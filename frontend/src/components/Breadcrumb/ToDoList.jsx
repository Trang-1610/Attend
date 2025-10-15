import { Breadcrumb } from "antd";
import { HomeOutlined, CheckSquareOutlined } from "@ant-design/icons";

const BreadcrumbToDoList = ({ t }) => {
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
                    href: "/to-do-list/today",
                    title: (
                        <>
                            <CheckSquareOutlined />{" "}
                            <span>To-Do List</span>
                        </>
                    ),
                },
            ]}
        />
    );
}

export default BreadcrumbToDoList