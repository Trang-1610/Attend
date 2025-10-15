import { Card } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

const CardLateCount = ({ summary }) => {
    return (
        <Card>
            <div className="flex items-center space-x-4">
                <InfoCircleOutlined className="text-orange-500 text-2xl" />
                <div>
                    <p className="text-sm text-gray-500">Đi muộn</p>
                    <p className="text-lg font-bold">
                        {summary.late_count} buổi
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default CardLateCount;