import React from "react";
import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";

export default function Error403() {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center h-screen">
            <Result
                status="403"
                title="403"
                subTitle="Bạn không có quyền truy cập trang này"
                extra={<Button type="primary" size="large" onClick={() => navigate("/")}>Về trang chủ</Button>}
            />
        </div>
    );
}