import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Footer from "../../components/Layout/Footer";
import Header from "../../components/Layout/Header";
import BreadcrumbTimeTable from "../../components/Breadcrumb/TimeTable";
import CardTimeTable from "../../components/Cards/TimeTable";
import FullScreenLoader from "../../components/Spin/Spin";
import api from "../../api/axiosInstance";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";
import WeekView from "../../components/TimeTable/WeekView";
import MonthView from "../../components/TimeTable/MonthView";
import { buildWeekSchedule } from "../../components/utils/utilsTimeTable";
import { getAccountId } from "../../utils/auth";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

export default function TimeTable() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("week");
    const [scheduleData, setScheduleData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(dayjs().tz("Asia/Ho_Chi_Minh"));

    // Get account id
    const accountId = getAccountId();

    const fetchSchedule = useCallback(async () => {
        try {
            const res = await api.get("students/schedules/" + accountId + "/");
            setScheduleData(res.data);
        } catch (error) {
            console.error("Error fetching schedule:", error);
        } finally {
            setLoading(false);
        }
    }, [accountId]);

    useEffect(() => {
        document.title = "ATTEND 3D - " + t("timetable");
        fetchSchedule();
    }, [t, fetchSchedule]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(dayjs().tz("Asia/Ho_Chi_Minh"));
        }, 1000 * 120);
        return () => clearInterval(interval);
    }, []);

    const weekSchedule = buildWeekSchedule(scheduleData, currentTime);

    const items = [
        {
            key: "week",
            label: "Theo tuần",
            children: loading ? <FullScreenLoader loading={loading} text={"Đang tải dữ liệu...Vui lòng đợi"} /> : <WeekView weekSchedule={weekSchedule} currentTime={currentTime} />
        },
        {
            key: "month",
            label: "Theo tháng",
            children: loading ? <FullScreenLoader loading={loading} text={"Đang tải dữ liệu...Vui lòng đợi"} /> : <MonthView scheduleData={scheduleData} currentTime={currentTime} />
        },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-white text-gray-800 dark:bg-black dark:text-white">
            <div className="w-full mx-auto px-6 flex-grow">
                <Header />
                <main className="m-auto mt-10 px-4">
                    <div className="w-full px-2 mb-6">
                        <BreadcrumbTimeTable t={t} />
                    </div>
                    <CardTimeTable
                        t={t}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        items={items}
                    />
                </main>
            </div>
            <Footer />
        </div>
    );
}