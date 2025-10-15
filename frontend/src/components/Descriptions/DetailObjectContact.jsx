import { Avatar, Descriptions } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined as PhoneIcon } from "@ant-design/icons";

const DescriptionsDetailObjectContact = ({ t, selectedLecturerInfo }) => {
    return (
        <Descriptions column={1} size="small">
            <Descriptions.Item label={t("lecturer")}>
                <div className="flex items-center gap-3">
                    <Avatar
                        src={
                            selectedLecturerInfo?.avatar ||
                            "https://cdn-icons-png.flaticon.com/512/219/219986.png"
                        }
                        icon={<UserOutlined />}
                    />
                    {selectedLecturerInfo?.fullname}
                </div>
            </Descriptions.Item>
            <Descriptions.Item label={t("email")}>
                <a href={`mailto:${selectedLecturerInfo?.email}`}>
                    <MailOutlined /> {selectedLecturerInfo?.email}
                </a>
            </Descriptions.Item>
            <Descriptions.Item label={t("phonenumber")}>
                <a href={`tel:${selectedLecturerInfo?.phone_number}`}>
                    <PhoneIcon /> {selectedLecturerInfo?.phone_number}
                </a>
            </Descriptions.Item>
        </Descriptions>
    )
};

export default DescriptionsDetailObjectContact;