import { useEffect, useState, useCallback } from "react";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";
import api from "../../api/axiosInstance";
import { useAppContext } from "../../context/Context";
import BreadcrumbNotification from "../../components/Breadcrumb/Notification";
import FullScreenLoader from "../../components/Spin/Spin";
import CardNotification from "../../components/Cards/Notification";

export default function NotificationPage() {
    const { t } = useTranslation();
    const { notifications, setNotifications, user } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("all");

    useEffect(() => {
        document.title = "ATTEND 3D - " + t("notifications");
    }, [t]);

    const fetchNotifications = useCallback(
        async (type) => {
            if (!user?.account_id) return;
            setLoading(true);

            let url = `/notifications/${user.account_id}/all/`;
            if (type === "unread") url = `/notifications/${user.account_id}/unread/`;
            if (type === "read") url = `/notifications/${user.account_id}/read/`;

            try {
                const res = await api.get(url);
                setNotifications(Array.isArray(res.data) ? res.data : []);
            } catch (error) {
                console.error("API error:", error);
                message.error("Không tải được thông báo.");
                setNotifications([]);
            } finally {
                setLoading(false);
            }
        },
        [user, setNotifications]
    );

    useEffect(() => {
        fetchNotifications(activeTab);
    }, [user, activeTab, fetchNotifications, t]);

    const markAsRead = async (notificationId) => {
        if (!user?.account_id) return;

        try {
            await api.post(`/notifications/${user.account_id}/mark-read/`, {
                notification_id: notificationId,
            });

            setNotifications((prev) =>
                prev.map((n) =>
                    n.notification_id === notificationId ? { ...n, is_read: "1" } : n
                )
            );

            message.success("Đã cập nhật trạng thái thông báo.");
        } catch (error) {
            console.error("Update error:", error);
            message.error("Không thể cập nhật thông báo.");
        }
    };

    return (
        <div className="min-h-screen bg-white text-gray-800 dark:bg-black dark:text-white flex flex-col">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex-grow">
                <Header />
                <main className="mt-8 flex flex-col items-center">
                    <div className="w-full mb-4">
                        <BreadcrumbNotification t={t} />
                    </div>

                    <div className="w-full mt-4">
                        <CardNotification
                            notifications={notifications}
                            markAsRead={markAsRead}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />
                    </div>
                </main>
                <FullScreenLoader loading={loading} text={"Đang tải dữ liệu...Vui lòng đợi"} />
            </div>
            <Footer />
        </div>
    );
}