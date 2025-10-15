import { Breadcrumb } from 'antd';
import { HomeOutlined, BellOutlined } from '@ant-design/icons';

const BreadcrumbNotification = ({ t }) => {
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
                    href: "/notifications",
                    title: (
                        <>
                            <BellOutlined /> <span>{t("notifications")}</span>
                        </>
                    ),
                },
            ]}
        />
    );
};

export default BreadcrumbNotification;