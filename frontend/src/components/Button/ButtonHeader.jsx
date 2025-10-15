import { Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";

const ButtonHeader = ({ setOpenDrawer }) => {
    return (
        <Button icon={<MenuOutlined />} type="text" onClick={() => setOpenDrawer(true)} />
    );
};

export default ButtonHeader;