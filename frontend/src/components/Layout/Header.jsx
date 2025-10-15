import React, { useState, useEffect } from "react";
import { PhoneOutlined, ScanOutlined, SettingOutlined, UserOutlined, BarChartOutlined, 
    PlusCircleOutlined, WechatWorkOutlined, AuditOutlined, LogoutOutlined, UserSwitchOutlined, } from "@ant-design/icons";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import {Icons} from "../Icons/Icons";
import { useAppContext } from "../../context/Context";
import useNotifications from "../../hooks/useNotifications";
import DrawerHeader from "../Drawer/DrawerHeader";
import DropdownHeader from "../Dropdown/DropdownHeader";
import PopoverHeader from "../Popover/PopoverHeader";
import ButtonHeader from "../Button/ButtonHeader";
import MenuHeader from "../Menu/MenuHeader";
import LogoHeader from "../LogoHeader";
import ModalLogout from "../Modal/ModalLogout";

export default function Header() {

    const { notifications, setNotifications, user } = useAppContext();

    const [openDrawer, setOpenDrawer] = useState(false);
    const { t } = useTranslation();
    const [selectedKeys, setSelectedKeys] = useState([]);
    const location = useLocation();

    useNotifications(user, setNotifications);

    const userRole = user?.role;

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

    const handleLogout = () => {
        ModalLogout();
    };

    const items = [
        {
            key: "home",
            icon: Icons.Home,
            label: <a href="/">{t("home")}</a>,
        },
        {
            key: "timetable",
            icon: Icons.Schedule,
            label: <a href="/timetable">{t("timetable")}</a>,
        },
        {
            key: "user",
            icon: Icons.Setting,
            label: t("setting"),
            children: userRole === "admin"
                ? [
                    {
                        key: "admin",
                        label: (
                            <a href="/admin/dashboard">
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
                ]
                : [
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
                    {Icons.Language}
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
            <LogoHeader />

            <div className="hidden md:flex flex-grow justify-between items-center ml-10 font-bold">
                <MenuHeader 
                    items={items} 
                    selectedKeys={selectedKeys} 
                    setSelectedKeys={setSelectedKeys} 
                    i18n={i18n} 
                />

                <div className="space-x-4 flex-shrink-0 flex items-center">
                    <>
                        <PopoverHeader 
                            notificationContent={notificationContent} 
                            notifications={notifications} 
                            t={t} 
                        />

                        <DropdownHeader 
                            userMenuItems={userMenuItems} 
                            user={user} 
                        />
                    </>
                </div>
            </div>

            <div className="md:hidden">
                <ButtonHeader setOpenDrawer={setOpenDrawer} />
            </div>

            <DrawerHeader
                items={items}
                setOpenDrawer={setOpenDrawer}
                openDrawer={openDrawer}
                i18n={i18n}
            />
        </header>
    );
}