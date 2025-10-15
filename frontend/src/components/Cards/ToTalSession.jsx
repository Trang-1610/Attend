import { Card } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

const CardTotalSession = ({ summary }) => {
    return (
        <Card>
            <div className="flex items-center space-x-4">
                <InfoCircleOutlined className="text-blue-500 text-2xl" />
                <div>
                    <p className="text-sm text-gray-500">Tổng số buổi</p>
                    <p className="text-lg font-bold">
                        {summary.total_sessions} buổi
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default CardTotalSession;