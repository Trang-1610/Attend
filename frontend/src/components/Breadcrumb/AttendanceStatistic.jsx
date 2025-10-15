import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

const BreadcrumbAttendanceStatistic = ({ t }) => {
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
                    href: "/attendance/statistics",
                    title: "Thống kê điểm danh",
                },
            ]}
        />
    );
};

export default BreadcrumbAttendanceStatistic;