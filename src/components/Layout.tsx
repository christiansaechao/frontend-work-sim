import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PromoBanner from "./PromoBanner";
import type { Theme } from "../App";

export type LayoutProps = {
    theme: Theme;
    favourites: number[];
    onThemeChange: (theme: Theme) => void;
    isClose: boolean;
    onClose: (isClose: boolean) => void;
    message: string;
    handleClear: () => void;
    isVisible: boolean;

};

export default function Layout({ favourites, theme, onThemeChange,  onClose, isClose, message, handleClear, isVisible}: LayoutProps){
    const currentPromoBanner = <PromoBanner message={message} handleClear={handleClear} />;
    return (
        <>
            <Navbar theme={theme} favourites={favourites} isClose={isClose} onClose={onClose} onThemeChange={onThemeChange}  />
            {isVisible ? currentPromoBanner : undefined}
            <Outlet />
            <Footer />
        </>
    )
}