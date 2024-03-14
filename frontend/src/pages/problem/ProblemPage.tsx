

export function ProblemPage() {

    return (
        <div className="ProblemPage">
            <div className="container-fluid pt-2">
                <div className="card shadow-sm p-2 border-0 mb-2">
                    <div className="d-flex justify-content-between">
                        <div>
                            <button className="btn btn-outline-secondary border-0 btm-sm"><i className="bi bi-arrow-left-circle me-2"></i>Back</button>
                        </div>
                        <div>
                            <button className="btn btn-outline-secondary border-0 btm-sm me-2"><i className="bi bi-play-fill me-1"></i>Run</button>
                            <button className="btn btn-success border-0 btm-sm"><i className="bi bi-send-fill me-2"></i>Submit</button>
                        </div>
                    </div>
                </div>
                <div className="card p-2" style={{height: '80vh'}}>
                    Hello world
                </div>
            </div>
        </div>
    )
}