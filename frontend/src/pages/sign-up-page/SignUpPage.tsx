import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserProvider';
import './SignUpPage.css'
import { toast } from 'react-toastify';
import { RegisterRequest, register } from '../../services/user-service';
import { AxiosError } from 'axios';

function SignUpPage() {

    const [email, setEmail] = useState();
    const [username, setUsername] = useState();
    const [pwd, setPwd] = useState();
    const [confirmPwd, setConfirmPwd] = useState();
    const [acceptedTermsAndConditions, setAcceptedTermsAndConditions] = useState(false);

    const [errMsg, setErrMesg] = useState<string[]>();

    const { loggedUser, setLoggedUser } = useContext(UserContext);
    const nav = useNavigate();

    useEffect(() => {
        if (loggedUser) {
            nav('/');
        }

        setErrMesg([]);
    }, [email, pwd, username])

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (pwd !== confirmPwd) {
            setErrMesg(['Passwords do not match']);
            return;
        }

        if (!acceptedTermsAndConditions) {
            setErrMesg(['You must accept the terms and conditions']);
            return;
        }

        const registerRequest: RegisterRequest = {
            username,
            email,
            password: pwd,
            acceptedTermsAndConditions
        }

        await register(registerRequest).then(() => {
            toast.success(`Welcome on board, ${username}! You can log in now.`);
            nav('/login');
        }).catch((error: AxiosError<{ message: string | string[] }>) => {
            console.log(error);
            const msg = error.response?.data.message;

            if (Array.isArray(msg)) {
                setErrMesg(msg);
                return;
            }

            setErrMesg([msg as string]);
        })

    }


    return (
        <div className="SignUpPage" style={{marginTop: '7rem'}}>
            <main className="d-flex" id="mainSignUp">
                <div className="container m-auto">
                    <div className="row justify-content-md-center">
                        <div className="col-lg-4">
                            <form method="post" className="card border-primary pt-3 p-4 shadow rounded-3 needs-validation" onSubmit={handleSubmit}>
                                <div className="card-body">
                                    <h3 className="card-title text-center mb-5">Sign up</h3>
                                    <p className="field-validation-error mb-3 text-danger">
                                        <ul>
                                            {
                                                errMsg?.map((msg) => {
                                                    return <li>{msg.charAt(0).toUpperCase() + msg.slice(1)}</li>
                                                })

                                            }
                                        </ul>
                                    </p>
                                    <div className="row">
                                        <div>
                                            <label asp-for="SignUpUser.FirstName" className="form-label">Username</label>
                                            <input type="text" id="firstname" className="form-control" onChange={(e: any) => { setUsername(e.target.value) }} autoComplete='off' required />
                                            <span asp-validation-for="SignUpUser.FirstName"></span>
                                        </div>
                                    </div>
                                    <div>
                                        <label asp-for="SignUpUser.Email" className="form-label mt-4">Email</label>
                                        <input type="email" id="email" className="form-control" onChange={(e: any) => { setEmail(e.target.value) }} autoComplete='off' required />
                                        <span asp-validation-for="SignUpUser.Email"></span>
                                    </div>
                                    <div>
                                        <label asp-for="SignUpUser.Password" className="form-label mt-4">Password</label>
                                        <input type="password" id="inputPassword" className="form-control mb-1" onChange={(e: any) => { setPwd(e.target.value) }} autoComplete='off' required />
                                        <span asp-validation-for="SignUpUser.Password"></span>
                                    </div>
                                    <div>
                                        <label asp-for="ConfirmPwd" className="form-label mt-4">Confirm password</label>
                                        <input type="password" id="confirmPassword" className="form-control" onChange={(e: any) => { setConfirmPwd(e.target.value) }} autoComplete='off' required />
                                        <span asp-validation-for="ConfirmPwd"></span>
                                    </div>
                                    <div>
                                        <div className="form-check mt-4">
                                            <input className="form-check-input" type="checkbox" value='' onChange={(e: any) => { setAcceptedTermsAndConditions(e.target.checked) }} />
                                            <label className="form-check-label">I accept the <Link to='/privacy-policy' target='_blank'>terms and conditions</Link>.</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer bg-white text-center py-4 mt-3">
                                    <div className="d-grid">
                                        <input type="submit" name="submit" className="btn btn-primary px-5" value="Sign up" />
                                    </div>
                                    <div className="d-grid pt-3">
                                        <Link to='/login' className="btn btn-outline-primary px-5">Already have an account? Log in</Link>
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

export default SignUpPage;