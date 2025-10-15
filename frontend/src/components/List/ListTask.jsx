import { List } from "antd";
import CheckboxFinishTask from "../Checkbox/FinishTask";
import ButtonDeleteTask from "../Button/ButtonDeleteTask";

const ListTask = ({ tasks, deleteTask, toggleTask }) => {
    return (
        <List
            dataSource={tasks}
            renderItem={(task) => (
                <List.Item
                    actions={[
                        <ButtonDeleteTask deleteTask={deleteTask} taskId={task.id} />
                    ]}
                >
                    <CheckboxFinishTask taskDone={task.done} taskId={task.id} toggleTask={toggleTask} taskTile={task.title} />
                </List.Item>
            )}
        />
    );
}

export default ListTask