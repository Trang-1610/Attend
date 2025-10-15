import { Card } from "antd";
import DescriptionsDetailObjectContact from "../Descriptions/DetailObjectContact";

const SubCardInformationContact = ({ t, selectedLecturerInfo }) => {
    return (
        <Card size="small" title={t("lecturer information")} className="h-full">
            {selectedLecturerInfo ? (
                <DescriptionsDetailObjectContact
                    t={t}
                    selectedLecturerInfo={selectedLecturerInfo}
                />
            ) : (
                <p>{t("please select a lecturer to view information")}</p>
            )}
        </Card>
    );
};

export default SubCardInformationContact;