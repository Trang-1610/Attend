import React, { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const localUser = JSON.parse(localStorage.getItem("user"));
        setUser(localUser || null);
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