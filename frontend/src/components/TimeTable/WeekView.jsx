import React from "react";
import { Table, Typography } from "antd";
import ScheduleCard from "./ScheduleCard";

const { Text } = Typography;

export default function WeekView({ weekSchedule, currentTime }) {
    const startOfWeek = currentTime.startOf("week").add(1, "day");

    const dayColumns = [
        { key: "Monday", label: "Thứ 2" },
        { key: "Tuesday", label: "Thứ 3" },
        { key: "Wednesday", label: "Thứ 4" },
        { key: "Thursday", label: "Thứ 5" },
        { key: "Friday", label: "Thứ 6" },
        { key: "Saturday", label: "Thứ 7" },
        { key: "Sunday", label: "Chủ nhật" },
    ];

    const columns = [
        { title: "Ca học", dataIndex: "shift", key: "shift", align: "center", width: 120, fixed: "left" },
        ...dayColumns.map((day, idx) => ({
            title: `${day.label} (${startOfWeek.add(idx, "day").format("DD/MM/YYYY")})`,
            dataIndex: day.key,
            key: day.key,
            align: "center",
        })),
    ];

    const renderCell = (data) => {
        if (!data || data.length === 0) return <Text type="secondary">—</Text>;
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 190, textAlign: "left" }}>
                {data.map((item, idx) => (
                    <ScheduleCard key={idx} item={item} currentTime={currentTime} />
                ))}
            </div>
        );
    };

    const dataSource = ["morning", "afternoon", "evening"].map((shift) => ({
        key: shift,
        shift: shift === "morning" ? "Sáng" : shift === "afternoon" ? "Chiều" : "Tối",
        Monday: renderCell(weekSchedule[shift].Monday),
        Tuesday: renderCell(weekSchedule[shift].Tuesday),
        Wednesday: renderCell(weekSchedule[shift].Wednesday),
        Thursday: renderCell(weekSchedule[shift].Thursday),
        Friday: renderCell(weekSchedule[shift].Friday),
        Saturday: renderCell(weekSchedule[shift].Saturday),
        Sunday: renderCell(weekSchedule[shift].Sunday),
    }));

    return <Table columns={columns} dataSource={dataSource} pagination={false} bordered scroll={{ x: true }} size="middle" />;
}