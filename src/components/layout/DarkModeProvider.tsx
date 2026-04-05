"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { ConfigProvider, theme as antTheme } from "antd";

interface DarkModeContextType {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
}

const DarkModeContext = createContext<DarkModeContextType>({
  darkMode: false,
  setDarkMode: () => {},
});

export const useDarkMode = () => useContext(DarkModeContext);

export default function DarkModeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      <ConfigProvider
        theme={{
          algorithm: darkMode ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
          token: {
            colorPrimary: "#1677ff",
            borderRadius: 10,
            fontFamily: "SF Pro Display, Arial, Helvetica, sans-serif",
          },
        }}
      >
        {/* Apply dark background to the whole page */}
        <div
          style={{
            background: darkMode ? "#141414" : "#f5f6fa",
            minHeight: "100vh",
            transition: "background 0.3s",
          }}
        >
          {children}
        </div>
      </ConfigProvider>
    </DarkModeContext.Provider>
  );
}
