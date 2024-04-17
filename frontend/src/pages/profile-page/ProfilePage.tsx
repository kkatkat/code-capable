import { Link, useNavigate, useParams } from "react-router-dom";
import { User } from "../../entities/user";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../UserProvider";
import { UpdateProfileRequest, deleteOwnAccount, getUserById, updateProfile } from "../../services/user-service";
import defaultPfp from '../../assets/user.png'
import { UserStatistics, getUserStatistics } from "../../services/problem-service";
import SolutionsView from "../problem/SolutionsView";
import NotFoundPage from "../not-found-page/NotFoundPage";
import { Loading } from "../../components/loading/Loading";
import ProblemsPage from "../problems-page/ProblemsPage";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { toast } from "react-toastify";
import { Axios, AxiosError } from "axios";


export default function ProfilePage() {
    const { id } = useParams();
    const { loggedUser, setLoggedUser } = useContext(UserContext);
    const nav = useNavigate();

    const [user, setUser] = useState<User | undefined>(undefined);
    const [statistics, setStatistics] = useState<UserStatistics | undefined>(undefined);
    const [currentView, setCurrentView] = useState<'problems' | 'solutions'>('problems');
    const [loading, setLoading] = useState(true);
    const [dataOverviewDialogOpen, setDataOverviewDialogOpen] = useState(false);
    const [editing, setEditing] = useState(false);
    const [deleteAccountChecked, setDeleteAccountChecked] = useState(false);

    const [newBio, setNewBio] = useState(user?.bio);
    const [newGhUsername, setNewGhUsername] = useState(user?.gitHubUsername);
    const [newLiUsername, setNewLiUsername] = useState(user?.linkedInUsername);
    const [newPassword, setNewPassword] = useState<string | undefined>(undefined);
    const [repeatedNewPassword, setRepeatedNewPassword] = useState<string | undefined>(undefined);
    const [currentPassword, setCurrentPassword] = useState<string | undefined>(undefined);
    

    async function fetchUser() {
        if (!id || isNaN(+id)) return;

        if (loggedUser && +id === loggedUser.id) {
            setUser(loggedUser);
            return;
        }

        await getUserById(+id).then((user) => {
            setUser(user);
        })
    }

    async function fetchUserStatistics() {
        if (!id || isNaN(+id)) return;

        getUserStatistics(+id).then((stats) => {
            setStatistics(stats);
        }).catch(() => {
            setStatistics(undefined);
        })
    }

    async function handleAccountDelete() {
        if (!loggedUser || !id) return;
        if (loggedUser.id !== +id) return;

        await deleteOwnAccount().then(() => {
            setLoggedUser(null);
            window.localStorage.removeItem('accessToken');
            toast.info('Your account has been deleted successfully.');
            nav('/');
        }).catch((error: AxiosError<{ message?: string }>) => {
            toast.error(error.response?.data.message ?? 'An error occurred while deleting your account.');
        })
    }

    async function handleAccountUpdate() {
        if (!loggedUser) return;
        if (newPassword) {
            if (newPassword !== repeatedNewPassword) {
                toast.error("New passwords don't match")
                return;
            }
        }

        const body: UpdateProfileRequest = {
            id: loggedUser.id,
            bio: newBio ?? undefined,
            gitHubUsername: newGhUsername ?? undefined,
            linkedInUsername: newLiUsername ?? undefined,
            password: newPassword ?? undefined,
            oldPassword: currentPassword ?? undefined
        }

        await updateProfile(body).then(() => {
            window.location.reload();
        }).catch((err: AxiosError<{message?: string}>) => {
            toast.error(err.response?.data.message ?? 'Your profile could not be updated at this time. Please try again later');
        } )
    }

    function resetForm() {
        setCurrentPassword(undefined);
        setNewPassword(undefined);
        setRepeatedNewPassword(undefined);
        setNewGhUsername(undefined);
        setNewLiUsername(undefined);
        setNewBio(undefined);
    }

    useEffect(() => {
        setLoading(true);
        fetchUser().finally(() => setLoading(false));
        fetchUserStatistics();
    }, [id])

    if (loading) {
        return <Loading />
    }

    if (!user && !loading) {
        return <NotFoundPage />
    }

    return (
        <>
            <div className="ProfilePage cc-margin">
                <div className="container-lg pt-3">
                    <div className="row gx-2">
                        <div className="col-lg-4">
                            <div className="row">
                                <div className="col-12">
                                    <div className="card shadow-sm border-primary" style={{ transition: 'all 0.5s ease' }}>
                                        <div className="card-body">
                                            <div className="d-flex">
                                                <div className="me-3">
                                                    <img src={user?.pfp ?? defaultPfp} className="rounded-circle" height='70' width='70'></img>
                                                </div>
                                                <div className="flex-fill">
                                                    <h5>{user?.username} {user?.role === 'admin' && <span className="badge bg-primary">CodeCapable staff</span>}</h5>
                                                    {
                                                        editing ?
                                                            <textarea className='form-control w-100 mb-2 shadow-sm' rows={10} placeholder="Short bio" defaultValue={user?.bio} value={newBio} style={{ resize: 'none' }} onChange={(e) => setNewBio(e.target.value)}></textarea>
                                                            :
                                                            <p>{user?.bio ? user.bio : 'Hello world!'}</p>
                                                    }
                                                    {
                                                        !editing &&
                                                        <p><i className="bi bi-calendar2-plus me-2"></i>Joined on {(new Date((user as User).createdAt)).toLocaleDateString('en-GB')}</p>
                                                    }
                                                    {
                                                        user?.gitHubUsername && !editing &&
                                                        <p><i className="bi bi-github me-2"></i>{user?.gitHubUsername}</p>
                                                    }
                                                    {
                                                        user?.linkedInUsername && !editing &&
                                                        <p><i className="bi bi-linkedin me-2"></i>{user?.linkedInUsername}</p>
                                                    }
                                                    {
                                                        editing &&
                                                        <div className="d-flex align-items-center mb-2"><i className="bi bi-github me-2"></i><input className="form-control form-control-sm shadow-sm" type="text" value={newGhUsername} defaultValue={user?.gitHubUsername} placeholder="GitHub username" onChange={(e) => setNewGhUsername(e.target.value)} /></div>
                                                    }
                                                    {
                                                        editing &&
                                                        <div className="d-flex align-items-center"><i className="bi bi-linkedin me-2"></i><input className="form-control form-control-sm shadow-sm" type="text" value={newLiUsername} defaultValue={user?.linkedInUsername} placeholder="LinkedIn username" onChange={(e) => setNewLiUsername(e.target.value)} /></div>
                                                    }
                                                    {
                                                        editing &&
                                                        <>
                                                            <hr />
                                                            <p className="small mb-2">Change password</p>
                                                            <input className="form-control form-control-sm mb-2 shadow-sm" type="password" value={currentPassword} placeholder="Current password" onChange={(e) => {setCurrentPassword(e.target.value)}} />
                                                            <input className="form-control form-control-sm mb-2 shadow-sm" type="password" value={newPassword} placeholder="New password" onChange={(e) => {setNewPassword(e.target.value)}} />
                                                            <input className="form-control form-control-sm shadow-sm" type="password" value={repeatedNewPassword} placeholder="Repeat new password" onChange={(e) => {setRepeatedNewPassword(e.target.value)}} />
                                                        </>

                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {
                                loggedUser && id && loggedUser.id === +id &&
                                <div className="row mt-2 gx-2">
                                    <div className="col-lg-6">
                                        {
                                            editing ?
                                            <button className={`btn btn-success shadow-sm border btn-sm w-100`} onClick={() => { handleAccountUpdate() }}><i className="bi bi-pencil me-2"></i>Save changes</button>
                                            :
                                            <button className={`btn btn-light shadow-sm border btn-sm w-100`} onClick={() => { setEditing(!editing) }}><i className="bi bi-pencil me-2"></i>Edit profile</button>
                                        }
                                    </div>
                                    <div className="col-lg-6 mt-2 mt-lg-0">
                                        {
                                            editing ?
                                                <button className="btn btn-danger shadow-sm border btn-sm w-100" onClick={() => {setEditing(false); resetForm();}}><i className="bi bi-x-circle me-2"></i>Cancel</button>
                                                :
                                                <button className="btn btn-light shadow-sm border btn-sm w-100" onClick={() => setDataOverviewDialogOpen(true)} data-testid='data-overview-button'><i className="bi bi-person-lock me-2"></i>My data overview</button>
                                        }
                                    </div>
                                </div>
                            }
                            {
                                statistics &&
                                <div className="row mt-2">
                                    <div className="col-12">
                                        <div className="card shadow-sm">
                                            <div className="card-header bg-white">
                                                Solved problems
                                            </div>
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <p className="my-1"><i className="bi bi-file-earmark-text text-success me-1"></i>Easy: {statistics.easies}</p>
                                                        <p className="my-1"><i className="bi bi-file-earmark-text text-warning me-1"></i>Medium: {statistics.mediums}</p>
                                                        <p className="my-1"><i className="bi bi-file-earmark-text text-danger me-1"></i>Hard: {statistics.hards}</p>
                                                    </div>
                                                    <div className="text-center me-4">
                                                        <p className="mb-2">Total</p>
                                                        <h3>{statistics.total}</h3>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                        <div className="col-lg-8">
                            <div className="card shadow-sm mt-lg-0 mt-2" style={{ minHeight: '85vh' }}>
                                <div className="card-header bg-white p-1">
                                    <button className={`btn btn-light text-secondary border-0 btn-sm ${currentView === 'problems' ? 'btn-active' : ''} me-1`} onClick={() => { setCurrentView('problems') }}><i className="bi bi-file-earmark-text me-1"></i>Created problems</button>
                                    <button className={`btn btn-light text-secondary border-0 btn-sm ${currentView === 'solutions' ? 'btn-active' : ''} me-1`} onClick={() => { setCurrentView('solutions') }} data-testid='solutions-view-button'><i className="bi bi-lightbulb me-1"></i>Solutions</button>                            </div>
                                <div className="card-body">
                                    {
                                        currentView === 'solutions' && id &&
                                        <SolutionsView problemId={-1} userId={+id} />
                                    }
                                    {
                                        currentView === 'problems' && id &&
                                        <ProblemsPage fullWidth hideSearch creatorId={+id} />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Dialog open={dataOverviewDialogOpen} onClose={() => setDataOverviewDialogOpen(false)} maxWidth='md' fullWidth>
                <DialogContent>
                    <h5 className="fw-normal">Your data at CodeCapable</h5>
                    <p>The safety of your data is our top priority. To learn more about how we handle your data, please refer to the <Link to="/privacy-policy" target="_blank">Privacy Policy</Link>.</p>
                    <hr />
                    <h5 className="fw-normal">TLDR</h5>
                    <p>Here at CodeCapable, we take your privacy seriously. In fact, we follow the principle of 'less is more' when it comes to data storage. Rest assured, we do not store much data. Your personal information is kept to a minimum and only used for essential purposes. We believe in transparency and have a comprehensive Privacy Policy in place to provide you with all the details. So, you can enjoy our services with peace of mind knowing that your data is in safe hands.</p>
                    <p>All data you've submitted to CodeCapable is accessible to you from your profile page.</p>
                    <hr />
                    <h5 className="fw-normal">Delete your account</h5>
                    <p>If you're ready to part ways with CodeCapable, we won't hold it against you. Just remember, deleting your account means saying goodbye to all those unsolved problems and unshared solutions. Are you sure you're ready to let go?</p>
                    <div className="form-check mb-2">
                        <input type="checkbox" className="form-check-input" id="deleteAccountCheckbox" onChange={() => setDeleteAccountChecked(!deleteAccountChecked)} checked={deleteAccountChecked} />
                        <label htmlFor="deleteAccountCheckbox" className="form-check-label">I understand that deleting my account is irreversible and all my data will be lost.</label>
                    </div>
                    <button className="btn btn-danger btn-sm" disabled={!deleteAccountChecked} onClick={() => { if (confirm('Are you sure?')) { handleAccountDelete() } }}>Delete my account forever</button>
                </DialogContent>
            </Dialog>
        </>
    )
}