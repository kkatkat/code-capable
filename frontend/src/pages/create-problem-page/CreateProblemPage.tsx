import { useState } from "react";
import { ProblemGuide } from "../../components/problemGuide/ProblemGuide";
import { useNavigate } from "react-router-dom";
import { useScrollToTop } from "../../common/lib";
import { ProblemForm } from "../../components/problemForm/ProblemForm";


function CreateProblemPage() {
    useScrollToTop();
    const [acknowledgedGuide, setAcknowledgedGuide] = useState<boolean>(false);
    

    const nav = useNavigate();

    return (
        <div className="CreateProblemPage">
            <div className="container-lg pt-3">
                <h2 className="mb-3">Create a problem</h2>
                {
                    !acknowledgedGuide ? <ProblemGuide onContinue={() => {setAcknowledgedGuide(true)}} onCancel={() => {nav('/')}}/>
                    :
                    <ProblemForm/>
                }
            </div>
        </div>
    )
}

export default CreateProblemPage;