import { Button, Card, Typography } from "antd";
import { DiffOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const CardCreateLeaveRequest = ({ t }) => {
    return (
        <Card title={<Title level={3}>Tạo đơn sinh nghỉ phép</Title>} className="p-2">
            <div className="flex justify-center mt-6">
                <div className="border rounded-lg p-4 bg-white text-gray-800 dark:bg-black dark:text-white text-center">
                    <Button
                        icon={<DiffOutlined />}
                        size="large"
                        block
                        type="primary"
                        href="/add-event/request-leave/request"
                    >
                        Tạo đơn xin nghỉ phép
                    </Button>
                    <Paragraph className="mt-2 text-sm text-gray-500">
                        Vui lòng click vào nút bên trên để tạo đơn xin nghỉ phép
                    </Paragraph>
                </div>
            </div>
        </Card>
    );
}

export default CardCreateLeaveRequest