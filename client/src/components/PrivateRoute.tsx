import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { Navigate, Outlet } from 'react-router'

const PrivateRoute = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth)
    return isAuthenticated ? <Outlet /> : <Navigate to={'/signin'} />
}

export default PrivateRoute