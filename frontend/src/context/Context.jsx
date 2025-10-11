import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axiosInstance";

const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get("/accounts/me/", { withCredentials: true });
                setUser(res.data);
            } catch (err) {
                const localUser = JSON.parse(localStorage.getItem("user"));
                setUser(localUser || null);
            }
        };

        fetchUser();
    }, []);

    return (
        <AppContext.Provider
            value={{
                notifications,
                setNotifications,
                user,
                setUser,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};