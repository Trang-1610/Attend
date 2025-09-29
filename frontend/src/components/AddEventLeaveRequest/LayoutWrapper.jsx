import React from 'react';
import Footer from "../Layout/Footer";
import Header from "../../components/Layout/Header";
// import { Spin } from 'antd';

export default function LayoutWrapper({ children }) {

    return (
        <div className="min-h-screen bg-white text-gray-800 dark:bg-black dark:text-white flex flex-col">
            {/* Header layout */}
            <Header />
            <div className="w-full mt-0 mx-auto px-6 flex-grow">
                {children}
            </div>
            {/* Footer layout */}
            <Footer />
            {/* <Spin spinning={loading} fullscreen tip="Đang xử lý. Vui lòng chờ..." /> */}
        </div>
    );
}