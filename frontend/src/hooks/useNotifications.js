import { useEffect } from "react";
import api from "../api/axiosInstance";
import playSound from "../utils/playSound";
import SoundMessage from "../assets/sounds/message.mp3";

export default function useNotifications(user, setNotifications) {
    useEffect(() => {
        if (!user?.account_id) return;

        const fetchInitialNotifications = async () => {
            try {
                const res = await api.get(`notifications/${user.account_id}/unread/`);
                setNotifications(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error("Fetch notifications failed:", err);
            }
        };

        fetchInitialNotifications();
    }, [user?.account_id, setNotifications]);

    useEffect(() => {
        if (!user?.account_id) return;

        const wsScheme = window.location.protocol === "https:" ? "wss" : "ws";
        const socket = new WebSocket(`${wsScheme}://127.0.0.1:8000/ws/notifications/${user.account_id}/`);

        socket.onopen = () => console.log("WebSocket connected");
        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                playSound(SoundMessage);
                if (data.unread_count !== undefined) {
                    setNotifications((prev) =>
                        prev.map((n) => (data.ids.includes(n.id) ? { ...n, is_read: "1" } : n))
                    );
                } else {
                    setNotifications((prev) => [data, ...prev]);
                }
            } catch (err) {
                console.error("WebSocket message error:", err);
            }
        };
        socket.onclose = () => console.log("WebSocket closed");
        socket.onerror = (err) => console.error("WebSocket error:", err);

        return () => socket.close();
    }, [user?.account_id, setNotifications]);
}