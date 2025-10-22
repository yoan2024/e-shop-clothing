// --- This component renders a table row (<tr>) for each product in a user's order.
// It displays the image, title, quantity, total price, and order status (with colored background). --- //

import React from "react";

const BodyTableP = ({ itemspedidos,  status, shippingStatus }) => {
  return (
    <>
      {itemspedidos.map((p, index) => {
        return (
          <React.Fragment key={index}>
            <tr className="text-center">
              {/* Empty cells reserved for future use or alignment */}
              <td></td>
              <td></td>

              {/* Product image */}
              <td>
                <img src={p.image} alt="" className="w-20 h-20" />
              </td>

              {/* Product title, truncated if too long */}
              <td className="max-w-[100px] truncate">{p.title}</td>

              {/* Quantity of the product ordered */}
              <td>{p.quantity}</td>

              {/* Total price for that product (price * quantity) */}
              <td>{p.total}</td>

              
              
            </tr>
          </React.Fragment>
        );
      })}
    </>
  );
};

export default BodyTableP;
