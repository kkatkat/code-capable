import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Solution } from "../../entities/solution";
import { getUserById } from "../../services/user-service";
import { User } from "../../entities/user";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Editor } from "@monaco-editor/react";
import defaultPfp from '../../assets/user.png';

export type SolutionDialogProps = {
    solution: Solution,
    open: boolean,
    onClose: () => void
}

export default function SolutionDialog({ solution, open, onClose }: SolutionDialogProps) {
    const [user, setUser] = useState<User | undefined>({ id: solution.userId, username: solution.userName } as User);

    async function fetchUser() {
        await getUserById(solution.userId).then((user) => {
            setUser(user);
        })
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth={'md'} fullWidth>
            <DialogTitle>
                <div className="small d-flex justify-content-between align-items-center">
                    <div className="m-0 p-0">
                        Solution #{solution.id}
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
                <button className="btn btn-light text-secondary" onClick={onClose}>
                    Close
                </button>
            </DialogActions>
        </Dialog>
    )
}