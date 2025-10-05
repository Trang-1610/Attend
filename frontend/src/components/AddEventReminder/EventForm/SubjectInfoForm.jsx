import React from "react";
import { Form, Input, Select, Typography } from "antd";
import { useTranslation } from "react-i18next";
const { Title } = Typography;

export default function SubjectInfoForm({ studentSubjects }) {
    const { t } = useTranslation();
    return (
        <div className="p-4">
            <Title level={4}>{t("subject information")}</Title>

            <Form.Item
                label={t("subject")}
                rules={[{ required: true, message: t("please select a subject") }]}
                name={'subject'}
                initialValue={null}
            >
                <Select
                    allowClear
                    options={studentSubjects.map(item => ({
                        label: `${item.subject_name}`,
                        value: item.subject_id
                    }))}
                    placeholder={t("enter your subject")}
                    size="large"
                    className="w-full custom-select"
                    showSearch
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                />
            </Form.Item>

            <Form.Item
                label={t("lecturer")}
                rules={[{ required: false }]}
                name={'teacher'}
            >
                <Input
                    size="large"
                    className="w-full"
                    disabled
                    style={{ borderWidth: 1.5, boxShadow: 'none', cursor: 'not-allowed' }}
                />
            </Form.Item>

            <Form.Item
                label={t("room")}
                name="roomName"
                rules={[{ required: false }]}
            >
                <Input
                    size="large"
                    disabled
                    style={{ borderWidth: 1.5, boxShadow: 'none', cursor: 'not-allowed' }}
                    className="w-full"
                />
            </Form.Item>

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
        </div>
    );
}