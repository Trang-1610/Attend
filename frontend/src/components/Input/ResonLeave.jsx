import { Form, Input } from "antd"

const InputReasonLeave = ({
    label = "Lý do",
    name = "personalLeave"
}) => {
    return (
        <Form.Item
            label={label}
            name={name}
            rules={[{ required: true, message: 'Vui lòng nhập nội dung sự kiện!' }]}
        >
            <Input.TextArea
                size="large"
                placeholder="Nhập nội lý do nghỉ phép"
                rows={5}
                style={{ borderWidth: 1.5, boxShadow: 'none' }}
            />
        </Form.Item>
    );
}

export default InputReasonLeave