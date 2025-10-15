import { List, Typography } from "antd";
import { ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const { Text } = Typography;

const ListSchedule = ({ todaySchedules, onSelectSchedule }) => {
    return (
        <List
            className="border rounded-lg p-4 hover:shadow-sm"
            dataSource={todaySchedules}
            renderItem={(item) => {
                const now = dayjs().tz("Asia/Ho_Chi_Minh");

                const semesterStart = dayjs(item.semester_start_date);
                const semesterEnd = dayjs(item.semester_end_date).endOf("day");
                if (!now.isBetween(semesterStart, semesterEnd, null, "[]")) {
                    return null;
                }

                const [sh, sm] = (item.lesson_start || "00:00").split(":");
                const [eh, em] = (item.lesson_end || "00:00").split(":");

                let start = now.clone().hour(parseInt(sh, 10)).minute(parseInt(sm, 10)).second(0);
                let end = now.clone().hour(parseInt(eh, 10)).minute(parseInt(em, 10)).second(0);
                if (!end.isAfter(start)) end = end.add(1, "day");

                const fmtRemaining = (minutes) => {
                    if (minutes <= 0) return "0m";
                    const h = Math.floor(minutes / 60);
                    const m = minutes % 60;
                    return (h > 0 ? `${h}h ` : "") + `${m}m`;
                };

                let statusText = "";
                let disabled = false;

                if (now.isBefore(start)) {
                    const diffMin = start.diff(now, "minute");
                    statusText = `Chưa đến giờ (còn ${fmtRemaining(diffMin)})`;
                    disabled = true;
                } else if (now.isAfter(start) && now.isBefore(start.add(20, "minute"))) {
                    const diffMin = Math.max(0, start.add(20, "minute").diff(now, "minute"));
                    statusText = `Trong 20 phút đầu — còn ${diffMin} phút để điểm danh`;
                    disabled = false;
                } else if (now.isAfter(start) && now.isBefore(end)) {
                    const diffMin = Math.max(0, end.diff(now, "minute"));
                    statusText = `Đang diễn ra — còn ${fmtRemaining(diffMin)} đến khi kết thúc`;
                    disabled = false;
                } else {
                    statusText = "Đã kết thúc";
                    disabled = true;
                }

                return (
                    <List.Item
                        className="rounded-lg p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                        onClick={() => !disabled && onSelectSchedule?.(item)}
                    >
                        <div className="w-full">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                <div>
                                    <Text strong>
                                        {item.subject_name} ({item.lesson_type})
                                    </Text>
                                    <div className="text-xs text-gray-600 mt-1">
                                        <ClockCircleOutlined /> {start.format("HH:mm")} - {end.format("HH:mm")} |{" "}
                                        <UserOutlined /> {item.lecturer_name}
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500">{start.format("DD/MM/YYYY")}</div>
                            </div>
                            <div className="mt-2 text-xs">
                                <span
                                    className={`font-medium ${disabled ? "text-gray-500" : "text-blue-600"}`}
                                >
                                    {statusText}
                                </span>
                            </div>
                            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700">
                                <div><b>Lớp:</b> {item.class_name}</div>
                                <div><b>Phòng:</b> {item.room_name}</div>
                                <div><b>Tiết:</b> {item.slot_name}</div>
                                <div><b>Loại:</b> {item.lesson_type}</div>
                            </div>
                        </div>
                    </List.Item>
                );
            }}
        />
    );
};

export default ListSchedule;