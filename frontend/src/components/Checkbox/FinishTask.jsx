import { Checkbox, Typography } from "antd";

const { Text } = Typography;

const FinishTask = ({ taskDone, taskId, toggleTask, taskTile }) => {
    return (
        <Checkbox
            checked={taskDone}
            onChange={() => toggleTask(taskId)}
        >
            <Text delete={taskDone}>{taskTile}</Text>
        </Checkbox>
    );
}

export default FinishTask