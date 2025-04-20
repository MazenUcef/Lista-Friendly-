import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { motion } from "framer-motion"
import { FaGoogle } from "react-icons/fa"
import { auth } from "../firebase"
import { useGoogleAuth } from "../api/authApi"
import { useNavigate } from "react-router"
import toast from "react-hot-toast"

const Oauth = () => {
    const { signInWithGoogle } = useGoogleAuth();
    const navigate = useNavigate()


    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: "select_account" })
        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider)
            const { user } = resultsFromGoogle;

            const res = await signInWithGoogle({
                email: user.email || '',
                name: user.displayName || '',
                googlePhotoUrl: user.photoURL || undefined,
                firebaseUid: user.uid
            });
        
            if (res) {
                navigate('/')
            } else {
                toast.error("Google sign in failed")
                return
            }
        } catch (error) {
            console.error("Google sign in error:", error);
        }
    }
    return (
        <motion.button
            onClick={handleGoogleClick}
            className="w-full cursor-pointer border-2 border-black text-black font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <FaGoogle color="red" />
            Continue with Google
        </motion.button>
    )
}

export default Oauth