import { Breadcrumb } from "antd";
import { HomeOutlined, ScheduleOutlined } from "@ant-design/icons";

const BreadcrumbTimeTable = ({ t }) => {
    return (
        <Breadcrumb
            items={[
                { href: "/", title: <><HomeOutlined /> <span>{t("home")}</span></> },
                { href: "/timetable", title: <><ScheduleOutlined /> <span>{t("timetable")}</span></> },
            ]}
        />
    );
}

export default BreadcrumbTimeTable