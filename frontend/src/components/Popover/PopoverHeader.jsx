import { Popover, Badge } from "antd";
import { BellOutlined } from "@ant-design/icons";

const PopoverHeader = ({ notificationContent, notifications, t }) => {
    return (
        <Popover
            content={notificationContent}
            title={t("notifications")}
            trigger="hover"
            placement="bottomRight"
            className="max-w-xs"
        >
            <Badge count={notifications.length} size="small">
                <BellOutlined style={{ fontSize: 20, cursor: "pointer" }} />
            </Badge>
        </Popover>
    );
};

export default PopoverHeader;