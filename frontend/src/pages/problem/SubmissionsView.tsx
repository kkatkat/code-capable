import SolutionCard from "../../components/solution-card/SolutionCard"
import { Solution } from "../../entities/solution"

export type SubmissionsViewProps = {
    submissions: Solution[]
}

export default function SubmissionsView( {submissions}: SubmissionsViewProps) {

    return (
        <div className="SubmissionsView">
            {
                submissions.map((s) => {
                    return <SolutionCard solution={s}/>
                })
            }
        </div>
    )
}