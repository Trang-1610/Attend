import { Modal, Form } from "antd";
import FormEditTask from "../Form/EditTask";

export default function ModelEditReminder({
    editModalOpen,
    setEditModalOpen,
    editTitle,
    setEditTitle,
    editContent,
    setEditContent,
    editRangeDate,
    setEditRangeDate,
    handleEditSave,
    studentSubjects,
    setEditSubject,
    editSubject
}) {
    const [form] = Form.useForm();

    return (
        <Modal
            title="Chỉnh sửa nhắc nhở"
            open={editModalOpen}
            onCancel={() => setEditModalOpen(false)}
            onOk={() => form.submit()}
        >
            <FormEditTask
                form={form}
                editTitle={editTitle}
                setEditTitle={setEditTitle}
                editContent={editContent}
                setEditContent={setEditContent}
                editRangeDate={editRangeDate}
                setEditRangeDate={setEditRangeDate}
                editSubject={editSubject}
                setEditSubject={setEditSubject}
                studentSubjects={studentSubjects}
                handleEditSave={handleEditSave}
            />
        </Modal>
    );
}