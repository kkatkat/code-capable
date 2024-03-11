import { useContext, useEffect } from 'react'
import './App.css'
import { UserContext } from './UserProvider';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import HomePage from './pages/homepage/HomePage';
import Footer from './components/footer/Footer';
import NavBar from './components/navbar/NavBar';

function App() {
    const { loggedUser, setLoggedUser } = useContext(UserContext);

    return (
        <>
            <div className='App'>
                <body>
                    <BrowserRouter>
                        <div className='wrapper'>
                            <header className='header'>
                                <NavBar/>
                            </header>
                            <Routes>
                                <Route path='/' element={<HomePage/>} />
                                {/* <Route path='/login' element={<LoginPage/>}/> */}
                            </Routes>
                        </div>
                        <footer className='footer'>
                            <Footer/>
                        </footer>
                    </BrowserRouter>
                    <ToastContainer />
                </body>
            </div>
        </>
    )
}

export default App
