export default function FieldToolbar({ addField }) {
  const fieldTypes = [
    { type: "signature", icon: "✍️", label: "Signature", color: "from-blue-500 to-purple-600" },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3">
        {fieldTypes.map(({ type, icon, label, color }) => (
          <button
            key={type}
            onClick={() => addField(type)}
            className={`group relative overflow-hidden bg-gradient-to-r ${color} hover:shadow-lg hover:shadow-white/20 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1`}
          >
            <div className="flex items-center justify-center space-x-3">
              <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                {icon}
              </span>
              <span className="text-sm">Add {label}</span>
            </div>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
          </button>
        ))}
      </div>

      <div className="text-xs text-gray-400 text-center mt-4">
        Click to add fields to your PDF
      </div>
    </div>
  );
}
