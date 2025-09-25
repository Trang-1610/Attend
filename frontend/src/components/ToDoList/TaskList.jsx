import React from "react";
import { Input, Button, List, Checkbox, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function TaskList({ newTask, setNewTask, addTask, tasks, toggleTask, deleteTask }) {
    return (
        <>
            <div className="flex gap-2 mb-4 mt-4">
                <Input
                    placeholder="Thêm nhiệm vụ..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onPressEnter={addTask}
                    size="large"
                    style={{ borderWidth: 1.5, boxShadow: "none" }}
                />
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={addTask}
                    size="large"
                >
                    Thêm
                </Button>
            </div>
            <List
                dataSource={tasks}
                renderItem={(task) => (
                    <List.Item
                        actions={[
                            <Button
                                type="link"
                                danger
                                onClick={() => deleteTask(task.id)}
                            >
                                Xóa
                            </Button>,
                        ]}
                    >
                        <Checkbox
                            checked={task.done}
                            onChange={() => toggleTask(task.id)}
                        >
                            <Text delete={task.done}>{task.title}</Text>
                        </Checkbox>
                    </List.Item>
                )}
            />
        </>
    );
}