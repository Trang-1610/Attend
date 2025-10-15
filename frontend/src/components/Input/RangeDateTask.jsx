import { DatePicker, Form } from "antd";

const { RangePicker } = DatePicker;

const InputRangeDateTask = ({
    label="Khoảng thời gian",
    name="dateRange",
    value,
    onChange,

}) => {
    return (
        <Form.Item
            label={label}
            name={name}
            rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu và kết thúc!" }]}
        >
            <RangePicker
                size="large"
                showTime={{ format: "HH:mm" }}
                format="HH:mm DD/MM/YYYY"
                className="w-full"
                onChange={onChange}
                value={value}
            />
        </Form.Item>
    );
}

export default InputRangeDateTask;