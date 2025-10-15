import { Breadcrumb } from 'antd';
import { HomeOutlined, PhoneOutlined } from '@ant-design/icons';

const BreadcrumbGeneralSetting = ({ t }) => {
    return (
        <Breadcrumb
            items={[
                { href: "/", title: <><HomeOutlined /> <span>{"Trang chủ"}</span></> },
                {
                    href: "/general-setting",
                    title: (
                        <>
                            <PhoneOutlined /> <span>{t("general_setting")}</span>
                        </>
                    ),
                }
            ]}
        />
    );
};

export default BreadcrumbGeneralSetting;