import React, { useState, useEffect, useCallback } from "react";
import { Button, Avatar, Dropdown, message, Popover, Badge, Drawer, Menu, Modal } from "antd";
import { HomeOutlined, PhoneOutlined, ScanOutlined, SettingOutlined, MenuOutlined, UserOutlined, LoginOutlined, BarChartOutlined, PlusCircleOutlined, WechatWorkOutlined, AuditOutlined, LogoutOutlined, UserSwitchOutlined, ScheduleOutlined, BellOutlined, } from "@ant-design/icons";

import Logo from "../../assets/general/face-recognition.png";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import api from "../../api/axiosInstance";
import { logout } from "../../utils/auth";
import { useLocation } from "react-router-dom";
import SoundMessage from "../../assets/sounds/message.mp3";
import playSound from "../../utils/playSound";

export default function Header() {
    const [openDrawer, setOpenDrawer] = useState(false);
    const { t } = useTranslation();
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [user, setUser] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const location = useLocation();

    const fetchNotifications = useCallback(async (accountId, checkNew = false) => {
        try {
            const res = await api.get(`notifications/${accountId}/unread/`);
            const data = Array.isArray(res.data) ? res.data : [];
    
            setNotifications((prev) => {
                if (checkNew && data.length > prev.length) {
                    playSound(SoundMessage);
                }
                return data;
            });            
    
            // setNotifications(data);
        } catch (error) {
            message.error("Không tải được thông báo.");
            setNotifications([]);
        }
    }, []);

    useEffect(() => {
        const path = location.pathname;
        if (path === "/") setSelectedKeys(["home"]);
        else if (path.startsWith("/timetable")) setSelectedKeys(["timetable"]);
        else if (path.startsWith("/attendance/add-face")) setSelectedKeys(["add-face"]);
        else if (path.startsWith("/general-setting")) setSelectedKeys(["general-setting"]);
        else if (path.startsWith("/attendance/statistics")) setSelectedKeys(["statistic"]);
        else if (path.startsWith("/contact")) setSelectedKeys(["contact"]);
        else if (path.startsWith("/profile")) setSelectedKeys(["profile"]);
        else if (path.startsWith("/add-event/add-reminder")) setSelectedKeys(["add-reminder"]);
        else if (path.startsWith("/add-event/request-leave")) setSelectedKeys(["request-leave"]);
        else setSelectedKeys([]);
    }, [location]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get("/accounts/me/", { withCredentials: true });
                setUser(res.data);
            } catch {
                setUser(null);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        if (!user?.account_id) return;

        const intervalId = setInterval(() => {
            fetchNotifications(user.account_id, true);
        }, 50000);

        fetchNotifications(user.account_id, false);

        return () => clearInterval(intervalId);
    }, [user?.account_id, fetchNotifications]);

    // useEffect(() => {
    //     if (!user?.account_id) return;

    //     const wsScheme = window.location.protocol === "https:" ? "wss" : "ws";
    //     const socket = new WebSocket("ws://127.0.0.1:8000/ws/notifications/" + user.account_id + "/");

    //     socket.onopen = () => {
    //         console.log("🔌 WebSocket connected");
    //     };

    //     socket.onmessage = (event) => {
    //         try {
    //             const data = JSON.parse(event.data);
    //             setNotifications((prev) => [data, ...prev]);
    //         } catch (err) {
    //             console.error("Error parsing WS message:", err);
    //         }
    //     };

    //     socket.onclose = () => {
    //         console.log("WebSocket closed");
    //     };

    //     socket.onerror = (err) => {
    //         console.error("WebSocket error:", err);
    //     };

    //     return () => {
    //         socket.close();
    //     };
    // }, [user?.account_id]);

    const handleLogout = () => {
        Modal.confirm({
            title: "Xác nhận đăng xuất",
            content: "Bạn có chắc chắn muốn đăng xuất không?",
            okText: "Đăng xuất",
            cancelText: "Hủy",
            onOk: async () => {
                try {
                    await logout();
                    message.success("Đăng xuất thành công");
                    window.location.href = "/account/login";
                } catch (err) {
                    message.error("Có lỗi khi đăng xuất");
                }
            },
        });
    };

    const items = [
        {
            key: "home",
            icon: <HomeOutlined />,
            label: <a href="/">{t("home")}</a>,
        },
        {
            key: "timetable",
            icon: <ScheduleOutlined />,
            label: <a href="/timetable">{t("timetable")}</a>,
        },
        {
            key: "user",
            icon: <UserOutlined />,
            label: t("setting"),
            children: !user
                ? [
                    {
                        key: "login-prompt",
                        label: <a href="/account/login">Đăng nhập để thực hiện các chức năng</a>,
                        icon: <LoginOutlined />,
                    },
                ]
                : [
                    {
                        key: "admin",
                        label: (
                            <a href="/admin/dashboard" target="_blank" rel="noopener noreferrer">
                                Admin
                            </a>
                        ),
                        icon: <UserSwitchOutlined />,
                    },
                    {
                        key: "add-face",
                        label: <a href="/attendance/add-face">{t("add_face")}</a>,
                        icon: <ScanOutlined />,
                    },
                    {
                        key: "event",
                        label: t("create_event"),
                        icon: <PlusCircleOutlined />,
                        children: [
                            {
                                key: "add-reminder",
                                label: <a href="/add-event/add-reminder">{t("create_reminder")}</a>,
                                icon: <WechatWorkOutlined />,
                            },
                            {
                                key: "request-leave",
                                label: <a href="/add-event/request-leave">{t("request_leave")}</a>,
                                icon: <AuditOutlined />,
                            },
                        ],
                    },
                    {
                        key: "general-setting",
                        label: <a href="/general-setting">{t("general_setting")}</a>,
                        icon: <SettingOutlined />,
                    },
                    {
                        key: "statistic",
                        label: <a href="/attendance/statistics">{t("attendance_stat")}</a>,
                        icon: <BarChartOutlined />,
                    },
                    {
                        key: "contact",
                        label: <a href="/contact">{t("contact")}</a>,
                        icon: <PhoneOutlined />,
                    },
                    {
                        key: "logout",
                        onClick: handleLogout,
                        label: <span style={{ color: "red" }}>{t("logout")}</span>,
                        icon: <LogoutOutlined style={{ color: "red" }} />,
                    },
                ],
        },
        {
            key: "language",
            label: (
                <span className="inline-flex items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-translate"
                        viewBox="0 0 16 16"
                    >
                        <path d="M4.545 6.714 4.11 8H3l1.862-5h1.284L8 8H6.833l-.435-1.286zm1.634-.736L5.5 3.956h-.049l-.679 2.022z"/>
                        <path d="M0 2a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v3h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zm7.138 9.995q.289.451.63.846c-.748.575-1.673 1.001-2.768 1.292.178.217.451.635.555.867 1.125-.359 2.08-.844 2.886-1.494.777.665 1.739 1.165 2.93 1.472.133-.254.414-.673.629-.89-1.125-.253-2.057-.694-2.82-1.284.681-.747 1.222-1.651 1.621-2.757H14V8h-3v1.047h.765c-.318.844-.74 1.546-1.272 2.13a6 6 0 0 1-.415-.492 2 2 0 0 1-.94.31"/>
                    </svg>
                    {t("language")}
                </span>
            ),
            children: [
                {
                    key: "vi",
                    label: (
                        <span className="flex items-center">
                            <img
                                src="https://flagcdn.com/w40/vn.png"
                                alt="Vietnam"
                                className="w-7 h-5 mr-2"
                            />
                            {t("Vietnamese")}
                        </span>
                    ),
                },
                {
                    key: "en",
                    label: (
                        <span className="flex items-center">
                            <img
                                src="https://flagcdn.com/w40/gb.png"
                                alt="UK"
                                className="w-7 h-5 mr-2"
                            />
                            {t("English")}
                        </span>
                    ),
                },
            ],
        },
    ];

    const notificationContent = (
        <div className="max-w-xs">
            {Array.isArray(notifications) && notifications.length > 0 ? (
                <ul className="max-h-60 overflow-auto space-y-2">
                    {notifications.slice(0, 10).map((noti, index) => (
                        <li key={index} className="text-sm border-b pb-1">
                            <strong>{noti.title}</strong>
                            <div className="text-gray-600">{noti.content}</div>
                            <div className="text-xs text-gray-400">
                                {new Date(noti.created_at).toLocaleString()}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-gray-500">{t("no notifications")}</p>
            )}
            <a
                href={`/notifications/all`}
                className="block text-center mt-2 text-blue-500 hover:underline text-sm"
            >
                {t("view all")}
            </a>
        </div>
    );

    const userMenuItems = [
        {
            key: "profile",
            label: <a href="/profile">{t("profile")}</a>,
            icon: <UserOutlined />,
        },
        {
            key: "logout",
            label: (
                <span onClick={handleLogout} style={{ color: "red" }}>
                    {t("logout")}
                </span>
            ),
            icon: <LogoutOutlined style={{ color: "red" }} />,
        },
    ];

    return (
        <header className="flex justify-between items-center py-4 px-4 md:px-10 border-b border-gray-200 w-full">
            <div className="flex items-center space-x-3">
                <a href="/" className="flex items-center space-x-2 hover:opacity-90 transition">
                    <img src={Logo} alt="Logo" className="h-8 w-8 object-contain" />
                    <span className="text-xl md:text-2xl font-extrabold text-gray-800 tracking-wide">
                        FACE <span className="text-blue-600">CLASS</span>
                    </span>
                </a>
            </div>

            <div className="hidden md:flex flex-grow justify-between items-center ml-10 font-bold">
                <Menu
                    mode="horizontal"
                    items={items}
                    selectedKeys={selectedKeys}
                    onClick={({ key }) => {
                        if (key === "vi" || key === "en") {
                            i18n.changeLanguage(key);
                            localStorage.setItem("lang", key);
                        } else {
                            setSelectedKeys([key]);
                        }
                    }}
                    className="flex-1 bg-transparent border-b-0 font-bold"
                />

                <div className="space-x-4 flex-shrink-0 flex items-center">
                    {/* {!user ? (
                        <Button icon={<LoginOutlined />} type="primary" size="middle" href="/account/login">
                            {t("login")}
                        </Button>
                    ) : (
                        <>
                            <Popover
                                content={notificationContent}
                                title="Thông báo"
                                trigger="hover"
                                placement="bottomRight"
                                className="max-w-xs"
                            >
                                <Badge count={notifications.length} size="small">
                                    <BellOutlined style={{ fontSize: 20, cursor: "pointer" }} />
                                </Badge>
                            </Popover>

                            <Dropdown trigger={["hover"]} placement="bottomRight" menu={{ items: userMenuItems }}>
                                <div className="flex items-center gap-2 cursor-pointer">
                                    {user?.avatar ? (

                                        <img
                                            src={user?.avatar}
                                            alt="Avatar"
                                            className="h-10 w-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <Avatar icon={<UserOutlined />} />
                                    )}
                                </div>
                            </Dropdown>
                        </>
                    )} */}
                    <>
                        <Popover
                            content={notificationContent}
                            title={t("notifications")}
                            trigger="hover"
                            placement="bottomRight"
                            className="max-w-xs"
                        >
                            <Badge count={notifications.length} size="small">
                                <BellOutlined style={{ fontSize: 20, cursor: "pointer" }} />
                            </Badge>
                        </Popover>

                        <Dropdown trigger={["hover"]} placement="bottomRight" menu={{ items: userMenuItems }}>
                            <div className="flex items-center gap-2 cursor-pointer">
                                {user?.avatar ? (

                                    <img
                                        src={user?.avatar}
                                        alt="Avatar"
                                        className="h-10 w-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <Avatar icon={<UserOutlined />} />
                                )}
                            </div>
                        </Dropdown>
                    </>
                </div>
            </div>

            <div className="md:hidden">
                <Button icon={<MenuOutlined />} type="text" onClick={() => setOpenDrawer(true)} />
            </div>

            <Drawer title="Menu" className="font-bold" placement="right" onClose={() => setOpenDrawer(false)} open={openDrawer}>
                <Menu
                    mode="inline"
                    items={items}
                    onClick={({ key }) => {
                        if (key === "vi" || key === "en") {
                            i18n.changeLanguage(key);
                        }
                        setOpenDrawer(false);
                    }}
                />
            </Drawer>
        </header>
    );
}