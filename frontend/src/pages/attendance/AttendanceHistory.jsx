import React, { useEffect, useState } from "react";
import {
    Table,
    Breadcrumb,
    Card,
    Spin,
    message,
    Modal,
    Descriptions,
    Button,
    Tag
} from "antd";
import { HomeOutlined, CalendarOutlined } from "@ant-design/icons";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";
import api from "../../api/axiosInstance";
import { useTranslation } from "react-i18next";

export default function AttendanceHistory() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));
    const accountId = user?.account_id;

    // mapping day_of_week
    const dayOfWeekMap = {
        2: "Thứ 2",
        3: "Thứ 3",
        4: "Thứ 4",
        5: "Thứ 5",
        6: "Thứ 6",
        7: "Thứ 7",
        8: "Chủ nhật",
    };

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

    // Table columns
    const columns = [
        {
            title: t("attendance code"),
            dataIndex: "attendance_code",
            key: "attendance_code",
        },
        {
            title: t("status"),
            dataIndex: "status",
            key: "status",
            render: (value) => {
                return value === "P"
                    ? <Tag color="green">Đúng giờ</Tag>
                    : value === "L"
                    ? <Tag color="orange">Đi muộn</Tag>
                    : <Tag color="red">Vắng mặt</Tag>;
            }            
        },
        {
            title: t("subject"),
            dataIndex: "subject_name",
            key: "subject_name",
        },
        {
            title: t("check in at"),
            dataIndex: "checkin_at",
            key: "checkin_at",
            render: (value) => (value ? new Date(value).toLocaleString("vi-VN") : "-"),
        },
        {
            title: t("action"),
            key: "actions",
            render: (_, record) => (
                <Button
                    type="link"
                    onClick={() => {
                        setSelectedRecord(record);
                        setIsModalVisible(true);
                    }}
                >
                    Xem chi tiết
                </Button>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-white text-gray-800 dark:bg-black dark:text-white flex flex-col">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex-grow">
                <Header />
                <main className="mt-8 flex flex-col items-center w-full">
                    <div className="w-full mb-4">
                        <Breadcrumb
                            items={[
                                {
                                    href: "/",
                                    title: (
                                        <>
                                            <HomeOutlined /> <span>{t("home")}</span>
                                        </>
                                    ),
                                },
                                {
                                    href: "/attendance/attendance-history",
                                    title: (
                                        <>
                                            <CalendarOutlined /> <span>{t("attendance history")}</span>
                                        </>
                                    ),
                                },
                            ]}
                        />
                    </div>

                    <div className="w-full mt-4">
                        <Card title={t("attendance history")} className="rounded">
                            {loading ? (
                                <div className="flex justify-center p-6">
                                    <Spin />
                                </div>
                            ) : (
                                <Table
                                    rowKey={(record) => record.attendance_id}
                                    columns={columns}
                                    dataSource={summary}
                                    pagination={{ pageSize: 10 }}
                                    scroll={{ x: true }}
                                />
                            )}
                        </Card>
                    </div>
                </main>
            </div>
            <Footer />

            <Modal
                title={"Chi tiết điểm danh cho mã diểm danh: " + selectedRecord?.attendance_code}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setIsModalVisible(false)}>
                        Đóng
                    </Button>,
                ]}
                width={800}
            >
                {selectedRecord && (
                    <Descriptions bordered column={2}>
                        <Descriptions.Item label="Trạng thái">
                            {selectedRecord.status === "P"
                                ? <Tag color="green">Đúng giờ</Tag>
                                : selectedRecord.status === "L"
                                ? <Tag color="orange">Đi muộn</Tag>
                                : "Vắng mặt"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Hình thức điểm danh">
                            {selectedRecord.attendance_type = "Q"
                                ? "QR Code"
                                : "Nhận diện khuôn mặt"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Thời gian điểm danh">
                            {selectedRecord?.checkin_at
                                ? new Date(selectedRecord?.checkin_at).toLocaleString("vi-VN")
                                : "-"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Thứ">
                            {dayOfWeekMap[selectedRecord?.day_of_week] ||
                                selectedRecord?.day_of_week}
                        </Descriptions.Item>
                        <Descriptions.Item label="Môn học">
                            {selectedRecord?.subject_name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Lớp">
                            {selectedRecord?.class_name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Phòng học">
                            {selectedRecord?.room_name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ca học">
                            {selectedRecord?.slot_name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Giờ bắt đầu">
                            {selectedRecord?.lesson_start_time}
                        </Descriptions.Item>
                        <Descriptions.Item label="Giờ kết thúc">
                            {selectedRecord?.lesson_end_time}
                        </Descriptions.Item>
                        <Descriptions.Item label="Buổi học">
                            {selectedRecord?.shift_name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Giảng viên">
                            {selectedRecord?.fullname}
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>
        </div>
    );
}