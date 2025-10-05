import React from "react";
import { Breadcrumb } from "antd";
import { HomeOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

export default function PageHeader() {
    const { t } = useTranslation();
    return (
        <div className="w-full px-4">
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
        </div>
    );
}