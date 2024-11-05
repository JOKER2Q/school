import { createContext, useEffect, useState } from "react";
const userLanguage = navigator.language || navigator.userLanguage;
const userLang = userLanguage.startsWith("ar") ? "AR" : "EN";
export const Context = createContext({});
const Provider = ({ children }) => {
  const [mode, setMode] = useState(+localStorage.getItem("isDark") || false);
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || userLang
  );

  useEffect(() => {
    localStorage.setItem("isDark", mode ? 1 : 0);
    mode && document.body.classList.add("dark");
  }, [mode]);

  useEffect(() => {
    const h2Active = document.querySelector(".languages h2.active");
    const h2 = document.querySelectorAll(".languages h2");
    const span = document.querySelector(".lang-span");
    span && (span.textContent = language);
    h2Active && h2Active.classList.remove("active");
    localStorage.setItem("language", language);
    if (h2) {
      h2.forEach(
        (e) => e.dataset.lang === language && e.classList.add("active")
      );
    }
  }, [language]);

  return (
    <Context.Provider value={{ setMode, language, setLanguage }}>
      {children}
    </Context.Provider>
  );
};
export default Provider;
