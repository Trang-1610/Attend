import { CloseCircleOutlined } from "@ant-design/icons";
import { Card } from "antd";

const CardAbsentCount = ({ summary }) => {
    return (
        <Card>
            <div className="flex items-center space-x-4">
                <CloseCircleOutlined className="text-red-500 text-2xl" />
                <div>
                    <p className="text-sm text-gray-500">Vắng</p>
                    <p className="text-lg font-bold">
                        {summary.absent_count} buổi
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default CardAbsentCount;