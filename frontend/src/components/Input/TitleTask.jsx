import { Form, Input } from "antd";

const InputTitleTask = ({ 
    label = "Tiêu đề", 
    name = "title", 
    value, 
    onChange, 
}) => {
    return (
        <Form.Item
            label={label}
            name={name}
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
        >
            <Input
                value={value}
                onChange={onChange}
                size="large"
                style={{ borderWidth: 1.5, boxShadow: "none" }}
            />
        </Form.Item>
    );
};

export default InputTitleTask;