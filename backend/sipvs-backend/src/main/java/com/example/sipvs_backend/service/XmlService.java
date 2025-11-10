package com.example.sipvs_backend.service;

import com.example.sipvs_backend.model.WorkContract;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.xml.XMLConstants;
import javax.xml.transform.*;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;
import javax.xml.validation.*;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class XmlService {

    @Autowired
    private PdfService pdfService;

    public void generateXml(WorkContract data) {
        try {
            File file = new File("src/main/resources/schema/work-contract.xml");
            file.getParentFile().mkdirs();
            try (Writer writer = new OutputStreamWriter(new FileOutputStream(file), StandardCharsets.UTF_8)) {

                writer.write("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
                writer.write("<workContract xmlns=\"http://example.com/work-contract\">\n");

                writer.write("  <employee>\n");
                writer.write("    <name>" + safe(data.getName()) + "</name>\n");
                writer.write("    <birthDate>" + safe(data.getBirthDate()) + "</birthDate>\n");
                writer.write("    <adresa>" + safe(data.getAdresa()) + "</adresa>\n");
                writer.write("    <email>" + safe(data.getEmail()) + "</email>\n");
                writer.write("    <phone>" + safe(data.getPhone()) + "</phone>\n");
                writer.write("  </employee>\n");

                writer.write("  <company>\n");
                writer.write("    <companyName>" + safe(data.getCompanyName()) + "</companyName>\n");
                writer.write("    <companyAdresa>" + safe(data.getCompanyAdresa()) + "</companyAdresa>\n");
                writer.write("    <contactInfo>" + safe(data.getContactInfo()) + "</contactInfo>\n");
                writer.write("  </company>\n");

                writer.write("  <job>\n");
                writer.write("    <positionTitle>" + safe(data.getPositionTitle()) + "</positionTitle>\n");
                writer.write("    <jobType>" + safe(data.getJobType()) + "</jobType>\n");
                writer.write("    <placeOfWork>" + safe(data.getPlaceOfWork()) + "</placeOfWork>\n");
                writer.write("    <startDate>" + safe(data.getStartDate()) + "</startDate>\n");
                writer.write("    <salary>" + safe(data.getSalary()) + "</salary>\n");
                writer.write("  </job>\n");

                writer.write("  <duties>\n");
                if (data.getDuties() != null) {
                    for (String duty : data.getDuties()) {
                        writer.write("    <duty>" + safe(duty) + "</duty>\n");
                    }
                }
                writer.write("  </duties>\n");

                writer.write("</workContract>");
            }
        } catch (Exception e) {
            throw new RuntimeException("Chyba pri generovaní XML: " + e.getMessage(), e);
        }
    }

    public boolean validateXml() {
        try {
            File xmlFile = new File("src/main/resources/schema/work-contract.xml");
            File xsdFile = new File("src/main/resources/schema/work-contract.xsd");
            SchemaFactory factory = SchemaFactory.newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI);
            Schema schema = factory.newSchema(xsdFile);
            Validator validator = schema.newValidator();
            validator.validate(new StreamSource(xmlFile));
            return true;
        } catch (Exception e) {
            System.err.println("Validation error: " + e.getMessage());
            return false;
        }
    }

    public String transformXmlToHtml() {
        try {
            File xml = new File("src/main/resources/schema/work-contract.xml");
            File xsl = new File("src/main/resources/schema/work-contract.xsl");
            TransformerFactory factory = TransformerFactory.newInstance();
            Transformer transformer = factory.newTransformer(new StreamSource(xsl));
            StringWriter output = new StringWriter();
            transformer.transform(new StreamSource(xml), new StreamResult(output));
            return output.toString();
        } catch (Exception e) {
            return "<h2 style='color:red;'>Chyba pri transformácii do HTML: " + e.getMessage() + "</h2>";
        }
    }

    public Map<String, String> generateFilesForSigning(WorkContract data) {
        try {
            generateXml(data);
            validateXml();

            String htmlContent = transformXmlToHtml();
            String pdfPath = pdfService.generatePdfFromHtml(htmlContent);

            Map<String, String> files = new HashMap<>();
            files.put("xml", encodeBase64("src/main/resources/schema/work-contract.xml"));
            files.put("xsd", encodeBase64("src/main/resources/schema/work-contract.xsd"));
            files.put("xsl", encodeBase64("src/main/resources/schema/work-contract.xsl"));
            files.put("pdf", encodeBase64(pdfPath));

            files.replaceAll((k, v) -> v.replaceAll("\\r|\\n|\\s", ""));

            Base64.getDecoder().decode(files.get("pdf"));

            return files;
        } catch (Exception e) {
            throw new RuntimeException("Chyba pri generovaní Base64 súborov: " + e.getMessage(), e);
        }
    }

    private String encodeBase64(String path) throws IOException {
        return Base64.getEncoder().encodeToString(Files.readAllBytes(Path.of(path)));
    }

    private String safe(Object value) {
        return value == null ? "" : value.toString().replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;");
    }
}
