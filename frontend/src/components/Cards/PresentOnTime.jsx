import { CheckCircleOutlined } from "@ant-design/icons";
import { Card } from "antd";

const CardPresentOnTime = ({ summary }) => {
    return (
        <Card>
            <div className="flex items-center space-x-4">
                <CheckCircleOutlined className="text-green-500 text-2xl" />
                <div>
                    <p className="text-sm text-gray-500">Có mặt</p>
                    <p className="text-lg font-bold">
                        {summary.present_on_time} buổi
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default CardPresentOnTime;