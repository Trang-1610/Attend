import { useState } from "react";
import { Modal } from "antd";
import { logout } from "../../../utils/auth";

export default function ConfirmLogoutModal() {
    const [isModalVisible, setIsModalVisible] = useState(true);
    return (
        <Modal
            title="Xác nhận đăng xuất"
            open={isModalVisible}
            onOk={logout}
            onCancel={() => setIsModalVisible(false)}
            okText="Đăng xuất"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
        >
            <p>Bạn có chắc chắn muốn đăng xuất không?</p>
        </Modal>
    );
}