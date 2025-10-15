import { BellOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import TableNotificationList from "../Table/NotificationList";

const CardNotification = ({ notifications, markAsRead, activeTab, setActiveTab }) => {
    return (
        <Card
            className="rounded"
            title={
                <div className="flex items-center gap-2 text-lg">
                    <BellOutlined /> Thông báo
                </div>
            }
            extra={
                <div className="flex flex-wrap gap-2">
                    <Button
                        type={activeTab === "unread" ? "primary" : "default"}
                        onClick={() => setActiveTab("unread")}
                    >
                        Chưa đọc
                    </Button>
                    <Button
                        type={activeTab === "read" ? "primary" : "default"}
                        onClick={() => setActiveTab("read")}
                    >
                        Đã đọc
                    </Button>
                    <Button
                        type={activeTab === "all" ? "primary" : "default"}
                        onClick={() => setActiveTab("all")}
                    >
                        Tất cả
                    </Button>
                </div>
            }
        >
            <TableNotificationList
                notifications={notifications}
                markAsRead={markAsRead}
            />
        </Card>
    );
};

export default CardNotification;