import { useEffect } from "react";

export function scrollToTop() {
    window.scrollTo(0, 0);
}

export function useScrollToTop() {
    useEffect(() => {
        scrollToTop();
    }, []);
}