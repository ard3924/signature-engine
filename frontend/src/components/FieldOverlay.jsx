export default function FieldOverlay({ pageSize }) {
  if (!pageSize.width) return null;

  return (
    <div
      className="absolute top-0 left-0 pointer-events-none"
      style={{
        width: pageSize.width,
        height: pageSize.height,
      }}
    >
      {/* Subtle overlay with animated border */}
      <div className="absolute inset-0 border-2 border-dashed border-blue-400/50 rounded-lg animate-pulse"></div>

      {/* Corner indicators */}
      <div className="absolute top-0 left-0 w-3 h-3 bg-blue-500 rounded-full opacity-60"></div>
      <div className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 bg-blue-500 rounded-full opacity-60"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 rounded-full opacity-60"></div>

      {/* Center guidelines */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-blue-300/30"></div>
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-blue-300/30"></div>

      {/* Instruction text */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-500/10 backdrop-blur-sm text-blue-700 text-sm px-3 py-1 rounded-full border border-blue-300/30">
        Drag fields here to position them
      </div>
    </div>
  );
}
