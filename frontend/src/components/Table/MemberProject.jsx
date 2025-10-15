import { Table } from "antd";

const members = [
    {
        key: "1",
        name: "Nguyễn Nguyễn Phong",
        studentCode: "21070601",
        class: "DHHTTT17B",
        email: "phongnguyen.050503@gmail.com",
    },
    {
        key: "2",
        name: "Trần Thị Huyền Trang",
        studentCode: "21061001",
        class: "DHHTTT17B",
        email: "huyentrangqb2003@gmail.com",
    },
];

const columns = [
    {
        title: "Họ và tên",
        dataIndex: "name",
        key: "name",
    },
    {
        title: "Email",
        dataIndex: "email",
        key: "email",
    },
    {
        title: "Mã số sinh viên",
        dataIndex: "studentCode",
        key: "studentCode",
    },
    {
        title: "Lớp",
        dataIndex: "class",
        key: "class",
    },
];
const TableMemberProject = () => {
    return (
        <Table
            columns={columns}
            dataSource={members}
            pagination={false}
            bordered
            className="mt-4"
        />
    );
}

export default TableMemberProject