import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Navigate } from "react-router";

export const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    if (isAuthenticated) {
        return <Navigate to="/home" replace />;
    }

    return children;
};
