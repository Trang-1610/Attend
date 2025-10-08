import React, { createContext, useContext, useEffect, useState } from "react";
import api, { logout as forceLogout } from "../api/axiosInstance";

const AuthCtx = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [initializing, setInitializing] = useState(true);

    const fetchMe = async () => {
        try {
            const res = await api.get("accounts/me/");
            setUser(res.data);
        } catch (err) {
            const stored = localStorage.getItem("user");
            if (stored) {
                setUser(JSON.parse(stored));
            } else {
                setUser(null);
            }
        } finally {
            setInitializing(false);
        }
    };

    useEffect(() => {
        const path = window.location.pathname;

        const isAuthPage =
            path.startsWith("/account/login") ||
            path.startsWith("/account/signup") ||
            path.startsWith("/account/forgot-password");

        if (isAuthPage) {
            setInitializing(false);
            return;
        }

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
                setInitializing(false);
                return;
            } catch (e) {
                console.error("Error parsing user:", e);
            }
        }

        fetchMe();
    }, []);

    useEffect(() => {
        const handleSessionExpired = async () => {
            await logout();
        };
    
        window.addEventListener("session-expired", handleSessionExpired);
        return () => window.removeEventListener("session-expired", handleSessionExpired);
    }, []);    

    const login = async (payload) => {
        try {
            const res = await api.post("accounts/login/", payload, { withCredentials: true });
            const userData = res.data.user || res.data;

            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));

            await fetchMe();

            return userData;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await forceLogout();
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthCtx.Provider value={{ user, initializing, login, logout }}>
            {children}
        </AuthCtx.Provider>
    );
};

export const useAuth = () => useContext(AuthCtx);