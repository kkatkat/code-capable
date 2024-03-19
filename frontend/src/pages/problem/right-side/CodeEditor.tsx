import { Editor } from "@monaco-editor/react";
import { Problem } from "../../../entities/problem";
import { useEffect, useState } from "react";

export type CodeEditorProps = {
    problem: Problem | undefined;
    running: boolean;
    output: string;
    error: boolean;
    success: boolean;
    codeValue: string;
    setCodeValue: (code: string) => void;
}


export function CodeEditor({ problem, running, output, error, codeValue, setCodeValue, success }: CodeEditorProps) {
    
    const [currentLowerView, setCurrentLowerView] = useState<'tests' | 'output'>('tests');

    function formatTests(): string {
        let tests = '';

        if (problem?.unitTests) {
            problem?.unitTests.forEach((test, index) => {
                if (test.visible) {
                    tests += `${test.code}${index !== problem.unitTests.length - 1 ? '\n\n' : ''}`
                }
            })
        }

        return tests;
    }

    function getDefaultCode(): void {
        const existingCode = window.localStorage.getItem(`problem-${problem?.id}-code`);

        if (!existingCode) {
            setCodeValue(problem?.starterCode || '')
            return;
        }

        if (existingCode === problem?.starterCode) {
            window.localStorage.removeItem(`problem-${problem?.id}-code`);
        }

        setCodeValue(existingCode || '')
    }

    function resetToDefaultCode(): void {
        window.localStorage.removeItem(`problem-${problem?.id}-code`);
        setCodeValue(problem?.starterCode || '');
    }

    useEffect(() => {
        getDefaultCode();
    }, [])

    useEffect(() => {
        if (running) {
            setCurrentLowerView('output');
        }
    }, [running])

    return (
        <div className="card-body p-0">
            <div className="card shadow-sm border-0 mb-2" style={{ height: '60%' }}>
                <div className="card-header p-1 bg-white text-secondary">
                    <div className="d-flex justify-content-between">
                        <button className={`btn btn-light text-dark border-0 btn-sm me-1`} disabled><i className="bi bi-braces me-1"></i>Code</button>
                        <button className={`btn btn-light text-secondary border-0 btn-sm me-1`} onClick={() => {resetToDefaultCode()}} title="Reset to default code"><i className="bi bi-arrow-counterclockwise"></i></button>
                    </div>
                </div>
                <div className="card-body p-1">
                    <Editor defaultLanguage="python" defaultValue={codeValue} value={codeValue}  onChange={(value) => {window.localStorage.setItem(`problem-${problem?.id}-code`, value || ''); setCodeValue(value || '')}} options={{ minimap: { enabled: false } }} />
                </div>
            </div>
            <div className="card shadow-sm border-0 p-0" style={{ height: '39%' }}>
                <div className="card-header p-1 bg-white text-secondary">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <button className={`btn btn-light text-secondary border-0 btn-sm ${currentLowerView === 'tests' ? 'btn-active' : ''} me-1`} onClick={() => { setCurrentLowerView('tests') }}><i className="bi bi-code-slash me-1"></i>Tests</button>
                            <button className={`btn btn-light text-secondary border-0 btn-sm ${currentLowerView === 'output' ? 'btn-active' : ''} me-1`} onClick={() => { setCurrentLowerView('output') }}><i className="bi bi-terminal me-1"></i>Output</button>
                        </div>
                        <div>
                            {
                                running &&
                                <div className="spinner-border text-primary me-2" role="status" style={{height:'20px', width: '20px'}}>
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            }
                            {
                                !running && error &&
                                <button className={`btn btn-light text-danger fw-bold border-0 btn-sm me-1`} disabled><i className="bi bi-exclamation-circle me-1"></i>Error</button>
                            }
                            {
                                !running && success &&
                                <button className={`btn btn-light text-success fw-bold border-0 btn-sm me-1`} disabled><i className="bi bi-check-circle me-1"></i>All test cases passed</button>
                            }
                        </div>
                    </div>
                </div>
                <div className="card-body p-1">
                    {
                        currentLowerView === 'tests' &&
                        <Editor defaultLanguage="python" defaultValue={formatTests()} options={{ minimap: { enabled: false }, readOnly: true }}/>
                    }
                    {
                        currentLowerView === 'output' &&
                        <Editor defaultLanguage="markdown" defaultValue={output} value={output} options={{ minimap: { enabled: false }, readOnly: true }}/>
                    }
                </div>
            </div>
        </div>
    )
}