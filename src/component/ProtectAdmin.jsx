import React from "react";

const ProtectAdmin = ({ rol, children }) => {
  if (rol === "user") return;

  return children;
};

export default ProtectAdmin;
