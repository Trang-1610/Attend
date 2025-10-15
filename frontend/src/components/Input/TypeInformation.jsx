import { Form, Radio } from "antd";

const InputTypeInformation = ({ t }) => {

    const options = [
        { label: 'Email', value: 1 },
        { label: 'SMS', value: 2, disabled: true },
        { label: 'Ứng dụng', value: 3, disabled: true },
    ];

    return (
        <Form.Item
            name="emailNotification"
            rules={[{ required: true }]}
            initialValue={1}
        >
            <label>
                <span className="text-red-500">*</span> {t("reminder form")}:
            </label>
            <Radio.Group options={options} defaultValue={1} className="ms-4" />
        </Form.Item>
    );
};

export default InputTypeInformation;