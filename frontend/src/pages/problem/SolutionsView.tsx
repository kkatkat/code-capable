import { useEffect, useState } from "react";
import { Solution } from "../../entities/solution";
import SolutionCard from "../../components/solution-card/SolutionCard";
import { getSolutionsForProblem } from "../../services/problem-service";
import { toast } from "react-toastify";
import { Problem } from "../../entities/problem";



export default function SolutionsView({problemId, problem}: {problemId: number, problem?: Problem}) {
    const [solutions, setSolutions] = useState<Solution[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchSolutionsForProblem() {
        getSolutionsForProblem(problemId).then((solutions) => {
            setSolutions(solutions);
        }).catch(() => {
            toast.error("Failed to fetch solutions for problem");
        }).finally(() => {
            setLoading(false);
        })
    }

    useEffect(() => {
        fetchSolutionsForProblem();
    }, [problemId])

    if (loading) {
        return (
            <div className="SolutionsView">
                <div className="d-flex justify-content-center text-muted align-items-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                     </div>
                </div>
            </div>
        )
    }

    if (solutions.length === 0 || !solutions) {
        return (
            <div className="SolutionsView">
                <div className="d-flex justify-content-center text-muted">
                    Nobody has solved this problem yet. Be the first one!
                </div>
            </div>
        )
    }

    
    return (
        <div className="SolutionsView">
            {
                solutions.map((s) => {
                    return <SolutionCard solution={s} problem={problem}/>
                })
            }
        </div>
    )
}
