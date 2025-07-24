import React from "react";

/**
 * ProtectAdmin component
 * This component conditionally renders its children only if the user is *not* a regular user.
 * In other words, only users with a role other than "user" ("admin") can see the content inside.
 */
const ProtectAdmin = ({ rol, children }) => {
  // If the user role is "user", don't render anything
  if (rol === "user") return null;

  // Otherwise, render the protected content
  return children;
};

export default ProtectAdmin;
