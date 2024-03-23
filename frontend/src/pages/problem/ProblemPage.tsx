import { Link, useNavigate, useParams } from "react-router-dom";
import { useGoBack } from "../../common/lib"
import logo from '../../assets/logo_cc.png'
import { useContext, useEffect, useState } from "react";
import { Problem } from "../../entities/problem";
import { approveProblem, deleteProblem, getUserSubmissions, getProblembyId } from "../../services/problem-service";
import NotFoundPage from "../not-found-page/NotFoundPage";
import { UserContext } from "../../UserProvider";
import { DescriptionView } from "./DescriptionView";
import { Loading } from "../../components/loading/Loading";
import { toast } from "react-toastify";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { CodeEditor } from "./right-side/CodeEditor";
import { runCode } from "../../services/runner-service";
import { AxiosError } from "axios";
import SubmissionsView from "./SubmissionsView";
import { Solution } from "../../entities/solution";
import SolutionsView from "./SolutionsView";
import { User } from "../../entities/user";
import { getUserById } from "../../services/user-service";

export function ProblemPage() {
    const { id } = useParams();
    const goBack = useGoBack();
    const { loggedUser } = useContext(UserContext);
    const nav = useNavigate();

    const [problemCreator, setProblemCreator] = useState<User>({} as User);

    const [currentView, setCurrentView] = useState<'description' | 'solutions' | 'submissions'>('description');
    const [problem, setProblem] = useState<Problem>();
    const [notFound, setNotFound] = useState(false);
    const [loading, setLoading] = useState(true);
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
    const [confirmViewSolutionsDialogOpen, setConfirmViewSolutionsDialogOpen] = useState(false);
    const [viewSolutionsConfirmed, setViewSolutionsConfirmed] = useState(false);

    const [running, setRunning] = useState(false);
    const [output, setOutput] = useState('');
    const [error, setError] = useState(false);
    const [codeValue, setCodeValue] = useState('');
    const [success, setSuccess] = useState(false);
    const [userSubmissions, setUserSubmissions] = useState<Solution[]>([]);

    async function fetchProblem() {
        setLoading(true);
        await getProblembyId(+(id as string)).then((prob) => {
            setProblem(prob);
        }).catch(() => {
            setNotFound(true);
        }).finally(() => {
            setLoading(false);
        })
    }

    async function fetchProblemCreator() {
        if (!problem) return;
        if (loggedUser && problem.creatorId === loggedUser.id) {
            setProblemCreator(loggedUser);
            return;
        }
        
        await getUserById(problem.creatorId).then((user) => {
            setProblemCreator(user);
        })
    }

    async function fetchSubmissions() {
        if (!loggedUser) return;
        if (!problem) return;

        await getUserSubmissions(loggedUser?.id as number, +(id as string)).then((submissions) => {
            setUserSubmissions(submissions);
        }).catch(() => {
            toast.error('Failed to fetch user submissions');
        })
    }

    async function handleApprove() {
        approveProblem(problem?.id as number).then(() => {
            fetchProblem();
            toast.success('Problem has been approved')
        }).catch(() => {
            toast.error('Failed to approve problem')
        })
    }

    async function handleDelete() {
        deleteProblem(problem?.id as number).then(() => {
            nav('/')
            toast.success('Problem has been deleted')
        }).catch(() => {
            toast.error('Failed to delete problem')
        })
    }

    function handleSolutionsClick() {
        if (!userSubmissions || userSubmissions.length === 0) {
            if (!viewSolutionsConfirmed) {
                setConfirmViewSolutionsDialogOpen(true);
            } else {
                setCurrentView('solutions');
            }
        } else {
            setCurrentView('solutions');
        }
    }

    function run(submit: boolean = false, codeValue: string) {
        if (!codeValue.trim()) {
            toast.error('The code you provided is empty');
            return;
        }

        //setSubmitted(false);
        setRunning(true);
        
        runCode({ code: codeValue, problemId: problem?.id as number, submit }).then((res) => {
            console.log(res);
            setOutput(res.output?.join('\n') || '');
            setError(res.error || false);
            
            if (!res.error) {
                setSuccess(true);

                if (submit && res.submitted) {
                    toast.success('Your solution has been submitted!');
                    setTimeout(() => fetchSubmissions(), 2000);
                    setCurrentView('submissions');
                }
            } else {
                setSuccess(false);
            }

        }).catch((error: AxiosError<{message?: string}>) => {
            if (error.response?.data.message) {
                toast.error(error.response.data.message);
                setSuccess(false);
            } else {
                toast.error('Failed to run the code');
            }
        }).finally(() => {
            setRunning(false);
        })

    }

    useEffect(() => {
        fetchProblem();
    }, [id])

    useEffect(() => {
        if (!problem) return;
        fetchProblemCreator();
    }, [problem])

    useEffect(() => {
        fetchSubmissions();
    }, [loggedUser, problem])

    if (loading) {
        return <Loading />
    }

    if (notFound) {
        return <NotFoundPage />
    }

    return (
        <div className="ProblemPage">
            <div className="container-fluid pt-2 bg-light pb-2">
                <div className="card shadow-sm p-2 border-0 mb-2">
                    <div className="d-flex justify-content-between">
                        <div className="d-flex align-items-center">
                            <Link to="/" className="navbar-brand me-3">
                                <img src={logo} height="30" className="d-inline-block align-top" />
                            </Link>
                            <button className="btn btn-outline-light text-secondary border-0 btm-sm me-2" onClick={goBack}><i className="bi bi-arrow-left-circle me-2"></i>Back</button>
                            <Link className="btn btn-outline-light text-secondary border-0 btm-sm me-2" to='/problems'>Problems</Link>
                        </div>
                        <div>
                            {
                                (loggedUser?.id === problem?.creatorId || loggedUser?.role === 'admin') &&
                                <button className="btn btn-outline-light text-secondary border-0 btm-sm me-2"><i className="bi bi bi-pencil me-2"></i>Edit</button>
                            }
                            {
                                (loggedUser?.role === 'admin' && problem?.approved === false) &&
                                <button className="btn btn-outline-light text-success border-0 btm-sm me-2" onClick={handleApprove}><i className="bi bi-check-circle me-2"></i>Approve</button>
                            }
                            {
                                (loggedUser?.role === 'admin' || loggedUser?.id === problem?.creatorId) &&
                                <button className="btn btn-outline-light text-danger border-0 btm-sm" onClick={() => { setConfirmDeleteDialogOpen(true) }}><i className="bi bi-x-circle me-2"></i>Delete</button>
                            }
                        </div>
                        <div className="d-flex justify-content-center align-items-center">
                            <div className="spinner-border text-primary me-2" role="status" style={{height:'25px', width: '25px', display: running ? 'block' : 'none'}}>
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <button className="btn btn-light text-secondary border-0 btm-sm me-2" disabled={running || !loggedUser} onClick={() => {run(false, codeValue)}}><i className="bi bi-play-fill me-1"></i>Run</button>
                            <button className="btn btn-success border-0 btm-sm" disabled={running || !loggedUser} onClick={() => {run(true, codeValue)}}><i className="bi bi-send-fill me-2"></i>Submit</button>
                            {
                                !loggedUser &&
                                <Link to='/login' className="btn text-primary border-0"><i className="bi bi-box-arrow-in-right me-2"></i>Login</Link>
                            }
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', height: '91vh' }}>
                    <div className="row g-2" style={{ flexGrow: 1 }}>
                        <div className="col-6">
                            <div className="card h-100 shadow-sm border-0">
                                <div className="card-header p-1 bg-white">
                                    <div className="d-flex justify-content-between">
                                        <div>
                                            <button className={`btn btn-light text-secondary border-0 btn-sm ${currentView === 'description' ? 'btn-active' : ''} me-1`} onClick={() => { setCurrentView('description')}}><i className="bi bi-file-text me-1"></i>Description</button>
                                            <button className={`btn btn-light text-secondary border-0 btn-sm ${currentView === 'solutions' ? 'btn-active' : ''} me-1`} onClick={handleSolutionsClick}><i className="bi bi-lightbulb me-1"></i>Solutions</button>
                                            <button className={`btn btn-light text-secondary border-0 btn-sm ${currentView === 'submissions' ? 'btn-active' : ''} me-1`} onClick={() => { setCurrentView('submissions') }}><i className="bi bi-person me-1"></i>My submissions</button>
                                        </div>
                                        <div>
                                            {
                                                userSubmissions.length > 0 &&
                                                <button className="btn text-secondary border-0 btn-sm text-success fw-semibold" onClick={() => {setCurrentView('submissions')}}><i className="bi bi-check2-circle me-1"></i>Solved</button>
                                            }
                                        </div>

                                    </div>
                                </div>
                                <div className="card-body" style={{ overflowY: 'scroll', height: '10px' }}>
                                    {
                                        currentView === 'description' &&
                                        <DescriptionView problem={problem} user={problemCreator} />
                                    }
                                    {
                                        currentView === 'submissions' &&
                                        <SubmissionsView submissions={userSubmissions} problem={problem} />
                                    }
                                    {
                                        currentView === 'solutions' &&
                                        <SolutionsView problemId={problem?.id as number} problem={problem}/>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="card h-100 border-0 bg-light">
                                <CodeEditor problem={problem} running={running} error={error} output={output} codeValue={codeValue} setCodeValue={setCodeValue} success={success}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Dialog
                open={confirmDeleteDialogOpen}
                onClose={() => { setConfirmDeleteDialogOpen(false) }}
            >
                <DialogTitle>
                    Confirmation
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Deleting problems is irreversible and not advised. All user data associated with this problem will be lost. Are you sure you want to delete this problem?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <button className="btn btn-light text-danger" onClick={handleDelete}>Delete</button>
                    <button className="btn btn-light text-secondary" onClick={() => {setConfirmDeleteDialogOpen(false)}}>Cancel</button>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmViewSolutionsDialogOpen} onClose={() => {setConfirmViewSolutionsDialogOpen(false)}}>
                <DialogContent>
                    <DialogContentText>
                        You haven't solved this problem yourself yet. Are you sure you want to view other users' solutions?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <button className="btn btn-light text-primary" onClick={() => {setCurrentView('solutions'); setConfirmViewSolutionsDialogOpen(false); setViewSolutionsConfirmed(true)}}>View solutions</button>
                    <button className="btn btn-light text-secondary" onClick={() => {setConfirmViewSolutionsDialogOpen(false)}}>Cancel</button>
                </DialogActions>
            </Dialog>
        </div>
    )
}