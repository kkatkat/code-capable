export function ProblemGuide(props: {onContinue: () => void, onCancel?: () => void}) {
    return (
        <>
            <h4 className="alert-heading">Quick guide</h4>
            <p>To ensure pleasant experience for all users, all submitted problems will be reviewed by our team before they can be accessed by the users. To increase the chances of your problem being accepted, make sure it meets the following criteria:</p>
            <h5>Problem</h5>
            <ul>
                <li>The problem should be able to be solved without the use of external packages. These are not always available, so your problem should be solvable by only using the Python standard library</li>
                <li>Your problem should not require computationally heavy solutions. Each time a user runs their solution there is a 5 second cutoff time after which the process is terminated. Make sure the intended solution for your problem does not exceed the 5-second window.</li>
                <li>If your problem requires the use of data structures which are not present in the standard libary, make sure to include the definitions in the starter code.</li>
                <li>Your starter code should be as small as possible. Preferably, only define a single empty function with its arguments.</li>
            </ul>
            <h5>Description</h5>
            <ul>
                <li>You should provide a clear description with examples, and constraints. Make use of Markdown syntax to your advantage.</li>
                <li>Your description shouldn't contain any inappropriate content. Only import images from external sources if you need to illustrate your problem.</li>
            </ul>
            <div className="">
                <span className="fw-semibold">Tip: </span>If you ever need to change something on your problem, it might become unavailable for a short period of time while it is being reviewed again.
            </div>
            <hr className="my-4"/>
            <div className="d-flex">
                <button className="btn btn-primary me-2 px-4" onClick={props.onContinue}>Continue</button>
                <button className="btn btn-outline-danger border-0" onClick={props.onCancel}>Cancel</button>
            </div>
        </>
    )
}