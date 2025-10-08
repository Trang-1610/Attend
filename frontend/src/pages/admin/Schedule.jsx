import React, { useState, useEffect } from 'react';
import {
    Layout, Table, Button, Select, Tabs, message, Tag
} from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import Sidebar from '../../components/Layout/Sidebar';
import Navbar from '../../components/Layout/Navbar';
import dayjs from 'dayjs';
import api from '../../api/axiosInstance';

const { Header } = Layout;
const { TabPane } = Tabs;

export default function Schedule() {

    useEffect(() => {
        document.title = "ATTEND 3D - Quản lý lịch học";
    }, []);

    const [collapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [schedules, setSchedules] = useState([]);
    const [studentIdFilter, setStudentIdFilter] = useState('');
    const [studentCode, setStudentCode] = useState([]);

    const fetchSchedules = async (studentCode) => {
        if (!studentCode) return;
        setLoading(true);
        try {
            const res = await api.get(`students/admin/all/schedule/${studentCode}/`);
            setSchedules(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
            message.error('Không tải được lịch học.');
            setSchedules([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchStudentCode = async () => {
        setLoading(true);
        try {
            const res = await api.get('students/admin/all/student-codes/');
            setStudentCode(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
            message.error('Không tải được danh sách sinh viên.');
            setStudentCode([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSchedules();
        fetchStudentCode();
    }, []);

    const columns = [
        // {
        //     title: 'Thao tác',
        //     dataIndex: 'action',
        //     key: 'action',
        //     render: (_, record) => (
        //         <Button type="link" onClick={() => window.open(`/admin/schedule/${record?.subject_registration_request_id}/`, '_blank')}>
        //             Xem chi tiết
        //         </Button>
        //     ),
        // },
        {
            title: 'Trạng thái duyệt',
            dataIndex: 'register_status',
            key: 'register_status',
            render: (value) => {
                if (value === 'pending') {
                    return <Tag color="blue">Chưa duyệt</Tag>;
                } else if (value === 'approved') {
                    return <Tag color="green">Đã duyệt</Tag>;
                } else {
                    return <Tag color="red">Không duyệt</Tag>;
                }
            }
        },
        {
            title: 'Mã sinh viên',
            dataIndex: 'student_code',
            key: 'student_code',
        },
        {
            title: 'Tên sinh viên',
            dataIndex: 'student_name',
            key: 'student_name',
        },
        {
            title: 'Ngày đăng ký',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (value) => value ? dayjs(value).format('HH:mm:ss DD/MM/YYYY') : '',
        },
        {
            title: 'Môn học',
            dataIndex: 'subject_name',
            key: 'subject_name',
        },
        {
            title: 'Giảng viên',
            dataIndex: 'lecturer_name',
            key: 'lecturer_name',
        },
        {
            title: 'Phòng học',
            dataIndex: 'room_name',
            key: 'room_name',
        },
        {
            title: 'Ca học',
            dataIndex: 'shift_name',
            key: 'shift_name',
        },
        {
            title: 'Tiết',
            dataIndex: 'slot_name',
            key: 'slot_name',
        },
        {
            title: 'Loại buổi',
            dataIndex: 'lesson_type',
            key: 'lesson_type',
        },
        {
            title: 'Thời gian',
            key: 'time',
            render: (_, record) => `${record.lesson_start} - ${record.lesson_end}`,
        },
    ];    

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
            <Layout>
                <Header className="bg-white px-4 flex justify-between items-center border-b">
                    <Navbar />
                </Header>

                <main className="mx-4 my-4 p-4 sm:p-6 bg-white rounded shadow">
                    <h1 className="text-2xl font-bold mb-4">Quản lý lịch học</h1>

                    <Tabs defaultActiveKey="browse">
                        <TabPane tab="Duyệt lịch học" key="browse">
                            <div className="flex flex-wrap gap-2 items-center mb-4">
                                <Select
                                    placeholder="Lọc theo mã sinh viên"
                                    value={studentIdFilter || undefined}
                                    onChange={(value) => {
                                        setStudentIdFilter(value);
                                
                                        if (value) {
                                            fetchSchedules(value);
                                        } else {
                                            setSchedules([]);
                                        }
                                    }}
                                    style={{ width: 400 }}
                                    allowClear
                                    size="large"
                                    options={studentCode.map(code => ({
                                        label: code?.student_code + ' - ' + code?.fullname,
                                        value: code?.student_code,
                                    }))}
                                    className='custom-select'
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    showSearch
                                />

                                <Button icon={<ReloadOutlined />} onClick={() => fetchSchedules(studentIdFilter)} size='large' type='primary'>
                                    Làm mới
                                </Button>
                            </div>

                            <Table
                                rowKey="schedule_id"
                                columns={columns}
                                dataSource={schedules}
                                loading={loading}
                                pagination={{ pageSize: 10 }}
                                bordered
                                scroll={{ x: 'max-content' }}
                            />
                        </TabPane>

                        <TabPane tab="Sửa lịch học" key="edit">
                            <p>Chức năng sửa lịch học sẽ triển khai sau.</p>
                        </TabPane>
                    </Tabs>
                </main>
            </Layout>
        </Layout>
    );
}