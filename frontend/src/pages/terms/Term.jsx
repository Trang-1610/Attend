import React, { useEffect } from "react";
import { Breadcrumb, Card } from "antd";
import { HomeOutlined, FileTextOutlined } from "@ant-design/icons";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";

export default function TermsPage() {
    useEffect(() => {
        document.title = "Điều khoản dữ liệu - ATTEND 3D";
    }, []);

    return (
        <div className="min-h-screen bg-white text-gray-800 dark:bg-black dark:text-white flex flex-col">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex-grow">
                <Header />
                <main className="mt-8 flex flex-col items-center w-full">
                    <div className="w-full mb-4">
                        <Breadcrumb
                            items={[
                                {
                                    href: "/",
                                    title: (
                                        <>
                                            <HomeOutlined /> <span>Trang chủ</span>
                                        </>
                                    ),
                                },
                                {
                                    href: "/terms",
                                    title: (
                                        <>
                                            <FileTextOutlined /> <span>Điều khoản dữ liệu</span>
                                        </>
                                    ),
                                },
                            ]}
                        />
                    </div>

                    <div className="w-full mt-4">
                        <Card
                            className="rounded mb-6"
                            title={
                                <div className="flex items-center gap-2 text-lg">
                                    <FileTextOutlined /> Điều khoản & Chính sách xử lý dữ liệu — ATTEND 3D
                                </div>
                            }
                        >
                            <p>
                                <strong>ATTEND 3D</strong> (sau đây gọi tắt là "Ứng dụng" hoặc "Chúng tôi") tôn trọng quyền riêng tư và quyền kiểm soát dữ liệu cá
                                nhân của người dùng, đặc biệt là dữ liệu nhạy cảm liên quan đến nhận diện sinh trắc học (khuôn mặt 3D). Tài liệu này mô tả chi tiết
                                cách thức chúng tôi thu thập, sử dụng, lưu trữ, bảo vệ, chia sẻ và xoá dữ liệu liên quan đến chức năng điểm danh bằng <strong>nhận diện khuôn mặt 3D</strong>
                                và <strong>quét mã QR</strong>. Vui lòng đọc kỹ. Nếu bạn là sinh viên hoặc giảng viên sử dụng hệ thống, bạn đồng ý với các điều khoản dưới đây
                                khi đăng ký sử dụng dịch vụ hoặc bật tính năng tương ứng.
                            </p>

                            <h3 className="mt-4 text-base font-semibold">1. Phạm vi dữ liệu thu thập</h3>
                            <ul className="list-disc ml-6">
                                <li>
                                    <strong>Dữ liệu nhận diện khuôn mặt 3D:</strong> bao gồm ảnh khuôn mặt/ảnh 3D, điểm mốc (landmarks), biểu diễn số hoá 3D hoặc vector đặc trưng sinh trắc học
                                    được trích xuất từ ảnh/scan để phục vụ mục đích xác thực danh tính và điểm danh. Chúng tôi không thu thập dữ liệu sinh trắc học khác ngoài khuôn mặt.
                                </li>
                                <li>
                                    <strong>Dữ liệu quét QR:</strong> mã QR liên quan đến tài khoản sinh viên hoặc sự kiện điểm danh (mã phiên điểm danh, thời gian, ID lớp).
                                </li>
                                <li>
                                    <strong>Dữ liệu hồ sơ:</strong> họ tên, mã số sinh viên, lớp, email, ảnh hồ sơ (nếu người dùng cung cấp), thời gian điểm danh, vị trí (nếu bật chia sẻ vị trí).
                                </li>
                                <li>
                                    <strong>Dữ liệu kỹ thuật:</strong> nhật ký truy cập, thiết bị (device ID), địa chỉ IP, thông tin trình duyệt hoặc ứng dụng giúp chúng tôi chẩn đoán, cải thiện dịch vụ.
                                </li>
                            </ul>

                            <h3 className="mt-4 text-base font-semibold">2. Mục đích và cơ sở xử lý dữ liệu</h3>
                            <p>
                                Chúng tôi xử lý dữ liệu cá nhân trên các cơ sở pháp lý hợp lệ: đồng ý của người dùng, thực hiện hợp đồng dịch vụ giữa trường và người dùng, hoặc
                                tuân thủ nghĩa vụ pháp lý. Các mục đích chính:
                            </p>
                            <ul className="list-disc ml-6">
                                <li>Xác thực danh tính sinh viên để điểm danh chính xác, chống gian lận (thay mặt, sử dụng ảnh tĩnh, v.v.).</li>
                                <li>Ghi nhận thời gian và trạng thái chuyên cần phục vụ báo cáo học tập, thống kê lớp học.</li>
                                <li>Nâng cao độ chính xác của mô hình nhận diện (khi người dùng cho phép dùng dữ liệu để huấn luyện cải thiện chất lượng).</li>
                                <li>Hỗ trợ giảng viên và quản trị viên tạo báo cáo, xuất dữ liệu phục vụ công tác quản lý giáo dục.</li>
                                <li>Đảm bảo an ninh hệ thống, phát hiện lạm dụng và xử lý khiếu nại, tranh chấp.</li>
                            </ul>

                            <h3 className="mt-4 text-base font-semibold">3. Quyền và lựa chọn của người dùng</h3>
                            <ul className="list-disc ml-6">
                                <li>
                                    <strong>Đồng ý:</strong> trước khi kích hoạt nhận diện khuôn mặt 3D, sinh viên sẽ được yêu cầu cung cấp <em>đồng ý rõ ràng</em>. Người dùng có quyền từ chối
                                    hoặc rút đồng ý bất cứ lúc nào. Nếu không đồng ý, sinh viên có thể sử dụng phương thức thay thế (ví dụ quét QR do trường cung cấp) nếu được trường cho phép.
                                </li>
                                <li>
                                    <strong>Truy cập & Sao chép:</strong> người dùng có quyền yêu cầu truy cập bản sao dữ liệu cá nhân đang lưu trữ (ví dụ: ảnh hồ sơ, dữ liệu điểm danh).
                                </li>
                                <li>
                                    <strong>Sửa đổi:</strong> yêu cầu sửa đổi thông tin hồ sơ (họ tên, email, v.v.) nếu có sai sót.
                                </li>
                                <li>
                                    <strong>Xoá dữ liệu:</strong> trong các trường hợp phù hợp và theo quy định pháp luật, người dùng có thể yêu cầu xoá dữ liệu cá nhân. Lưu ý: xoá dữ liệu sinh trắc học
                                    có thể ảnh hưởng đến khả năng sử dụng tính năng nhận diện tự động.
                                </li>
                                <li>
                                    <strong>Phê duyệt sử dụng huấn luyện:</strong> trước khi dùng dữ liệu khuôn mặt để huấn luyện mô hình, chúng tôi sẽ xin phép người dùng (opt-in). Dữ liệu dùng để huấn luyện
                                    sẽ được xử lý theo quy trình ẩn danh hoá hoặc pseudo-anonymization khi có thể.
                                </li>
                            </ul>

                            <h3 className="mt-4 text-base font-semibold">4. Thời gian lưu trữ</h3>
                            <p>
                                Chúng tôi lưu trữ dữ liệu trong thời hạn phù hợp với mục đích thu thập và quy định của trường/trách nhiệm pháp lý:
                            </p>
                            <ul className="list-disc ml-6">
                                <li>Thông tin điểm danh và bản ghi thời gian: lưu trữ tối thiểu theo quy định nhà trường (ví dụ một học kỳ / một năm học) — chi tiết thực tế do trường quy định.</li>
                                <li>Dữ liệu nhận diện khuôn mặt (bản mẫu/số hoá): lưu trữ trong khoảng thời gian cần thiết để hệ thống hoạt động; người dùng có thể yêu cầu xoá sớm hơn nếu phù hợp.</li>
                                <li>Dữ liệu kỹ thuật và log: lưu theo chính sách bảo mật nội bộ; dữ liệu có thể được lưu tạm để xử lý sự cố rồi xoá định kỳ.</li>
                            </ul>

                            <h3 className="mt-4 text-base font-semibold">5. Bảo mật và lưu trữ</h3>
                            <p>
                                Chúng tôi áp dụng các biện pháp kỹ thuật và tổ chức phù hợp nhằm bảo vệ dữ liệu cá nhân:
                            </p>
                            <ul className="list-disc ml-6">
                                <li>Ghi mã hóa (encryption) dữ liệu sinh trắc học và các bản sao lưu quan trọng khi lưu trữ và truyền tải.</li>
                                <li>Hạn chế quyền truy cập nội bộ theo nguyên tắc <em>ít quyền nhất</em> (least privilege).</li>
                                <li>Giám sát an ninh, log truy cập và phát hiện hành vi bất thường.</li>
                                <li>Kiểm soát truy cập vật lý tại nơi lưu trữ máy chủ (nếu sử dụng hạ tầng tại trường hoặc nhà cung cấp đám mây tuân thủ tiêu chuẩn bảo mật).</li>
                                <li>Đào tạo nhân sự vận hành để xử lý dữ liệu cá nhân một cách có trách nhiệm.</li>
                            </ul>
                            <p className="mt-2">
                                Tuy nhiên, không có hệ thống nào an toàn tuyệt đối. Chúng tôi sẽ thông báo kịp thời cho người dùng và cơ quan có thẩm quyền nếu xảy ra sự cố vi phạm dữ liệu theo quy định pháp luật.
                            </p>

                            <h3 className="mt-4 text-base font-semibold">6. Chia sẻ dữ liệu với bên thứ ba</h3>
                            <p>
                                Dữ liệu cá nhân chỉ được chia sẻ trong các trường hợp sau:
                            </p>
                            <ul className="list-disc ml-6">
                                <li>Với <strong>nhà trường</strong> và các bộ phận liên quan phục vụ mục đích quản lý học tập và điểm danh.</li>
                                <li>Với <strong>nhà cung cấp dịch vụ hạ tầng/đám mây</strong> (nếu có) để lưu trữ hoặc xử lý kỹ thuật; các nhà cung cấp này phải tuân thủ điều khoản bảo mật và không được sử dụng dữ liệu cho mục đích khác.</li>
                                <li>Với cơ quan nhà nước khi có yêu cầu hợp pháp (ví dụ trích xuất dữ liệu phục vụ điều tra theo yêu cầu của cơ quan có thẩm quyền).</li>
                                <li>Không chia sẻ dữ liệu cho mục đích thương mại hoặc quảng cáo bên thứ ba mà không có sự đồng ý rõ ràng của người dùng.</li>
                            </ul>

                            <h3 className="mt-4 text-base font-semibold">7. Xử lý dữ liệu sinh trắc học (nhạy cảm)</h3>
                            <p>
                                Dữ liệu nhận diện khuôn mặt 3D được coi là <em>dữ liệu nhạy cảm</em>. Do đó:
                            </p>
                            <ul className="list-disc ml-6">
                                <li>Chúng tôi chỉ thu thập và xử lý sau khi có sự đồng ý rõ ràng của chủ thể dữ liệu, trừ khi pháp luật yêu cầu khác.</li>
                                <li>Quá trình thu thập minh bạch: người dùng được thông báo trước về mục đích, cách thức, thời hạn lưu trữ và quyền liên quan.</li>
                                <li>Không sử dụng dữ liệu sinh trắc học cho mục đích thứ cấp không liên quan (ví dụ: phân tích cảm xúc, quảng cáo) nếu không có sự đồng ý thêm.</li>
                            </ul>

                            <h3 className="mt-4 text-base font-semibold">8. Quy trình xác thực & chống gian lận</h3>
                            <p>
                                Hệ thống kết hợp nhiều biện pháp để giảm gian lận:
                            </p>
                            <ul className="list-disc ml-6">
                                <li>So sánh mẫu khuôn mặt 3D với mẫu đã đăng ký; áp dụng ngưỡng tương đồng để xác nhận.</li>
                                <li>Kiểm tra độ sống (liveness check) cơ bản — yêu cầu nháy mắt, xoay đầu, hoặc phân tích chiều sâu để phân biệt người thật và ảnh tĩnh/thiết bị phát lại.</li>
                                <li>Ghi nhận kết quả quét QR kèm thời gian để đối chiếu.</li>
                                <li>Nếu phát hiện hành vi đáng ngờ (ví dụ nhiều điểm danh trong thời gian ngắn từ cùng tài khoản), hệ thống gửi cảnh báo cho quản trị viên để kiểm tra thủ công.</li>
                            </ul>

                            <h3 className="mt-4 text-base font-semibold">9. Trách nhiệm của nhà trường và người dùng</h3>
                            <ul className="list-disc ml-6">
                                <li>
                                    <strong>Nhà trường / Quản trị viên:</strong> đảm bảo rằng chính sách nội bộ phù hợp với pháp luật, cung cấp phương án thay thế khi sinh viên không đồng ý sử dụng sinh trắc học,
                                    xử lý khiếu nại, và bảo vệ quyền lợi của sinh viên.
                                </li>
                                <li>
                                    <strong>Sinh viên / Người dùng:</strong> cung cấp thông tin chính xác, không chia sẻ tài khoản điểm danh, thông báo kịp thời khi phát hiện sai sót dữ liệu, và tuân thủ quy định sử dụng hệ thống.
                                </li>
                            </ul>

                            <h3 className="mt-4 text-base font-semibold">10. Khiếu nại, yêu cầu quyền lợi và liên hệ</h3>
                            <p>
                                Nếu bạn muốn truy cập, chỉnh sửa, rút đồng ý, yêu cầu xoá, hoặc khiếu nại liên quan đến dữ liệu cá nhân, vui lòng liên hệ:
                            </p>
                            <ul className="list-disc ml-6">
                                <li><strong>Email hỗ trợ:</strong> zephyrnguyen.vn@gmail.com</li>
                                <li><strong>Phòng phụ trách dữ liệu tại trường:</strong> phòng Công tác sinh viên / Ban Công nghệ thông tin (thông tin liên hệ do trường cung cấp)</li>
                                <li>Khi gửi yêu cầu, vui lòng cung cấp thông tin nhận dạng hợp lệ để chúng tôi xử lý yêu cầu theo quy trình bảo mật.</li>
                            </ul>

                            <h3 className="mt-4 text-base font-semibold">11. Thay đổi chính sách</h3>
                            <p>
                                Chúng tôi có thể cập nhật chính sách xử lý dữ liệu này để phù hợp với quy định pháp luật hoặc thay đổi tính năng kỹ thuật. Mọi thay đổi quan trọng sẽ được
                                thông báo trước tới người dùng (qua email hoặc thông báo trong ứng dụng). Việc tiếp tục sử dụng dịch vụ sau khi có thông báo được coi là chấp nhận các điều khoản mới.
                            </p>

                            <h3 className="mt-4 text-base font-semibold">12. Lưu ý đặc biệt về quyền riêng tư</h3>
                            <ul className="list-disc ml-6">
                                <li>Việc sử dụng công nghệ nhận diện khuôn mặt có thể gây rủi ro nếu dữ liệu bị tiết lộ. Chúng tôi cam kết giảm thiểu rủi ro bằng biện pháp kỹ thuật và quản trị.</li>
                                <li>Nếu bạn là người đại diện hợp pháp (ví dụ phụ huynh của sinh viên vị thành niên), vui lòng làm theo hướng dẫn nhà trường để cung cấp đồng ý hợp lệ.</li>
                                <li>Trong mọi trường hợp, chúng tôi tuân thủ pháp luật hiện hành về bảo vệ dữ liệu cá nhân và quyền riêng tư tại quốc gia áp dụng.</li>
                            </ul>

                            <p className="mt-4">
                                <em>
                                    Ghi chú: nội dung trên đây là mẫu điều khoản dữ liệu chi tiết cho dự án điểm danh kết hợp nhận diện khuôn mặt 3D và quét QR. Khi triển khai thực tế,
                                    nhà trường hoặc tổ chức quản lý cần rà soát lại để phù hợp với quy định pháp luật địa phương, chính sách riêng của trường và các điều khoản hợp đồng
                                    với nhà cung cấp dịch vụ (nếu có). Đặc biệt với dữ liệu sinh trắc học, hãy đảm bảo có <strong>đồng ý rõ ràng</strong> và quy trình giám sát nghiêm ngặt.
                                </em>
                            </p>
                        </Card>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}