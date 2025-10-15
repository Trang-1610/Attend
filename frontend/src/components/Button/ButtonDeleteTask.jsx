import { Button } from "antd";

const ButtonDeleteTask = ({ deleteTask, taskId }) => {
    return (
        <Button
            type="link"
            danger
            onClick={() => deleteTask(taskId)}
        >
            Xóa
        </Button>
    );
}

export default ButtonDeleteTask