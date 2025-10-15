import { Breadcrumb } from 'antd';
import { HomeOutlined, PlusCircleOutlined } from '@ant-design/icons';

const BreadcrumbReminder = ({ t }) => {
    return (
        <Breadcrumb
            items={[
                { href: "/", title: <><HomeOutlined /> <span>{t("home")}</span></> },
                {
                    href: '#',
                    title: <>
                        <PlusCircleOutlined /> <span>{t("create_event")}</span>
                    </>
                },
                { href: '/add-event/add-reminder', title: t("create_reminder") },
            ]}
        />
    );
};

export default BreadcrumbReminder;