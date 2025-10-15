import { useEffect, useState } from "react";
import { Form, Card, message, Typography } from "antd";
import { useWatch } from 'antd/es/form/Form';
import api from "../../api/axiosInstance";

import SoundMessage from "../../assets/sounds/message.mp3";
import playSound from "../../utils/playSound";
import FullScreenLoader from "../../components/Spin/Spin";
import FormAddLeave from "../../components/Form/AddLeave";
import BreadcrumbAddLeave from "../../components/Breadcrumb/AddLeave";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";
import { getAccountId } from "../../utils/auth";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

export default function AddRequest() {
    useEffect(() => {
        document.title = "ATTEND 3D - Tạo đơn xin nghỉ phép";
    }, []);

    const [form] = Form.useForm();
    const { t } = useTranslation();
    const personalLeave = useWatch('personalLeave', form);
    const rangeDate = useWatch('rangeDate', form);
    const selectedSubject = useWatch('subject', form);
    const [loading, setLoading] = useState(false);
    const [leaveData, setLeaveData] = useState(null);
    const [studentSubjects, setStudentSubjects] = useState([]);

    // Get account id
    const accountId = getAccountId();

    useEffect(() => {
        const fetchLeaveData = async () => {
            if (!selectedSubject) return;
            setLoading(true);
            try {

                const res = await api.get(
                    `leaves/leave-requests/${accountId}/${selectedSubject}/`
                );

                if (Array.isArray(res.data) && res.data.length > 0) {
                    setLeaveData(res.data[0]);
                    const lecturerName = res.data[0].lecturer_name || '';
                    form.setFieldsValue({ teacher: lecturerName });
                } else {
                    setLeaveData(null);
                    form.setFieldsValue({ teacher: '' });
                    message.error("Lỗi khi lấy thông tin giảng viên.");
                }

            } catch (error) {
                message.error("Lỗi khi lấy thông tin giảng viên.");
                setLeaveData(null);
                form.setFieldsValue({ teacher: '' });
            } finally {
                setLoading(false);
            }
        };

        fetchLeaveData();
    }, [selectedSubject, form, accountId, t]);

    const today = new Date();
    const formattedDate = `Tp.HCM, ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;

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
        if (leaveData) {
            if (leaveData?.max_leave_days > 0) {
                try {
                    setLoading(true);

                    const formData = new FormData();
                    formData.append("student", leaveData?.student_id);
                    formData.append("subject", values.subject);
                    formData.append("reason", values.personalLeave);
                    formData.append("from_date", values.rangeDate[0].toISOString());
                    formData.append("to_date", values.rangeDate[1].toISOString());
                    formData.append("to_target", leaveData?.lecturer_id);
                    formData.append("leave_data", JSON.stringify(leaveData));

                    (values.images || []).forEach(fileObj => {
                        if (fileObj) {
                            formData.append("images", fileObj);
                        }
                    });

                    await api.post("leaves/leave-requests/", formData, {
                        headers: { "Content-Type": "multipart/form-data" },
                    });

                    message.success("Gửi đơn thành công!");
                    playSound(SoundMessage);
                    setLoading(false);
                    form.resetFields([
                        "subject",
                        "teacher",
                        "personalLeave",
                        "rangeDate",
                        "images",
                    ]);
                } catch (error) {
                    console.error(error);
                    message.error("Gửi đơn thất bại!");
                    setLoading(false);
                } finally {
                    setLoading(false);
                }
            } else {
                message.error("Bạn đã hết ngày xin nghỉ phép!");
            }
        } else {
            message.error("Không tồn tại lịch học!");
        }
    };

    return (
        <div className="min-h-screen bg-white text-gray-800 dark:bg-black dark:text-white flex flex-col">
            <Header />
            <div className="w-full mt-0 mx-auto px-6 flex-grow">
                <main className="mt-10 flex flex-col items-center">
                    <div className="w-full px-4">
                        <BreadcrumbAddLeave />
                    </div>
                    <div className="w-full p-5 rounded-lg mt-6">
                        <Card title={<Title level={3}>Tạo đơn xin nghỉ phép</Title>} className="p-2">
                            <FormAddLeave
                                form={form}
                                onFinish={onFinish}
                                studentSubjects={studentSubjects}
                                leaveData={leaveData}
                                loading={loading}
                                rangeDate={rangeDate}
                                personalLeave={personalLeave}
                                formattedDate={formattedDate}
                                t={t}
                            />
                        </Card>
                    </div>
                    <FullScreenLoader loading={loading} text="Đang xử lý. Vui lòng chờ..." />
                </main>
            </div>
            <Footer />
        </div>
    );
}