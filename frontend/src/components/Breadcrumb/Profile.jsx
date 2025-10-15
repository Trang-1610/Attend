import { Breadcrumb } from "antd";
import { HomeOutlined, SnippetsOutlined } from "@ant-design/icons";

const BreadcumProfile = ({ t }) => {
    return (
        <Breadcrumb
            items={[
                { href: "/", title: <><HomeOutlined /> <span>{t("home")}</span></> },
                {
                    href: "/profile",
                    title: (
                        <>
                            <SnippetsOutlined />
                            <span> Thông tin tài khoản</span>
                        </>
                    ),
                },
            ]}
        />
    );
};

export default BreadcumProfile;