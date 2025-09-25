import React from "react";
import { Card, List, Typography, Tag } from "antd";
import { CheckSquareOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import TaskList from "../../components/ToDoList/TaskList";

const { Text } = Typography;

export default function ReminderCard({ reminders, openEditModal, newTask, setNewTask, addTask, tasks, toggleTask, deleteTask }) {
    return (
        <Card
            className="rounded"
            title={
                <div className="flex items-center gap-2">
                    <CheckSquareOutlined /> Nhiệm vụ khác
                </div>
            }
        >
            <div className="border-[1.5px] rounded-[10px] p-3">
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
                                    // <Button
                                    //     type="link"
                                    //     onClick={() => openEditModal(rem)}
                                    //     // disabled={!canEdit}
                                    //     disabled
                                    // >
                                    //     Sửa
                                    // </Button>,
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
                                            {!canEdit && (
                                                <div style={{ color: "red", marginTop: 4 }}>
                                                    Không thể chỉnh sửa (còn ≤ 60 phút đến hạn)
                                                </div>
                                            )}
                                        </>
                                    }
                                />
                            </List.Item>
                        );
                    }}
                />
            </div>

            <TaskList
                newTask={newTask}
                setNewTask={setNewTask}
                addTask={addTask}
                tasks={tasks}
                toggleTask={toggleTask}
                deleteTask={deleteTask}
            />
        </Card>
    );
}