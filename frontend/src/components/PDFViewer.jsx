import { Document, Page, pdfjs } from "react-pdf";
import { useState } from "react";

pdfjs.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PDFViewer({ file }) {
  const [pages, setPages] = useState(null);
  return (
    <Document file={file} onLoadSuccess={({ numPages }) => setPages(numPages)}>
      <Page pageNumber={1} width={500} />
    </Document>
  );
}
