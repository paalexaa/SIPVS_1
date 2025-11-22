package com.example.sipvs_backend.controller;

import java.util.Map;

import com.example.sipvs_backend.service.TimestampService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.sipvs_backend.model.WorkContract;
import com.example.sipvs_backend.service.XmlService;

@RestController
@CrossOrigin(origins = "http://localhost:5173/")
public class FormController {

    private final XmlService xmlService;
    private final TimestampService timestampService;

    public FormController(XmlService xmlService, TimestampService timestampService) {
        this.xmlService = xmlService;
        this.timestampService = timestampService;
    }

    @PostMapping("/api/generate-xml")
    public String generateXml(@RequestBody WorkContract data) {
        try {
            xmlService.generateXml(data);
            return xmlService.transformXmlToHtml();
        } catch (Exception e) {
            e.printStackTrace();
            return "<h2 style='color:red;'> Chyba pri spracovaní údajov: " + e.getMessage() + "</h2>";
        }
    }

    @PostMapping("/api/generate-files")
    public Map<String, String> generateFiles(@RequestBody WorkContract data) {
        return xmlService.generateFilesForSigning(data);
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @PostMapping(value = "/api/upload-signed", consumes = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public boolean uploadSigned(@RequestBody byte[] asiceBytes) {
        return xmlService.uploadSigned(asiceBytes);
    }

    @GetMapping("/api/generate-timestamp")
    public ResponseEntity<String> generateTimestamp() {
        try {
            timestampService.insertTimestampToAsice(timestampService.generateTimestamp());
            return ResponseEntity.ok("Timestamp inserted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to insert timestamp: " + e.getMessage());
        }
    }
}

