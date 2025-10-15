import { Button, Descriptions, Modal, Tag } from "antd";

const dayOfWeekMap = {
    2: "Thứ Hai",
    3: "Thứ Ba",
    4: "Thứ Tư",
    5: "Thứ Năm",
    6: "Thứ Sáu",
    7: "Thứ Bảy",
    8: "Chủ Nhật",
};

const ModalDetailAttendanceHistory = ({ 
    isModalVisible,
    onCancel,
    onClick,
    selectedRecord
 }) => {
    return (
        <Modal
            title={"Chi tiết điểm danh cho mã diểm danh: " + selectedRecord?.attendance_code}
            open={isModalVisible}
            onCancel={onCancel}
            footer={[
                <Button key="close" onClick={onClick}>
                    Đóng
                </Button>,
            ]}
            width={800}
        >
            {selectedRecord && (
                <Descriptions bordered column={2}>
                    <Descriptions.Item label="Trạng thái">
                        {selectedRecord.status === "P"
                            ? <Tag color="green">Đúng giờ</Tag>
                            : selectedRecord.status === "L"
                                ? <Tag color="orange">Đi muộn</Tag>
                                : "Vắng mặt"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Hình thức điểm danh">
                        {selectedRecord.attendance_type === "Q"
                            ? "QR Code"
                            : "Nhận diện khuôn mặt"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Thời gian điểm danh">
                        {selectedRecord?.checkin_at
                            ? new Date(selectedRecord?.checkin_at).toLocaleString("vi-VN")
                            : "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Thứ">
                        {dayOfWeekMap[selectedRecord?.day_of_week] ||
                            selectedRecord?.day_of_week}
                    </Descriptions.Item>
                    <Descriptions.Item label="Môn học">
                        {selectedRecord?.subject_name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Lớp">
                        {selectedRecord?.class_name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Phòng học">
                        {selectedRecord?.room_name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ca học">
                        {selectedRecord?.slot_name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Giờ bắt đầu">
                        {selectedRecord?.lesson_start_time}
                    </Descriptions.Item>
                    <Descriptions.Item label="Giờ kết thúc">
                        {selectedRecord?.lesson_end_time}
                    </Descriptions.Item>
                    <Descriptions.Item label="Buổi học">
                        {selectedRecord?.shift_name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Giảng viên">
                        {selectedRecord?.fullname}
                    </Descriptions.Item>
                </Descriptions>
            )}
        </Modal>
    );
}

export default ModalDetailAttendanceHistory