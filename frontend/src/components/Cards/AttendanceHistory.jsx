import { Card } from "antd";
import TableAttendanceHistory from "../Table/AttendanceHistory";
import FullScreenLoader from "../Spin/Spin";

const CardAttendanceHistory = ({ loading, summary, setSelectedRecord, setIsModalVisible, t }) => {
    return (
        <Card title={t("attendance history")} className="rounded">
            {loading ? (
                <div className="flex justify-center p-6">
                    <FullScreenLoader loading={loading} text={"Đang tải dữ liệu...Vui lòng đợi"} />
                </div>
            ) : (
                <TableAttendanceHistory
                    summary={summary}
                    setSelectedRecord={setSelectedRecord}
                    setIsModalVisible={setIsModalVisible}
                    t={t}
                />
            )}
        </Card>
    );
}

export default CardAttendanceHistory