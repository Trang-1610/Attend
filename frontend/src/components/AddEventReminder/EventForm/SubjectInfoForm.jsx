import React from "react";
import { Form, Input, Select, Typography } from "antd";

const { Title } = Typography;

export default function SubjectInfoForm({ studentSubjects }) {

    return (
        <div className="p-4">
            <Title level={4}>Thông tin môn học</Title>

            <Form.Item
                label="Tên môn học"
                rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}
                name={'subject'}
                initialValue={null}
            >
                <Select
                    allowClear
                    options={studentSubjects.map(item => ({
                        label: `${item.subject_name}`,
                        value: item.subject_id
                    }))}
                    placeholder="Chọn môn học"
                    size="large"
                    className="w-full custom-select"
                    showSearch
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                />
            </Form.Item>

            <Form.Item
                label="Tên giảng viên"
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
                label="Phòng học"
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
                label="Tiết học"
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