import React, { useEffect, useState } from "react";
import { Typography, Table, Spin, message, Tooltip } from "antd";
import api from "../../api/axiosInstance";

const { Title } = Typography;

export default function GuideTab() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const accountId = user?.account_id;

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await api.get(`audits/login-logs/${accountId}/`);
                setLogs(response.data);
            } catch (err) {
                console.error("Lỗi khi tải login logs:", err);
                message.error("Không thể tải dữ liệu giám sát đăng nhập.");
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, [accountId]);

    // Table columns
    const columns = [
        {
            title: "Code",
            dataIndex: "login_code",
            key: "login_code",
            render: (code) =>
                code ? (
                    <Tooltip title={code}>
                        <span>{code.substring(0, 6)}...</span>
                    </Tooltip>
                ) : (
                    "-"
            ),
        },
        {
            title: "Địa chỉ IP",
            dataIndex: "ip_address",
            key: "ip_address",
        },
        {
            title: "Hệ điều hành",
            dataIndex: ["device_info", "os"],
            key: "os",
        },
        {
            title: "Trình duyệt",
            dataIndex: ["device_info", "browser"],
            key: "browser",
            render: (browser, record) => `${browser} ${record.device_info?.browser_version || ""}`,
        },
        {
            title: "User agent",
            dataIndex: "user_agent",
            key: "user_agent",
            render: (code) =>
                code ? (
                    <Tooltip title={code}>
                        <span>{code.substring(0, 6)}...</span>
                    </Tooltip>
                ) : (
                    "-"
            ),
        },
        {
            title: "Thiết bị",
            dataIndex: ["device_info", "device"],
            key: "device",
        },
        {
            title: "Vị trí",
            dataIndex: ["device_info", "device_info", "location"],
            key: "location",
            render: (location) => {
                const clean = location?.replace(/[, ]/g, "").trim();
                return clean ? `${location}` : "Không xác định";
            },              
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) =>
                status === "S" ? (
                    <span className="text-green-600 font-medium">Đăng nhập thành công</span>
                ) : (
                    <span className="text-red-500 font-medium">Thất bại</span>
                ),
        },
        {
            title: "Thời gian đăng nhập",
            dataIndex: "login_time",
            key: "login_time",
            render: (time) => new Date(time).toLocaleString(),
        },
        {
            title: "Thời gian đăng xuất",
            dataIndex: "logout_time",
            key: "logout_time",
            render: (time) => (time ? new Date(time).toLocaleString() : "Chưa đăng xuất"),
        },
    ];

    return (
        <div className="p-6 rounded-xl border bg-white shadow-sm">
            <Title level={4}>Giám sát đăng nhập</Title>

            {loading ? (
                <div className="flex justify-center items-center py-10">
                    <Spin size="large" />
                </div>
            ) : (
                <Table
                    dataSource={logs}
                    columns={columns}
                    rowKey="login_code"
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: true }}
                />
            )}
        </div>
    );
}