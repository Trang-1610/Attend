// import { Upload, Image, Button, message, Avatar } from "antd";
// import { UserOutlined, UploadOutlined } from "@ant-design/icons";
// import api from "../../../api/axiosInstance";

// export default function AvatarUpload({ avatarUrl, setAvatarUrl, accountId }) {
//     const user = JSON.parse(localStorage.getItem("user") || "{}");

//     const handleUpload = async ({ file, onSuccess, onError }) => {
//         const formData = new FormData();
//         formData.append("avatar", file);

//         try {
//             const res = await api.post(`accounts/${accountId}/update_avatar/`, formData, {
//                 headers: { "Content-Type": "multipart/form-data" },
//             });
//             const newAvatar = res.data.avatar_url;
//             setAvatarUrl(newAvatar);
//             localStorage.setItem("user", JSON.stringify({ ...user, avatar: newAvatar }));
//             message.success("Cập nhật ảnh thành công!");
//             onSuccess("ok");
//         } catch (error) {
//             message.error("Tải ảnh thất bại!");
//             onError(error);
//         }
//     };

//     return avatarUrl ? (
//         <>
//             <Image src={avatarUrl} width={100} height={100} className="rounded-full" />
//             <Upload customRequest={handleUpload} showUploadList={false} accept="image/*">
//                 <Button icon={<UploadOutlined />} className="my-3">
//                     Cập nhật ảnh
//                 </Button>
//             </Upload>
//         </>
//     ) : (
//         <Avatar size={100} icon={<UserOutlined />} />
//     );
// }