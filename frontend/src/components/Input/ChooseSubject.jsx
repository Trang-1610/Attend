import { Select, Form } from "antd";

const InputChooseSubject = ({ 
    label = "Môn học", 
    name = "subject", 
    studentSubjects, 
    onChange }) => {
    return (
        <Form.Item
            label={label}
            name={name}
            rules={[{ required: true, message: "Vui lòng chọn môn học!" }]}
        >
            <Select
                className="custom-select"
                size="large"
                options={studentSubjects.map((sub) => ({
                    value: Number(sub.subject_id),
                    label: sub.subject_name,
                }))}
                onChange={onChange}
            />
        </Form.Item>
    );
}

export default InputChooseSubject