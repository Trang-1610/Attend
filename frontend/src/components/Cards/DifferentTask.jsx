import { Card } from "antd";
import { CheckSquareOutlined } from "@ant-design/icons";
import InputAddTask from "../Input/AddTask";
import ButtonAddTask from "../Button/ButtonAddTask";
import ListReminder from "../List/ListReminder";
import ListTask from "../List/ListTask";

const DifferentTask = ({ t, reminders, openEditModal, newTask, setNewTask, addTask, tasks, deleteTask, toggleTask }) => {
    return (
        <Card
            className="rounded"
            title={
                <div className="flex items-center gap-2">
                    <CheckSquareOutlined /> {t("other missions")}
                </div>
            }
        >
            <div className="border-[1.5px] rounded-[10px] p-3">
                <ListReminder reminders={reminders} openEditModal={openEditModal} t={t} />
            </div>

            <div className="flex gap-2 mb-4 mt-4">
                <InputAddTask t={t} newTask={newTask} setNewTask={setNewTask} addTask={addTask} />
                <ButtonAddTask addTask={addTask} t={t}/>
            </div>
            <ListTask tasks={tasks} deleteTask={deleteTask} toggleTask={toggleTask} />
        </Card>
    );
}

export default DifferentTask