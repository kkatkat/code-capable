import { useNavigate } from "react-router-dom";
import { Problem } from "../../entities/problem";
import { difficultyColor, firstCapital, truncateString } from "../../common/lib";

export default function ProblemCard({ problem }: { problem: Problem }) {

    const nav = useNavigate();

    return (
        <button className="card shadow-sm mb-2 w-100 hoverable-card" onClick={() => nav(`/problem/${problem.id}`)}>
            <div className="card-body py-1 w-100">
                <div className="small d-flex justify-content-between">
                    <div>
                        {problem.id}. {problem.name} {!problem.approved && <span className="badge bg-danger">UNAPPROVED</span>}
                    </div>
                    <div className="text-muted">
                        by <span className="fw-semibold">{problem.creatorName}</span>
                    </div>
                </div>
                <div className="small d-flex justify-content-between">
                    <div className="text-muted">
                        {truncateString(problem.description, 50)}
                    </div>
                    <div className={`text-${difficultyColor(problem.difficulty)}`}>
                        {firstCapital(problem.difficulty)}
                    </div>
                </div>
            </div>
        </button>
    )
}