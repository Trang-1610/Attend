import React, { useEffect } from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import CHPlayLogo from '../../assets/general/logo-ch-play.png';
import AppStoreLogo from '../../assets/general/logo-apple-store.svg';

const AttendanceQRCode = () => {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "ATTEND 3D - Điểm danh QR Code";
    }, []);

    return (
        <div className="flex items-center justify-center h-screen px-4 bg-white text-gray-800 dark:bg-black dark:text-white">
            <Result
                status="warning"
                title="Warning"
                subTitle={
                    <div className="text-base text-gray-600">
                        Chức năng này không được phép thực hiện trên website.<br />
                        Vui lòng tải ứng dụng di động để tiếp tục sử dụng.
                    </div>
                }
                extra={
                    <div className="flex flex-col items-center gap-6 mt-6">
                        <Button type="primary" onClick={() => navigate('/')} size="large">
                            Trở về trang chủ
                        </Button>

                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => { }}
                                className="p-0 border-none bg-transparent cursor-pointer"
                            >
                                <img
                                    src={CHPlayLogo}
                                    alt="Google Play"
                                    className="h-14 hover:scale-105 transition-transform"
                                />
                            </button>

                            <button
                                type="button"
                                onClick={() => { }}
                                className="p-0 border-none bg-transparent cursor-pointer"
                            >
                                <img
                                    src={AppStoreLogo}
                                    alt="App Store"
                                    className="h-14 hover:scale-105 transition-transform"
                                />
                            </button>
                        </div>
                    </div>
                }
            />
        </div>
    );
};

export default AttendanceQRCode;