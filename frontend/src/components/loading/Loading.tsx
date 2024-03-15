import React from 'react';

export function Loading() {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{marginTop: '-3.9rem'}}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
};