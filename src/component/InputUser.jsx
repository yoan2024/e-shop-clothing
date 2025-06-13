import React from "react";
import { FaPencilAlt } from "react-icons/fa";

const InputUser = ({
  disable,
  ref,
  guardando,
  value,
  setstate,
  handleguardar,
  handleclick,
  texto,
}) => {
  return (
    <>
      {disable.includes(ref) && (
        <div className="flex justify-center items-center felx-row gap-2">
          <div>
            <label htmlFor={ref}>{ref}: </label>
            <input
              type="text"
              value={value}
              onChange={(e) => setstate(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <div>
            {guardando ? (
              <span className="font-bold">"Guardando....."</span>
            ) : (
              <button
                className=" p-1 rounded-xl bg-red-700"
                onClick={() => handleguardar(ref)}
              >
                guardar
              </button>
            )}
          </div>
        </div>
      )}

      {!disable.includes(ref) && (
        <div className="flex flex-row gap-2 items-center">
          <div className=" ">{texto} :</div>
          <div className="flex flex-row items-center gap-2">
            <div className="">{value} </div>
            <div className="w-6 h-6  group" onClick={() => handleclick(ref)}>
              <FaPencilAlt className="w-full h-full cursor-pointer" />
              <div className="w-fit bottom-full text-sm text-blue-300 transition-opacity opacity-0 duration-200 group-hover:opacity-100 ">
                Editar
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InputUser;
