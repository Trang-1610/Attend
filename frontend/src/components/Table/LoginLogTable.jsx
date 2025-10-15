// import { useEffect, useState } from "react";
// import { Table, Spin, message } from "antd";
// import api from "../../../api/axiosInstance";

// export default function LoginLogTable() {
//     const [logs, setLogs] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const user = JSON.parse(localStorage.getItem("user"));
//     const accountId = user?.account_id;

//     useEffect(() => {
//         const fetchLogs = async () => {
//             try {
//                 const res = await api.get(`audits/login-logs/${accountId}/`);
//                 setLogs(res.data);
//             } catch {
//                 message.error("Không thể tải dữ liệu giám sát đăng nhập.");
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchLogs();
//     }, [accountId]);

//     const columns = [
//         { title: "IP", dataIndex: "ip_address" },
//         { title: "Trình duyệt", dataIndex: ["device_info", "browser"] },
//         {
//             title: "Trạng thái",
//             dataIndex: "status",
//             render: (v) => (v === "S" ? <span className="text-green-600">Thành công</span> : <span className="text-red-500">Thất bại</span>),
//         },
//         { title: "Đăng nhập", dataIndex: "login_time", render: (t) => new Date(t).toLocaleString() },
//         { title: "Đăng xuất", dataIndex: "logout_time", render: (t) => (t ? new Date(t).toLocaleString() : "Chưa đăng xuất") },
//     ];

//     return loading ? <Spin className="flex justify-center" /> : <Table dataSource={logs} columns={columns} rowKey="login_code" />;
// }