import { useContext, useEffect, useState } from 'react'
import './App.css'
import { UserContext } from './UserProvider';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import HomePage from './pages/homepage/HomePage';
import Footer from './components/footer/Footer';
import NavBar from './components/navbar/NavBar';
import PrivacyPolicyPage from './pages/privacy-policy-page/PrivacyPolicyPage';
import LoginPage from './pages/login-page/LoginPage';
import 'react-toastify/dist/ReactToastify.css';
import { checkToken } from './services/user-service';
import NotFoundPage from './pages/not-found-page/NotFoundPage';
import SignUpPage from './pages/sign-up-page/SignUpPage';
import CreateProblemPage from './pages/create-problem-page/CreateProblemPage';


function App() {
    const { loggedUser, setLoggedUser } = useContext(UserContext);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function checkJwt() {
            if (window.localStorage.getItem('accessToken') === null) {
                setLoggedUser(null);
                setLoading(false);
                return;
            }

            await checkToken().then((res) => {
                console.log(res);
                setLoggedUser(res.user);
            }).catch(() => {
                setLoggedUser(null);

                if (window.localStorage.getItem('accessToken') !== null) {
                    toast.info('Your session has expired. Please log in again.')
                }

                window.localStorage.removeItem('accessToken');
            })
            setLoading(false);

        }
        checkJwt();
    }, [])

    return (
        <>
            <div className='App'>
                <body>
                    <BrowserRouter>
                        <div className='wrapper'>
                            <header className='header'>
                                <NavBar />
                            </header>
                            <Routes>
                                <Route path='/' element={<HomePage />} />
                                <Route path='/privacy-policy' element={<PrivacyPolicyPage />} />
                                <Route path='/login' element={<LoginPage />} />
                                <Route path='/signUp' element={<SignUpPage/>} />
                                <Route path='/create-problem' element={<CreateProblemPage/>}/>
                                <Route path='*' element={<NotFoundPage/>} />
                            </Routes>
                        </div>
                        <footer className='footer'>
                            <Footer />
                        </footer>
                    </BrowserRouter>
                    <ToastContainer position='top-center' hideProgressBar={true} />
                </body>
            </div>
        </>
    )
}

export default App
