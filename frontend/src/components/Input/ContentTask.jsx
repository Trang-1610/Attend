import { Form, Input } from "antd";

const InputContentTask = ({
    label = "Nội dung",
    name = "content",
    value,
    onChange,
}) => {
    return (
        <Form.Item
            label={label}
            name={name}
            rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
        >
            <Input.TextArea
                value={value}
                rows={4}
                onChange={onChange}
                size="large"
                style={{ borderWidth: 1.5, boxShadow: "none" }}
            />
        </Form.Item>
    );
};

export default InputContentTask;