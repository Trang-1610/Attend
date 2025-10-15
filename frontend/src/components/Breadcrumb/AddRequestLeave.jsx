import { Breadcrumb } from "antd";
import { HomeOutlined, PlusCircleOutlined } from "@ant-design/icons";

const BreadcrumbAddRequestLeave = ({ t }) => {
    return (
        <Breadcrumb
            items={[
                { href: '/', title: <><HomeOutlined /> <span>{t("home")}</span></> },
                { href: '/add-event/request-leave', title: <><PlusCircleOutlined /> <span>{t("your leave list")}</span></> }
            ]}
        />
    );
}

export default BreadcrumbAddRequestLeave;