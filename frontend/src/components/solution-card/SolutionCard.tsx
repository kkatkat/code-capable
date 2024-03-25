import { useState } from "react";
import { truncateString } from "../../common/lib";
import { Solution } from "../../entities/solution";
import SolutionDialog from "../solution-dialog/SolutionDialog";
import { Problem } from "../../entities/problem";


export default function SolutionCard({ solution, problem }: { solution: Solution, problem?: Problem }) {
    const [showDialog, setShowDialog] = useState(false);

    return (
        <>
            <button className="card shadow-sm mb-2 w-100 hoverable-card" onClick={() => setShowDialog(true)}>
                <div className="card-body py-1 w-100">
                    <div className="small d-flex justify-content-between">
                        <div>
                            Solution #{solution.id} {problem ? `for ${problem.id}. ${problem.name}` : ''}
                        </div>
                        <div className="text-muted">
                            by <span className="fw-semibold">{solution.userName}</span> on {new Date(solution.createdAt).toLocaleDateString('en-GB')}
                        </div>
                    </div>
                    <div className="small text-muted d-flex">
                        {truncateString(solution.code, 100)}
                    </div>
                </div>
            </button>
            <SolutionDialog solution={solution} open={showDialog} onClose={() => setShowDialog(false)} problem={solution.problem ?? problem} />
        </>

    )
}