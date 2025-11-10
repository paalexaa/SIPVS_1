import { waitForDitec } from "./ditecLoader";

function decodeBase64(base64) {
  base64 = base64.replace(/^data:.*;base64,/, "");
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
  return new TextDecoder("utf-8").decode(bytes);
}


export async function signXmlFile(userData) {
  try {
    await waitForDitec();

    const signer = window.ditec?.dSigXadesJs;

    const response = await fetch("http://localhost:8080/api/generate-files", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const files = await response.json();

    signer.deploy(null, {
      onSuccess: function () {

        signer.initialize({
          onSuccess: function () {

            const xmlContent = decodeBase64(files.xml);
            const xsdContent = decodeBase64(files.xsd);
            const xslContent = decodeBase64(files.xsl);

            signer.addXmlObject2(
              "id_0",
              "XML pracovná zmluva",
              xmlContent,
              xsdContent,
              "http://example.com/work-contract",
              "http://example.com/work-contract.xsd",
              xslContent,
              "http://example.com/work-contract.xsl",
              "HTML",
              {
                onSuccess: function () {

                  signer.addPdfObject(
                    "id_1",
                    "PDF pracovná zmluva",
                    files.pdf,
                    "",
                    "http://example.com/pdf",
                    0,
                    true,
                    {
                      onSuccess: function () {

                        signer.sign20(
                          "id_signature",
                          "http://www.w3.org/2001/04/xmlenc#sha256",
                          "urn:oid:1.3.158.36061701.1.2.3",
                          "id_signature_envelope",
                          "http://example.com/signatureEnvelope",
                          "dáta obálky",
                          {
                            onSuccess: function () {

                              signer.getSignedXmlWithEnvelope({
                                onSuccess: function (signedXml) {

                                  const blob = new Blob([signedXml], {
                                    type: "application/vnd.etsi.asic-e+zip",
                                  });
                                  const a = document.createElement("a");
                                  a.href = URL.createObjectURL(blob);
                                  a.download = "work-contract.asice";
                                  a.click();
                                  URL.revokeObjectURL(a.href);

                                  fetch("http://localhost:8080/api/upload-signed", {
                                    method: "POST",
                                    headers: { "Content-Type": "text/xml" },
                                    body: signedXml,
                                  }).catch(console.error);
                                },
                              });
                            },
                            onError: function (err) {
                              console.error("Chyba pri podpise:", err);
                            },
                          }
                        );
                      },
                    }
                  );
                },
              }
            );
          },
        });
      },
    });
  } catch (error) {
    console.error("Výnimka:", error);
  }
}
