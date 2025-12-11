import { useState } from "react";
import PDFViewer from "../components/PDFViewer";
import FieldOverlay from "../components/FieldOverlay";

export default function Editor() {
  const [pageSize, setPageSize] = useState({ width: 0, height: 0 });

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="relative">
        <PDFViewer onPageRender={(w, h) => setPageSize({ width: w, height: h })} />
        <FieldOverlay pageSize={pageSize} />
      </div>
    </div>
  );
}
