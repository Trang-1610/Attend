import React from "react";
import { Modal, Input, DatePicker, Select, Form } from "antd";

const { RangePicker } = DatePicker;

export default function EditReminderModal({
    editModalOpen,
    setEditModalOpen,
    editTitle,
    setEditTitle,
    editContent,
    setEditContent,
    editRangeDate,
    setEditRangeDate,
    handleEditSave,
    studentSubjects,
    setEditSubject,
    editSubject
}) {
    const [form] = Form.useForm();

    return (
        <Modal
            title="Chỉnh sửa nhắc nhở"
            open={editModalOpen}
            onCancel={() => setEditModalOpen(false)}
            onOk={() => form.submit()}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    title: editTitle,
                    content: editContent,
                    dateRange: editRangeDate,
                    subject: editSubject,
                }}
                onFinish={handleEditSave}
            >
                <Form.Item
                    label="Tiêu đề"
                    name="title"
                    rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
                >
                    <Input 
                        onChange={(e) => setEditTitle(e.target.value)} 
                        size="large"
                        style={{ borderWidth: 1.5, boxShadow: "none" }}
                    />
                </Form.Item>

                <Form.Item
                    label="Nội dung"
                    name="content"
                    rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
                >
                    <Input.TextArea 
                        rows={4} 
                        onChange={(e) => setEditContent(e.target.value)} 
                        size="large"
                        style={{ borderWidth: 1.5, boxShadow: "none" }}
                    />
                </Form.Item>

                <Form.Item
                    label="Khoảng thời gian"
                    name="dateRange"
                    rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu và kết thúc!" }]}
                >
                    <RangePicker
                        size="large"
                        showTime={{ format: "HH:mm" }}
                        format="HH:mm DD/MM/YYYY"
                        className="w-full"
                        onChange={(val) => setEditRangeDate(val)}
                    />
                </Form.Item>

                <Form.Item
                    label="Môn học"
                    name="subject"
                    rules={[{ required: true, message: "Vui lòng chọn môn học!" }]}
                >
                    <Select
                        className="custom-select"
                        size="large"
                        options={studentSubjects.map((sub) => ({
                            value: Number(sub.subject_id),
                            label: sub.subject_name,
                        }))}
                        onChange={(val) => setEditSubject(val)}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}
