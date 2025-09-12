import { Link } from "react-router-dom";
import { useAuth } from "./security/AuthContext";
import React from "react";

export default function Welcome(){
    
    const authContext = useAuth();
    const username = authContext.username;

    return(
        <div className="Welcome">
            <h1>Login successful, welcome back {username}.</h1>
            <h3>Manage your <Link to="/todos">todos.</Link> </h3>
        </div>
    )
}