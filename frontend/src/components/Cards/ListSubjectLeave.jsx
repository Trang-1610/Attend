import { Card, Typography } from "antd";
import TableListSubjectLeave from "../Table/ListSubjectLeave";

const { Title } = Typography;

const CardListSubjectLeave = ({ listSubject, getColumnSearchProps }) => {
    return (
        <Card title={<Title level={3}>Danh sách môn học bạn nghỉ phép</Title>} className="p-2">
            <TableListSubjectLeave 
                listSubject={listSubject}
                getColumnSearchProps={getColumnSearchProps}
            />
        </Card>
    );
}

export default CardListSubjectLeave