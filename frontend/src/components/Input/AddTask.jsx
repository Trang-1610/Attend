import { Input } from "antd";

const InputAddTask = ({ newTask, setNewTask, addTask, t }) => {
    return (
        <Input
            placeholder={t("add mission...")}
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onPressEnter={addTask}
            size="large"
            style={{ borderWidth: 1.5, boxShadow: "none" }}
        />
    );
}

export default InputAddTask