import React, { useEffect, useState } from "react";
import { Button, Form, Input, Typography, Card, Breadcrumb, Select, Row, Col, Descriptions, Avatar, message } from "antd";
import { HomeOutlined, PhoneOutlined, UserOutlined, MailOutlined, PhoneOutlined as PhoneIcon } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import Footer from "../../components/Layout/Footer";
import Header from "../../components/Layout/Header";
import api from "../../api/axiosInstance";

const { Title } = Typography;
const { TextArea } = Input;

export default function ContactPage() {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [contactType, setContactType] = useState("");
    const [subjects, setSubjects] = useState([]);
    const [, setSelectedSubject] = useState(null);
    const [selectedLecturerInfo, setSelectedLecturerInfo] = useState(null);

    useEffect(() => {
        document.title = "ATTEND 3D - " + t("contact");

        fetchSubjects();
    }, [t]);

    const fetchSubjects = async () => {
        try {
            const res = await api.get(`lecturers/lecturer-contact/`);
            setSubjects(res.data || []);
        } catch (error) {
            console.error("Error fetching subjects:", error);
            setSubjects([]);
        }
    };

    const handleContactTypeChange = (value) => {
        setContactType(value);
        setSelectedLecturerInfo(null);
    };

    const onFinish = async (values) => {
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
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-white text-gray-800 dark:bg-black dark:text-white">
            <div className="w-full mx-auto px-6 flex-grow">
                <Header />
                <main className="mt-10 flex flex-col items-center">
                    <div className="w-full px-4">
                        <Breadcrumb
                            items={[
                                { href: "/", title: <><HomeOutlined /> <span>{t("home")}</span></> },
                                {
                                    href: "/contact",
                                    title: (
                                        <>
                                            <PhoneOutlined /> <span>{t("contact")}</span>
                                        </>
                                    ),
                                },
                            ]}
                        />
                    </div>

                    <div className="w-full p-5 rounded-lg mt-0">
                        <Card
                            title={
                                <Title level={3} className="text-start">
                                    {t("send contact information")}
                                </Title>
                            }
                            className="p-6"
                        >
                            <Form
                                form={form}
                                name="contact_form"
                                layout="vertical"
                                method="POST"
                                autoComplete="off"
                                onFinish={onFinish}
                            >
                                <Row gutter={24}>
                                    <Col xs={24} md={24}>
                                        <Form.Item
                                            label={t("contact object")}
                                            name="object_contact"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: t("please select a contact person"),
                                                },
                                            ]}
                                        >
                                            <Select
                                                showSearch
                                                size="large"
                                                allowClear
                                                onChange={handleContactTypeChange}
                                                options={[
                                                    { value: "lecturer", label: t("lecturer") },
                                                    { value: "admin", label: t("admin") },
                                                ]}
                                                className="w-full custom-select"
                                                placeholder={t("select a contact person")}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                {contactType === "lecturer" && (
                                    <Row gutter={24}>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                label={t("subject")}
                                                name="subject"
                                                rules={[{ required: true, message: t("please select a subject") }]}
                                            >
                                                <Select
                                                    showSearch
                                                    size="large"
                                                    allowClear
                                                    placeholder={t("enter your subject")}
                                                    options={subjects.map((subject) => ({
                                                        value: subject.subject_id,
                                                        label: subject.subject_name,
                                                    }))}
                                                    onChange={(value) => {
                                                        setSelectedSubject(value);
                                                        const lecturer = subjects.find((s) => s.subject_id === value);
                                                        setSelectedLecturerInfo(lecturer || null);

                                                        form.setFieldsValue({
                                                            lecturer: lecturer?.fullname || "",
                                                        });
                                                    }}
                                                    className="w-full custom-select"
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                label={t("lecturer")}
                                                name="lecturer"
                                            >
                                                <Input
                                                    size="large"
                                                    disabled
                                                />
                                            </Form.Item>
                                        </Col>

                                        <Col xs={24} md={12}>
                                            <Card size="small" title={t("lecturer information")} className="h-full">
                                                {selectedLecturerInfo ? (
                                                    <Descriptions column={1} size="small">
                                                        <Descriptions.Item label={t("lecturer")}>
                                                            <div className="flex items-center gap-3">
                                                                <Avatar
                                                                    src={
                                                                        selectedLecturerInfo?.avatar ||
                                                                        "https://cdn-icons-png.flaticon.com/512/219/219986.png"
                                                                    }
                                                                    icon={<UserOutlined />}
                                                                />
                                                                {selectedLecturerInfo?.fullname}
                                                            </div>
                                                        </Descriptions.Item>
                                                        <Descriptions.Item label={t("email")}>
                                                            <a href={`mailto:${selectedLecturerInfo?.email}`}>
                                                                <MailOutlined /> {selectedLecturerInfo?.email}
                                                            </a>
                                                        </Descriptions.Item>
                                                        <Descriptions.Item label={t("phonenumber")}>
                                                            <a href={`tel:${selectedLecturerInfo?.phone_number}`}>
                                                                <PhoneIcon /> {selectedLecturerInfo?.phone_number}
                                                            </a>
                                                        </Descriptions.Item>
                                                    </Descriptions>
                                                ) : (
                                                    <p>{t("please select a lecturer to view information")}</p>
                                                )}
                                            </Card>
                                        </Col>
                                    </Row>
                                )}

                                <Form.Item
                                    label={t("content")}
                                    name="content"
                                    rules={[{ required: true, message: t("please enter your content") }]}
                                >
                                    <TextArea rows={5} style={{ boxShadow: 'none', borderWidth: 1.5 }} placeholder={t("enter your content")} />
                                </Form.Item>

                                <Form.Item className="mt-6">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        block
                                        size="large"
                                        style={{ width: '100px' }}
                                    >
                                        {t("submit")}
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}