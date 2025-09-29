import React from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-black text-gray-800 dark:text-white">
            <Header />
            <main className="flex-1 overflow-auto">
                {children}
            </main>
            <Footer />
        </div>
    );
}