import React, { useEffect } from "react";

const BodyTableP = ({ itemspedidos }) => {


  return (
    <>
      {itemspedidos.map((p, index) => {
        return (
          <React.Fragment key={index}>
            <tr className="text-center">
              <td> </td>
              <td></td>
              <td>
                <img src={p.image} alt="" className="w-20 h-20" />{" "}
              </td>
              <td className="max-w-[200px] truncate">{p.title} </td>
              <td>{p.cantidad} </td>
              <td> {p.total}</td>
              <td>
                <span
                  className={
                    p.estado === "Pendiente"
                      ? `bg-red-500`
                      : p.estado == "En camino"
                      ? "bg-blue-500"
                      : "bg-green-500"
                  }
                >
                  {p.estado}
                </span>
              </td>
            </tr>
          </React.Fragment>
        );
        ("bg-red-500");
      })}
    </>
  );
};

export default BodyTableP;
