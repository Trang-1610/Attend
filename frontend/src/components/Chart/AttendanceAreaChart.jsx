import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AttendanceAreaChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%" className={'p-4'}>
        <AreaChart data={data}>
            <XAxis dataKey="class_name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="total_sessions" stroke="#0ea5e9" fill="#bae6fd" />
            <Area type="monotone" dataKey="present_sessions" stroke="#22c55e" fill="#bbf7d0" name="Có mặt" />
            <Area type="monotone" dataKey="late_sessions" stroke="#f97316" fill="#fed7aa" name="Đi muộn" />
            <Area type="monotone" dataKey="absent_sessions" stroke="#ef4444" fill="#fecaca" name="Vắng" />
        </AreaChart>
    </ResponsiveContainer>
  );
}