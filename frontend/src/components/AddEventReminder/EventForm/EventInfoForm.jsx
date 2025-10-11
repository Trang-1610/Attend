import React from "react";
import { Form, Input, DatePicker, Radio, Typography } from "antd";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useTranslation } from "react-i18next";

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;
const { Title } = Typography;

export default function EventInfoForm({ reminderData, form, selectedSubject }) {
    const { t } = useTranslation();
    const options = [
        { label: 'Email', value: 1 },
        { label: 'SMS', value: 2, disabled: true },
        { label: 'Ứng dụng', value: 3, disabled: true },
    ];

    return (
        <div className="p-4">
            <Title level={4}>{t("event information")}</Title>

            <Form.Item
                label={t("title")}
                name="title"
                rules={[{ required: true, message: t("please enter event title") }]}
            >
                <Input 
                    size="large" 
                    placeholder={t("enter event title")}
                    style={{ borderWidth: 1.5, boxShadow: 'none' }} 
                    value={" Nhắc nhở"}
                />
            </Form.Item>

            <Form.Item
                label={t("content")}
                name="content"
                rules={[{ required: true, message: t("please enter event content") }]}
            >
                <Input.TextArea size="large" placeholder={t("enter event content")} rows={5} style={{ borderWidth: 1.5, boxShadow: 'none' }} />
            </Form.Item>

            <Form.Item
                label={t("event reminder time")}
                initialValue={null}
                name="rangeDate"
                rules={[
                    { required: true, message: t("please select a time") },
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
                    placeholder={[t("start date"), t("end date")]}
                    disabledDate={(current) => {
                        return current && current < dayjs().startOf("day");
                    }}
                />
            </Form.Item>
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
        </div>
    );
}