import React from "react";
import { Card, Tag, Typography } from "antd";
import { PushpinOutlined, HarmonyOSOutlined, ClockCircleOutlined, UserOutlined, SelectOutlined } from "@ant-design/icons";
import TimerCountdown from "../../components/TimerCountdown";

const { Text } = Typography;

export default function ScheduleCard({ item, currentTime }) {
    const now = currentTime;
    const currentWeekday = now.day() === 0 ? 8 : now.day() + 1;
    const itemWeekday = parseInt(item?.day_of_week, 10);

    const [sh, sm] = (item?.lesson_start || "00:00").split(":");
    const [eh, em] = (item?.lesson_end || "00:00").split(":");

    const dayIndex = itemWeekday === 8 ? 0 : itemWeekday - 1;
    const lessonStartWithDay = now.clone().day(dayIndex).hour(parseInt(sh, 10)).minute(parseInt(sm, 10)).second(0);
    const lessonEndWithDay = now.clone().day(dayIndex).hour(parseInt(eh, 10)).minute(parseInt(em, 10)).second(0);
    const endCountdown = lessonStartWithDay.add(10, "minute");

    let countdownNode;
    if (itemWeekday > currentWeekday) {
        countdownNode = <Text type="warning">Chưa đến giờ điểm danh</Text>;
    } else if (itemWeekday < currentWeekday) {
        countdownNode = <Text type="danger">Hết giờ điểm danh</Text>;
    } else {
        if (now.isBefore(lessonStartWithDay)) {
            const diffH = lessonStartWithDay.diff(now, "hour");
            const diffM = lessonStartWithDay.diff(now, "minute") % 60;
            countdownNode = <Text>Còn {diffH > 0 ? `${diffH} giờ ` : ""}{diffM} phút nữa điểm danh</Text>;
        } else if (now.isAfter(lessonEndWithDay)) {
            countdownNode = <Text type="danger">Hết giờ điểm danh</Text>;
        } else if (now.isAfter(lessonStartWithDay) && now.isBefore(endCountdown)) {
            countdownNode = <TimerCountdown end={endCountdown} />;
        } else {
            countdownNode = <Text type="danger">Hết giờ điểm danh</Text>;
        }
    }

    return (
        <Card size="small" style={{ borderLeft: `4px solid ${item?.color || "blue"}`, fontSize: 12 }} bodyStyle={{ padding: 8 }}>
            <Tag color={item?.color || "blue"}>{item?.subject_name} ({item?.lessonType || item.lesson_type})</Tag>
            <div className="mt-2"><PushpinOutlined /> Tiết: {item?.slot_name || item?.slotName}</div>
            <div><HarmonyOSOutlined /> Lớp: {item?.class_name || item?.className}</div>
            <div><ClockCircleOutlined /> Thời gian: {item?.time || `${item?.lesson_start} - ${item?.lesson_end}`}</div>
            <div><UserOutlined /> Giảng viên: {item?.lectureName || item?.lecturer_name}</div>
            <div><SelectOutlined /> Phòng: {item?.roomName || item?.room_name}</div>
            <div style={{ marginTop: 6 }}>Thời gian điểm danh: {countdownNode}</div>
        </Card>
    );
}