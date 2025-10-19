package com.example.sipvs_backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.sipvs_backend.model.WorkContract;
import com.example.sipvs_backend.service.XmlService;

@RestController
@CrossOrigin(origins = "http://localhost:5174/")
public class FormController {

    private final XmlService xmlService;

    public FormController(XmlService xmlService) {
        this.xmlService = xmlService;
    }

    @PostMapping("/api/generate-xml")
    public String generateXml(@RequestBody WorkContract data) {
        try {
            xmlService.generateXml(data);
            return xmlService.transformXmlToHtml();
        } catch (Exception e) {
            e.printStackTrace();
            return "<h2 style='color:red;'>❌ Chyba pri spracovaní údajov: " + e.getMessage() + "</h2>";
        }
    }
}

