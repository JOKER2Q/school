import { createContext, useEffect, useState } from "react";

export const Context = createContext({});
const Provider = ({ children }) => {
  const [mode, setMode] = useState(+localStorage.getItem("isDark") || false);
  useEffect(() => {
    localStorage.setItem("isDark", mode ? 1 : 0);
    mode && document.body.classList.add("dark");
  }, [mode]);
  return <Context.Provider value={{ setMode }}> {children} </Context.Provider>;
};
export default Provider;
