import React from "react";
import { Form, Input, DatePicker, Radio, Typography } from "antd";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;
const { Title } = Typography;

export default function EventInfoForm({ reminderData, form, selectedSubject }) {
    
    const options = [
        { label: 'Email', value: 1 },
        { label: 'SMS', value: 2, disabled: true },
        { label: 'Ứng dụng', value: 3, disabled: true },
    ];

    return (
        <div className="p-4">
            <Title level={4}>Thông tin sự kiện</Title>

            <Form.Item
                label="Tiêu đề sự kiện"
                name="title"
                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề sự kiện!' }]}
            >
                <Input 
                    size="large" 
                    placeholder="Nhập tiêu đề sự kiện" 
                    style={{ borderWidth: 1.5, boxShadow: 'none' }} 
                    value={" Nhắc nhở"}
                />
            </Form.Item>

            <Form.Item
                label="Nội dung sự kiện"
                name="content"
                rules={[{ required: true, message: 'Vui lòng nhập nội dung sự kiện!' }]}
            >
                <Input.TextArea size="large" placeholder="Nhập nội dung sự kiện" rows={5} style={{ borderWidth: 1.5, boxShadow: 'none' }} />
            </Form.Item>

            <Form.Item
                label="Thời gian nhắc nhở sự kiện"
                initialValue={null}
                name="rangeDate"
                rules={[
                    { required: true, message: "Vui lòng chọn thời gian!" },
                    {
                        validator: (_, value) => {
                            if (!value || !reminderData) return Promise.resolve();

                            const [start, end] = value;
                            if (!start || !end) return Promise.resolve();

                            const { day_of_week, lesson_start, semester_start_date, semester_end_date } = reminderData;

                            const semesterStart = dayjs(semester_start_date);
                            const semesterEnd = dayjs(semester_end_date);

                            // ============================================
                            // CACULATE REMINDER TIME
                            // ============================================

                            // 1. start & end must be in time semester
                            if (start.isBefore(semesterStart) || start.isAfter(semesterEnd)) {
                                return Promise.reject(new Error("Ngày bắt đầu phải nằm trong học kỳ."));
                            }
                            if (end.isBefore(semesterStart) || end.isAfter(semesterEnd)) {
                                return Promise.reject(new Error("Ngày kết thúc phải nằm trong học kỳ."));
                            }

                            // 2. end must be in day_of_week
                            const endDay = end.day() === 0 ? 8 : end.day() + 1;
                            if (endDay !== day_of_week) {
                                return Promise.reject(new Error(`Ngày kết thúc phải rơi vào thứ ${day_of_week}`));
                            }

                            // 3. end < lesson_start
                            const endLimit = dayjs(end.format("YYYY-MM-DD") + " " + lesson_start);
                            if (!end.isBefore(endLimit)) {
                                return Promise.reject(new Error(`Ngày kết thúc phải trước ${lesson_start}`));
                            }

                            // 4. start < end and end - start >= 1h
                            if (!start.isBefore(end)) {
                                return Promise.reject(new Error("Ngày bắt đầu phải nhỏ hơn ngày kết thúc."));
                            }
                            if (end.diff(start, "minute") < 60) {
                                return Promise.reject(new Error("Khoảng thời gian sự kiện phải ít nhất 1 giờ."));
                            }

                            return Promise.resolve();
                        },
                    },
                ]}
            >
                <RangePicker
                    showTime={{ format: "HH:mm" }}
                    disabled={!selectedSubject}
                    size="large"
                    format="HH:mm DD/MM/YYYY"
                    className="w-full"
                    style={{ borderWidth: 1.5, boxShadow: "none" }}
                    placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                />
            </Form.Item>
            <Form.Item 
                name="emailNotification" 
                rules={[{ required: true }]}
                initialValue={1} 
            >
                <label>
                    <span className="text-red-500">*</span> Hình thức nhắc nhở:
                </label>
                <Radio.Group options={options} defaultValue={1} className="ms-4" />
            </Form.Item>
        </div>
    );
}