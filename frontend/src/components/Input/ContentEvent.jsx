import { Form, Input } from "antd";

const InputContentEvent = ({ t }) => {
    return (
        <Form.Item
            label={t("content")}
            name="content"
            rules={[{ required: true, message: t("please enter content") }]}
        >
            <Input.TextArea size="large" placeholder={t("enter content")} rows={5} style={{ borderWidth: 1.5, boxShadow: 'none' }} />
        </Form.Item>
    );
};

export default InputContentEvent;