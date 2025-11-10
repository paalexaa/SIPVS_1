package com.example.sipvs_backend.service;

import com.itextpdf.html2pdf.HtmlConverter;
import org.springframework.stereotype.Service;
import java.io.FileOutputStream;
import java.io.OutputStream;

@Service
public class PdfService {

    public String generatePdfFromHtml(String htmlContent) {
        try {
            String outputPath = "src/main/resources/schema/work-contract.pdf";
            try (OutputStream os = new FileOutputStream(outputPath)) {
                HtmlConverter.convertToPdf(htmlContent, os);
            }
            return outputPath;
        } catch (Exception e) {
            throw new RuntimeException("Chyba pri generovaní PDF: " + e.getMessage(), e);
        }
    }
}
