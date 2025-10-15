import { useEffect, useState } from "react";
import { Card, Progress } from "antd";
import { useTranslation } from "react-i18next";
import Footer from "../../components/Layout/Footer";
import Header from "../../components/Layout/Header";
import BarChart from "../../components/Chart/AttendanceBarChart";
import FullScreenLoader from "../../components/Spin/Spin";
import BreadcrumbAttendanceStatistic from "../../components/Breadcrumb/AttendanceStatistic";
import CardPresentOnTime from "../../components/Cards/PresentOnTime";
import CardAbsentCount from "../../components/Cards/AbsentCount";
import CardLateCount from "../../components/Cards/LateCount";
import CardTotalSession from "../../components/Cards/ToTalSession";
import api from "../../api/axiosInstance";
import { getAccountId } from "../../utils/auth";

export default function StudentAttendanceStatsPage() {
    const { t } = useTranslation();
    const [summary, setSummary] = useState({
        total_sessions: 0,
        present_on_time: 0,
        late_count: 0,
        absent_count: 0,
    });
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Get account id
    const accountId = getAccountId();

    useEffect(() => {
        document.title = "ATTEND 3D - Thống kê điểm danh";

        const fetchSummary = async () => {
            setLoading(true);
            try {
                const res = await api.get(
                    `attendance/attendance-summary/${accountId}/`
                );
                if (Array.isArray(res.data) && res.data.length > 0) {
                    setSummary(res.data[0]);
                }
            } catch (error) {
                console.error("Error fetching summary:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchStatistics = async () => {
            setLoading(true);
            try {
                const res = await api.get(
                    `attendance/attendance-statistics/${accountId}/`
                );
                if (Array.isArray(res.data)) {
                    setChartData(res.data);
                }
            } catch (error) {
                console.error("Error fetching statistics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
        fetchStatistics();
    }, [t, accountId]);

    return (
        <div className="min-h-screen bg-white text-gray-800 dark:bg-black dark:text-white flex flex-col">
            <div className="w-full mx-auto px-6 flex-grow">
                <Header />
                <main className="w-full mt-10 mx-auto flex-grow">
                    <div className="w-full px-4">
                        <BreadcrumbAttendanceStatistic t={t} />
                    </div>

                    <h1 className="text-2xl font-semibold mt-6 mb-4">
                        Thống kê điểm danh
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <CardPresentOnTime summary={summary} />
                        <CardAbsentCount summary={summary} />
                        <CardLateCount summary={summary} />
                        <CardTotalSession summary={summary} />
                    </div>
                    <Card title="Tỷ lệ có mặt">
                        <Progress percent={summary.attendance_rate_percent} status="active" />
                    </Card>
                    <Card title="Thống kê theo môn học" className="mt-6">
                        <BarChart data={chartData} />
                    </Card>
                </main>
                <FullScreenLoader loading={loading} text={"Đang tải dữ liệu...Vui lòng đợi"} />
            </div>
            <Footer />
        </div>
    );
}