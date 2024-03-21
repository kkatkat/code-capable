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

export function truncateString(str: string, length: number) {
    return str.length > length ? str.substring(0, length) + '...' : str;
}

export type Paginated<T> = {
    items: T[];
    total: number;
    totalPages: number;
    currentPage: number;
}