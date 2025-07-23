import React from "react";
import { FaPencilAlt } from "react-icons/fa";

const InputUser = ({
  disable,
  field,
  saving,
  value,
  setstate,
  handlesave,
  handleclick,
  texto,
}) => {
  return (
    <>
      {disable.includes(field) && (
        <div className="flex justify-center items-center felx-row gap-2">
          <div>
            <label htmlFor={field}>{field}: </label>
            <input
              type="text"
              value={value}
              onChange={(e) => {
                
                setstate(e.target.value);
              }}
              className="rounded-xl"
            />
          </div>
          <div>
            {saving ? (
              <span className="font-bold">"Guardando....."</span>
            ) : (
              <button
                className=" p-1 rounded-xl bg-red-700"
                onClick={handlesave}
              >
                guardar
              </button>
            )}
          </div>
        </div>
      )}

      {!disable.includes(field) && (
        <div className="flex flex-row gap-2 items-center">
          <div className=" ">{texto} :</div>
          <div className="flex flex-row items-center gap-2">
            <div className="">{value} </div>
            <div className="w-6 h-6  group" onClick={() => handleclick(field)}>
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
