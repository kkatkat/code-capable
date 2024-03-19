import { Solution } from "../../entities/solution";


export default function SolutionCard({solution}: {solution: Solution}) {

    return (
        <div className="card shadow-sm mb-2">
            <div className="card-body py-1">
                <div className="small d-flex justify-content-between">
                    <div>
                        Solution #{solution.id}
                    </div>
                </div>
            </div>
        </div>
    )
}