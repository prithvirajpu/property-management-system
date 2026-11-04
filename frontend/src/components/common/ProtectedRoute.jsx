import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {Loader2} from 'lucide-react'

const ProtectedRoute = () => {
    const {isAuthenticated,loading}=useAuth()
    if (loading){
        return <Loader2/>
    }
  return isAuthenticated ? <Outlet/> :
  <Navigate to='/login' replace/>
}

export default ProtectedRoute
