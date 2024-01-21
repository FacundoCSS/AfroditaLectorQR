import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {AiOutlineLoading3Quarters} from 'react-icons/ai'

const PrivateRoute = ({children}) => {
    const { user, loading } = useAuth();

    if (loading) return <div className="w-full h-[100vh] bg-lime-500 flex text-white">
        <AiOutlineLoading3Quarters className="w-8 h-8 animate-spin m-auto"/>
    </div>;
  
    if (!user) return <Navigate to="/signin"/>;
  
    return <>{children}</>;
}

export default PrivateRoute