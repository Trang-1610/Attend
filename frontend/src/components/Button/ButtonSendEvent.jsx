import { Button, Form } from "antd";

const ButtonSendEvent = ({ t }) => {
    return (
        <Form.Item className="">
            <Button type="primary" htmlType="submit" size="large" className="w-full md:w-auto">
                {t("send event")}
            </Button>
        </Form.Item>
    );
};

export default ButtonSendEvent;