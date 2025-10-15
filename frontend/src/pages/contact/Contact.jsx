import { useEffect, useState } from "react";
import { Form, message } from "antd";
import { useTranslation } from "react-i18next";

import Footer from "../../components/Layout/Footer";
import Header from "../../components/Layout/Header";
import api from "../../api/axiosInstance";
import BreadcrumbContact from "../../components/Breadcrumb/Contact";
import CardInformationContact from "../../components/Cards/InformationContact";
import FullScreenLoader from "../../components/Spin/Spin";

export default function ContactPage() {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [contactType, setContactType] = useState("");
    const [subjects, setSubjects] = useState([]);
    const [, setSelectedSubject] = useState(null);
    const [selectedLecturerInfo, setSelectedLecturerInfo] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.title = "ATTEND 3D - " + t("contact");

        fetchSubjects();
    }, [t]);

    const fetchSubjects = async () => {
        setLoading(true);
        try {
            const res = await api.get(`lecturers/lecturer-contact/`);
            setSubjects(res.data || []);
        } catch (error) {
            console.error("Error fetching subjects:", error);
            setSubjects([]);
        } finally {
            setLoading(false);
        }
    };

    const handleContactTypeChange = (value) => {
        setContactType(value);
        setSelectedLecturerInfo(null);
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const { object_contact, subject, content } = values;
            if (!object_contact) {
                return message.warning("Vui lòng chọn đối tượng liên hệ.");
            }

            const payload = {
                type_person_contact: object_contact === "lecturer" ? "LECTURER" : "ADMIN",
                message: content,
                ...(object_contact === "lecturer" && subject ? { subject } : {}),
            };

            const res = await api.post("/contacts/add/", payload);

            if (res.status === 201 || res.status === 200) {
                message.success("Gửi liên hệ thành công.");
                form.resetFields();
                setContactType("");
                setSelectedLecturerInfo(null);
            } else {
                message.error("Không thể gửi liên hệ. Vui lòng thử lại.");
                console.error("Unexpected response:", res);
            }
        } catch (err) {
            console.error("Error sending contact:", err);
            if (err.response && err.response.data) {
                const data = err.response.data;
                if (typeof data === "string") {
                    message.error(data);
                } else if (data.detail) {
                    message.error(data.detail);
                } else {
                    const firstKey = Object.keys(data)[0];
                    const firstErr = data[firstKey];
                    message.error(Array.isArray(firstErr) ? firstErr.join(", ") : String(firstErr));
                }
            } else {
                message.error("Lỗi mạng hoặc máy chủ. Vui lòng thử lại.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-white text-gray-800 dark:bg-black dark:text-white">
            <div className="w-full mx-auto px-6 flex-grow">
                <Header />
                <main className="mt-10 flex flex-col items-center">
                    <div className="w-full px-4">
                        <BreadcrumbContact t={t} />
                    </div>
                    <div className="w-full p-5 rounded-lg mt-0">
                        <CardInformationContact
                            t={t}
                            form={form}
                            onFinish={onFinish}
                            handleContactTypeChange={handleContactTypeChange}
                            contactType={contactType}
                            subjects={subjects}
                            setSelectedSubject={setSelectedSubject}
                            selectedLecturerInfo={selectedLecturerInfo}
                            setSelectedLecturerInfo={setSelectedLecturerInfo}
                            loading={loading}
                        />
                    </div>
                </main>
                <FullScreenLoader loading={loading} text={"Đang xử lý...Vui lòng đợi"} />
            </div>
            <Footer />
        </div>
    );
}