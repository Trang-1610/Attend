import { Breadcrumb } from "antd";
import { HomeOutlined, CalendarOutlined } from "@ant-design/icons";

const BreadcrumbAttendanceHistory = ({ t }) => {
    return (
        <Breadcrumb
            items={[
                {
                    href: "/",
                    title: (
                        <>
                            <HomeOutlined /> <span>{t("home")}</span>
                        </>
                    ),
                },
                {
                    href: "/attendance/attendance-history",
                    title: (
                        <>
                            <CalendarOutlined /> <span>{t("attendance history")}</span>
                        </>
                    ),
                },
            ]}
        />
    );
}

export default BreadcrumbAttendanceHistory