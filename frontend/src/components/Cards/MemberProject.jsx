import { Card } from "antd";
import { TeamOutlined } from "@ant-design/icons";
import TableMemberProject from "../Table/MemberProject";

const CardMemberProject = () => {
    return (
        <Card
            className="rounded"
            title={
                <div className="flex items-center gap-2 text-lg">
                    <TeamOutlined /> Thành viên dự án
                </div>
            }
        >
            <p>
                Nhóm thực hiện dự án gồm các thành viên sau, đều là sinh viên ngành
                Công nghệ thông tin, có kinh nghiệm và hứng thú với các ứng dụng
                nhận diện khuôn mặt, xử lý hình ảnh, và phát triển phần mềm quản lý:
            </p>
            <TableMemberProject />
            <p className="mt-4">
                Các thành viên chịu trách nhiệm phân chia công việc rõ ràng, bao gồm:
            </p>
            <ul className="list-disc ml-6">
                <li>Đang hoàn thiện</li>
            </ul>
            <p className="mt-4">
                Mỗi thành viên đều góp phần quan trọng vào việc hoàn thiện dự án, đảm bảo
                sản phẩm cuối cùng đạt chất lượng cao, dễ sử dụng và phù hợp với nhu cầu thực tế.
            </p>
        </Card>
    );
}

export default CardMemberProject