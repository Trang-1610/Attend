import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Layout/Header";
import { useTranslation } from "react-i18next";
import Footer from "../../components/Layout/Footer";
import api from '../../api/axiosInstance';
import { message, Modal, Skeleton } from "antd";
import ScheduleIcon from "../../assets/icons/scheduling.png";
import ContactIcon from "../../assets/icons/contact-us.png";
import DashboardIcon from "../../assets/icons/dashboard.png";
import ScanFaceIcon from "../../assets/icons/face-scan.png";
import HistoryIcon from "../../assets/icons/history.png";
import LeaveIcon from "../../assets/icons/leave.png";
import NotificationIcon from "../../assets/icons/notification.png";
import ReminderIcon from "../../assets/icons/reminder-notes.png";
import QRCodeIcon from "../../assets/icons/scan-code.png";
import SettingIcon from "../../assets/icons/settings.png";
import TermIcon from "../../assets/icons/terms.png";
import WarningIcon from "../../assets/icons/message-warning.png";
import LogoutIcon from "../../assets/icons/logout.png";
import ProfileIcon from "../../assets/icons/profile.png";
import IntroductionIcon from "../../assets/icons/introduction.png";
import ToDoListIcon from "../../assets/icons/to-do-list.png";

export default function HomePage() {
    const { t } = useTranslation();

    const [user, setUser] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true); 

    const navigate = useNavigate();

    useEffect(() => {
        document.title = "ATTEND 3D - " + t("home");

        let intervalId;

        const fetchUserAndNotifications = async () => {
            try {
                const res = await api.get("/accounts/me/", { withCredentials: true });
                setUser(res.data);

                if (res.data?.account_id) {
                    fetchNotifications(res.data.account_id);
                }
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUserAndNotifications();

        intervalId = setInterval(() => {
            if (user?.account_id) {
                fetchNotifications(user.account_id);
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [user?.account_id, t]);

    const fetchNotifications = async (accountId) => {
        try {
            const res = await api.get(`notifications/${accountId}/unread/`);
            setNotifications(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            message.error("Không tải được thông báo.");
            setNotifications([]);
        }
    };

    const handleLogout = () => {
        Modal.confirm({
            title: "Xác nhận đăng xuất",
            content: "Bạn có chắc chắn muốn đăng xuất không?",
            okText: "Đăng xuất",
            cancelText: "Hủy",
            onOk: async () => {
                try {
                    await api.post("/accounts/logout/", {}, { withCredentials: true });
                    message.success("Đăng xuất thành công");
                    navigate("/account/login");
                } catch (err) {
                    message.error("Có lỗi khi đăng xuất");
                }
            },
        });
    };

    const features = [
        { name: t("introduction"), img: IntroductionIcon, path: "/introduction" },
        { name: t("timetable"), img: ScheduleIcon, path: "/timetable" },
        { name: t("assignment & to-do list"), img: ToDoListIcon, path: "/to-do-list/today" },
        { name: t("attendance qr code"), img: QRCodeIcon, path: "attendance/attendance-qr" },
        { name: t("attendance face"), img: ScanFaceIcon, path: "attendance/add-face" },
        { name: t("attendance history"), img: HistoryIcon, path: "attendance/attendance-history" },
        { name: t("request leave"), img: LeaveIcon, path: "/add-event/request-leave" },

        { name: t("statistics"), img: DashboardIcon, path: "/attendance/statistics" },
        { name: t("notifications") + ` (${notifications.length})`, img: NotificationIcon, path: "/notifications/all" },
        { name: t("attendance reminder"), img: ReminderIcon, path: "/add-event/add-reminder" },

        { name: t('contact'), img: ContactIcon, path: "/contact" },
        { name: t("setting"), img: SettingIcon, path: "/general-setting" },
        { name: t("terms"), img: TermIcon, path: "/terms" },
        { name: t("profile"), img: ProfileIcon, path: "/profile" },

        { name: t("report error"), img: WarningIcon, path: "https://forms.gle/hzNeY832k6dEwfqDA" },
        { name: t("logout"), img: LogoutIcon, action: handleLogout },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-white text-gray-800 dark:bg-black dark:text-white">
            <div className="w-full mx-auto px-6 flex-grow">
                <Header />
                <main className="container m-auto mt-20">
                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {Array.from({ length: 12 }).map((_, index) => (
                                <Skeleton.Button
                                    key={index}
                                    active
                                    block
                                    style={{ height: 120, borderRadius: 8 }}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {features.map((item, index) => {
                                const content = (
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-white text-gray-800 dark:bg-black dark:text-white rounded shadow-md p-6 flex flex-col items-center justify-center cursor-pointer transition-all hover:shadow-xl"
                                    >
                                        <img
                                            src={item.img}
                                            alt={item.name}
                                            className="w-16 h-16 mb-4 object-contain"
                                        />
                                        <p className="text-sm font-semibold text-gray-700 text-center">
                                            {item.name}
                                        </p>
                                    </motion.div>
                                );

                                return item.action ? (
                                    <div key={index} onClick={item.action}>
                                        {content}
                                    </div>
                                ) : (
                                    <Link key={index} to={item.path}>
                                        {content}
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </main>
            </div>
            <Footer />
        </div>
    );
}