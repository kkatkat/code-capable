import Markdown from "react-markdown";
import { Problem } from "../../entities/problem";


export function DescriptionView({ problem }: { problem: Problem | undefined }) {

    return (
        <div className="DescriptionView">
            <h5>{`${problem?.id}. ${problem?.name}`}</h5>
            <Markdown>{problem?.description}</Markdown>
            <Markdown>{problem?.description}</Markdown>

            <Markdown>{problem?.description}</Markdown>

            <p className="fw-bold">Constraints:</p>
            <Markdown>{problem?.constraints}</Markdown>
        </div>
    )
}