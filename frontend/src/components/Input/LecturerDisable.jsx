import { Form, Input } from 'antd'

const InputLecturerDisable = ({
    label = "Tên giảng viên",
    name = "teacher",
}) => {
    return (
        <Form.Item label={label} name={name}>
            <Input
                size="large"
                className="w-full"
                disabled
                style={{ borderWidth: 1.5, boxShadow: 'none', cursor: 'not-allowed' }}
            />
        </Form.Item>
    );
}

export default InputLecturerDisable