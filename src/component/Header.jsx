import { useState } from "react";
import { useUser } from "../context/User";
import Nav from "./Nav";

const Header = ({ togle, settogle }) => {
  const { user, setUser } = useUser();

  if (!user) return null;

  return (
    <header>
      <div>{/*aca va el header*/}</div>
      <Nav tog={togle} settog={settogle} />
    </header>
  );
};

export default Header;
