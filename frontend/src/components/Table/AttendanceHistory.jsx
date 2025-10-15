import { Table, Tag, Button } from "antd";

const TableAttendanceHistory = ({ summary, setSelectedRecord, setIsModalVisible, t }) => {

    // Table columns
    const columns = [
        {
            title: t("attendance code"),
            dataIndex: "attendance_code",
            key: "attendance_code",
        },
        {
            title: t("status"),
            dataIndex: "status",
            key: "status",
            render: (value) => {
                return value === "P"
                    ? <Tag color="green">Đúng giờ</Tag>
                    : value === "L"
                        ? <Tag color="orange">Đi muộn</Tag>
                        : <Tag color="red">Vắng mặt</Tag>;
            }
        },
        {
            title: t("subject"),
            dataIndex: "subject_name",
            key: "subject_name",
        },
        {
            title: t("check in at"),
            dataIndex: "checkin_at",
            key: "checkin_at",
            render: (value) => (value ? new Date(value).toLocaleString("vi-VN") : "-"),
        },
        {
            title: t("action"),
            key: "actions",
            render: (_, record) => (
                <Button
                    type="link"
                    onClick={() => {
                        setSelectedRecord(record);
                        setIsModalVisible(true);
                    }}
                >
                    Xem chi tiết
                </Button>
            ),
        },
    ];

    return (
        <Table
            rowKey={(record) => record.attendance_id}
            columns={columns}
            dataSource={summary}
            pagination={{ pageSize: 10 }}
            scroll={{ x: true }}
        />
    );
}

export default TableAttendanceHistory