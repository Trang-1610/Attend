import { useEffect, useState } from "react";
import {
    Button,
    Input,
    Space,
    message
} from "antd";
import Header from "../../components/Layout/Header";
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import Footer from "../../components/Layout/Footer";
import api from "../../api/axiosInstance";
import { useTranslation } from "react-i18next";
import { getAccountId } from "../../utils/auth";

import CardListSubjectLeave from "../../components/Cards/ListSubjectLeave";
import CardCreateLeaveRequest from "../../components/Cards/CreateLeaveRequest";
import BreadcrumbAddRequestLeave from "../../components/Breadcrumb/AddRequestLeave";
import FullScreenLoader from "../../components/Spin/Spin";

export default function AddREquestLeave() {

    const { t } = useTranslation();
    const [listSubject, setListSubject] = useState([]);
    const [loading, setLoading] = useState(false);

    // Get account id
    const accountId = getAccountId();

    useEffect(() => {
        document.title = "ATTEND 3D - Xin nghỉ phép";

        const fetchListSubject = async () => {
            setLoading(true);
            try {
                const res = await api.get(`leaves/leave-requests/list-subjects/${accountId}/`);
                setListSubject(res.data);
            } catch (error) {
                console.log(error);
                message.error("Không tải được danh sách môn học nghỉ phép.");
                setListSubject([]);
            } finally {
                setLoading(false);
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

    return (
        <div className="min-h-screen bg-white text-gray-800 dark:bg-black dark:text-white flex flex-col">
            <div className="w-full mx-auto px-6 flex-grow">
                <Header />

                <main className="mt-10 flex flex-col items-center">
                    <div className="w-full px-4">
                        <BreadcrumbAddRequestLeave t={t} />
                    </div>

                    <div className="w-full p-5 rounded-lg mt-6">
                        <CardCreateLeaveRequest />
                    </div>

                    <div className="w-full p-5 rounded-lg mt-6">
                        <CardListSubjectLeave 
                            listSubject={listSubject}
                            getColumnSearchProps={getColumnSearchProps}
                        />
                    </div>
                </main>

                <FullScreenLoader loading={loading} text={"Đang tải dữ liệu...Vui lòng đợi"} />
            </div>
            <Footer />
        </div>
    );
}