import React, { useEffect, useState } from "react";
import {
    Breadcrumb,
    Typography,
    Card,
    Button,
    Table,
    Input,
    Space,
    Badge,
    message
} from "antd";
import Header from "../../components/Layout/Header";
import { HomeOutlined, PlusCircleOutlined, DiffOutlined, SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import Footer from "../../components/Layout/Footer";
import api from "../../api/axiosInstance";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

const { Title, Paragraph } = Typography;

export default function ContactPage() {

    const { t } = useTranslation();
    const [listSubject, setListSubject] = useState([]);

    const user = localStorage.getItem("user");
    const accountId = user ? JSON.parse(user).account_id : null;

    useEffect(() => {
        document.title = "ATTEND 3D - Xin nghỉ phép";

        const fetchListSubject = async () => {
            try {
                const res = await api.get(`leaves/leave-requests/list-subjects/${accountId}/`);
                setListSubject(res.data);
            } catch (error) {
                console.log(error);
                message.error("Không tải được danh sách môn học nghỉ phép.");
                setListSubject([]);
            }
    
        };

        fetchListSubject();
    }, [t, accountId]);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    let searchInput = null;

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => { searchInput = node; }}
                    placeholder={`Tìm kiếm ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Tìm
                    </Button>
                    <Button
                        onClick={() => handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Làm mới
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
                filterDropdownProps: {
                    onOpenChange: (open) => {
                        if (open) {
                            setTimeout(() => searchInput?.select(), 100);
                        }
                    },
                },
        render: text =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0] || '');
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const columns = [
        {
            title: 'Mã nghỉ phép',
            dataIndex: 'leave_request_code',
            key: 'leave_request_code',
        },
        {
            title: 'Lý do',
            dataIndex: 'reason',
            key: 'reason',
            ...getColumnSearchProps('reason'),
        },
        {
            title: 'Môn học',
            dataIndex: 'subject_name',
            key: 'subject_name',
            ...getColumnSearchProps('subject_name'),
        },
        {
            title: 'Từ ngày',
            dataIndex: 'from_date',
            key: 'from_date',
            sorter: (a, b) => new Date(a.from_date) - new Date(b.from_date),
            render: (value) => value ? dayjs(value).format("HH:mm DD/MM/YYYY") : "-"
        },
        {
            title: 'Đến ngày',
            dataIndex: 'to_date',
            key: 'to_date',
            sorter: (a, b) => new Date(a.to_date) - new Date(b.to_date),
            render: (value) => value ? dayjs(value).format("HH:mm DD/MM/YYYY") : "-"
        },          
        {
            title: 'Số ngày nghỉ phép còn lại',
            dataIndex: 'max_leave_days',
            key: 'max_leave_days',
            sorter: (a, b) => new Date(a.max_leave_days) - new Date(b.max_leave_days),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'leave_request_status',
            key: 'leave_request_status',
            filters: [
                { text: 'Đã duyệt', value: 'A' },
                { text: 'Chờ duyệt', value: 'P' },
                { text: 'Từ chối', value: 'R' },
            ],
            onFilter: (value, record) => record?.leave_request_status === value,
            render: (status) => {
                const statusMap = {
                    A: <Badge status="success" text="Đã duyệt" />,
                    P: <Badge status="warning" text="Chờ duyệt" />,
                    R: <Badge status="error" text="Từ chối" />,
                };
                return statusMap[status] || status;
            }
        },
        {
            title: 'Tệp đính kèm',
            dataIndex: 'attachment_url',
            key: 'attachment_url',
            render: (url) =>
                url ? (
                    <a href={url} target="_blank" rel="noopener noreferrer" download={true}>
                        <Button type="link">Tải xuống</Button>
                    </a>
                ) : (
                    "-"
                ),
        },        
    ];

    return (
        <div className="min-h-screen bg-white text-gray-800 dark:bg-black dark:text-white flex flex-col">
            <div className="w-full mx-auto px-6 flex-grow">
                <Header />

                <main className="mt-10 flex flex-col items-center">
                    <div className="w-full px-4">
                        <Breadcrumb
                            items={[
                                { href: '/', title: <><HomeOutlined /> <span>Trang chủ</span></> },
                                { href: '/add-event/request-leave', title: <><PlusCircleOutlined /> <span>Danh sách nghỉ phép của bạn</span></> }
                            ]}
                        />
                    </div>

                    <div className="w-full p-5 rounded-lg mt-6">
                        <Card title={<Title level={3}>Tạo đơn sinh nghỉ phép</Title>} className="p-2">
                            <div className="flex justify-center mt-6">
                                <div className="border rounded-lg p-4 bg-white text-gray-800 dark:bg-black dark:text-white text-center">
                                    <Button
                                        icon={<DiffOutlined />}
                                        size="large"
                                        block
                                        type="primary"
                                        href="/add-event/request-leave/request"
                                    >
                                        Tạo đơn xin nghỉ phép
                                    </Button>
                                    <Paragraph className="mt-2 text-sm text-gray-500">
                                        Vui lòng click vào nút bên trên để tạo đơn xin nghỉ phép
                                    </Paragraph>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="w-full p-5 rounded-lg mt-6">
                        <Card title={<Title level={3}>Danh sách môn học bạn nghỉ phép</Title>} className="p-2">
                            <Table
                                rowKey={'leave_request_code'}
                                columns={columns}
                                dataSource={listSubject}
                                pagination={{ pageSize: 10 }}
                                scroll={{ x: true }}
                            />
                        </Card>
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
}