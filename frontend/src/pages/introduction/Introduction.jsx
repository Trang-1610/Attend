import { useEffect } from "react";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";
import { useTranslation } from "react-i18next";
import BreadcrumbIntroduction from "../../components/Breadcrumb/Introduction";
import CardIntroductionProject from "../../components/Cards/IntroductionProject";
import CardMemberProject from "../../components/Cards/MemberProject";

export default function AboutProjectPage() {
    const { t } = useTranslation();

    useEffect(() => {
        document.title = t("project and member introduction") + " - ATTEND 3D";
    }, [t]);

    return (
        <div className="min-h-screen flex flex-col bg-white text-gray-800 dark:bg-black dark:text-white">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex-grow">
                <Header />
                <main className="mt-8 flex flex-col items-center w-full">
                    <div className="w-full mb-4">
                        <BreadcrumbIntroduction t={t} />
                    </div>
                    <div className="w-full mt-4">
                        <CardIntroductionProject t={t} />
                    </div>
                    <div className="w-full mt-4">
                        <CardMemberProject />
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}