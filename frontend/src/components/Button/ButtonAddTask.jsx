import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const ButtonAddTask = ({ addTask, t }) => {
    return (
        <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={addTask}
            size="large"
        >
            {t("add")}
        </Button>
    );
}

export default ButtonAddTask