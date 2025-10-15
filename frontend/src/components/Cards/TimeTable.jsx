import { Card, Typography } from "antd";
import TabTimeTable from "../Tab/TimeTable";

const { Title } = Typography;

const CardTimeTable = ({ t, activeTab, setActiveTab, items }) => {
    return (
        <Card
            title={<Title level={4} style={{ margin: 0 }}>{t("timetable")}</Title>}
            className="rounded-lg"
        >
            <TabTimeTable activeKey={activeTab} onChange={setActiveTab} items={items} />
        </Card>
    );
}

export default CardTimeTable