import { Form, Col, Row } from "antd";
import InputObjectContact from "../Input/ObjectContact";
import InputSubjectContact from "../Input/SubjectContact";
import InputLecturerDisable from "../Input/TeacherDisable";
import SubCardInformationContact from "../Cards/SubInformationContact";
import InputContentContact from "../Input/ContentEvent";
import ButtonSubmit from "../Button/ButtonSubmit";

const FormAddContact = ({ 
    form, 
    onFinish, 
    handleContactTypeChange, 
    t,
    contactType,
    subjects,
    setSelectedSubject,
    selectedLecturerInfo,
    setSelectedLecturerInfo,
    loading
}) => {
    return (
        <Form
            form={form}
            name="contact_form"
            layout="vertical"
            method="POST"
            autoComplete="off"
            onFinish={onFinish}
        >
            <Row gutter={24}>
                <Col xs={24} md={24}>
                    <InputObjectContact
                        handleContactTypeChange={handleContactTypeChange}
                        t={t}
                    />
                </Col>
            </Row>
            {contactType === "lecturer" && (
                <Row gutter={24}>
                    <Col xs={24} md={12}>
                        <InputSubjectContact
                            t={t}
                            subjects={subjects}
                            setSelectedSubject={setSelectedSubject}
                            setSelectedLecturerInfo={setSelectedLecturerInfo}
                            form={form}
                        />

                        <InputLecturerDisable t={t} />
                    </Col>
                    <Col xs={24} md={12}>
                        <SubCardInformationContact
                            t={t}
                            selectedLecturerInfo={selectedLecturerInfo}
                        />
                    </Col>
                </Row>
            )}
            <InputContentContact t={t} />
            <ButtonSubmit loading={loading} />
        </Form>
    )
};

export default FormAddContact;