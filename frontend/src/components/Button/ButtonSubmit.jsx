import { Button, Form } from "antd";

const ButtonSubmit = ({
    loading
}) => {
    return (
        <Form.Item className="mt-6">
            <Button type="primary" htmlType="submit" size="large" loading={loading} className="w-full md:w-auto">
                Gửi đơn
            </Button>
        </Form.Item>
    );
}

export default ButtonSubmit