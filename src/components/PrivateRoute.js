import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({children}) => {
    const { user, loading } = useAuth();

    if (loading) return <h1>Loading</h1>;
  
    if (!user) return <Navigate to="/signin"/>;
  
    return <>{children}</>;
}

export default PrivateRoute