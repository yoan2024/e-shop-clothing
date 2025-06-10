import { useState } from "react";
import { useUser } from "../context/User";
import Nav from "./Nav";

const Header = ({ toglee, settoglee }) => {
  const { user, setUser } = useUser();
  if (!user) return null;

  return (
    <header>
      <div>{/*aca va el header*/}</div>
      <Nav togglee={toglee} settogglee={settoglee} />
    </header>
  );
};

export default Header;
