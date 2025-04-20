import { deleteUser, deleteUsers, getUsers, googleAuth, GoogleAuthData, signinUser, signoutUser, signupUser, updateUser, UserCredentials, UserRegistration } from "../redux/authSlice";
import { AppDispatch, RootState } from "../store";
import { useDispatch, useSelector } from 'react-redux';

export const useSignUp = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user, status, error } = useSelector((state: RootState) => state.auth);

    const signup = async (userData: UserRegistration) => {
        try {
            const result = await dispatch(signupUser(userData)).unwrap();
            return result;
        } catch (error) {
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



export const useSignIn = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user, status, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

    const signin = async (userData: UserCredentials) => {
        try {
            const result = await dispatch(signinUser(userData)).unwrap();
            return result;
        } catch (error) {
            throw typeof error === 'string' ? error : 'Signup failed';
        }
    };



    return {
        user,
        authStatus: status,
        error,
        signin,
        isAuthenticated
    };
}



export const useSignOut = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user, status, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

    const signout = async () => {
        try {
            const result = await dispatch(signoutUser()).unwrap();
            return result;
        } catch (error) {
            throw typeof error === 'string' ? error : 'Signout failed';
        }
    };



    return {
        user,
        authStatus: status,
        error,
        signout,
        isAuthenticated
    };
}




export const useGoogleAuth = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user, status, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

    const signInWithGoogle = async (googleData: GoogleAuthData) => {
        try {
            const result = await dispatch(googleAuth(googleData)).unwrap();
            return result;
        } catch (error) {
            throw typeof error === 'string' ? error : 'Google authentication failed';
        }
    };



    return {
        user,
        authStatus: status,
        error,
        signInWithGoogle,
        isAuthenticated
    };
}




export const useUpdateUser = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user, status, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

    const update = async (updateData: {
        userId: string;
        formData: {
            fullName?: string;
            email?: string;
            password?: string;
            profilePicture?: string;
        };
        file?: File;
    }) => {
        try {
            const result = await dispatch(updateUser(updateData)).unwrap();
            return result;
        } catch (error) {
            throw typeof error === 'string' ? error : 'User update failed';
        }
    };

    return {
        user,
        authStatus: status,
        error,
        update,
        isAuthenticated
    };
}





export const useDeleteUser = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user, status, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

    const deleteAccount = async (userId: string) => {
        try {
            const result = await dispatch(deleteUser(userId)).unwrap();
            return result;
        } catch (error) {
            throw typeof error === 'string' ? error : 'Account deletion failed';
        }
    };

    return {
        user,
        deleteStatus: status,
        error,
        deleteAccount,
        isAuthenticated
    };
};




export const useGetUsers = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user, status, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

    // Add usersList to your auth state if you want to store the fetched users
    const usersList = useSelector((state: RootState) => state.auth.usersList || []);
    const pagination = useSelector((state: RootState) => state.auth.pagination);
    const stats = useSelector((state: RootState) => state.auth.stats);

    const fetchUsers = async (params: {
        startIndex?: number;
        limit?: number;
        sort?: 'asc' | 'desc';
    }) => {
        try {
            const result = await dispatch(getUsers(params)).unwrap();
            return result;
        } catch (error) {
            throw typeof error === 'string' ? error : 'Failed to fetch users';
        }
    };

    return {
        users: usersList,
        pagination,
        stats,
        authStatus: status,
        error,
        fetchUsers,
        isAuthenticated,
        currentUser: user // The currently logged-in user
    };
}






export const useDeleteUsers = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user, status, error, isAuthenticated, usersList } = useSelector((state: RootState) => state.auth);

    const deleteUserByAdmin = async (userId: string) => {
        try {
            const result = await dispatch(deleteUsers(userId)).unwrap();

            
            return {
                ...result,
                deletedUserId: userId
            };
        } catch (error) {
            throw typeof error === 'string' ? error : 'Failed to delete user account';
        }
    };

    return {
        user,
        authStatus: status,
        error,
        deleteUserByAdmin,
        isAuthenticated,
        usersList
    };
};