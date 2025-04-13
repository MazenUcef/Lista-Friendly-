import { signupUser, UserData } from "../redux/authSlice";
import { AppDispatch, RootState } from "../store";
import { useDispatch, useSelector } from 'react-redux';

export const useSignUp = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user, status, error } = useSelector((state: RootState) => state.auth);

    const signup = async (userData: UserData) => {
        try {
            const result = await dispatch(signupUser(userData)).unwrap();
            return result;
        } catch (error) {
            // Rethrow the string error message
            throw typeof error === 'string' ? error : 'Signup failed';
        }
    };



    return {
        user,
        authStatus: status,
        error,
        signup,
    };
}