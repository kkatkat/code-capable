import Markdown from "react-markdown";
import { Problem } from "../../entities/problem";
import { Link } from "react-router-dom";
import { User } from "../../entities/user";
import defaultPfp from '../../assets/user.png';


export function DescriptionView({ problem, user }: { user: User, problem: Problem | undefined }) {

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
            <hr className="mt-1"/>

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