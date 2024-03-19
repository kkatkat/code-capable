import { useContext } from "react"
import SolutionCard from "../../components/solution-card/SolutionCard"
import { Solution } from "../../entities/solution"
import { UserContext } from "../../UserProvider"
import { Problem } from "../../entities/problem"

export type SubmissionsViewProps = {
    submissions: Solution[]
    problem?: Problem
}

export default function SubmissionsView( {submissions, problem}: SubmissionsViewProps) {

    const {loggedUser} = useContext(UserContext);

    if (!loggedUser) {
        return (
            <div className="SubmissionsView">
                <div className="d-flex justify-content-center text-muted">
                    You need to be logged in to see your submissions.
                </div>
            </div>
        )
    }

    if (submissions.length === 0 || !submissions) {
        return (
            <div className="SubmissionsView">
                <div className="d-flex justify-content-center text-muted">
                    You don't have any submissions yet.
                </div>
            </div>
        )
    }


    return (
        <div className="SubmissionsView">
            {
                submissions.map((s) => {
                    return <SolutionCard solution={s} problem={problem}/>
                })
            }
        </div>
    )
}