import React, { useEffect, useRef, useState } from "react";
import { Form, Input, Button, Alert, message, Spin } from "antd";
import OTPImage from "../../assets/general/otp.jpg";
import Logo from "../../assets/general/face-recognition.png";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import publicApi from "../../api/publicApi";

const OTP_DURATION = 300; // 5 minutes

const OtpVerifyResetPassword = () => {
    const navigate = useNavigate();
    const randomId = uuidv4();
    const [otp, setOtp] = useState(Array(6).fill(""));
    const inputRefs = useRef([]);
    const [loading, setLoading] = useState(false);

    const [timeLeft, setTimeLeft] = useState(OTP_DURATION);
    const [expiryTime, setExpiryTime] = useState(() => {
        const saved = localStorage.getItem("otp_expiry");
        if (saved) {
            const expiry = parseInt(saved, 10);
            if (expiry > Date.now()) {
                return expiry;
            } else {
                localStorage.removeItem("otp_expiry");
                return Date.now();
            }
        } else {
            // lần đầu vào form -> bắt đầu 5 phút
            const newExpiry = Date.now() + OTP_DURATION * 1000;
            localStorage.setItem("otp_expiry", newExpiry);
            return newExpiry;
        }
    });    
    // const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    useEffect(() => {
        document.title = "ATTEND 3D - Nhập OTP";
        inputRefs.current[0]?.focus();
    }, []);

    // Interval calculates timeLeft based on expiryTime
    useEffect(() => {
        const interval = setInterval(() => {
            const remaining = Math.max(Math.floor((expiryTime - Date.now()) / 1000), 0);
            setTimeLeft(remaining);
        }, 1000);

        return () => clearInterval(interval);
    }, [expiryTime]); // <--- listen expiryTime

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < otp.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleResendOtp = async () => {
        const email = localStorage.getItem("otp_email");
        if (!email) return message.error("Không tìm thấy email để gửi lại OTP");

        try {
            setLoading(true);
            const res = await publicApi.post("/accounts/auth/resend-otp/", { email });
            const data = res.data;

            if (data.error) return message.error(data.error);

            message.success("Đã gửi lại OTP thành công");

            const newExpiry = Date.now() + OTP_DURATION * 1000;
            localStorage.setItem("otp_expiry", newExpiry);
            setExpiryTime(newExpiry); // <-- update state, interval automatically use new value
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                const { error, success } = err.response.data;
                if (error) {
                    message.error(error);
                } else if (success === false) {
                    message.error("Mã OTP không hợp lệ!");
                } else {
                    message.error("Lỗi không xác định!");
                }
            } else {
                message.error("Lỗi kết nối khi xác thực OTP");
            }
        } finally {
            setLoading(false);
        }
    };

    const onFinish = async () => {
        const otpValue = otp.join("");
        const email = localStorage.getItem("otp_email");

        if (!email) {
            return message.error("Không tìm thấy email. Vui lòng thực hiện lại bước quên mật khẩu.");
        }

        try {
            setLoading(true);
            const res = await publicApi.post("accounts/auth/verify-otp-reset-password/", {
                email,
                otp: otpValue,
            });

            if (res.data.success) {
                message.success("Xác thực OTP thành công!");
                localStorage.removeItem("user");
                navigate("/account/entry-password/?redirect=" + randomId);
            } else {
                message.error(res.data.error || "Mã OTP không hợp lệ!");
            }
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                const { error, success } = err.response.data;
                if (error) {
                    message.error(error);
                } else if (success === false) {
                    message.error("Mã OTP không hợp lệ!");
                } else {
                    message.error("Lỗi không xác định!");
                }
            } else {
                message.error("Lỗi kết nối khi xác thực OTP");
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
                    src={OTPImage}
                    alt="Forgot Password"
                    className="w-[80%] h-[80%] object-contain"
                />
            </div>
            <div className="w-full md:w-5/12 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    <img src={Logo} alt="Logo" className="mx-auto mb-5 w-[100px]" />
                    <h1 className="text-2xl font-semibold mb-4 text-center">Mã OTP</h1>

                    {timeLeft > 0 ? (
                        <Alert
                            showIcon
                            message="Mã xác thực được gửi qua email. Vui lòng kiểm tra email"
                            type="success"
                            className="mb-6"
                        />
                    ) : (
                        " "
                    )}

                    <Form
                        name="otp_form"
                        layout="vertical"
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item
                            name="otp"
                            rules={[{ required: true, message: "Vui lòng nhập mã OTP!" }]}
                        >
                            <div className="flex justify-center flex-wrap gap-3 sm:gap-4 md:gap-5">
                                {otp.map((digit, index) => (
                                    <Input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        value={digit}
                                        maxLength={1}
                                        onChange={(e) => handleChange(e, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        className="!text-center !font-semibold border border-gray-300 rounded-xl focus:border-blue-500 focus:shadow-md transition-all duration-150
                                                w-[12vw] sm:w-[50px] md:w-[56px] aspect-square text-lg sm:text-xl"
                                        style={{ borderWidth: 1.5, boxShadow: 'none' }}
                                    />
                                ))}
                            </div>
                        </Form.Item>

                        {timeLeft > 0 ? (
                            <p className="text-gray-500 mb-4 text-center">
                                Mã OTP sẽ hết hạn sau <strong>{formatTime(timeLeft)}</strong>
                            </p>
                        ) : (
                            <p className="text-center">
                                <Button type="link" onClick={handleResendOtp} className="mb-4">
                                    Gửi lại mã OTP
                                </Button>
                            </p>
                        )}

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                size="large"
                                className="mt-3"
                                disabled={timeLeft <= 0}
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

export default OtpVerifyResetPassword;