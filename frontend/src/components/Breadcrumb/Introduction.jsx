import { Breadcrumb } from "antd";
import { HomeOutlined, ProjectOutlined } from "@ant-design/icons";

const BreadcrumbIntroduction = ({ t}) => {
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
                    href: "/about",
                    title: (
                        <>
                            <ProjectOutlined /> <span>{t("project and member introduction")}</span>
                        </>
                    ),
                },
            ]}
        />
    );
}

export default BreadcrumbIntroduction