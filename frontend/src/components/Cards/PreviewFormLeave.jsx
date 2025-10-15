import { Card } from "antd";

const CardPreviewFormLeave = ({
    leaveData,
    form,
    personalLeave,
    formattedDate,
}) => {

    const rangeDate = form?.getFieldValue("rangeDate");
    const rangeDateErrors = form?.getFieldError("rangeDate") || [];

    return (
        <Card className="p-4">
            <div className="prose max-w-full">
                <p className="text-center font-bold text-lg uppercase">
                    Cộng hoà xã hội chủ nghĩa Việt Nam
                </p>
                <p className="text-center font-bold text-base">
                    Độc lập - Tự do - Hạnh phúc
                </p>
                <div className="border-t border-black w-40 mx-auto my-2"></div>

                <p className="text-center font-bold text-2xl mt-6 uppercase">
                    Đơn xin nghỉ phép
                </p>

                <p className="mt-6">
                    <strong>Kính gửi:</strong> Giảng viên {leaveData?.lecturer_name}
                </p>

                <div className="grid grid-cols-2 gap-8 mt-4">
                    <p>
                        <strong>Em tên là:</strong> {leaveData?.student_name}
                    </p>
                    <p>
                        <strong>Mã số sinh viên:</strong> {leaveData?.student_code}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-8">
                    <p>
                        <strong>Lớp:</strong> {leaveData?.class_name}
                    </p>
                    <p>
                        <strong>Khoa:</strong> {leaveData?.department_name}
                    </p>
                </div>

                <div className="space-y-4 mt-4">
                    <p>
                        <strong>Năm học - Học kỳ:</strong>{" "}
                        {leaveData?.academic_year_name} - {leaveData?.semester_name}
                    </p>
                    <p>
                        <strong>Môn học:</strong> {leaveData?.subject_name}
                    </p>
                    <p>
                        <strong>Thời gian nghỉ phép:</strong>{" "}
                        {rangeDate &&
                        rangeDate[0] &&
                        rangeDate[1] &&
                        rangeDateErrors.length === 0
                            ? `${rangeDate[0].format("HH:mm DD/MM/YYYY")} - ${rangeDate[1].format(
                                  "HH:mm DD/MM/YYYY"
                              )}`
                            : ""}
                    </p>
                    <p>
                        <strong>Lý do:</strong> {personalLeave}
                    </p>
                </div>

                <p className="mt-4">
                    Em xin cam kết việc nghỉ học trên là có lý do chính đáng và sẽ tự
                    ôn tập, bổ sung kiến thức bị thiếu trong thời gian nghỉ.
                </p>
                <p className="mt-4">Em xin chân thành cảm ơn!</p>

                <div className="mt-8 flex justify-end">
                    <div className="text-center">
                        <p>{formattedDate}</p>
                        <p>
                            <strong>Người làm đơn</strong>
                        </p>
                        <p className="italic">(Ký và ghi rõ họ tên)</p>
                        <p className="mt-5">
                            <strong>{leaveData?.student_name}</strong>
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default CardPreviewFormLeave;