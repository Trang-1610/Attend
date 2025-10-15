import { Form, DatePicker } from "antd";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const InputRangeDateEvent = ({ t, reminderData, selectedSubject }) => {
    return (
        <Form.Item
            label={t("event reminder time")}
            name="rangeDate"
            rules={[
                { required: true, message: t("please select a time") },
                {
                    validator: (_, value) => {
                        if (!value || !reminderData) return Promise.resolve();

                        const [start, end] = value;
                        if (!start || !end) return Promise.resolve();

                        const { day_of_week, lesson_start, semester_start_date, semester_end_date } = reminderData;
                        const semesterStart = dayjs(semester_start_date);
                        const semesterEnd = dayjs(semester_end_date);

                        if (start.isBefore(semesterStart) || start.isAfter(semesterEnd)) {
                            return Promise.reject(new Error("Ngày bắt đầu phải nằm trong học kỳ."));
                        }
                        if (end.isBefore(semesterStart) || end.isAfter(semesterEnd)) {
                            return Promise.reject(new Error("Ngày kết thúc phải nằm trong học kỳ."));
                        }

                        const endDay = end.day() === 0 ? 8 : end.day() + 1;
                        if (endDay !== day_of_week) {
                            return Promise.reject(new Error(`Ngày kết thúc phải rơi vào thứ ${day_of_week}`));
                        }

                        const endLimit = dayjs(end.format("YYYY-MM-DD") + " " + lesson_start);
                        if (!end.isBefore(endLimit)) {
                            return Promise.reject(new Error(`Ngày kết thúc phải trước ${lesson_start}`));
                        }

                        if (!start.isBefore(end)) {
                            return Promise.reject(new Error("Ngày bắt đầu phải nhỏ hơn ngày kết thúc."));
                        }
                        if (end.diff(start, "minute") < 60) {
                            return Promise.reject(new Error("Khoảng thời gian sự kiện phải ít nhất 1 giờ."));
                        }

                        return Promise.resolve();
                    },
                },
            ]}
        >
            <RangePicker
                showTime={{ format: "HH:mm" }}
                disabled={!selectedSubject}
                size="large"
                format="HH:mm DD/MM/YYYY"
                className="w-full"
                style={{ borderWidth: 1.5, boxShadow: "none" }}
                placeholder={[t("start date"), t("end date")]}
                disabledDate={(current) => current && current < dayjs().startOf("day")}
            />
        </Form.Item>
    );
};

export default InputRangeDateEvent;