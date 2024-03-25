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

export function firstCapital(str?: string) {
    if (!str) return str;

    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function difficultyColor(difficulty?: string) {
    switch (difficulty) {
        case 'easy':
            return 'success';
        case 'medium':
            return 'warning';
        case 'hard':
            return 'danger';
        default:
            return 'primary';
    }
}

export type Paginated<T> = {
    items: T[];
    total: number;
    totalPages: number;
    currentPage: number;
}