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

    // --- 1. Generate files ---
    const response = await fetch("http://localhost:8080/api/generate-files", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const files = await response.json();

    // --- 2. Wrap callback API in promises ---
    const deploy = () =>
      new Promise((resolve, reject) =>
        signer.deploy(null, { onSuccess: resolve, onError: reject })
      );

    const initialize = () =>
      new Promise((resolve, reject) =>
        signer.initialize({ onSuccess: resolve, onError: reject })
      );

    const addXmlObject2 = () =>
      new Promise((resolve, reject) =>
        signer.addXmlObject2(
          "id_0",
          "XML pracovná zmluva",
          decodeBase64(files.xml),
          decodeBase64(files.xsd),
          "http://example.com/work-contract",
          "http://example.com/work-contract.xsd",
          decodeBase64(files.xsl),
          "http://example.com/work-contract.xsl",
          "HTML",
          { onSuccess: resolve, onError: reject }
        )
      );

    const addPdfObject = () =>
      new Promise((resolve, reject) =>
        signer.addPdfObject(
          "id_1",
          "PDF pracovná zmluva",
          files.pdf,
          "",
          "http://example.com/pdf",
          0,
          true,
          { onSuccess: resolve, onError: reject }
        )
      );

    const sign20 = () =>
      new Promise((resolve, reject) =>
        signer.sign20(
          "id_signature",
          "http://www.w3.org/2001/04/xmlenc#sha256",
          "urn:oid:1.3.158.36061701.1.2.3",
          "id_signature_envelope",
          "http://example.com/signatureEnvelope",
          "dáta obálky",
          { onSuccess: resolve, onError: reject }
        )
      );

    const getSignedXmlWithEnvelope = () =>
      new Promise((resolve, reject) =>
        signer.getSignedXmlWithEnvelope({
          onSuccess: resolve,
          onError: reject,
        })
      );

    // --- 3. FLOW ---
    // Only deploy if signer is not deployed
    if (!signer.state || signer.state === "Uninitialized") {
      await new Promise((resolve, reject) =>
        signer.deploy(null, { onSuccess: resolve, onError: reject })
      );
    }

    // Only initialize if not already initialized
    if (signer.state !== "Initialized") {
      await new Promise((resolve, reject) =>
        signer.initialize({ onSuccess: resolve, onError: reject })
      );
    }
    await addXmlObject2();
    await addPdfObject();
    await sign20();

    const signedXml = await getSignedXmlWithEnvelope();

    // --- 4. Download result ---
    const blob = new Blob([signedXml], {
      type: "application/vnd.etsi.asic-e+zip",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "work-contract.asice";
    a.click();
    URL.revokeObjectURL(a.href);

    // --- 5. Upload signed file (ignore upload errors) ---
    fetch("http://localhost:8080/api/upload-signed", {
      method: "POST",
      headers: { "Content-Type": "application/octet-stream" },
      body: signedXml,
    }).catch(console.error);

    return true; // SUCCESS ✔

  } catch (error) {
    console.error("Signing failed:", error);
    return false; // FAIL ✖
  }
}
