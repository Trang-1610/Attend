import { Button } from "antd";

const ButtonDisableEditTask = ({ openEditModal, rem, t }) => {
    return (
        <Button
            type="link"
            onClick={() => openEditModal(rem)}
            disabled
        >
            {t("edit")}
        </Button>
    );
}

export default ButtonDisableEditTask