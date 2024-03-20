import { useEffect, useState, useContext } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './LogInPage.css';
import { UserContext } from '../../UserProvider';
import { toast } from 'react-toastify';
import { login } from '../../services/user-service';
import { AxiosError } from 'axios';
import { useScrollToTop } from '../../common/lib';
import { Divider } from '@mui/material';

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;

function LogInPage() {
    useScrollToTop();
    const [username, setUsername] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [errMsg, setErrMesg] = useState('');

    const {loggedUser, setLoggedUser} = useContext(UserContext);
    const nav = useNavigate();

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        await login({username, password: userPassword})
        .then((res) => {
            setLoggedUser(res.user);
            window.localStorage.setItem('accessToken', res.accessToken);
            toast.success(`Welcome back, ${res.user.username}`, {autoClose: 2000})
            nav('/');
        })
        .catch((error: AxiosError) => {
            if (error.response?.status === 401) {
                setErrMesg('Wrong username or password');
            } else {
                setErrMesg('An error occurred');
            }
        })

    }

    useEffect(() => {
        if (loggedUser) {
            nav('/');
        }   
    }, [loggedUser])

    useEffect(() => {
        setErrMesg('');
    }, [username, userPassword])


    return (
        <div className="LogInPage" style={{marginTop: '10rem'}}> 
            <main className="d-flex" id="mainSignUp">
                <div className="container m-auto">
                    <div className="row justify-content-md-center">
                        <div className="col-lg-4">
                            <form className="card border-primary pt-3 p-4 shadow rounded-3 needs-validation" onSubmit={handleSubmit}>
                                <div className="card-body">
                                    <h3 className="card-title text-center mb-5">Log in</h3>
                                    <p className="field-validation-error text-center mb-3 text-danger">{errMsg}</p>
                                    <div>
                                        <label className="form-label mt-1">Username</label>
                                        <input type="text" id="username" className="form-control" autoComplete='off' onChange={(e) => setUsername(e.target.value)} value={username} required/>
                                    </div>
                                    <div>
                                        <label className="form-label mt-4">Password</label>
                                        <input type="password" id="inputPassword" className="form-control mb-1" onChange={(e) => setUserPassword(e.target.value)} value={userPassword} required />
                                    </div>
                                    <div>
                                        <div className="form-check mt-4">
                                            <input className="form-check-input" type="checkbox" value='' />
                                            <label className="form-check-label">Keep me logged in</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer bg-white text-center py-4 border-0">
                                    <div className="d-grid">
                                        <input type="submit" name="submit" className="btn btn-primary px-5" value="Log in" />
                                    </div>
                                    <Divider sx={{marginY: '0.5rem'}}>or</Divider>
                                    <div className="d-grid">
                                        <Link to="/signup" className="btn btn-outline-primary px-5">Sign up with email</Link>
                                    </div>
                                    <div className="d-grid pt-3">
                                        <Link to={`https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=user:email`} className="btn btn-outline-dark px-5"><i className="bi bi-github me-2"></i>Sign in with GitHub</Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>  
        </div>

    )
}

export default LogInPage;