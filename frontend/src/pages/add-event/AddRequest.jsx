import React, { useEffect, useState } from "react";
import { Form, Card, message } from "antd";
import { useWatch } from 'antd/es/form/Form';
import LayoutWrapper from "../../components/AddEventLeaveRequest/LayoutWrapper";
import PageHeader from "../../components/AddEventLeaveRequest/PageHeader";
import LeaveBreadcrumb from "../../components/AddEventLeaveRequest/LeaveRequest/LeaveBreadcrumb";
import LeaveForm from "../../components/AddEventLeaveRequest/LeaveRequest/LeaveForm";
import LeavePreview from "../../components/AddEventLeaveRequest/LeaveRequest/LeavePreview";
import api from "../../api/axiosInstance";
import SoundMessage from "../../assets/sounds/message.mp3";
import playSound from "../../utils/playSound";
import FullScreenLoader from "../../components/Spin/Spin";

export default function AddRequest() {
    useEffect(() => {
        document.title = "ATTEND 3D - Tạo đơn xin nghỉ phép";
    }, []);

    const [form] = Form.useForm();
    const teacher = useWatch('teacher', form);
    const personalLeave = useWatch('personalLeave', form);
    const rangeDate = useWatch('rangeDate', form);
    const selectedSubject = useWatch('subject', form);
    const [loading, setLoading] = useState(false);
    const [leaveData, setLeaveData] = useState(null);
    const [studentSubjects, setStudentSubjects] = useState([]);

    useEffect(() => {
        const fetchLeaveData = async () => {
            if (!selectedSubject) return;

            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const accountId = user?.account_id;

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
            }
        };

        fetchLeaveData();
    }, [selectedSubject, form]);

    const today = new Date();
    const formattedDate = `Tp.HCM, ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;

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
        <LayoutWrapper>
            <main className="mt-10 flex flex-col items-center">
                <div className="w-full px-4">
                    <LeaveBreadcrumb />
                </div>

                <div className="w-full p-5 rounded-lg mt-6">
                    <Card title={<PageHeader text="Tạo đơn xin nghỉ phép" />} className="p-2">
                        <Form
                            form={form}
                            initialValues={{ variant: 'filled', emailNotification: 1 }}
                            layout="vertical"
                            className="w-full"
                            onFinish={async (values) => {
                                if (leaveData) {
                                    if(leaveData?.max_leave_days > 0) {
                                        try {
                                            setLoading(true);
        
                                            const payload = {
                                                student: leaveData?.student_id,
                                                subject: values.subject,
                                                reason: values.personalLeave,
                                                from_date: values.rangeDate[0].toISOString(),
                                                to_date: values.rangeDate[1].toISOString(),
                                                leave_data: leaveData, 
                                                to_target: leaveData?.lecturer_id,
                                            };
        
                                            await api.post("leaves/leave-requests/", payload);
        
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
                            }}
                            onFinishFailed={(errorInfo) => {
                                console.log("Failed:", errorInfo);
                                message.error("Vui lòng điền đầy đủ và chính xác thông tin!");
                            }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <LeaveForm
                                        form={form}
                                        leaveData={leaveData}
                                        selectedSubject={selectedSubject}
                                        loading={loading}
                                        studentSubjects={studentSubjects}
                                    />
                                </div>
                                <div className="p-4">
                                    <LeavePreview
                                        form={form}
                                        selectedSubject={selectedSubject}
                                        rangeDate={rangeDate}
                                        personalLeave={personalLeave}
                                        teacher={teacher}
                                        formattedDate={formattedDate}
                                        leaveData={leaveData}
                                        images={useWatch('images', form)}
                                    />
                                </div>
                            </div>
                        </Form>
                    </Card>
                </div>
                <FullScreenLoader loading={loading} text="Đang xử lý. Vui lòng chờ..." />
            </main>
        </LayoutWrapper>
    );
}