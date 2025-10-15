import { Form, Select } from "antd";

const InputSubjectContact = ({ t, subjects, setSelectedSubject, setSelectedLecturerInfo, form }) => {
    return (
        <Form.Item
            label={t("subject")}
            name="subject"
            rules={[{ required: true, message: t("please select a subject") }]}
        >
            <Select
                showSearch
                size="large"
                allowClear
                placeholder={t("enter your subject")}
                options={subjects.map((subject) => ({
                    value: subject.subject_id,
                    label: subject.subject_name,
                }))}
                onChange={(value) => {
                    setSelectedSubject(value);
                    const lecturer = subjects.find((s) => s.subject_id === value);
                    setSelectedLecturerInfo(lecturer || null);

                    form.setFieldsValue({
                        lecturer: lecturer?.fullname || "",
                    });
                }}
                className="w-full custom-select"
            />
        </Form.Item>
    );
};

export default InputSubjectContact;