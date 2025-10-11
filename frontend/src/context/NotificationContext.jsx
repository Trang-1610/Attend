import { createContext, useContext, useState } from "react";

const NotificationCtx = createContext();

export const useNotification = () => useContext(NotificationCtx);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    return (
        <NotificationCtx.Provider value={{ notifications, setNotifications }}>
            {children}
        </NotificationCtx.Provider>
    );
};