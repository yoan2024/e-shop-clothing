import { useNavigate } from "react-router-dom";

const Informacion = () => {
  const navegation = useNavigate();

  return (
    <div className="mt-20 border-t-2 border-slate-200  border-solid">
      <div className="flex flex-col items-center gap-4">
        <div className="text-center font-light text-2xl bg-slate-100">
          Productos de alta calidad al mejor precio por que nos importa dar un
          buen servicio anuestros clientes.Ademas de cuidar el bolsillo de
          nuestros clientes con nuestros descuentos de productos y demas. Para
          mas informacion puedes ver el catalogo aqui
        </div>
        <div
          className="p-2 cursor-pointer rounded-lg bg-red-100 font-semibold w-fit self-center"
          onClick={() => navegation("/catalogo/all")}
        >
          Ver catalogo
        </div>
      </div>
    </div>
  );
};

export default Informacion;
