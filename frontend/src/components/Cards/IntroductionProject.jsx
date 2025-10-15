import { Card } from "antd";
import { ProjectOutlined } from "@ant-design/icons";

const CardIntroductionProject = ({ t }) => {
    return (
        <Card
            className="rounded mb-6"
            title={
                <div className="flex items-center gap-2 text-lg">
                    <ProjectOutlined /> {t("project introduction")}
                </div>
            }
        >
            <p>
                Dự án <strong>“Ứng dụng điểm danh sinh viên nhận diện khuôn mặt 3D
                    và quét mã QR Code”</strong> được triển khai nhằm nâng cao hiệu quả
                và chính xác trong công tác điểm danh tại các trường đại học.
                Thông qua việc kết hợp công nghệ nhận diện khuôn mặt 3D với việc
                quét mã QR, ứng dụng giúp:
            </p>
            <ul className="list-disc ml-6">
                <li>Đảm bảo kiểm soát chính xác sự hiện diện của sinh viên trong lớp học.</li>
                <li>Tiết kiệm thời gian cho giảng viên và nhân viên quản lý.</li>
                <li>Tích hợp báo cáo tự động về số lượng và tình trạng điểm danh.</li>
                <li>Cung cấp dữ liệu đầy đủ cho việc quản lý lớp học, kiểm tra chuyên cần,
                    và phục vụ các mục đích thống kê giáo dục.</li>
            </ul>
            <p>
                Hệ thống áp dụng thuật toán nhận diện khuôn mặt 3D tiên tiến để tăng
                độ chính xác, đồng thời đảm bảo an toàn dữ liệu cá nhân. Sinh viên
                cũng có thể điểm danh nhanh chóng bằng cách quét mã QR được cấp từ
                ứng dụng, giúp giảm thiểu sai sót và gian lận.
            </p>
            <p>
                Dự án này hướng tới việc tối ưu hóa công tác quản lý lớp học trong
                môi trường đại học hiện đại, đồng thời kết hợp các công nghệ tiên tiến
                nhằm nâng cao trải nghiệm cho cả giảng viên và sinh viên.
            </p>
        </Card>
    );
}

export default CardIntroductionProject