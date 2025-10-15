import { Form, DatePicker } from 'antd';
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const InputDateLeave = ({
    label = "Thời gian nghỉ phép",
    name = "rangeDate",
    leaveData
}) => {
    return (
        <Form.Item
            label={label}
            name={name}
            rules={[
                { required: true, message: 'Vui lòng chọn thời gian nghỉ phép!' },
                {
                    validator(_, value) {
                        if (!value || value.length !== 2) {
                            return Promise.reject(
                                new Error('Vui lòng chọn cả ngày bắt đầu và ngày kết thúc!')
                            );
                        }

                        const [start, end] = value;

                        // If start or end is null
                        if (!start || !end) {
                            return Promise.reject(
                                new Error('Vui lòng chọn cả ngày bắt đầu và ngày kết thúc!')
                            );
                        }

                        const today = dayjs().startOf('day');

                        // Days before today are not allowed to be selected as start or end
                        if (start.isBefore(today, 'day') || end.isBefore(today, 'day')) {
                            return Promise.reject(
                                new Error('Ngày nghỉ phép phải lớn hơn hoặc bằng ngày hôm nay!')
                            );
                        }

                        // Start date must be before end date
                        if (end.isBefore(start, 'day')) {
                            return Promise.reject(
                                new Error('Ngày kết thúc phải sau ngày bắt đầu!')
                            );
                        }

                        // Check by day of week
                        if (leaveData && leaveData?.day_of_week) {
                            const mapDayOfWeek = {
                                2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 0
                            };
                            const requiredDay = mapDayOfWeek[leaveData?.day_of_week];

                            if (start.day() !== requiredDay || end.day() !== requiredDay) {
                                return Promise.reject(
                                    new Error(
                                        `Ngày bắt đầu/kết thúc phải rơi vào thứ ${leaveData?.day_of_week}!`
                                    )
                                );
                            }
                        }

                        // Check by semester
                        if (leaveData?.start_date_semester && leaveData?.end_date_semester) {
                            const startSemester = dayjs(leaveData?.start_date_semester);
                            const endSemester = dayjs(leaveData?.end_date_semester);

                            if (
                                start.isBefore(startSemester, 'day') ||
                                end.isAfter(endSemester, 'day')
                            ) {
                                return Promise.reject(
                                    new Error(
                                        `Ngày nghỉ phải nằm trong khoảng ${startSemester.format(
                                            'DD/MM/YYYY'
                                        )} - ${endSemester.format('DD/MM/YYYY')}`
                                    )
                                );
                            }
                        }

                        return Promise.resolve();
                    },
                },
            ]}
        >
            <RangePicker
                showTime={{ format: 'HH:mm' }}
                allowEmpty={[true, true]}
                size="large"
                format="HH:mm DD/MM/YYYY"
                className="w-full"
                style={{ borderWidth: 1.5, boxShadow: 'none' }}
                disabledDate={(current) => {
                    return current && current < dayjs().startOf('day');
                }}
            />
        </Form.Item>
    );
}

export default InputDateLeave