import { Form, Select } from "antd";

const SelectSubject = ({
    label = "Tên môn học",
    name = "subject",
    studentSubjects,
    t
}) => {
    return (
        <Form.Item
            label={label}
            rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}
            name={name}
            className="mt-5"
        >
            <Select
                allowClear
                options={studentSubjects.map(item => ({
                    label: `${item.subject_name}`,
                    value: item.subject_id
                }))}
                size="large"
                className="w-full custom-select"
                placeholder={t("enter your subject")}
                showSearch
                filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
            />
        </Form.Item>
    );
}

export default SelectSubject;