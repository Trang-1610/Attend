import React, { useEffect } from "react";
import { Button, Card, Breadcrumb, Select, Slider } from "antd";
import { HomeOutlined, PhoneOutlined, BgColorsOutlined, LockOutlined, SkinOutlined, } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import Footer from "../../components/Layout/Footer";
import Header from "../../components/Layout/Header";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

export default function GeneralSetting() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { themeMode, setThemeMode, brightness, setBrightness } = useTheme();

    useEffect(() => {
        document.title = "ATTEND 3D - " + t("general_setting");

    }, [t, brightness]);

    const handChangePassword = () => {
        navigate("/account/forgot-password/");
    };

    return (
        <div className="min-h-screen bg-white text-gray-800 dark:bg-black dark:text-white flex flex-col">
            <div className="w-full mx-auto px-6 flex-grow">
                <Header />
                <main className="mt-10 flex flex-col items-center">
                    <div className="w-full px-4">
                        <Breadcrumb
                            items={[
                                { href: "/", title: <><HomeOutlined /> <span>{"Trang chủ"}</span></> },
                                {
                                    href: "/general-setting",
                                    title: (
                                        <>
                                            <PhoneOutlined /> <span>{t("general_setting")}</span>
                                        </>
                                    ),
                                }
                            ]}
                        />
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        <Card
                            title={
                                <div className="flex items-center gap-2">
                                    <BgColorsOutlined /> Độ sáng màn hình
                                </div>
                            }
                        >
                            <p className="mb-2 text-sm text-gray-500">
                                Điều chỉnh độ sáng giao diện.
                            </p>
                            <Slider
                                value={brightness}
                                min={50}
                                max={150}
                                onChange={(val) => setBrightness(val)}
                            />
                        </Card>

                        <Card
                            title={
                                <div className="flex items-center gap-2">
                                    <LockOutlined /> Bảo mật
                                </div>
                            }
                        >
                            <p className="mb-2 text-sm text-gray-500">
                                Cập nhật mật khẩu hoặc bật xác thực 2 yếu tố.
                            </p>
                            <Button className="w-full mb-2" size="large" type="primary" onClick={handChangePassword}>
                                Đổi mật khẩu
                            </Button>
                        </Card>

                        <Card
                            title={
                                <div className="flex items-center gap-2">
                                    <SkinOutlined /> Giao diện
                                </div>
                            }
                        >
                            <p className="mb-2 text-sm text-gray-500">
                                Chuyển đổi giữa chế độ sáng và tối.
                            </p>
                            <Select
                                defaultValue="light"
                                value={themeMode}
                                className="w-full custom-select"
                                size="large"
                                onChange={(val) => setThemeMode(val)}
                            >
                                <Option value="light">Sáng</Option>
                                <Option value="dark">Tối</Option>
                                <Option value="auto">Tự động</Option>
                            </Select>
                        </Card>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}