import { useForm, Controller } from 'react-hook-form';
import { FaLeaf, FaUser, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router';
import logo from '../assets/images/logo.png';
import { useSignIn } from '../api/authApi';
import toast from 'react-hot-toast';
import Oauth from '../components/Oauth';



type LoginFormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

const SignIn = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });
  const { authStatus, signin } = useSignIn()
  const navigate = useNavigate()

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await signin({
        email: data.email,
        password: data.password
      });

      if (res) {
        navigate('/home');
      }
    } catch (error) {
      toast.error(error as string);
    }
  };

  return (
    <div className="w-[85%] md:w-[70%] min-h-screen mx-auto flex justify-center items-center">
      <motion.div
        className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-[#71BE63] text-white p-6 text-center">
          <div className="inline-block p-3 rounded-full mb-4">
            <img
              src={logo}
              alt="Logo"
              className="h-32"
            />
          </div>
          <h1 className="text-2xl font-bold">Welcome Back to <span className="font-bold text-[#71BE63] bg-white p-1 rounded-xl">Friendly <span className="text-black font-bold">ليسته</span></span></h1>
          <p className="mt-2">Sign in to continue your eco-friendly journey</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email Address</label>
            <Controller
              name="email"
              control={control}
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              }}
              render={({ field }) => (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    {...field}
                    type="email"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
              )}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <Controller
              name="password"
              control={control}
              rules={{
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              }}
              render={({ field }) => (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    {...field}
                    type="password"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
              )}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between mb-6">
            <Controller
              name="rememberMe"
              control={control}
              render={({ field }) => (
                <label className="flex items-center text-gray-700">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    checked={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                  <span className="ml-2">Remember me</span>
                </label>
              )}
            />
          </div>

          {/* Submit Button with Loading State */}
          <motion.button
            type="submit"
            className="w-full cursor-pointer bg-[#71BE63] hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={authStatus === 'loading'}
          >
            {authStatus === 'loading' ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </span>
            ) : (
              <>
                <FaLeaf />
                Sign In
              </>
            )}
          </motion.button>
        </form>
        <div className="px-6">
          <Oauth />
          <div className="my-2 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-green-600 hover:text-green-800 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;