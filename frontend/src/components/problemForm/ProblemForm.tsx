import { Editor } from "@monaco-editor/react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CreateProblemRequest, createProblem } from "../../services/problem-service";
import { AxiosError } from "axios";
import { UserContext } from "../../UserProvider";


export function ProblemForm() {
    const nav = useNavigate();
    const {loggedUser} = useContext(UserContext);

    const [starterCode, setStarterCode] = useState<string | undefined>('');
    const [description, setDescription] = useState<string | undefined>('');
    const [constraints, setConstraints] = useState<string | undefined>('');
    const [unitTests, setUnitTests] = useState<string[]>([]);
    const [title, setTitle] = useState<string>('');
    const [difficulty, setDifficulty] = useState<string>('easy');

    function handleStarterCodeChange(value: string | undefined, event: any) {
        setStarterCode(value);
    }

    function handleDescriptionChange(value: string | undefined, event: any) {
        setDescription(value);
    }

    function handleConstraintsChange(value: string | undefined, event: any) {
        setConstraints(value);
    }

    function addUnitTest() {
        setUnitTests([...unitTests, '']);
    }

    function validate(): boolean {
        let pass = true;

        if (!description) {
            toast.error('Description is required');
            pass = false;
        }

        if (!starterCode) {
            toast.error('Starter code is required');
            pass = false;
        }

        if (!title) {
            toast.error('Title is required');
            pass = false;
        } else {
            if (title.trim().length < 2) {
                toast.error('Title is too short');
                pass = false;
            }
        }

        if (unitTests.length === 0) {
            toast.error('At least one unit test is required');
            pass = false;
        }

        unitTests.forEach((test, index) => {
            if (test.trim().length === 0) {
                toast.error(`Unit test #${index+1} is empty`);
                pass = false;
            }
        })

        return pass;
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        
        if (!validate()) {
            return;
        }
        
        const request: CreateProblemRequest = {
            creatorId: loggedUser?.id as number,
            name: title,
            description: description as string,
            constraints: constraints,
            starterCode: starterCode as string,
            difficulty: difficulty,
            unitTests: unitTests.map((test) => {
                return {
                    code: test
                }
            })
        }

        await createProblem(request).then(() => {
            toast.success('Problem submitted for review');
            nav('/');
        }).catch((err: AxiosError<{message: string | string[]}>) => {
            if (Array.isArray(err.response?.data.message)) {
                err.response.data.message.forEach((errorMessage: string) => {
                    toast.error(errorMessage);
                });
            } else {
                toast.error(err.response?.data.message);
            }

            if (!err.response?.data.message) {
                toast.error('An error occurred, please try again later');
            }
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="row pb-5">
                <div className="col-6">
                    <h5>
                        Title
                    </h5>
                    <p className="text-muted">
                        Give your problem a short, concise title that gives a good first hint about the problem. The user should be able to get an idea what the problem is about by reading the title alone.
                    </p>
                </div>
                <div className="col-6">
                    <input type="text" className="form-control border-light shadow" placeholder="Title" required onChange={(e: any) => {setTitle(e.target.value)}}/>
                </div>
            </div>
            <hr className="my-5"/>
            <div className="row pb-5">
                <div className="col-6">
                    <h5>Description</h5>
                    <p className="text-muted">
                        Describe the problem in detail. Do not spare any details that your think are obvious - they might not be. Make sure your explanations are clear and unambiguous. Always include examples (preferably matching some of your test cases) to illustrate better what the problem is about. Feel free to include images, but only do so if they bring value to the problem.
                    </p>
                    <p className="text-muted"><span className="fw-semibold">Tip: </span>Make use of Markdown syntax to describe your problem. You may include code snippets as well.</p>
                </div>
                <div className="col-6">
                    <div className="card p-2 border-light shadow">
                        <Editor height="400px" defaultLanguage="markdown" defaultValue="" onChange={handleDescriptionChange} options={{minimap: {enabled: false}}}/>
                    </div>
                </div>
            </div>
            <hr className="my-5"/>
            <div className="row pb-5">
                <div className="col-6">
                    <h5>Constraints <span className="badge text-bg-secondary">optional</span></h5>
                    <p className="text-muted">
                        If your problem has constraints, make sure to include them here. This will help the user understand the limits of the problem and will help them optimize their solution.
                    </p>
                    <p className="text-muted"><span className="fw-semibold">Tip: </span>Make use of Markdown syntax if you want to use bullet points.</p>
                </div>
                <div className="col-6">
                    <div className="card p-2 border-light shadow">
                        <Editor height="400px" defaultLanguage="markdown" defaultValue="" onChange={handleConstraintsChange} options={{minimap: {enabled: false}}}/>
                    </div>
                </div>
            </div>
            <hr className="my-5"/>
            <div className="row pb-5">
                <div className="col-6">
                    <h5>Difficulty</h5>
                    <p className="text-muted">
                        Choose the difficulty of the problem. This will help the user filter problems based on their skill level. If you are unsure, choose the difficulty that you think best fits the problem and we will review it.
                    </p>
                </div>
                <div className="col-6">
                    <select className="form-select border-light shadow" onChange={(e: any) => {setDifficulty(e.target.value)}}>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>
            </div>
            <hr className="my-5"/>
            <div className="row pb-5">
                <div className="col-6">
                    <h5>Starter code</h5>
                    <p className="text-muted">
                        Provide a starter code for the problem. The user will be able to build their solution on top of this code. Make sure to include any necessary definitions. If your problem requires the use of data structures which are not present in the standard libary, make sure to include the definitions in the starter code.
                    </p>
                </div>
                <div className="col-6">
                    <div className="card p-2 border-light shadow">
                        <Editor height="400px" defaultLanguage="python" defaultValue="# Hello world" onChange={handleStarterCodeChange} options={{minimap: {enabled: false}}}/>
                    </div>
                </div>
            </div>
            <hr className="my-5"/>
            <div className="row pb-5">
                <div className="col-6">
                    <h5>Unit tests</h5>
                    <p className="text-muted">
                        Provide a set of unit tests that will be used to validate the user's solution. Make sure to include edge cases and tests that cover the constraints of the problem. The user will be able to run these tests on their solution to check if it is correct. You may use the <code>unittest</code> module to write your tests or even more simply, use the <code>assert</code> statement. Before submitting for review, make sure to run your tests locally on a correct solution to make sure they are working as intended.
                    </p>
                </div>
                <div className="col-6">
                    {
                        unitTests.map((test, index) => {
                            return (
                                <div className="d-flex justify-content-between">
                                    <div className="card border-light shadow p-2 mb-3 flex-fill" key={index}>
                                        <Editor height="75px" defaultLanguage="python" value={test} onChange={(value) => {unitTests[index] = value as string;}} options={{minimap: {enabled: false}}}/>
                                    </div>
                                    <div className="my-auto">
                                        <div className="btn btn-lg text-danger border-0 mb-3" onClick={() => {
                                            let copy = [...unitTests]
                                            copy.splice(index, 1);
                                            setUnitTests(copy);
                                            }}><i className="bi bi-dash-circle"></i></div>
                                    </div>
                                </div>
                            )
                        })
                    }
                    <div className="btn btn-outline-light text-primary border-0 mb-3" onClick={addUnitTest}><i className="bi bi-plus-circle me-2"></i>Add a unit test</div>
                </div>
            </div>
            <hr className="mb-4"/>
            <button type="submit" className="btn btn-primary border-0 px-5">Submit for review</button>
            <button className="btn btn-outline-light text-danger border-0 ms-3 px-3" onClick={() => {nav('/')}}>Cancel</button>
        </form>
    )

}