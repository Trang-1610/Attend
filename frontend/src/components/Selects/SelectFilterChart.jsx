import React from "react";
import { Select } from "antd";

const { Option } = Select;

export default function SelectFilterChart({loadingAcademicYear, loadingSemester, academicYear, semesters, selectedYear, setSelectedYear, selectedSemester, setSelectedSemester}) {
    return (
        <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
            <Select
                placeholder="Chọn năm học"
                className="w-full sm:w-44 custom-select"
                size="middle"
                loading={loadingAcademicYear}
                value={selectedYear}
                onChange={(value) => setSelectedYear(value)}
            >
                {academicYear.map((year) => (
                    <Option key={year?.academic_year_id} value={year?.academic_year_id}>
                        {year?.academic_year_name}
                    </Option>
                ))}
            </Select>
            <Select
                placeholder="Chọn học kỳ"
                className="w-full sm:w-41 custom-select"
                size="middle"
                loading={loadingSemester}
                value={selectedSemester}
                onChange={(value) => setSelectedSemester(value)}
            >
                {semesters.map((semester) => (
                    <Option key={semester.semester_id} value={semester.semester_id}>
                        {semester.semester_name}
                    </Option>
                ))}
            </Select>
        </div>
    )
}