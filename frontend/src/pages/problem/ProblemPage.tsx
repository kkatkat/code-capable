import { Link, useParams } from "react-router-dom";
import { useGoBack } from "../../common/lib"
import logo from '../../assets/logo_cc.png'
import { useContext, useEffect, useState } from "react";
import { Problem } from "../../entities/problem";
import { getProblembyId } from "../../services/problem-service";
import NotFoundPage from "../not-found-page/NotFoundPage";
import { UserContext } from "../../UserProvider";
import { DescriptionView } from "./DescriptionView";
import { Loading } from "../../components/loading/Loading";

export function ProblemPage() {
    const { id } = useParams();
    const goBack = useGoBack();
    const { loggedUser } = useContext(UserContext);

    const [currentView, setCurrentView] = useState<'description' | 'solutions' | 'submissions'>('description');
    const [problem, setProblem] = useState<Problem>();
    const [notFound, setNotFound] = useState(false);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        fetchProblem();
    }, [id])

    if (loading) {
        return <Loading/>
    }

    if (notFound) {
        return <NotFoundPage/>
    }

    return (
        <div className="ProblemPage" style={{marginTop: '-3.9rem'}}>
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
                                <button className="btn btn-outline-light text-success border-0 btm-sm me-2"><i className="bi bi-check-circle me-2"></i>Approve</button>
                            }
                            {
                                (loggedUser?.role === 'admin' || loggedUser?.id === problem?.creatorId) &&
                                <button className="btn btn-outline-light text-danger border-0 btm-sm"><i className="bi bi-x-circle me-2"></i>Delete</button>
                            }
                        </div>
                        <div>
                            <button className="btn btn-light text-secondary border-0 btm-sm me-2"><i className="bi bi-play-fill me-1"></i>Run</button>
                            <button className="btn btn-success border-0 btm-sm"><i className="bi bi-send-fill me-2"></i>Submit</button>
                        </div>
                    </div>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', height: '91vh'}}>
                    <div className="row g-2" style={{flexGrow: 1}}>
                        <div className="col-6">
                            <div className="card h-100 shadow-sm border-0">
                                <div className="card-header p-1 bg-white">
                                    <div className="d-flex justify-content-between">
                                        <div>
                                            <button className={`btn btn-light text-secondary border-0 btn-sm ${currentView === 'description' ? 'btn-active' : ''} me-1`} onClick={() => {setCurrentView('description')}}><i className="bi bi-file-text me-1"></i>Description</button>
                                            <button className={`btn btn-light text-secondary border-0 btn-sm ${currentView === 'solutions' ? 'btn-active' : ''} me-1`} onClick={() => {setCurrentView('solutions')}}><i className="bi bi-lightbulb me-1"></i>Solutions</button>
                                            <button className={`btn btn-light text-secondary border-0 btn-sm ${currentView === 'submissions' ? 'btn-active' : ''} me-1`} onClick={() => {setCurrentView('submissions')}}><i className="bi bi-person me-1"></i>My submissions</button>
                                        </div>
                                        <div>
                                            <button className="btn text-secondary border-0 btn-sm text-success fw-semibold"><i className="bi bi-check2-circle me-1"></i>Solved</button>
                                        </div>

                                    </div>
                                </div>
                                <div className="card-body" style={{overflowY: 'scroll', height: 'auto'}}>
                                    {
                                        currentView === 'description' &&
                                        <DescriptionView problem={problem}/>
                                    }
                                    hello world
                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="card h-100 shadow-sm border-0">
                                <div className="card-body">
                                    Hi
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}