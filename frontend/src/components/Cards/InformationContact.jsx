import { Card, Typography } from "antd";
import FormAddContact from "../Form/AddContact";

const { Title } = Typography;

const CardInformationContact = ({ 
    t,
    form,
    onFinish,
    handleContactTypeChange,
    contactType,
    subjects,
    setSelectedSubject,
    selectedLecturerInfo,
    setSelectedLecturerInfo,
    loading
}) => {
    return (
        <Card
            title={
                <Title level={3} className="text-start">
                    {t("send contact information")}
                </Title>
            }
            className="p-6"
        >
            <FormAddContact 
                t={t} 
                form={form}
                onFinish={onFinish}
                handleContactTypeChange={handleContactTypeChange}
                contactType={contactType}
                subjects={subjects}
                setSelectedSubject={setSelectedSubject}
                selectedLecturerInfo={selectedLecturerInfo}
                setSelectedLecturerInfo={setSelectedLecturerInfo}
                loading={loading}
            />
        </Card>
    );
};

export default CardInformationContact;