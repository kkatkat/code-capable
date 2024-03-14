import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function MaybeShow({children, ...props}: {children: any, exclude?: string[]}) {
    const location = useLocation();
    const [show, setShow] = useState<boolean>(false);

    useEffect(() => {
        if (props.exclude?.includes(recursivelyRemoveLastChar(location.pathname))) {
            setShow(false);
        } else {
            setShow(true);
        }
    }, [location])

    return (
        <>{show && children}</>
    )

    function recursivelyRemoveLastChar(str: string): string {
        if (isNaN(Number(str[str.length - 1]))) {
            return str;
        }

        return recursivelyRemoveLastChar(str.slice(0, str.length - 1));
    }
}