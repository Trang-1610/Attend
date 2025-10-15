import { List, Tag, Typography } from "antd";
import TooltipDisplayConditionEdit from "../Tooltip/DisplayConditionEdit";
import ButtonEditTask from "../Button/ButtonEditTask";
import dayjs from "dayjs";

const { Text } = Typography;

const ListReminder = ({ reminders, openEditModal, t }) => {
    return (
        <List
            dataSource={reminders}
            renderItem={(rem) => {
                const now = dayjs();
                const end = dayjs(rem.end_date);
                const diffMinutes = end.diff(now, "minute");
                const canEdit = diffMinutes > 60;

                return (
                    <List.Item
                        actions={[
                            !canEdit ? (
                                <TooltipDisplayConditionEdit t={t} openEditModal={openEditModal} rem={rem} />
                            ) : (
                                <ButtonEditTask openEditModal={openEditModal} rem={rem} t={t} />
                            ),
                        ]}
                    >
                        <List.Item.Meta
                            title={<b>{rem.title}</b>}
                            description={
                                <>
                                    <div>Nội dung: {rem.content}</div>
                                    <div>
                                        Thời gian:{" "}
                                        <Text type="secondary">
                                            {dayjs(rem.start_date).format("DD/MM/YYYY")} -{" "}
                                            {dayjs(rem.end_date).format("DD/MM/YYYY")}
                                        </Text>
                                    </div>
                                    <div>Môn học: {rem.subject?.subject_name}</div>
                                    <div>
                                        Thời gian tự động thông báo trước:{" "}
                                        <Tag color="green">{dayjs(`2025-01-01 ${rem.time_reminder}`).format("HH:mm")} phút</Tag>
                                    </div>
                                    <div>
                                        Trạng thái nhắc nhở:{" "}
                                        <Tag color="red">{
                                            rem.status_reminder === "P" ? "Chưa hoàn thành" : "Hoàn thành"
                                        }</Tag>
                                    </div>
                                    <div>
                                        Hình thức gửi nhắc nhở:{" "}
                                        <Tag color="blue">
                                            Email
                                        </Tag>
                                    </div>
                                </>
                            }
                        />
                    </List.Item>
                );
            }}
        />
    );
}

export default ListReminder