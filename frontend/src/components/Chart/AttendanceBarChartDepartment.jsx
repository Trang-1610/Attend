import React from "react";
import {
    BarChart as ReBarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend,
} from "recharts";

export default function AttendanceBarChartDepartment({ data }) {
    return (
        <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
                <ReBarChart
                    data={data}
                    margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject_name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="department_name" fill="#3b82f6" name="Khoa" />
                    <Bar dataKey="present_sessions" fill="#22c55e" name="Có mặt" />
                    <Bar dataKey="late_sessions" fill="#f97316" name="Đi muộn" />
                    <Bar dataKey="absent_sessions" fill="#ef4444" name="Vắng" />
                </ReBarChart>
            </ResponsiveContainer>
        </div>
    );
}