import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PromoBanner from "./PromoBanner";

export type LayoutProps = {
    isClose: boolean;
    onClose: (isClose: boolean) => void;
    message: string;
    handleClear: () => void;
    isVisible: boolean;

};

export default function Layout({ onClose, isClose, message, handleClear, isVisible}: LayoutProps){
    const currentPromoBanner = <PromoBanner message={message} handleClear={handleClear} />;
    return (
        <>
            <Navbar isClose={isClose} onClose={onClose} />
            {isVisible ? currentPromoBanner : undefined}
            <Outlet />
            <Footer />
        </>
    )
}