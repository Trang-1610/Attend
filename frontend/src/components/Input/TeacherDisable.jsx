import { Form, Input } from "antd";

const LecturerDisable = ({ t }) => {
    return (
        <Form.Item
            label={t("lecturer")}
            name="lecturer"
        >
            <Input
                size="large"
                disabled
            />
        </Form.Item>
    );
};

export default LecturerDisable;