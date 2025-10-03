import React, { useState, useEffect } from "react";
import { Breadcrumb, message } from "antd";
import { HomeOutlined, CheckSquareOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";
import api from "../../api/axiosInstance";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isBetween from "dayjs/plugin/isBetween";

import ScheduleCard from "../../components/ToDoList/ScheduleCard";
import ReminderCard from "../../components/ToDoList/ReminderCard";
import EditReminderModal from "../../components/ToDoList/EditReminderModal";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

export default function ToDoList() {
    const { t } = useTranslation();

    const [loading, setLoading] = useState(true);
    const [scheduleData, setScheduleData] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");

    // Modal state for attendance
    const [, setOpenModal] = useState(false);
    const [, setSelectedSchedule] = useState(null);

    // Reminder state
    const [reminders, setReminders] = useState([]);
    const [editingReminder, setEditingReminder] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [editRangeDate, setEditRangeDate] = useState("");

    // Subject state
    const [studentSubjects, setStudentSubjects] = useState([]);
    const [editSubject, setEditSubject] = useState(null);

    useEffect(() => {
        document.title = "ATTEND 3D - Danh sách nhiệm vụ";

        fetchSchedule();
        fetchReminders();
        fetchStudentSubject();
    }, [t]);

    // load tasks when opening page
    useEffect(() => {
        try {
            const saved = localStorage.getItem("tasks");
            if (saved && saved !== "undefined") {
                setTasks(JSON.parse(saved));
            }
        } catch (err) {
            console.error("Error parsing tasks from localStorage:", err);
            setTasks([]);
        }
    }, []);

    // Every time tasks change, save it.
    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    const fetchSchedule = async () => {
        const user = localStorage.getItem("user");
        const accountId = user ? JSON.parse(user).account_id : null;
        try {
            const res = await api.get("students/schedules/" + accountId + "/");
            setScheduleData(res.data || []);
        } catch (error) {
            console.error("Error fetching schedule:", error);
        } finally {
            setLoading(false);
        }
    };

    // fetch reminders
    const fetchReminders = async () => {
        const user = localStorage.getItem("user");
        const accountId = user ? JSON.parse(user).account_id : null;
        try {
            const res = await api.get("reminders/" + accountId + "/");
            setReminders(res.data || []);
        } catch (error) {
            console.error("Error fetching reminders:", error);
            setReminders([]);
        }
    };

    // fetch student_subjects
    const fetchStudentSubject = async () => {
        const user = localStorage.getItem("user");
        const accountId = user ? JSON.parse(user).account_id : null;

        try {
            const res = await api.get("subjects/student-subjects/" + accountId + "/");
            setStudentSubjects(res.data || []);
        } catch (error) {
            console.error("Error fetching student_subjects:", error);
            setStudentSubjects([]);
        }
    }

    // mở modal edit
    const openEditModal = (reminder) => {
        setEditingReminder(reminder);
        setEditTitle(reminder.title);
        setEditContent(reminder.content);
        setEditRangeDate([
            dayjs(reminder.start_date),
            dayjs(reminder.end_date),
        ]);
        setEditSubject(Number(reminder.subject.subject_id));
        setEditModalOpen(true);
    };

    // submit edit
    const handleEditSave = async () => {
        try {
            await api.put("reminders/", {
                ...editingReminder,
                reminder_id: editingReminder.reminder_id,
                title: editTitle,
                content: editContent,
                start_date: editRangeDate[0].format("YYYY-MM-DD HH:mm:ss"),
                end_date: editRangeDate[1].format("YYYY-MM-DD HH:mm:ss"),
                subject_id: editSubject,
            });
            message.success("Cập nhật reminder thành công!");
            setEditModalOpen(false);
            fetchReminders(); // refresh list
        } catch (err) {
            console.error("Update reminder failed", err);
            message.error("Không thể cập nhật reminder!");
        }
    };

    // Filter today's schedule based on day_of_week
    const todaySchedules = scheduleData.filter((item) => {
        let today = dayjs().tz("Asia/Ho_Chi_Minh").day(); // 0 = CN
        let mappedToday = today === 0 ? 8 : today + 1; // CN=8
        return parseInt(item.day_of_week, 10) === mappedToday;
    });

    const addTask = () => {
        if (!newTask.trim()) {
            message.warning("Vui lòng nhập nhiệm vụ!");
            return;
        }
        setTasks([
            ...tasks,
            { id: Date.now(), title: newTask, done: false, type: "task" },
        ]);
        setNewTask("");
        message.success("Đã thêm nhiệm vụ!");
    };

    const toggleTask = (id) => {
        setTasks(
            tasks.map((task) =>
                task.id === id ? { ...task, done: !task.done } : task
            )
        );
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter((task) => task.id !== id));
        message.success("Đã xóa nhiệm vụ!");
    };

    const openAttendanceModal = (schedule) => {
        setSelectedSchedule(schedule);
        setOpenModal(true);
    };

    return (
        <div className="min-h-screen bg-white text-gray-800 dark:bg-black dark:text-white flex flex-col">
            <div className="w-full mx-auto px-6 flex-grow">
                <Header />
                <main className="mt-10 flex flex-col items-center">
                    <div className="w-full px-4">
                        <Breadcrumb
                            items={[
                                {
                                    href: "/",
                                    title: (
                                        <>
                                            <HomeOutlined /> <span>Trang chủ</span>
                                        </>
                                    ),
                                },
                                {
                                    href: "/to-do-list/today",
                                    title: (
                                        <>
                                            <CheckSquareOutlined />{" "}
                                            <span>To-Do List</span>
                                        </>
                                    ),
                                },
                            ]}
                        />
                    </div>

                    <div className="w-full mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ScheduleCard
                            loading={loading}
                            todaySchedules={todaySchedules}
                            openAttendanceModal={openAttendanceModal}
                        />

                        <div>
                            <ReminderCard
                                reminders={reminders}
                                openEditModal={openEditModal}

                                newTask={newTask}
                                setNewTask={setNewTask}
                                addTask={addTask}
                                tasks={tasks}
                                toggleTask={toggleTask}
                                deleteTask={deleteTask}
                            />
                        </div>
                    </div>
                </main>
            </div>
            <Footer />

            {/* <AttendanceModal
                openModal={openModal}
                setOpenModal={setOpenModal}
                selectedSchedule={selectedSchedule}
            /> */}

            <EditReminderModal
                editModalOpen={editModalOpen}
                setEditModalOpen={setEditModalOpen}

                editTitle={editTitle}
                setEditTitle={setEditTitle}

                editContent={editContent}
                setEditContent={setEditContent}

                editRangeDate={editRangeDate}
                setEditRangeDate={setEditRangeDate}

                handleEditSave={handleEditSave}

                studentSubjects={studentSubjects}
                editSubject={editSubject}
                setEditSubject={setEditSubject}
            />
        </div>
    );
}
