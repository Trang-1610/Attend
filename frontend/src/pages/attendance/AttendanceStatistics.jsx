import React, { useEffect, useState } from "react";
import { Card, Breadcrumb, Progress } from "antd";
import {
    HomeOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import Footer from "../../components/Layout/Footer";
import Header from "../../components/Layout/Header";
import BarChart from "../../components/Chart/AttendanceBarChart";
import api from "../../api/axiosInstance";

export default function StudentAttendanceStatsPage() {
    const { t } = useTranslation();
    const [summary, setSummary] = useState({
        total_sessions: 0,
        present_on_time: 0,
        late_count: 0,
        absent_count: 0,
    });
    const [chartData, setChartData] = useState([]);

    const user = JSON.parse(localStorage.getItem("user"));
    const accountId = user?.account_id;

    useEffect(() => {
        document.title = "ATTEND 3D - Thống kê điểm danh";

        const fetchSummary = async () => {
            try {
                const res = await api.get(
                    `attendance/attendance-summary/${accountId}/`
                );
                if (Array.isArray(res.data) && res.data.length > 0) {
                    setSummary(res.data[0]);
                }
            } catch (error) {
                console.error("Error fetching summary:", error);
            }
        };

        const fetchStatistics = async () => {
            try {
                const res = await api.get(
                    `attendance/attendance-statistics/${accountId}/`
                );
                if (Array.isArray(res.data)) {
                    setChartData(res.data);
                }
            } catch (error) {
                console.error("Error fetching statistics:", error);
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
                        <Breadcrumb
                            items={[
                                {
                                    href: "/",
                                    title: (
                                        <>
                                            <HomeOutlined /> <span>{"Trang chủ"}</span>
                                        </>
                                    ),
                                },
                                {
                                    href: "/attendance/statistics",
                                    title: "Thống kê điểm danh",
                                },
                            ]}
                        />
                    </div>

                    <h1 className="text-2xl font-semibold mt-6 mb-4">
                        Thống kê điểm danh
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <Card>
                            <div className="flex items-center space-x-4">
                                <CheckCircleOutlined className="text-green-500 text-2xl" />
                                <div>
                                    <p className="text-sm text-gray-500">Có mặt</p>
                                    <p className="text-lg font-bold">
                                        {summary.present_on_time} buổi
                                    </p>
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="flex items-center space-x-4">
                                <CloseCircleOutlined className="text-red-500 text-2xl" />
                                <div>
                                    <p className="text-sm text-gray-500">Vắng</p>
                                    <p className="text-lg font-bold">
                                        {summary.absent_count} buổi
                                    </p>
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="flex items-center space-x-4">
                                <InfoCircleOutlined className="text-orange-500 text-2xl" />
                                <div>
                                    <p className="text-sm text-gray-500">Đi muộn</p>
                                    <p className="text-lg font-bold">
                                        {summary.late_count} buổi
                                    </p>
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="flex items-center space-x-4">
                                <InfoCircleOutlined className="text-blue-500 text-2xl" />
                                <div>
                                    <p className="text-sm text-gray-500">Tổng số buổi</p>
                                    <p className="text-lg font-bold">
                                        {summary.total_sessions} buổi
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <Card title="Tỷ lệ có mặt">
                        <Progress percent={summary.attendance_rate_percent} status="active" />
                    </Card>

                    <Card title="Thống kê theo môn học" className="mt-6">
                        <BarChart data={chartData} />
                    </Card>
                </main>
            </div>

            <Footer />
        </div>
    );
}