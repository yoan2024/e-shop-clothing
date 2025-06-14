import React, { useState, useEffect } from "react";

const EditarProduct = ({ onClose, p }) => {
  const [titulo, setTitulo] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagenPreview, setImagenPreview] = useState("");

  useEffect(() => {
    if (p) {
      setTitulo(p.title || "");
      setPrecio(p.price || "");
      setCategoria(p.category || "");
      setDescripcion(p.description || "");
      setImagenPreview(p.image || "");
    }
    console.log("ppppppp", p);
  }, [p]);

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagenPreview(URL.createObjectURL(file));
    }
  };

  const handleGuardar = () => {
    console.log({
      titulo,
      precio,
      categoria,
      descripcion,
      imagenPreview,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl font-bold"
        >
          ×
        </button>

        {/* Imagen actual */}
        <div className="w-full h-40 mb-4 flex items-center justify-center overflow-hidden rounded-md border bg-gray-100">
          {imagenPreview ? (
            <img
              src={imagenPreview}
              alt="Vista previa"
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <span className="text-sm text-gray-400">Sin imagen</span>
          )}
        </div>

        {/* Formulario */}
        <div className="space-y-3">
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Nombre del producto"
            className="w-full border rounded px-3 py-2 text-sm"
          />
          <input
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            type="number"
            placeholder="Precio"
            className="w-full border rounded px-3 py-2 text-sm"
          />
          <input
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            placeholder="Categoría"
            className="w-full border rounded px-3 py-2 text-sm"
          />
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción"
            rows={3}
            className="w-full border rounded px-3 py-2 text-sm"
          />
          <input
            type="file"
            onChange={handleImagenChange}
            className="w-full text-sm"
          />
          <button
            onClick={handleGuardar}
            className="w-full mt-4 bg-blue-600 text-white rounded py-2 hover:bg-blue-700 transition"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditarProduct;
