package com.example.sipvs_backend.service;

import org.bouncycastle.crypto.digests.SHA256Digest;
import org.bouncycastle.tsp.TSPException;
import org.bouncycastle.tsp.TimeStampRequest;
import org.bouncycastle.tsp.TimeStampRequestGenerator;
import org.bouncycastle.tsp.TimeStampResponse;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

@Service
public class TimestampService {
    public String generateTimestamp() throws IOException, TSPException {
        // 1️⃣ Read signed ASiC-E file
        File file = new File("src/main/resources/signed_documents/dummy_container.sce");
        byte[] fileBytes = new byte[(int) file.length()];
        try (FileInputStream fis = new FileInputStream(file)) {
            fis.read(fileBytes);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        // 2️⃣ Compute SHA-256 digest
        SHA256Digest digest = new SHA256Digest();
        digest.update(fileBytes, 0, fileBytes.length);
        byte[] digestBytes = new byte[digest.getDigestSize()];
        digest.doFinal(digestBytes, 0);

        // 3️⃣ Build TimeStampRequest
        TimeStampRequestGenerator tsReqGen = new TimeStampRequestGenerator();
        tsReqGen.setCertReq(true);
        TimeStampRequest tsRequest = tsReqGen.generate(org.bouncycastle.tsp.TSPAlgorithms.SHA256, digestBytes);

        // 4️⃣ Send request to TSA
        byte[] tsRequestBytes = tsRequest.getEncoded();
        URL url = new URL("https://testpki.ditec.sk/tsarsa/tsa.aspx");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setDoOutput(true);
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/timestamp-query");
        conn.setRequestProperty("Content-Length", String.valueOf(tsRequestBytes.length));

        try (OutputStream os = conn.getOutputStream()) {
            os.write(tsRequestBytes);
        }

        // 5️⃣ Read TSA response
        byte[] responseBytes;
        try (InputStream is = conn.getInputStream()) {
            responseBytes = is.readAllBytes();
        }

        TimeStampResponse tsResponse = new TimeStampResponse(responseBytes);

        // --- 5.5. Save timestamp token to file ---
        File tsFile = new File("src/main/resources/timestamp_responses/work-contract.tsr"); // choose your filename
        try (FileOutputStream fos = new FileOutputStream(tsFile)) {
            fos.write(tsResponse.getTimeStampToken().getEncoded());
        }

        // 6️⃣ Return Base64-encoded timestamp token
        return Base64.getEncoder().encodeToString(tsResponse.getTimeStampToken().getEncoded());
    }

    public void insertTimestampToAsice(String tsBase64) throws Exception {
        File asiceFile = new File("src/main/resources/signed_documents/dummy_container.sce");
        File tempFile = new File("src/main/resources/signed_documents/dummy_container_timestamp.sce");

        // 1️⃣ Open original ASiC-E for reading
        try (ZipInputStream zis = new ZipInputStream(new FileInputStream(asiceFile));
             ZipOutputStream zos = new ZipOutputStream(new FileOutputStream(tempFile))) {

            ZipEntry entry;
            while ((entry = zis.getNextEntry()) != null) {
                System.out.println("Found entry: " + entry.getName());
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                zis.transferTo(baos);
                byte[] content = baos.toByteArray();

                if ("META-INF/signatures001.xml".equals(entry.getName())) {
                    // 2️⃣ Modify the signature XML to include the timestamp
                    Path beforePath = Paths.get("src/main/resources/signed_documents/signatures_before.xml");
                    Files.write(beforePath, content);

                    // 2️⃣ Modify the signature XML to include the timestamp
                    content = addTimestampToSignatureXML(content, tsBase64);

                    // Dump content after modification
                    Path afterPath = Paths.get("src/main/resources/signed_documents/signatures_after.xml");
                    Files.write(afterPath, content);
                }

                // 3️⃣ Write entry to new ASiC-E
                zos.putNextEntry(new ZipEntry(entry.getName()));
                zos.write(content);
                zos.closeEntry();
            }
        }
    }

    // --- Helper to inject the timestamp ---
    private byte[] addTimestampToSignatureXML(byte[] xmlBytes, String tsBase64) throws Exception {
        DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
        dbf.setNamespaceAware(true);
        Document doc = dbf.newDocumentBuilder().parse(new ByteArrayInputStream(xmlBytes));

        // 1️⃣ Locate the ds:Signature element
        NodeList signatures = doc.getElementsByTagNameNS("http://www.w3.org/2000/09/xmldsig#", "Signature");
        if (signatures.getLength() == 0) {
            throw new IllegalStateException("No ds:Signature element found");
        }
        Element signature = (Element) signatures.item(0);

        // 2️⃣ Locate or create ds:Object -> xades:QualifyingProperties
        NodeList objects = signature.getElementsByTagNameNS("http://www.w3.org/2000/09/xmldsig#", "Object");
        Element xadesObject;
        if (objects.getLength() > 0) {
            xadesObject = (Element) objects.item(0);
        } else {
            xadesObject = doc.createElementNS("http://www.w3.org/2000/09/xmldsig#", "Object");
            signature.appendChild(xadesObject);
        }

        NodeList qualifyingList = xadesObject.getElementsByTagNameNS("http://uri.etsi.org/01903/v1.3.2#", "QualifyingProperties");
        Element qualifying;
        if (qualifyingList.getLength() > 0) {
            qualifying = (Element) qualifyingList.item(0);
        } else {
            qualifying = doc.createElementNS("http://uri.etsi.org/01903/v1.3.2#", "QualifyingProperties");
            qualifying.setAttribute("Target", "#" + signature.getAttribute("Id"));
            xadesObject.appendChild(qualifying);
        }

        // 3️⃣ Locate or create UnsignedProperties -> UnsignedSignatureProperties
        NodeList unsignedList = qualifying.getElementsByTagNameNS("http://uri.etsi.org/01903/v1.3.2#", "UnsignedProperties");
        Element unsignedProps;
        if (unsignedList.getLength() > 0) {
            unsignedProps = (Element) unsignedList.item(0);
        } else {
            unsignedProps = doc.createElementNS("http://uri.etsi.org/01903/v1.3.2#", "UnsignedProperties");
            qualifying.appendChild(unsignedProps);
        }

        NodeList uspList = unsignedProps.getElementsByTagNameNS("http://uri.etsi.org/01903/v1.3.2#", "UnsignedSignatureProperties");
        Element usp;
        if (uspList.getLength() > 0) {
            usp = (Element) uspList.item(0);
        } else {
            usp = doc.createElementNS("http://uri.etsi.org/01903/v1.3.2#", "UnsignedSignatureProperties");
            unsignedProps.appendChild(usp);
        }

        // 4️⃣ Add SignatureTimeStamp
        Element sigTs = doc.createElementNS("http://uri.etsi.org/01903/v1.3.2#", "SignatureTimeStamp");
        Element encTs = doc.createElementNS("http://uri.etsi.org/01903/v1.3.2#", "EncapsulatedTimeStamp");
        encTs.setTextContent(tsBase64);
        sigTs.appendChild(encTs);
        usp.appendChild(sigTs);

        // 5️⃣ Convert back to bytes
        Transformer transformer = TransformerFactory.newInstance().newTransformer();
        transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "no");
        transformer.setOutputProperty(OutputKeys.INDENT, "yes");
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        transformer.transform(new DOMSource(doc), new StreamResult(baos));
        return baos.toByteArray();
    }
}
