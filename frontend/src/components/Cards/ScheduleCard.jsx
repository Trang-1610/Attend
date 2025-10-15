import { Card, Typography } from "antd";
import { BookOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import ListSchedule from "../List/ListSchedule";

const { Text } = Typography;

export default function ScheduleCard({ todaySchedules, onSelectSchedule }) {
    const { t } = useTranslation();
    return (
        <Card
            className="rounded"
            title={
                <div className="flex items-center gap-2">
                    <BookOutlined /> {t("today's roll call mission")}
                </div>
            }
        >
            { todaySchedules.length === 0 ? (
                <Text type="secondary">
                    {t("you don't have any classes today")} 🎉
                </Text>
            ) : (
                <ListSchedule
                    todaySchedules={todaySchedules}
                    onSelectSchedule={onSelectSchedule}
                    t={t}
                />
            )}
        </Card>
    );
}