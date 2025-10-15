import { useEffect, useState } from "react";
import { Form, message } from "antd";
import { useWatch } from 'antd/es/form/Form';
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

import { getAccountId } from "../../utils/auth";
import api from "../../api/axiosInstance";
import SoundMessage from "../../assets/sounds/message.mp3";
import playSound from "../../utils/playSound";
import Footer from "../../components/Layout/Footer";
import Header from "../../components/Layout/Header";
import BreadcrumbReminder from "../../components/Breadcrumb/Reminder";
import CardInformationEvent from "../../components/Cards/InformationEvent";
import FullScreenLoader from "../../components/Spin/Spin";

export default function ReminderPage() {
    useEffect(() => {
        document.title = "ATTEND 3D - Tạo nhắc nhở điểm danh";
    }, []);

    const [form] = Form.useForm();
    const { t } = useTranslation();
    const [reminderData, setReminderData] = useState(null);
    const selectedSubject = useWatch('subject', form);
    const [studentSubjects, setStudentSubjects] = useState([]);
    const [loading, setLoading] = useState(false);

    // Get account id
    const accountId = getAccountId();

    useEffect(() => {
        const fetchReminderData = async () => {
            if (!selectedSubject) return;
            if (selectedSubject) {
                setLoading(true);
                try {
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
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchReminderData();
    }, [selectedSubject, form, t, accountId]);

    useEffect(() => {
        const fetchStudentSubject = async () => {
            setLoading(true);
            try {
                const res = await api.get("subjects/student-subjects/" + accountId + "/");
                setStudentSubjects(res.data || []);
            } catch (error) {
                console.error("Error fetching student_subjects:", error);
                setStudentSubjects([]);
            } finally {
                setLoading(false);
            }
        };

        fetchStudentSubject();
    }, [accountId]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
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
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-gray-800 dark:bg-black dark:text-white flex flex-col">
            <Header />
            <div className="w-full mx-auto px-6 flex-grow">
                <main className="mt-10 flex flex-col items-center">
                    <div className="w-full px-4">
                        <BreadcrumbReminder t={t} />
                    </div>
                    <div className="w-full p-5 rounded-lg mt-6">
                        <CardInformationEvent
                            form={form}
                            onFinish={onFinish}
                            studentSubjects={studentSubjects}
                            selectedSubject={selectedSubject}
                            reminderData={reminderData}
                            t={t}
                        />
                    </div>
                </main>
                <FullScreenLoader loading={loading} text={"Đang xử lý...Vui lòng đợi"} />
            </div>
            <Footer />
        </div>
    );
}