const express = require("express");
const fs = require("fs");
const path = require("path");
const { PDFDocument } = require("pdf-lib");
const router = express.Router();

router.post("/sign-pdf", async (req, res) => {
  try {
    console.log("📩 HIT SIGN ROUTE");
    console.log("📦 BODY:", req.body);

    const { pdfId, fields } = req.body;

    if (!pdfId || !fields || !Array.isArray(fields)) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const pdfPath = path.join(__dirname, "..", "pdfs", `${pdfId}.pdf`);
    console.log("📁 Searching PDF at:", pdfPath);

    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ error: "PDF file not found" });
    }

    const originalPDFBuffer = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(originalPDFBuffer);
    const pages = pdfDoc.getPages();
    const page = pages[0];

    for (let field of fields) {
      if (field.type !== "signature") continue;

      if (!field.dataUrl) {
        console.log("⚠️ Skipping empty signature");
        continue;
      }

      const signatureBytes = field.dataUrl.split(",")[1];
      const pngImage = await pdfDoc.embedPng(Buffer.from(signatureBytes, "base64"));
      const { width, height } = pngImage.scale(1);

      const x = field.xNorm * page.getWidth();
      const y = field.yNorm * page.getHeight();
      const w = field.wNorm * page.getWidth();
      const h = field.hNorm * page.getHeight();

      console.log("✍️ Embedding signature at:", { x, y, w, h });

      page.drawImage(pngImage, { x, y, width: w, height: h });
    }

    const signedPdfBytes = await pdfDoc.save();
    const signedDir = path.join(__dirname, "..", "signed");
    if (!fs.existsSync(signedDir)) fs.mkdirSync(signedDir);

    const fileName = `${pdfId}-${Date.now()}.pdf`;
    const outputPath = path.join(signedDir, fileName);

    fs.writeFileSync(outputPath, signedPdfBytes);

    console.log("🎉 PDF Signed Successfully:", fileName);

    res.json({
      success: true,
      signedPdfUrl: `http://localhost:5000/signed/${fileName}`
    });

  } catch (err) {
    console.error("❌ SIGN ERROR", err);
    res.status(500).json({ error: "Signing failed", details: err.message });
  }
});

module.exports = router;
