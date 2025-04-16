import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { updateUser } from "../redux/userSlice";

interface UserData {
    fullName?: string;
    email?: string;
    profilePicture?: string;
    password?: string;
}

export const useUpdateUser = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user, status, error } = useSelector((state: RootState) => state.user);

    const update = async (userId: string, userData: UserData) => {
        if (!userId) {
            throw new Error("No user ID available for update");
        }

        try {
            const result = await dispatch(updateUser({ 
                userId,
                ...userData 
            })).unwrap();
            return result;
        } catch (error) {
            throw typeof error === 'string' ? error : 'Update failed';
        }
    };

    return {
        user,
        status,
        error,
        update
    };
};