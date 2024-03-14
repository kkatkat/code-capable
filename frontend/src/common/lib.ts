import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function scrollToTop() {
    window.scrollTo(0, 0);
}

export function useScrollToTop() {
    useEffect(() => {
        scrollToTop();
    }, []);
}

export function useGoBack() {
    const nav = useNavigate();
    
    return () => {
        nav(-1);
    }
}