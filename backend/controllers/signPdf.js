const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { PDFDocument, rgb } = require("pdf-lib");

/**
 * POST /api/sign-pdf
 * Required payload:
 * {
 *   pdfId: "sample-a4",
 *   signatureImage: "data:image/png;base64,...",
 *   fields: [
 *     {
 *       type: "signature",
 *       page: 1,
 *       xNorm: 0.20,
 *       yNormTop: 0.55,
 *       wNorm: 0.30,
 *       hNorm: 0.10
 *     }
 *   ]
 * }
 */
module.exports = async function signPdf(req, res) {
  try {
    console.log("📩 HIT SIGN ROUTE");
    const { pdfId, signatureImage, fields } = req.body;

    if (!pdfId || !signatureImage || !fields) {
      return res.status(400).json({ success: false, message: "Missing payload fields" });
    }

    // ----------- LOAD PDF TEMPLATE -----------
    const pdfPath = path.join(__dirname, "../pdfs", `${pdfId}.pdf`);
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ success: false, message: "PDF template not found" });
    }

    const existingPdfBytes = fs.readFileSync(pdfPath);
    const originalHash = crypto.createHash("sha256").update(existingPdfBytes).digest("hex");

    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // ----------- PROCESS EACH FIELD -----------
    for (const field of fields) {
      if (field.type === "signature") {
        console.log("✍️ Embedding signature…");

        const pngBase64 = signatureImage.replace(/^data:image\/png;base64,/, "");
        const pngBytes = Buffer.from(pngBase64, "base64");
        const pngImage = await pdfDoc.embedPng(pngBytes);

        const { width: pdfW, height: pdfH } = pdfDoc.getPage(field.page - 1).getSize();

        // Convert normalized units into PDF coordinates
        const x = field.xNorm * pdfW;
        const w = field.wNorm * pdfW;

        const h = field.hNorm * pdfH;
        const yFromTop = field.yNormTop * pdfH;
        const y = pdfH - yFromTop - h;  // Convert browser → PDF coords

        // Draw signature
        pdfDoc.getPage(field.page - 1).drawImage(pngImage, {
          x,
          y,
          width: w,
          height: h
        });

        console.log("👉 Final coords:", { x, y, w, h });
      }
    }

    // ----------- SAVE SIGNED PDF -----------
    const pdfBytes = await pdfDoc.save();
    const signedHash = crypto.createHash("sha256").update(pdfBytes).digest("hex");

    const signedFileName = `${pdfId}-${Date.now()}.pdf`;
    const signedDir = path.join(__dirname, "../signed");
    if (!fs.existsSync(signedDir)) fs.mkdirSync(signedDir);

    const signedPath = path.join(signedDir, signedFileName);
    fs.writeFileSync(signedPath, pdfBytes);

    // ----------- BUILD PUBLIC URL -----------
    const baseUrl = process.env.BASE_URL || "http://localhost:5000";
    const signedPdfUrl = `${baseUrl}/signed/${signedFileName}`;

    console.log("🎉 PDF Signed Successfully:", signedPdfUrl);

    return res.json({
      success: true,
      signedPdfUrl,
      originalHash,
      signedHash
    });

  } catch (error) {
    console.error("❌ SIGN ERROR", error);
    res.status(500).json({ success: false, message: "Signing failed", error: error.message });
  }
};
