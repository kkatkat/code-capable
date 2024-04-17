import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Solution } from "../../entities/solution";
import { getUserById } from "../../services/user-service";
import { User } from "../../entities/user";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Editor } from "@monaco-editor/react";
import defaultPfp from '../../assets/user.png';
import { Problem } from "../../entities/problem";
import { UserContext } from "../../UserProvider";
import { deleteSolution } from "../../services/problem-service";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

export type SolutionDialogProps = {
    solution: Solution,
    open: boolean,
    onClose: () => void,
    problem?: Problem
}

export default function SolutionDialog({ solution, open, onClose, problem }: SolutionDialogProps) {
    const [user, setUser] = useState<User | undefined>({ id: solution.userId, username: solution.userName } as User);
    const {loggedUser} = useContext(UserContext);

    async function fetchUser() {
        if (loggedUser && solution.userId === loggedUser.id) {
            setUser(loggedUser);
            return;
        }
        
        await getUserById(solution.userId).then((user) => {
            setUser(user);
        })
    }

    async function handleDeleteSolution() {
        if (window.confirm('Are you sure you want to delete this solution?')) {
            await deleteSolution(solution.id).then(() => {
                onClose();
                toast.success('Solution deleted successfully');
            }).catch((err: AxiosError<{message?: string}>) => {
                toast.error(err.response?.data.message ?? 'An error occurred while deleting the solution');
            })
        }
    }

    useEffect(() => {
        if (open) {
            fetchUser();
        }
    }, [open])

    return (
        <Dialog open={open} onClose={onClose} maxWidth={'md'} fullWidth>
            <DialogTitle>
                <div className="small d-flex justify-content-between align-items-center">
                    <div className="m-0 p-0">
                        Solution #{solution.id} {problem && <>for <Link to={`/problem/${problem.id}`} className="text-decoration-none">{problem.id}. {problem.name}</Link></>}
                    </div>
                    <div className="d-flex align-items-center">
                        <div>
                            <Link to={`/profile/${solution.userId}`} className="link-underline-opacity-0 link-underline"><h5 className="m-0 p-0 text-muted">{solution.userName}</h5></Link>
                        </div>
                        <img src={user?.pfp ?? defaultPfp} className="rounded-circle ms-2" width="35" height="35" />
                    </div>
                </div>
            </DialogTitle>
            <DialogContent>
                <div className="text-muted mb-2">
                    Posted on {new Date(solution.createdAt).toLocaleDateString('en-GB')}
                </div>
                <div>
                    <Editor defaultLanguage="python" defaultValue={solution.code} options={{ minimap: { enabled: false }, readOnly: true }} height={'400px'}/>
                </div>
            </DialogContent>
            <DialogActions>
                {
                    user?.id === loggedUser?.id &&
                    <button className="btn btn-light text-danger" onClick={handleDeleteSolution}>
                        Delete
                    </button>
                }
                <button className="btn btn-light text-secondary" onClick={onClose}>
                    Close
                </button>
            </DialogActions>
        </Dialog>
    )
}