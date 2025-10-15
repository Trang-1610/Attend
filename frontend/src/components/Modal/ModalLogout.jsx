import { message, Modal } from "antd";
import { logout } from "../../utils/auth";

const ModalLogout = () => {
    return (
        Modal.confirm({
            title: "Xác nhận đăng xuất",
            content: "Bạn có chắc chắn muốn đăng xuất không?",
            okText: "Đăng xuất",
            cancelText: "Hủy",
            onOk: async () => {
                try {
                    await logout();
                    message.success("Đăng xuất thành công");
                    window.location.href = "/account/login";
                    localStorage.clear();
                    sessionStorage.clear();
                } catch (err) {
                    message.error("Có lỗi khi đăng xuất");
                }
            },
        })
    );
}

export default ModalLogout