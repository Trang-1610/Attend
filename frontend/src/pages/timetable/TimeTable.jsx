import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, Breadcrumb, Tabs, Typography, Spin } from "antd";
import { HomeOutlined, ScheduleOutlined } from "@ant-design/icons";
import Footer from "../../components/Layout/Footer";
import Header from "../../components/Layout/Header";
import api from "../../api/axiosInstance";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";
import WeekView from "../../components/TimeTable/WeekView";
import MonthView from "../../components/TimeTable/MonthView";
import { buildWeekSchedule } from "../../components/utils/utilsTimeTable";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

const { Title } = Typography;

export default function TimeTable() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("week");
    const [scheduleData, setScheduleData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(dayjs().tz("Asia/Ho_Chi_Minh"));

    useEffect(() => {
        document.title = "ATTEND 3D - " + t("timetable");
        fetchSchedule();
    }, [t]);

    const fetchSchedule = async () => {
        const user = localStorage.getItem("user");
        const accountId = user ? JSON.parse(user).account_id : null;
        try {
            const res = await api.get("students/schedules/" + accountId + "/");
            setScheduleData(res.data);
        } catch (error) {
            console.error("Error fetching schedule:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(dayjs().tz("Asia/Ho_Chi_Minh"));
        }, 1000 * 120);
        return () => clearInterval(interval);
    }, []);

    const weekSchedule = buildWeekSchedule(scheduleData, currentTime);

    const items = [
        { key: "week", label: "Theo tuần", children: loading ? <Spin /> : <WeekView weekSchedule={weekSchedule} currentTime={currentTime} /> },
        { key: "month", label: "Theo tháng", children: loading ? <Spin /> : <MonthView scheduleData={scheduleData} currentTime={currentTime} /> },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-white text-gray-800 dark:bg-black dark:text-white">
            <div className="w-full mx-auto px-6 flex-grow">
                <Header />
                <main className="m-auto mt-10 px-4">
                    <div className="w-full px-2 mb-6">
                        <Breadcrumb
                            items={[
                                { href: "/", title: <><HomeOutlined /> <span>{"Trang chủ"}</span></> },
                                { href: "/timetable", title: <><ScheduleOutlined /> <span>{"Lịch học"}</span></> },
                            ]}
                        />
                    </div>
                    <Card
                        title={<Title level={4} style={{ margin: 0 }}>{t("timetable")}</Title>}
                        className="rounded-lg"
                    >
                        <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
                    </Card>
                </main>
            </div>
            <Footer />
        </div>
    );
}
