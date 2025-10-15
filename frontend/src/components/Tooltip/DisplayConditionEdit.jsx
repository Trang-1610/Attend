import { Tooltip } from "antd";
import ButtonDisableEditTask from "../Button/ButtonDisableTask";

const TooltipDisplayConditionEdit = ({ t, openEditModal, rem }) => {
    return (
        <Tooltip
            placement="top"
            title={t("since the notification will be sent automatically via email, it cannot be edited within the remaining 60 minutes")}
        >
            <span>
                <ButtonDisableEditTask t={t} openEditModal={openEditModal} rem={rem} />
            </span>
        </Tooltip>
    );
};

export default TooltipDisplayConditionEdit;