import { useState, useEffect} from 'react';
import { Navigate } from 'react-router-dom';

function RCall() {

    const loggedIn = localStorage.getItem("loggedIn") === "true";

    if (!loggedIn) {
        return <Navigate to="/" />;
    }

    return (
        <>
            <form className="form" onSubmit={(e) => e.preventDefault()}>
                <h1>R CALL MAIN PAGE</h1>
            </form>
        </>
    );
}

export default RCall