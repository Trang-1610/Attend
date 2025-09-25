import React from "react";
import { Modal, Descriptions, Button, message } from "antd";
import { QrcodeOutlined, SmileOutlined } from "@ant-design/icons";

export default function AttendanceModal({ openModal, setOpenModal, selectedSchedule }) {
    return (
        <Modal
            title="Chọn hình thức điểm danh"
            open={openModal}
            onCancel={() => setOpenModal(false)}
            footer={null}
        >
            {selectedSchedule && (
                <>
                    <Descriptions bordered size="small" column={1}>
                        <Descriptions.Item label="Môn học">{selectedSchedule.subject_name}</Descriptions.Item>
                        <Descriptions.Item label="Lớp">{selectedSchedule.class_name}</Descriptions.Item>
                        <Descriptions.Item label="Giảng viên">{selectedSchedule.lecturer_name}</Descriptions.Item>
                    </Descriptions>
                    <div className="flex justify-around mt-4">
                        <Button
                            type="primary"
                            icon={<QrcodeOutlined />}
                            onClick={() => message.success("Điểm danh bằng QR")}
                        >
                            QR Code
                        </Button>
                        <Button
                            type="dashed"
                            icon={<SmileOutlined />}
                            onClick={() => message.success("Điểm danh bằng khuôn mặt")}
                        >
                            Check-in Face
                        </Button>
                    </div>
                </>
            )}
        </Modal>
    );
}