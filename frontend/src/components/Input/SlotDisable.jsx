import { Form, Input } from "antd";

const InputRoomDisable = ({ t}) => {
    return (
        <Form.Item
            label={t("slot")}
            name="slotName"
            rules={[{ required: false }]}
        >
            <Input
                size="large"
                disabled
                style={{ borderWidth: 1.5, boxShadow: 'none', cursor: 'not-allowed' }}
                className="w-full"
            />
        </Form.Item>
    );
};

export default InputRoomDisable;