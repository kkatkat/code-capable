import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "react-toastify";
import { gitHubLogin } from "../../services/user-service";
import { UserContext } from "../../UserProvider";
import { AxiosError } from "axios";
import { Loading } from "../../components/loading/Loading";


export default function LoggedInPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const {loggedUser, setLoggedUser} = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const nav = useNavigate();

    async function handleCodeReceived() {
        const code = searchParams.get('code');

        if (!code) {
            toast.error('Logging in failed. Please try again.')
            return;
        }

        gitHubLogin(code).then((res) => {
            setLoggedUser(res.user);
            window.localStorage.setItem('accessToken', res.accessToken);
            toast.success(`Welcome back, ${res.user.username}`, {autoClose: 2000})
            nav('/');
        })
        .catch((error: AxiosError<{message?: string}>) => {
            toast.error(error.response?.data.message, {autoClose: false})
        }).finally(() => {
            setLoading(false);
        })

    }

    useEffect(() => {
        handleCodeReceived();
    }, [])

    if (loading) {
        return <Loading/>
    }

    return (
        <></>
    )
}