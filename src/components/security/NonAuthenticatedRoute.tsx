import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Spinner } from 'react-bootstrap';
import { DecodedToken, AuthenticationRouteProps } from "../../types";

//* users already logged in shouldnt be able to goto "/login" or "/signup"

export default function NonAuthenticatedRoute({ children } : AuthenticationRouteProps) {
    const authContext = useAuth();
    const storedToken = authContext.storedToken;
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      if (storedToken) {
        const decodedToken = jwtDecode<DecodedToken>(storedToken.replace("Bearer ", ""));
        const currentTime = Date.now() / 1000;
  
        if (decodedToken.exp > currentTime) {
            const username = decodedToken.sub;
            navigate(`/welcome/${username}`)
            setIsLoading(false);
        } else{
            setIsLoading(false);
        }
      }else{
            setIsLoading(false);
      }
    }, [storedToken, authContext, navigate]);
  
    if (isLoading) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
      )
    }
  
    return children;
  }