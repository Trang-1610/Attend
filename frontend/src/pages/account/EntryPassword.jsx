import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Spin } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import EntryPasswordImage from "../../assets/general/reset-password.png";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import publicApi from "../../api/publicApi";

const randomId = uuidv4();

const EntryPassword = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const user = localStorage.getItem("user");
    const accountId = user ? JSON.parse(user).account_id : null;

    useEffect(() => {
        document.title = "ATTEND 3D - Nhập mật khẩu";
    }, []);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onFinish = async (values) => {
        const email = localStorage.getItem("otp_email");

        if (!email) {
            return message.error("Không tìm thấy email. Vui lòng thực hiện lại bước quên mật khẩu.");
        }
        try {
            setLoading(true);
            const res = await publicApi.post("accounts/auth/reset-password-for-change-password/", {
                email,
                password: values.password,
                confirm_password: values.confirmPassword,
            });

            if (res.data.success) {
                if(accountId !== null) {
                    message.success("Cập nhật mật khẩu thành công!");
                    navigate("/profile");
                } else {
                    message.success("Cập nhật mật khẩu thành công! Vui lòng đăng nhập lại");
                    navigate("/account/login/?redirect=" + randomId);
                }
            } else {
                message.error(res.data.error);
            }
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                const { error, success } = err.response.data;
                if (error) {
                    message.error(error);
                } else if (success === false) {
                    message.error("Mật khẩu không hợp lệ!");
                } else {
                    message.error("Lỗi không xác định!");
                }
            } else {
                message.error("Lỗi kết nối");
            }
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full flex flex-col md:flex-row">
            <div className="w-full md:w-7/12 flex items-center justify-center">
                <img
                    src={EntryPasswordImage}
                    alt="Reset password illustration"
                    className="w-[80%] h-[80%] object-contain"
                />
            </div>
            <div className="w-full md:w-5/12 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    <h1 className="text-2xl font-semibold mb-6 text-center">
                        Nhập mật khẩu của bạn
                    </h1>

                    <Form
                        name="entry_password"
                        layout="vertical"
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item
                            name="password"
                            label="Mật khẩu mới"
                            rules={[
                                { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                                {
                                    pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                                    message:
                                        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ cái và số!",
                                },
                            ]}
                        >
                            <Input
                                placeholder="Nhập mật khẩu mới"
                                type={showPassword ? "text" : "password"}
                                size="large"
                                style={{ borderWidth: 1.5, boxShadow: "none" }}
                                suffix={
                                    showPassword ? (
                                        <EyeTwoTone onClick={togglePasswordVisibility} />
                                    ) : (
                                        <EyeInvisibleOutlined onClick={togglePasswordVisibility} />
                                    )
                                }
                            />
                        </Form.Item>
                        <Form.Item
                            name="confirmPassword"
                            label="Xác nhận mật khẩu"
                            dependencies={["password"]}
                            rules={[
                                { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("password") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error("Mật khẩu không khớp!")
                                        );
                                    },
                                }),
                            ]}
                        >
                            <Input
                                placeholder="Nhập lại mật khẩu"
                                type={showPassword ? "text" : "password"}
                                size="large"
                                style={{ borderWidth: 1.5, boxShadow: "none" }}
                                suffix={
                                    showPassword ? (
                                        <EyeTwoTone onClick={togglePasswordVisibility} />
                                    ) : (
                                        <EyeInvisibleOutlined onClick={togglePasswordVisibility} />
                                    )
                                }
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                size="large"
                                className="rounded-md mt-3"
                            >
                                Xác nhận
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
            <Spin spinning={loading} fullscreen tip="Đang xử lý. Vui lòng chờ..." />
        </div>
    );
};

export default EntryPassword;