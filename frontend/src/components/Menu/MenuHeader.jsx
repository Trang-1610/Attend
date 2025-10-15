import { Menu } from "antd";

const MenuHeader = ({ items, selectedKeys, setSelectedKeys, i18n }) => {
    return (
        <Menu
            mode="horizontal"
            items={items}
            selectedKeys={selectedKeys}
            onClick={({ key }) => {
                if (key === "vi" || key === "en") {
                    i18n.changeLanguage(key);
                    localStorage.setItem("lang", key);
                } else {
                    setSelectedKeys([key]);
                }
            }}
            className="flex-1 bg-transparent border-b-0 font-bold"
        />
    );
}

export default MenuHeader