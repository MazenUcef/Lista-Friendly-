import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { Navigate, Outlet } from 'react-router'

const OnlyAdmin = () => {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)
    return isAuthenticated && user?.isAdmin ? <Outlet /> : <Navigate to={'/signin'} />
}

export default OnlyAdmin