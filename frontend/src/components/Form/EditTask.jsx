import { Form } from "antd";
import InputTitleTask from "../Input/TitleTask";
import InputContentTask from "../Input/ContentTask";
import InputRangeDateTask from "../Input/RangeDateTask";
import InputChooseSubject from "../Input/ChooseSubject";

const FormEditTask = ({ 
    form,
    editTitle,
    setEditTitle,
    editContent,
    setEditContent,
    editRangeDate,
    setEditRangeDate,
    editSubject,
    setEditSubject,
    studentSubjects,
    handleEditSave
}) => {
    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={{
                title: editTitle,
                content: editContent,
                dateRange: editRangeDate,
                subject: editSubject,
            }}
            onFinish={handleEditSave}
        >
            <InputTitleTask
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
            />

            <InputContentTask
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
            />

            <InputRangeDateTask
                value={editRangeDate}
                onChange={(val) => setEditRangeDate(val)}
            />

            <InputChooseSubject
                studentSubjects={studentSubjects}
                onChange={(val) => setEditSubject(val)}
            />
        </Form>
    );
}

export default FormEditTask