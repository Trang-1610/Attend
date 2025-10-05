import React, { useEffect, useState } from "react";
import { Card, Form, Typography, Button, message } from "antd";
import EventInfoForm from "./EventInfoForm";
import SubjectInfoForm from "./SubjectInfoForm";
import api from "../../../api/axiosInstance";
import { useWatch } from 'antd/es/form/Form';
import dayjs from "dayjs";
import SoundMessage from "../../../assets/sounds/message.mp3";
import playSound from "../../../utils/playSound";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

export default function EventForm() {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const [reminderData, setReminderData] = useState(null);
    const selectedSubject = useWatch('subject', form);
    const selectedRange = useWatch('rangeDate', form);
    const selectedTimeEvent = useWatch('timeEvent', form);
    
    const [studentSubjects, setStudentSubjects] = useState([]);

    useEffect(() => {
        const fetchReminderData = async () => {
            if (!selectedSubject) return;

            if(selectedSubject) {

                try {
                    const user = JSON.parse(localStorage.getItem('user'));
                    const accountId = user?.account_id;
    
                    const res = await api.get(
                        `reminders/${accountId}/${selectedSubject}/`
                    );
    
                    if (Array.isArray(res.data) && res.data.length > 0) {
                        const reminder = res.data[0];
                        setReminderData(reminder);
                    
                        form.setFieldsValue({
                            title: "Nhắc nhở điểm danh cho môn " + reminder.subject_name,
                            content: "Nội dung nhắc nhở " + dayjs().format('DD-MM-YYYY') + " cho môn " + reminder.subject_name,
                            teacher: reminder.lecturer_name || '',
                            roomName: reminder.room_name || '',
                            slotName: reminder.slot_name || ''
                        });
                    } else {
                        setReminderData(null);
                        form.setFieldsValue({ 
                            title: "", 
                            teacher: '', 
                            roomName: '', 
                            slotName: '' 
                        });
                        message.error("Lỗi khi lấy thông tin lịch học.");
                    }                    
    
                } catch (error) {
                    message.error("Lỗi khi lấy thông tin lịch học.");
                    setReminderData(null);
                    form.setFieldsValue({ teacher: '', roomName: '', slotName: '' });
                }
            }
        };

        fetchReminderData();
    }, [selectedSubject, form, t]);

    useEffect(() => {
        const fetchStudentSubject = async () => {
            const user = localStorage.getItem("user");
            const accountId = user ? JSON.parse(user).account_id : null;
    
            try {
                const res = await api.get("subjects/student-subjects/" + accountId + "/");
                setStudentSubjects(res.data || []);
            } catch (error) {
                console.error("Error fetching student_subjects:", error);
                setStudentSubjects([]);
            }
        };

        fetchStudentSubject();
    }, []);
      
    return (
        <div className="w-full p-5 rounded-lg mt-6">
            <Card title={<Title level={3}>{t("create event information")}</Title>} className="p-2">
                <Form
                    form={form}
                    initialValues={{ variant: 'filled', emailNotification: 1 }}
                    layout="vertical"
                    name="formCreateEvent"
                    autoComplete="off"

                    onFinish={async (values) => {
                        try {
                            const user = JSON.parse(localStorage.getItem('user'));
                            const accountId = user?.account_id;
                
                            const payload = {
                                title: values.title,
                                content: values.content,
                                start_date: values.rangeDate[0].toISOString(),
                                end_date: values.rangeDate[1].toISOString(),
                                time_reminder: "00:30:00",
                                subject: values.subject,
                                student_account: accountId,
                            };

                            console.log('payload', payload);
                
                            await api.post("reminders/", payload);
                
                            message.success("Tạo sự kiện thành công!");
                            playSound(SoundMessage);
                            form.resetFields(['title', 'content', 'rangeDate', 'emailNotification', 'subject', 'teacher', 'roomName', 'slotName']);
                
                        } catch (error) {
                            console.error(error);
                            message.error("Lỗi khi tạo sự kiện!");
                        }
                    }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SubjectInfoForm 
                            form={form}
                            selectedSubject={selectedSubject}
                            reminderData={reminderData}
                            studentSubjects={studentSubjects}
                        />
                        <EventInfoForm
                            form={form}
                            reminderData={reminderData}
                            selectedRange={selectedRange}
                            selectedTimeEvent={selectedTimeEvent}
                            selectedSubject={selectedSubject}
                        />
                    </div>

                    <Form.Item className="">
                        <Button type="primary" htmlType="submit" size="large" className="w-full md:w-auto">
                            {t("send event")}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}