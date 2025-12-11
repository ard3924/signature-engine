// controllers/signPdf.js
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { PDFDocument } = require("pdf-lib");
const Document = require("../models/Document");

module.exports = async function signPdf(req, res) {
  try {
    const { pdfId, fields, signatureImage } = req.body;

    if (!pdfId || !fields || !Array.isArray(fields) || fields.length === 0) {
      return res.status(400).json({ message: "pdfId and fields are required" });
    }

    if (!signatureImage) {
      return res.status(400).json({ message: "signatureImage is required" });
    }

    // 1️⃣ Load original PDF
    const pdfPath = path.join(__dirname, "..", "pdfs", `${pdfId}.pdf`);

    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ message: "PDF template not found" });
    }

    const originalPdfBytes = fs.readFileSync(pdfPath);

    // 2️⃣ Hash original PDF (before signing)
    const originalHash = crypto
      .createHash("sha256")
      .update(originalPdfBytes)
      .digest("hex");

    // 3️⃣ Load PDF with pdf-lib
    const pdfDoc = await PDFDocument.load(originalPdfBytes);
    const pages = pdfDoc.getPages();

    // For now, just handle first signature field (you can loop later)
    const field = fields[0];

    const pageIndex = (field.page || 1) - 1;
    if (!pages[pageIndex]) {
      return res.status(400).json({ message: "Invalid page index" });
    }
    const page = pages[pageIndex];

    const { width: pageWidthPt, height: pageHeightPt } = page.getSize();

    // 4️⃣ Convert normalized coords → PDF points
    const { xNorm, yNormTop, wNorm, hNorm } = field;

    if (
      [xNorm, yNormTop, wNorm, hNorm].some(
        (v) => typeof v !== "number" || v < 0 || v > 1
      )
    ) {
      return res
        .status(400)
        .json({ message: "Invalid normalized coordinates" });
    }

    const wBoxPt = wNorm * pageWidthPt;
    const hBoxPt = hNorm * pageHeightPt;
    const xPt = xNorm * pageWidthPt;

    // y from top → y from bottom
    const yTopPt = yNormTop * pageHeightPt;
    const yPt = pageHeightPt - (yTopPt + hBoxPt);

    // 5️⃣ Decode base64 signature image
    let base64Data = signatureImage;
    const commaIndex = base64Data.indexOf(",");
    if (commaIndex !== -1) {
      base64Data = base64Data.slice(commaIndex + 1);
    }

    const sigBytes = Buffer.from(base64Data, "base64");

    // Assume PNG for now; you can conditionally choose JPG/PNG based on data URL
    const sigImage = await pdfDoc.embedPng(sigBytes);

    const imgW = sigImage.width;
    const imgH = sigImage.height;

    // 6️⃣ Aspect ratio: contain image inside box, no stretch
    const scale = Math.min(wBoxPt / imgW, hBoxPt / imgH);

    const finalW = imgW * scale;
    const finalH = imgH * scale;

    // Center inside the box
    const xImg = xPt + (wBoxPt - finalW) / 2;
    const yImg = yPt + (hBoxPt - finalH) / 2;

    // 7️⃣ Draw image on page
    page.drawImage(sigImage, {
      x: xImg,
      y: yImg,
      width: finalW,
      height: finalH,
    });

    // 8️⃣ Save modified PDF
    const signedPdfBytes = await pdfDoc.save();

    // 9️⃣ Hash the final PDF
    const signedHash = crypto
      .createHash("sha256")
      .update(signedPdfBytes)
      .digest("hex");

    // 🔟 Store hashes in MongoDB (audit trail)
    await Document.create({
      pdfId,
      originalHash,
      signedHash,
    });

    // 1️⃣1️⃣ Save file to /signed
    const fileName = `${pdfId}-${Date.now()}.pdf`;
    const outputPath = path.join(__dirname, "..", "signed", fileName);
    fs.writeFileSync(outputPath, signedPdfBytes);

    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
    const signedPdfUrl = `${baseUrl}/signed/${fileName}`;

    return res.json({
      signedPdfUrl,
      originalHash,
      signedHash,
    });
  } catch (err) {
    console.error("signPdf error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
