import { Button } from "antd";

const ButtonEditTask = ({ openEditModal, rem, t }) => {
    return (
        <Button
            type="link"
            onClick={() => openEditModal(rem)}
        >
            {t("edit")}
        </Button>
    );
}

export default ButtonEditTask