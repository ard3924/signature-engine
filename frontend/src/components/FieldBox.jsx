import { Rnd } from "react-rnd";
import SignatureCanvas from "react-signature-canvas";
import { useRef, useState } from "react";

export default function FieldBox({ field, updateField }) {
  const sigRef = useRef(null);
  const [drawMode, setDrawMode] = useState(false);

  const saveSignature = () => {
    const canvas = sigRef.current.getCanvas(); // FIXED
    const dataUrl = canvas.toDataURL("image/png"); // FIXED
    updateField(field.id, { value: dataUrl });
    setDrawMode(false);
  };

  return (
    <Rnd
      size={{ width: field.width, height: field.height }}
      position={{ x: field.x, y: field.y }}
      disableDragging={drawMode}
      onDragStop={(e, d) => updateField(field.id, { x: d.x, y: d.y })}
      onResizeStop={(e, dir, ref, delta, pos) =>
        updateField(field.id, {
          width: ref.offsetWidth,
          height: ref.offsetHeight,
          ...pos,
        })
      }
      className="absolute border border-black bg-white"
    >
      {!field.value && !drawMode && (
        <button
          className="bg-black text-white w-full h-full"
          onClick={() => setDrawMode(true)}
        >
          ✍️ Draw Signature
        </button>
      )}

      {drawMode && (
        <div className="w-full h-full flex flex-col">
          <SignatureCanvas
            ref={sigRef}
            penColor="black"
            canvasProps={{ className: "border w-full h-full" }}
          />
          <button className="bg-blue-600 text-white" onClick={saveSignature}>
            Save
          </button>
        </div>
      )}

      {field.value && (
        <img src={field.value} alt="signature" className="w-full h-full object-contain" />
      )}
    </Rnd>
  );
}
