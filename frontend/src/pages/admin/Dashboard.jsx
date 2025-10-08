import React, { useState, useEffect } from 'react';
import { Layout, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import AttendanceBarChartDepartment from '../../components/Chart/AttendanceBarChartDepartment';
import AttendancePieChart from '../../components/Chart/AttendancePieChart';
import AttendanceLineChart from '../../components/Chart/AttendanceLineChart';
import AttendanceAreaChart from '../../components/Chart/AttendanceAreaChart';
import AttendanceRadarChart from '../../components/Chart/AttendanceRadarChart';
import Sidebar from '../../components/Layout/Sidebar';
import Navbar from '../../components/Layout/Navbar';
import api from '../../api/axiosInstance';
import SummaryCards from '../../components/Cards/SummaryCards';
import SelectFilterChart from '../../components/Selects/SelectFilterChart';

const { Header } = Layout;

export default function Dashboard() {
    const { t } = useTranslation();
    const [collapsed, setCollapsed] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [totalStudent, setTotalStudent] = useState(0);
    const [loadingTotalStudent, setLoadingTotalStudent] = useState(false);

    const [totalLecturer, setTotalLecturer] = useState(0);
    const [loadingTotalLecturer, setLoadingTotalLecturer] = useState(false);

    const [totalAttendance, setTotalAttendance] = useState(0);
    const [loadingTotalAttendance, setLoadingTotalAttendance] = useState(false);

    const [academicYear, setAcademicYear] = useState([]);
    const [loadingAcademicYear, setLoadingAcademicYear] = useState(false);
    const [selectedYear, setSelectedYear] = useState(null);

    const [semesters, setSemesters] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [loadingSemester, setLoadingSemester] = useState(false);

    const [attendanceByDepartment, setAttendanceByDepartment] = useState([]);
    const [loadingAttendanceByDepartment, setLoadingAttendanceByDepartment] = useState(false);

    useEffect(() => {
        document.title = "ATTEND 3D - Dashboard";

        fetchTotalStudent();
        fetchTotalLecturer();
        fetchTotalAttendance();

        fetchAcademicYear();
        fetchSemesters();
    }, [t]);

    const fetchTotalStudent = async () => {
        setLoadingTotalStudent(true);
        try {
            const res = await api.get('students/admin/total-student/');
            setTotalStudent(res.data.total_student);
        } catch (error) {
            console.error('Lỗi khi tải tổng số sinh viên:', error);
            setTotalStudent(0);
        } finally {
            setLoadingTotalStudent(false);
        }
    };

    const fetchTotalLecturer = async () => {
        setLoadingTotalLecturer(true);
        try {
            const res = await api.get('lecturers/admin/total-lecturer/');
            setTotalLecturer(res.data.total_lecturer);
        } catch (error) {
            console.error('Lỗi khi tải tổng số giảng viên:', error);
            setTotalLecturer(0);
        } finally {
            setLoadingTotalLecturer(false);
        }
    };

    const fetchTotalAttendance = async () => {
        setLoadingTotalAttendance(true);
        try {
            const res = await api.get('attendance/admin/attendance-statistics-total/');
            setTotalAttendance(res.data);
        } catch (error) {
            console.error('Lỗi khi tải tổng số buổi điểm danh:', error);
            setTotalAttendance(0);
        } finally {
            setLoadingTotalAttendance(false);
        }
    };

    const fetchAcademicYear = async () => {
        setLoadingAcademicYear(true);
        try {
            const res = await api.get('academic-years/all/');
            setAcademicYear(res.data);

            if (res.data.length > 0) {
                setSelectedYear(res.data[0].academic_year_id);
            }
        } catch (err) {
            console.error('Lỗi khi lấy danh sách năm học:', err);
        } finally {
            setLoadingAcademicYear(false);
        }
    };

    useEffect(() => {
        if (selectedYear) {
            fetchSemesters(selectedYear);
        }
    }, [selectedYear]);
    
    const fetchSemesters = async (yearId) => {
        setLoadingSemester(true);
        try {
            const res = await api.get(`semesters/${yearId}/`);
            setSemesters(res.data);
    
            if (res.data.length > 0) {
                setSelectedSemester(res.data[0].semester_id);
            }
        } catch (err) {
            console.error('Lỗi khi lấy danh sách học kỳ:', err);
        } finally {
            setLoadingSemester(false);
        }
    };    

    useEffect(() => {
        if (selectedSemester && selectedYear) {
            fetchAttendanceByDepartment(selectedSemester, selectedYear);
        }
    }, [selectedSemester, selectedYear]);    

    const fetchAttendanceByDepartment = async (semesterId, yearId) => {
        if (!semesterId || !yearId) return;
        setLoadingAttendanceByDepartment(true);
    
        try {
            const res = await api.get(`attendance/admin/attendance-statistics-by-department/${semesterId}/${yearId}/`);
            // Backend returns an array of objects
            setAttendanceByDepartment(res.data);
        } catch (error) {
            console.error('Lỗi khi tải thống kê điểm danh theo khoa:', error);
            setAttendanceByDepartment([]);
        } finally {
            setLoadingAttendanceByDepartment(false);
        }
    };    

    const summaryCards = [
        { icon: 'fas fa-users', color: 'text-blue-500', label: 'Tổng số sinh viên', value: loadingTotalStudent ? <Spin /> : totalStudent },
        { icon: 'fa-solid fa-person-chalkboard', color: 'text-blue-500', label: 'Tổng số giảng viên', value: loadingTotalLecturer ? <Spin /> : totalLecturer },
        { icon: 'fas fa-check-circle', color: 'text-green-500', label: 'Tổng số buổi điểm danh', value: loadingTotalAttendance ? <Spin /> : totalAttendance?.total_sessions },
        { icon: 'fa-solid fa-person-chalkboard', color: 'text-yellow-500', label: 'Tổng số buổi điểm danh %', value: loadingTotalAttendance ? <Spin /> : totalAttendance?.total_sessions_precent },
    ];

    const pieData = [
        { name: 'Đi học', value: 320 },
        { name: 'Vắng mặt', value: 80 },
    ];

    const lineData = [
        { date: '01/06', attendance: 90 },
        { date: '02/06', attendance: 85 },
        { date: '03/06', attendance: 88 },
        { date: '04/06', attendance: 92 },
        { date: '05/06', attendance: 87 },
    ];

    const areaData = [
        { class: 'Lớp A', total: 150 },
        { class: 'Lớp B', total: 180 },
        { class: 'Lớp C', total: 200 },
        { class: 'Lớp D', total: 170 },
    ];

    const radarData = [
        { faculty: 'CNTT', attendance: 98 },
        { faculty: 'Kinh tế', attendance: 85 },
        { faculty: 'Ngôn ngữ', attendance: 75 },
        { faculty: 'Luật', attendance: 90 },
        { faculty: 'Xã hội', attendance: 80 },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} t={t} />

            <Layout>
                <Header className="bg-white px-4 flex flex-col sm:flex-row justify-between items-center gap-4 py-3 border-b">
                    <Navbar
                        searchValue={searchValue}
                        setSearchValue={setSearchValue}
                    />
                </Header>

                <main className="mx-4 my-4 p-4 sm:p-6 bg-white rounded shadow">
                    <h1 className="text-2xl font-bold mb-6">{t('Welcome to Dashboard')}</h1>

                    <SummaryCards cards={summaryCards} />

                    <div className="w-full bg-white rounded shadow p-6 mb-4">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 space-y-2 md:space-y-0 md:space-x-4">
                            <h2 className="text-lg font-semibold">Thống kê điểm danh theo khoa</h2>
                            <SelectFilterChart
                                loadingAcademicYear={loadingAcademicYear}
                                loadingSemester={loadingSemester}
                                academicYear={academicYear}
                                semesters={semesters}
                                selectedYear={selectedYear}
                                setSelectedYear={setSelectedYear}
                                selectedSemester={selectedSemester}
                                setSelectedSemester={setSelectedSemester}
                            />
                        </div>

                        <div className="w-full h-64">
                            {loadingAttendanceByDepartment ? (
                                <div className="flex justify-center items-center h-64">
                                    <Spin />
                                </div>
                            ) : (
                                <AttendanceBarChartDepartment data={attendanceByDepartment} />
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="w-full h-64 bg-white rounded shadow p-6">
                            <h2 className="text-lg font-semibold mb-2">Tỉ lệ điểm danh</h2>
                            <AttendancePieChart data={pieData} />
                        </div>

                        <div className="w-full h-64 bg-white rounded shadow p-6">
                            <h2 className="text-lg font-semibold mb-2">Xu hướng điểm danh theo ngày</h2>
                            <AttendanceLineChart data={lineData} />
                        </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                        <div className="w-full h-64 bg-white rounded shadow p-6">
                            <h2 className="text-lg font-semibold mb-2">Điểm danh theo lớp</h2>
                            <AttendanceAreaChart data={areaData} />
                        </div>

                        <div className="w-full h-64 bg-white rounded shadow p-6">
                            <h2 className="text-lg font-semibold mb-2">So sánh điểm danh giữa các khoa</h2>
                            <AttendanceRadarChart data={radarData} />
                        </div>
                    </div>
                </main>
            </Layout>
        </Layout>
    );
}