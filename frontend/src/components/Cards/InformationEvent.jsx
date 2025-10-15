import { Card, Typography } from "antd";
import FormAddEvent from "../Form/AddEvent";

const { Title } = Typography;

const CardInformationEvent = ({ form, onFinish, studentSubjects, selectedSubject, reminderData, t }) => {
    return (
        <Card title={<Title level={3}>{t("create event information")}</Title>} className="p-2">
            <FormAddEvent
                form={form}
                onFinish={onFinish}
                studentSubjects={studentSubjects}
                selectedSubject={selectedSubject}
                reminderData={reminderData}
                t={t}
            />
        </Card>
    );
};

export default CardInformationEvent;