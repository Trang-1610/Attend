import { useEffect, useState } from "react";
import { message } from "antd";
import api from "../../api/axiosInstance";
import { useTranslation } from "react-i18next";
import { getAccountId } from "../../utils/auth";

import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";
import BreadcrumbAttendanceHistory from "../../components/Breadcrumb/AttendanceHistory";
import ModalDetailAttendanceHistory from "../../components/Modal/ModalDetailAttendanceHistory";
import CardAttendanceHistory from "../../components/Cards/AttendanceHistory";

export default function AttendanceHistory() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Get account id
    const accountId = getAccountId();

    useEffect(() => {
        if (!accountId) return;
        setLoading(true);
        api.get(`attendance/attendance-history/${accountId}/`)
            .then((res) => {
                setSummary(res.data);
            })
            .catch(() => {
                message.error("Không thể tải dữ liệu lịch sử điểm danh");
            })
            .finally(() => setLoading(false));
    }, [accountId, t]);

    return (
        <div className="min-h-screen bg-white text-gray-800 dark:bg-black dark:text-white flex flex-col">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex-grow">
                <Header />
                <main className="mt-8 flex flex-col items-center w-full">
                    <div className="w-full mb-4">
                        <BreadcrumbAttendanceHistory t={t} />
                    </div>

                    <div className="w-full mt-4">
                        <CardAttendanceHistory 
                            loading={loading} 
                            summary={summary} 
                            setSelectedRecord={setSelectedRecord} 
                            setIsModalVisible={setIsModalVisible} 
                            t={t} 
                        />
                    </div>
                </main>
            </div>
            <Footer />
            <ModalDetailAttendanceHistory
                isModalVisible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onClick={() => setIsModalVisible(false)}
                selectedRecord={selectedRecord}
            />
        </div>
    );
}