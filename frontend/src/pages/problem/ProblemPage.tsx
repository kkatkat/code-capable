import { Link } from "react-router-dom";
import { useGoBack } from "../../common/lib"
import logo from '../../assets/logo_cc.png'

export function ProblemPage() {

    const goBack = useGoBack();

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
                            <button className="btn btn-outline-light text-secondary border-0 btm-sm me-2"><i className="bi bi bi-pencil me-2"></i>Edit</button>
                            <button className="btn btn-outline-light text-success border-0 btm-sm me-2"><i className="bi bi-check-circle me-2"></i>Approve</button>
                            <button className="btn btn-outline-light text-danger border-0 btm-sm"><i className="bi bi-x-circle me-2"></i>Delete</button>
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
                                <div className="card-body">
                                    Hi
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