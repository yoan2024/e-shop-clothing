import { getDoc, updateDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { setDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
import axios from "axios";
import { useProducts } from "../context/ContextProducts";
import { db } from "../firebase/firebase-config";

const LogicProduct = ({ onClose, p, logica }) => {
  const [titulo, setTitulo] = useState("");
  const [precio, setPrecio] = useState("");
  const { products, setProducts } = useProducts();
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [file, setFile] = useState("");
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
    if (file && file.size > 1 * 1024 * 1024) {
      console.log("imagen muy grande tiene q ser mayor a 2 MB");
    } else {
      console.log(file, "se guardo la imagen");
      setFile(file);
      setImagenPreview(URL.createObjectURL(file));
    }
  };

  const handleGuardar = async (prod) => {
    console.log({
      titulo,
      precio,
      categoria,
      descripcion,
      imagenPreview,
    });

    if (
      titulo.length > 5 &&
      precio > 0 &&
      categoria.length > 5 &&
      descripcion.length > 5 &&
      imagenPreview
    ) {
      const formData = new FormData();
      const imagenRuta = "/images/sinimagen.webp";
      const response = await fetch(imagenRuta);
      const blog = await response.blob();
      const image = file || imagenPreview || blog;
      formData.append("file", image);
      formData.append("upload_preset", "ecomerce");
      let img;
      try {
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dcqsgyyax/image/upload",
          formData
        );

        img = res.data.secure_url;

        alert("✅ Imagen subida correctamente");
      } catch (error) {
        console.error("Error uploading:", error);
        alert("❌ Falló la subida");
      }

      const refP = doc(db, "productos", "productos1088272651");
      const getP = await getDoc(refP);
      const dataP = getP.data();
      let p = dataP.productos;
      if (logica === "editar") {
        const editarP = p.map((p) => {
          if (p.id === prod.id) {
            return {
              ...p,
              title: titulo,
              category: categoria,
              price: precio,
              description: descripcion,
              image: img,
            };
          }
          return p;
        });
        console.log("curenttt productos ya editassssssssss", editarP);
        setDoc(refP, {
          productos: editarP,
        });

        setProducts(editarP);
        console.log(
          "todo el producto se edito correctamente gracias por usar trendora"
        );
      } else {
        const randomRate = Math.random() * 6;
        const randomCount = Math.random() * 200;
        const floatrate = Math.floor(randomRate);
        const floatCount = Math.floor(randomCount);

        const sorProducts = p.sort((a, b) => b.id - a.id);
        const newId = sorProducts[0].id;

        const newProducto = {
          category: categoria,
          description: descripcion,
          id: newId,
          image: img,
          price: precio,
          rating: { count: floatCount, rate: floatrate },
        };

        p.push(newProducto);
        setDoc(refP, {
          productos: p,
        });
        setProducts(p);

        console.log(
          "se agregaron correctamente el producto",
          newProducto,
          "p actualizados: ",
          p
        );
      }
    } else {
      return;
    }
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
            onClick={() => handleGuardar(p)}
            className="w-full mt-4 bg-blue-600 text-white rounded py-2 hover:bg-blue-700 transition"
          >
            {logica === "editar" ? "Guardar Cambios" : "Guardar Producto"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogicProduct;
