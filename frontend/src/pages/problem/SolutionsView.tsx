import { useEffect, useState } from "react";
import { Solution } from "../../entities/solution";
import SolutionCard from "../../components/solution-card/SolutionCard";
import { getSolutionsForProblem, getSolutionsForUser } from "../../services/problem-service";
import { toast } from "react-toastify";
import { Problem } from "../../entities/problem";
import { Pagination } from "@mui/material";



export default function SolutionsView({problemId, problem, userId}: {problemId: number, problem?: Problem, userId?: number}) {
    const [solutions, setSolutions] = useState<Solution[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    async function fetchSolutionsForProblem(page: number = 1) {
        getSolutionsForProblem(problemId, page).then((solutions) => {
            setSolutions(solutions.items);
            setTotalPages(solutions.totalPages);
        }).catch(() => {
            toast.error("Failed to fetch solutions for problem");
        }).finally(() => {
            setLoading(false);
        })
    }

    async function fetchSolutionsForUser(page: number = 1) {
        if (!userId) {
            return;
        }

        getSolutionsForUser(userId, page).then((solutions) => {
            setSolutions(solutions.items);
            setTotalPages(solutions.totalPages);
        }).catch(() => {
            toast.error("Failed to fetch solutions for user");
        }).finally(() => {
            setLoading(false);
        })
    }

    useEffect(() => {
        if (userId) {
            fetchSolutionsForUser(page);
            return;
        }

        if (problemId < 0) {
            return;
        }
        fetchSolutionsForProblem(page);
    }, [problemId, page, userId])

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
                    Nothing to see here yet!
                </div>
            </div>
        )
    }

    
    return (
        <div className="SolutionsView">
            {
                solutions.map((s) => {
                    return <SolutionCard solution={s} problem={s?.problem ?? problem}/>
                })
            }
            <div className="text-center mt-4">
                <Pagination count={totalPages} shape="rounded" page={page} onChange={(e, value) => {setPage(value)}} />
            </div>
        </div>
    )
}
