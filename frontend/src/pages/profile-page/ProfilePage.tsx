import { useParams } from "react-router-dom";
import { User } from "../../entities/user";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../UserProvider";
import { getUserById } from "../../services/user-service";
import defaultPfp from '../../assets/user.png'
import { UserStatistics, getUserStatistics } from "../../services/problem-service";
import SolutionsView from "../problem/SolutionsView";
import NotFoundPage from "../not-found-page/NotFoundPage";
import { Loading } from "../../components/loading/Loading";
import ProblemsPage from "../problems-page/ProblemsPage";


export default function ProfilePage() {
    const { id } = useParams();
    const {loggedUser} = useContext(UserContext);

    const [user, setUser] = useState<User | undefined>(undefined);
    const [statistics, setStatistics] = useState<UserStatistics | undefined>(undefined);
    const [currentView, setCurrentView] = useState<'problems' | 'solutions'>('problems');
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        setLoading(true);
        fetchUser().finally(() => setLoading(false));
        fetchUserStatistics();
    }, [id])

    if (loading) {
        return <Loading/>
    }

    if (!user && !loading) {
        return <NotFoundPage/>
    }

    return (
        <div className="ProfilePage cc-margin">
            <div className="container-lg pt-3">
                <div className="row gx-2">
                    <div className="col-lg-4">
                        <div className="row">
                            <div className="col-12">
                                <div className="card shadow-sm border-primary">
                                    <div className="card-body">
                                        <div className="d-flex">
                                            <div className="me-3">
                                                <img src={user?.pfp ?? defaultPfp} className="rounded-circle" height='70' width='70'></img>
                                            </div>
                                            <div>
                                                <h5>{user?.username}</h5>
                                                <p>{user?.bio ?? 'Hello world!'}</p>
                                                <p><i className="bi bi-calendar2-plus me-2"></i>Joined on {(new Date((user as User).createdAt)).toLocaleDateString('en-GB')}</p>
                                                {
                                                    user?.gitHubUsername &&
                                                    <p><i className="bi bi-github me-2"></i>{user?.gitHubUsername}</p>
                                                }
                                                {
                                                    user?.linkedInUsername &&
                                                    <p><i className="bi bi-linkedin me-2"></i>{user?.linkedInUsername}</p>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                        <div className="card shadow-sm mt-lg-0 mt-2" style={{minHeight: '85vh'}}>
                            <div className="card-header bg-white p-1">
                                <button className={`btn btn-light text-secondary border-0 btn-sm ${currentView === 'problems' ? 'btn-active' : ''} me-1`} onClick={() => {setCurrentView('problems')}}><i className="bi bi-file-earmark-text me-1"></i>Created problems</button>
                                <button className={`btn btn-light text-secondary border-0 btn-sm ${currentView === 'solutions' ? 'btn-active' : ''} me-1`} onClick={() => {setCurrentView('solutions')}}><i className="bi bi-lightbulb me-1"></i>Solutions</button>                            </div>
                            <div className="card-body">
                                {
                                    currentView === 'solutions' && id &&
                                    <SolutionsView problemId={-1} userId={+id}/>
                                }
                                {
                                    currentView === 'problems' && id &&
                                    <ProblemsPage fullWidth hideSearch creatorId={+id}/>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}