import { Input, Form } from 'antd';

const InputTitleEvent = ({ t }) => {
    return (
        <Form.Item
            label={t("title")}
            name="title"
            rules={[{ required: true, message: t("please enter event title") }]}
        >
            <Input
                size="large"
                placeholder={t("enter event title")}
                style={{ borderWidth: 1.5, boxShadow: 'none' }}
                value={" Nhắc nhở"}
            />
        </Form.Item>
    );
};

export default InputTitleEvent;