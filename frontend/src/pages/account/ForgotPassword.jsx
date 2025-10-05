import React, { useEffect, useState } from "react";
import { Form, Input, Button, Alert, message, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import ForgotPasswordImage from "../../assets/general/forgot-password.png";
import { Icons } from "../../components/Icons/Icons";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import publicApi from "../../api/publicApi";

const randomId = uuidv4();

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const user = localStorage.getItem("user");
    const accountId = user ? JSON.parse(user).account_id : null;

    useEffect(() => {
        document.title = "ATTEND 3D - Quên mật khẩu";
    }, []);

    const onFinish = async (values) => {
        try {
            setLoading(true);
            localStorage.setItem("otp_email", values.email);
            const response = await publicApi.post("accounts/auth/forgot-password/", {
                email: values.email,
            });

            message.success(response.data.message || "Mã OTP đã được gửi tới email của bạn!");
            navigate(`/account/otp-verify-reset-password/?redirect=${randomId}`);
        } catch (error) {
            console.error("Forgot password error:", error);
            if (error.response?.data?.email) {
                message.error(error.response.data.email);
            } else if (error.response?.data?.detail) {
                message.error(error.response.data.detail);
            } else {
                message.error("Không thể gửi OTP. Vui lòng thử lại.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full flex flex-col md:flex-row">
            {/* Left illustration */}
            <div className="w-full md:w-7/12 flex items-center justify-center">
                <img
                    src={ForgotPasswordImage}
                    alt="Forgot password"
                    className="w-[80%] h-[80%] object-contain"
                />
            </div>

            {/* Right form */}
            <div className="w-full md:w-5/12 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    <h1 className="text-2xl font-semibold mb-6 text-center">
                        {accountId === null ? "Quên mật khẩu" : "Đổi mật khẩu"}
                    </h1>

                    <Alert
                        message="Vui lòng nhập email để gửi mã xác thực"
                        type="info"
                        showIcon
                        className="mb-4"
                    />

                    <Form
                        name="forgot_password_form"
                        layout="vertical"
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: "Vui lòng nhập email!" },
                                { type: "email", message: "Email không hợp lệ!" },
                            ]}
                        >
                            <Input
                                placeholder="Nhập email"
                                size="large"
                                style={{ borderWidth: 1.5, boxShadow: "none" }}
                                suffix={Icons.Email}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                size="large"
                                className="rounded-md mt-3"
                                loading={loading}
                            >
                                Xác nhận
                            </Button>
                        </Form.Item>
                    </Form>

                    <div className="flex flex-col items-center space-y-2 text-sm">
                        {accountId !== null ? (
                            <a
                                href="/profile"
                                className="text-blue-600 hover:underline"
                            >
                                <ArrowLeftOutlined /> Quay lại
                            </a>
                        ) : (
                            <a
                                href={`/account/login/?redirect=${randomId}`}
                                className="text-blue-600 hover:underline"
                            >
                                <ArrowLeftOutlined /> Quay lại
                            </a>
                        )}
                    </div>
                </div>
            </div>
            <Spin spinning={loading} fullscreen tip="Đang xử lý. Vui lòng chờ..." />
        </div>
    );
};

export default ForgotPassword;