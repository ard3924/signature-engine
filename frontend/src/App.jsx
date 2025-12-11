import { useRef, useState } from "react";
import PDFViewer from "./components/PDFViewer";
import FieldBox from "./components/FieldBox";
import FieldToolbar from "./components/FieldToolbar";
import axios from "axios";

export default function App() {
  const [fields, setFields] = useState([]);
  const pdfRef = useRef(null);

  const addField = (type) => {
    setFields((prev) => [
      ...prev,
      {
        id: Date.now(),
        type,
        x: 100,
        y: 150,
        width: type === "signature" ? 200 : 150,
        height: type === "signature" ? 70 : 40,
        value: null,
      },
    ]);
  };

  const updateField = (id, updates) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  const handleSavePDF = async () => {
    const rect = pdfRef.current.getBoundingClientRect();

    const payload = {
      pdfId: "sample-a4",
      fields: fields.map((f) => ({
        type: f.type,
        dataUrl: f.value,
        xNorm: f.x / rect.width,
        yNorm: 1 - (f.y + f.height) / rect.height,
        wNorm: f.width / rect.width,
        hNorm: f.height / rect.height,
      })),
    };

    try {
      const res = await axios.post("http://localhost:5000/api/sign-pdf", payload);

      if (res.data.signedPdfUrl) {
        window.open(res.data.signedPdfUrl, "_blank");
      }
    } catch (err) {
      console.log("SIGN ERROR:", err);
      alert("Failed to sign PDF");
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="glass-effect border-b border-white/20 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">B</span>
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              BoloSign PDF Editor
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-300">PDF Signature Tool</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-48 glass-effect m-2 rounded-lg p-3 space-y-4">
          <div>
            <h2 className="text-sm font-semibold mb-3 text-gray-200">Document Tools</h2>
            <FieldToolbar addField={addField} />
          </div>

          <div className="border-t border-white/20 pt-4">
            <h3 className="text-sm font-semibold mb-3 text-gray-200">Actions</h3>
            <div className="space-y-2">
              <button
                className="btn-success w-full flex items-center justify-center space-x-2 text-sm"
                onClick={handleSavePDF}
              >
                <span>🔐</span>
                <span>Sign & Download</span>
              </button>
            </div>
          </div>

          <div className="border-t border-white/20 pt-4">
            <h3 className="text-sm font-semibold mb-3 text-gray-200">Fields ({fields.length})</h3>
            <div className="space-y-1 max-h-32 overflow-y-auto scrollbar-thin">
              {fields.length === 0 ? (
                <p className="text-xs text-gray-400">No fields added yet</p>
              ) : (
                fields.map((field, index) => (
                  <div key={field.id} className="flex items-center justify-between bg-white/5 rounded-md p-2">
                    <span className="text-xs text-gray-300 truncate">
                      {index + 1}. {field.type.charAt(0).toUpperCase() + field.type.slice(1)}
                    </span>
                    <button
                      onClick={() => setFields(prev => prev.filter(f => f.id !== field.id))}
                      className="text-red-400 hover:text-red-300 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-3">
          <div className="glass-effect rounded-lg p-4 h-full">
            <div ref={pdfRef} className="relative bg-white rounded-lg shadow-2xl overflow-hidden">
              <PDFViewer file="/sample-a4.pdf" />
              {fields.map((f) => (
                <FieldBox key={f.id} field={f} updateField={updateField} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
