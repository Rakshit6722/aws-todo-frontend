import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Spinner } from 'react-bootstrap';
import { AuthenticationRouteProps, DecodedToken } from "../../types";

export default function AuthenticatedRoute({ children }: AuthenticationRouteProps) {
    const authContext = useAuth();
    const storedToken = authContext.storedToken;
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      if (storedToken) {
        const decodedToken = jwtDecode<DecodedToken>(storedToken.replace("Bearer ", ""));
        const currentTime = Date.now() / 1000;
  
        if (decodedToken.exp > currentTime) {
          authContext.setToken(storedToken);
          authContext.setIsAuthenticated(true);
          authContext.setUsername(decodedToken.sub);
          setIsLoading(false);
        } else {
          sessionStorage.removeItem("token");
          navigate("/login");
        }
      } else {
        navigate("/login");
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