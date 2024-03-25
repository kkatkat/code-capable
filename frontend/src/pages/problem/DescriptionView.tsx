import Markdown from "react-markdown";
import { Problem } from "../../entities/problem";
import { Link, useNavigate } from "react-router-dom";
import { User } from "../../entities/user";
import defaultPfp from '../../assets/user.png';
import { difficultyColor, firstCapital } from "../../common/lib";


export function DescriptionView({ problem, user }: { user: User, problem: Problem | undefined }) {

    const nav = useNavigate();

    return (
        <div className="DescriptionView">
            <div className="d-flex justify-content-between mb-2">
                <h5 className="pt-1">{`${problem?.id}. ${problem?.name}`}</h5>
                <div className="d-flex align-items-center">
                    <div>
                        <Link to={`/profile/${problem?.creatorId}`} className="link-underline-opacity-0 link-underline"><p className="m-0 p-0 fw-semibold">by {problem?.creatorName}</p></Link>
                    </div>
                    <img src={user?.pfp ?? defaultPfp} className="rounded-circle ms-2" width="30" height="30" />
                </div>
            </div>
            <hr className="mt-1 mb-2"/>
            <div className="d-flex mb-2">
                <button className={`btn btn-light text-${difficultyColor(problem?.difficulty)} border-0 btn-sm me-1`} onClick={() => {nav(`/problems?difficulty=${problem?.difficulty}`)}}>{firstCapital(problem?.difficulty)}</button>
            </div>
            <Markdown className='md-format'>{problem?.description}</Markdown>

            {
                problem?.constraints &&
                <>
                    <p className="fw-bold">Constraints:</p>
                    <Markdown>{problem?.constraints}</Markdown>
                </>
            }
        </div>
    )
}