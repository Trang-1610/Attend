import { Form, message } from "antd";
import SelectSubjectLeave from "../Input/ChooseSubjectLeave";
import InputLecturerDisable from "../Input/LecturerDisable";
import InputReasonLeave from "../Input/ResonLeave";
import InputDateLeave from "../Input/DateLeave";
import InputImageProving from "../Input/ImageProving";
import ButtonSubmit from "../Button/ButtonSubmit";
import CardPreviewFormLeave from "../Cards/PreviewFormLeave";

const FormAddLeave = ({
    form,
    onFinish,
    studentSubjects,
    leaveData,
    loading,
    personalLeave,
    formattedDate,
    t
}) => {
    return (
        <Form
            form={form}
            encType="multipart/form-data"
            initialValues={{ variant: 'filled', emailNotification: 1 }}
            layout="vertical"
            className="w-full"
            onFinish={onFinish}
            onFinishFailed={(errorInfo) => {
                console.log("Failed:", errorInfo);
                message.error("Vui lòng điền đầy đủ và chính xác thông tin!");
            }}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <SelectSubjectLeave 
                        studentSubjects={studentSubjects} 
                        t={t}
                    />
                    <InputLecturerDisable />
                    <InputReasonLeave />
                    <InputDateLeave 
                        leaveData={leaveData}
                    />
                    <InputImageProving />
                    <ButtonSubmit 
                        loading={loading}
                    />
                </div>
                <CardPreviewFormLeave
                    leaveData={leaveData}
                    personalLeave={personalLeave}
                    formattedDate={formattedDate}
                />
            </div>
        </Form>
    );
}

export default FormAddLeave