package com.example.sipvs_backend.service;

import com.example.sipvs_backend.model.WorkContract;
import org.springframework.stereotype.Service;

import javax.xml.transform.*;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;
import javax.xml.validation.*;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStreamWriter;
import java.io.StringWriter;
import java.io.Writer;
import java.nio.charset.StandardCharsets;

import javax.xml.XMLConstants;

@Service
public class XmlService {

    public void generateXml(WorkContract data) {
        try {
            File file = new File("src/main/resources/schema/work-contract.xml");
            Writer writer = new OutputStreamWriter(new FileOutputStream(file), StandardCharsets.UTF_8);


            writer.write("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
            writer.write("<workContract xmlns=\"http://example.com/work-contract\">\n");
            writer.write("  <employee>\n");
            writer.write("    <name>" + data.getName() + "</name>\n");
            writer.write("    <birthDate>" + data.getBirthDate() + "</birthDate>\n");
            writer.write("    <adresa>" + data.getAdresa() + "</adresa>\n");
            writer.write("    <email>" + data.getEmail() + "</email>\n");
            writer.write("    <phone>" + data.getPhone() + "</phone>\n");
            writer.write("  </employee>\n");

            writer.write("  <company>\n");
            writer.write("    <companyName>" + data.getCompanyName() + "</companyName>\n");
            writer.write("    <companyAdresa>" + data.getCompanyAdresa() + "</companyAdresa>\n");
            writer.write("    <contactInfo>" + data.getContactInfo() + "</contactInfo>\n");
            writer.write("  </company>\n");

            writer.write("  <job>\n");
            writer.write("    <positionTitle>" + data.getPositionTitle() + "</positionTitle>\n");
            writer.write("    <jobType>" + data.getJobType() + "</jobType>\n");
            writer.write("    <placeOfWork>" + data.getPlaceOfWork() + "</placeOfWork>\n");
            writer.write("    <startDate>" + data.getStartDate() + "</startDate>\n");
            writer.write("    <salary>" + data.getSalary() + "</salary>\n");
            writer.write("  </job>\n");

             writer.write("  <duties>\n");
            writer.write("    <duty>" + data.getDuties() + "</duty>\n");
            writer.write("  </duties>\n");

            writer.write("</workContract>");
            writer.close();
        } catch (Exception e) {
            throw new RuntimeException("Chyba pri generovaní XML: " + e.getMessage());
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
        System.out.println("chybaaaa");
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
}
