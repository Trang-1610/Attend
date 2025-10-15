import { Table, Badge, Button } from "antd";
import dayjs from "dayjs";

const TableListSubjectLeave = ({ listSubject, getColumnSearchProps }) => {
    const columns = [
        {
            title: "Mã nghỉ phép",
            dataIndex: "leave_request_code",
            key: "leave_request_code",
        },
        {
            title: "Lý do",
            dataIndex: "reason",
            key: "reason",
            ...(getColumnSearchProps ? getColumnSearchProps("reason") : {}),
        },
        {
            title: "Môn học",
            dataIndex: "subject_name",
            key: "subject_name",
            ...(getColumnSearchProps ? getColumnSearchProps("subject_name") : {}),
        },
        {
            title: "Từ ngày",
            dataIndex: "from_date",
            key: "from_date",
            sorter: (a, b) => new Date(a.from_date) - new Date(b.from_date),
            render: (value) =>
                value ? dayjs(value).format("HH:mm DD/MM/YYYY") : "-",
        },
        {
            title: "Đến ngày",
            dataIndex: "to_date",
            key: "to_date",
            sorter: (a, b) => new Date(a.to_date) - new Date(b.to_date),
            render: (value) =>
                value ? dayjs(value).format("HH:mm DD/MM/YYYY") : "-",
        },
        {
            title: "Số ngày nghỉ phép còn lại",
            dataIndex: "max_leave_days",
            key: "max_leave_days",
            sorter: (a, b) => a.max_leave_days - b.max_leave_days,
        },
        {
            title: "Trạng thái",
            dataIndex: "leave_request_status",
            key: "leave_request_status",
            filters: [
                { text: "Đã duyệt", value: "A" },
                { text: "Chờ duyệt", value: "P" },
                { text: "Từ chối", value: "R" },
            ],
            onFilter: (value, record) =>
                record?.leave_request_status === value,
            render: (status) => {
                const statusMap = {
                    A: <Badge status="success" text="Đã duyệt" />,
                    P: <Badge status="warning" text="Chờ duyệt" />,
                    R: <Badge status="error" text="Từ chối" />,
                };
                return statusMap[status] || status;
            },
        },
        {
            title: "Tệp đính kèm",
            dataIndex: "attachment_url",
            key: "attachment_url",
            render: (url) =>
                url ? (
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                    >
                        <Button type="link">Tải xuống</Button>
                    </a>
                ) : (
                    "-"
                ),
        },
    ];

    return (
        <Table
            rowKey="leave_request_code"
            columns={columns}
            dataSource={listSubject}
            pagination={{ pageSize: 10 }}
            scroll={{ x: true }}
        />
    );
};

export default TableListSubjectLeave;