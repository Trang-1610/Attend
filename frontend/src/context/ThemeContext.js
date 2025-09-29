import React, { createContext, useContext, useEffect, useState } from "react";
import { ConfigProvider, theme as antdTheme } from "antd";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    const [themeMode, setThemeMode] = useState(
        localStorage.getItem("theme") || "light"
    );

    const [brightness, setBrightness] = useState(() => {
        const raw = localStorage.getItem("brightness");
        const parsed = parseInt(raw, 10);
        return Number.isFinite(parsed) ? parsed : 100;
    });

    // Áp brightness
    useEffect(() => {
        document.body.style.filter = `brightness(${brightness}%)`;
        localStorage.setItem("brightness", String(brightness));
    }, [brightness]);

    // Áp theme (dark/light/auto)
    useEffect(() => {
        const applyLight = () => document.documentElement.classList.remove("dark");
        const applyDark = () => document.documentElement.classList.add("dark");

        if (themeMode === "dark") {
            applyDark();
        } else if (themeMode === "light") {
            applyLight();
        } else {
            // auto
            const media = window.matchMedia("(prefers-color-scheme: dark)");
            const setFromMedia = (m) => (m.matches ? applyDark() : applyLight());
            setFromMedia(media);

            media.addEventListener("change", setFromMedia);
            return () => media.removeEventListener("change", setFromMedia);
        }

        localStorage.setItem("theme", themeMode);
    }, [themeMode]);

    const antdConfig = {
        algorithm: themeMode === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    };

    return (
        <ThemeContext.Provider value={{ themeMode, setThemeMode, brightness, setBrightness }}>
            <ConfigProvider theme={antdConfig}>{children}</ConfigProvider>
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
    return ctx;
}