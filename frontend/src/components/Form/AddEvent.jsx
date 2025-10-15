import { Form, Typography } from "antd";
import SelectSubject from "../Input/ChooseSubjectLeave";
import InputLecturerDisable from "../Input/LecturerDisable";
import InputRoomDisable from "../Input/RoomDisable";
import InputTitleEvent from "../Input/TitleEvent";
import InputContentEvent from "../Input/ContentEvent";
import InputRangeDateEvent from "../Input/RangeDateEvent";
import InputTypeInformation from "../Input/TypeInformation";
import ButtonSendEvent from "../Button/ButtonSendEvent";

const { Title } = Typography;

const FormAddEvent = ({
    t,
    onFinish,
    form,
    studentSubjects,
    selectedSubject,
    reminderData
}) => {
    return (
        <Form
            form={form}
            initialValues={{ variant: 'filled', emailNotification: 1 }}
            layout="vertical"
            name="formCreateEvent"
            autoComplete="off"
            onFinish={onFinish}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4">
                    <Title level={4}>{t("subject information")}</Title>
                    <SelectSubject
                        studentSubjects={studentSubjects}
                        t={t}
                    />
                    <InputLecturerDisable />
                    <InputRoomDisable t={t} />
                    <InputRoomDisable t={t} />
                </div>

                <div className="p-4">
                    <Title level={4}>{t("event information")}</Title>
                    <InputTitleEvent t={t} />
                    <InputContentEvent t={t} />
                    <InputRangeDateEvent
                        t={t}
                        reminderData={reminderData}
                        selectedSubject={selectedSubject}
                    />
                    <InputTypeInformation t={t} />
                </div>
            </div>
            <ButtonSendEvent t={t} />
        </Form>
    );
};

export default FormAddEvent;