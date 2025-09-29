import { Spin } from "antd";

export default function FullScreenLoader({ loading, text }) {
    if (!loading) return null;
    return (
        <Spin
            spinning={loading}
            tip={text || "Đang xử lý..."}
            size="large"
            fullscreen
        />
    );
}