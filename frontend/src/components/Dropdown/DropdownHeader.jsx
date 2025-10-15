import { Dropdown, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

const DropdownHeader = ({ userMenuItems, user }) => {
    return (
        <Dropdown trigger={["hover"]} placement="bottomRight" menu={{ items: userMenuItems }}>
            <div className="flex items-center gap-2 cursor-pointer">
                {user?.avatar ? (

                    <img
                        src={user?.avatar}
                        alt="Avatar"
                        className="h-10 w-10 rounded-full object-cover"
                    />
                ) : (
                    <Avatar icon={<UserOutlined />} />
                )}
            </div>
        </Dropdown>
    );
};

export default DropdownHeader;