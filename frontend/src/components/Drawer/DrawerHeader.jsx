import React from "react";
import { Drawer, Menu } from "antd";

const DrawerHeader = ({ items, setOpenDrawer, openDrawer, i18n }) => {
    return (
        <Drawer title="Menu" className="font-bold" placement="right" onClose={() => setOpenDrawer(false)} open={openDrawer}>
            <Menu
                mode="inline"
                items={items}
                onClick={({ key }) => {
                    if (key === "vi" || key === "en") {
                        i18n.changeLanguage(key);
                    }
                    setOpenDrawer(false);
                }}
            />
        </Drawer>
    );
};

export default DrawerHeader;