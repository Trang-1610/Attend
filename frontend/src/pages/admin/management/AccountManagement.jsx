import React, { useState, useEffect } from 'react';
import {
    Layout, Table, Button, Modal, Form, Input, message, Space,
    Tag, Select
} from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import Sidebar from '../../../components/Layout/Sidebar';
import Navbar from '../../../components/Layout/Navbar';
import api from '../../../api/axiosInstance';

const { Header } = Layout;

export default function AccountManagement() {
    const [collapsed, setCollapsed] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        document.title = "ATTEND 3D - Quản lý người dùng";

        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        setLoading(true);
        try {
            const response = await api.get("accounts/get-all-accounts/");
            setUsers(response.data);
        } catch (error) {
            message.error("Bạn không có quyền truy cập.");
        } finally {
            setLoading(false);
        }
    };

    const generateRandomPassword = (length = 10) => {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
        let password = "";
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return password;
    };

    const showEditModal = (user) => {
        setEditingUser(user);
        form.setFieldsValue(user);
        setOpenModal(true);
    };

    const handleAddUser = () => {
        setEditingUser(null);
        const randomPassword = generateRandomPassword();
        form.resetFields();
        form.setFieldsValue({ password: randomPassword });
        setOpenModal(true);
    };

    const handleSubmit = async (values) => {
        try {
            if (editingUser) {
                await api.put(
                    `accounts/admin/update-account/${editingUser.account_id}/`,
                    values
                );

                message.success('Cập nhật người dùng thành công');

                const updatedUsers = users.map((u) =>
                    u.account_id === editingUser.account_id ? { ...u, ...values } : u
                );
                setUsers(updatedUsers);
            } else {
                await api.post("accounts/admin/create-account/", values);
                message.success("Thêm người dùng thành công");
                fetchAccounts();
            }
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data) {
                message.error(error.response.data?.detail || 'Cập nhật thất bại');
            } else {
                message.error('Có lỗi xảy ra khi cập nhật');
            }
        } finally {
            form.resetFields();
            setEditingUser(null);
            setOpenModal(false);
        }
    };

    const columns = [
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Trạng thái hoạt động',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (is_active) => (is_active ? <Tag color="green">Hoạ­t động</Tag> : <Tag color="red">Tạm dừng</Tag>),
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone_number',
        },
        {
            title: 'Hành động',
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => showEditModal(record)}>
                        Sửa
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
            <Layout>
                <Header className="bg-white px-4 flex justify-between items-center py-3 border-b">
                    <Navbar />
                </Header>

                <main className="mx-4 my-4 p-4 bg-white rounded shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Quản lý người dùng</h2>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            // onClick={() => {
                            //     setEditingUser(null);
                            //     form.resetFields();
                            //     setOpenModal(true);
                            // }}
                            onClick={handleAddUser}
                        >
                            Thêm người dùng
                        </Button>
                    </div>

                    <Table
                        dataSource={users}
                        columns={columns}
                        rowKey="account_id"
                        bordered
                        scroll={{ x: 'max-content' }}
                        loading={loading}
                    />

                    <Modal
                        open={openModal}
                        title={editingUser ? 'Cập nhật thông tin người dùng' : 'Thêm người dùng mới'}
                        onCancel={() => setOpenModal(false)}
                        onOk={() => form.submit()}
                    >
                        <Form
                            layout="vertical"
                            form={form}
                            onFinish={handleSubmit}
                            autoComplete='off'
                            name='update-user-form'
                        >
                            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email' }]}>
                                <Input type='email' style={{ borderWidth: 1.5, boxShadow: 'none' }} />
                            </Form.Item>
                            <Form.Item name="is_active" label="Trạng thái hoạt động" rules={[{ required: true, message: "Vui lòng chọn trạng thái hoạt động" }]}>
                                <Select className='w-full custom-select'>
                                    <Select.Option value={true}>Hoạ­t động</Select.Option>
                                    <Select.Option value={false}>Tạm dừng</Select.Option>
                                </Select>
                            </Form.Item>
                            {
                                !editingUser && (
                                    <>
                                        <Form.Item name="user_type" label="Vai trò" rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}>
                                            <Select className='w-full custom-select'>
                                                <Select.Option value="student">student</Select.Option>
                                                <Select.Option value="teacher">teacher</Select.Option>
                                                <Select.Option value="admin">admin</Select.Option>
                                                <Select.Option value="superadmin">superadmin</Select.Option>
                                            </Select>
                                        </Form.Item>

                                        <Form.Item 
                                            name="password" 
                                            label="Mật khẩu" 
                                            rules={[{ required: true, message: "Vui lòng nhâp mật khẩu" }]}
                                        >
                                            <Input.Password style={{ borderWidth: 1.5, boxShadow: 'none' }} />
                                        </Form.Item>
                                    </>
                                )
                            }
                            <Form.Item 
                                name="phone_number" 
                                label="Số điện thoại" 
                                // rules={[{ required: true }]}
                                rules={[
                                    { required: true, message: "Vui lòng nhập số điện thoại" },
                                    {
                                        pattern:
                                            /^(096|097|086|098|039|038|037|036|035|034|033|032|083|084|085|081|088|082|091|094|070|076|077|078|079|089|090|093|092|056|058|099|059|087)\d{7}$/,
                                        message: "Số điện thoại không hợp lệ!",
                                    },
                                ]}
                            >
                                <Input 
                                    type='text' 
                                    style={{ borderWidth: 1.5, boxShadow: 'none' }} 
                                />
                            </Form.Item>
                        </Form>
                    </Modal>
                </main>
            </Layout>
        </Layout>
    );
}