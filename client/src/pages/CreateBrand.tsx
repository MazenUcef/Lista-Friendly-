import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { FaInstagram, FaTwitter, FaFacebook, FaLinkedin, FaMapMarkerAlt, FaYoutube, FaAddressCard } from 'react-icons/fa';
import { FiUpload } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { RootState } from '../store';
import { useCreatePost } from '../api/postsApi';
import { CATEGORIES } from '../constants';

type SocialLinks = {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    youtube?: string;
    website?: string;
};

type FormData = {
    name: string;
    description: string;
    location: string;
    category: string;
    socialLinks: SocialLinks;
    image: FileList | null;
};

const CreateBrand = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const { control, handleSubmit, formState: { errors }, register, watch, reset } = useForm<FormData>();
    const { createStatus, createError, createNewPost } = useCreatePost();
    const imagePreview = watch("image")?.[0];
    const egyptCities: string[] = [
        "Cairo",
        "Alexandria",
        "Giza",
        "Shubra El Kheima",
        "Port Said",
        "Suez",
        "Luxor",
        "Mansoura",
        "Tanta",
        "Asyut",
        "Ismailia",
        "Faiyum",
        "Zagazig",
        "Aswan",
        "Damietta",
        "Damanhur",
        "Beni Suef",
        "Hurghada",
        "Qena",
        "Sohag",
        "Minya",
        "Kafr El Sheikh",
        "Banha",
        "Mahalla El Kubra",
        "Arish",
        "10th of Ramadan",
        "Obour",
        "Sadat City",
        "New Cairo",
        "6th of October City",
        "Helwan",
        "Nasr City",
        "Maadi",
        "Sheikh Zayed",
        "New Damietta"
    ];
    useEffect(() => {
        if (createError) {
            toast.error(createError);
        }
    }, [createError]);

    const onSubmit = async (data: FormData) => {
        try {
            const socialLinksArray = Object.entries(data.socialLinks)
            .filter(([_, value]) => value)
            .map(([_, value]) => value);

            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('description', data.description);
            formData.append('location', data.location);
            formData.append('socialLinks', JSON.stringify(socialLinksArray));
            formData.append('isAdmin', String(user?.isAdmin || false));

            if (data.image?.[0]) {
                formData.append('image', data.image[0]);
            }

            await createNewPost({
                name: data.name,
                description: data.description,
                category: data.category,
                location: data.location,
                socialLinks: socialLinksArray,
                file: data.image?.[0],
            });

            // Reset form after successful submission
            reset({
                name: '',
                description: '',
                location: '',
                socialLinks: {
                    instagram: '',
                    twitter: '',
                    facebook: '',
                    linkedin: '',
                    youtube: ''
                },
                image: null
            });
        } catch (error) {
            console.error('Error creating brand:', error);
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen p-4 md:p-8 bg-white"
        >
            <div className="">
                <motion.h1
                    variants={itemVariants}
                    className="text-3xl md:text-4xl font-bold text-[#71BE63] mb-8 text-start"
                >
                    Create a New Brand
                </motion.h1>

                <motion.form
                    onSubmit={handleSubmit(onSubmit)}
                    variants={containerVariants}
                    className="bg-white rounded-xl overflow-hidden "
                >
                    <div className="p-6 md:p-8">
                        {/* Brand Image Upload */}
                        <motion.div variants={itemVariants} className="mb-8">
                            <label className="block text-gray-700 mb-3 font-medium">Brand Image</label>
                            <div className="flex flex-col items-start">
                                <label className="cursor-pointer">
                                    <div className="w-[20rem] h-[25rem] rounded-md border-2 border-dashed border-[#71BE63] flex items-center justify-center overflow-hidden bg-gray-50 hover:bg-gray-100 transition">
                                        {imagePreview ? (
                                            <img
                                                src={URL.createObjectURL(imagePreview)}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="text-center p-4">
                                                <FiUpload className="mx-auto text-3xl text-[#71BE63] mb-2" />
                                                <p className="text-sm text-gray-500">Upload Image</p>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        {...register("image")}
                                    />
                                </label>
                            </div>
                        </motion.div>

                        {/* Brand Name */}
                        <motion.div variants={itemVariants} className="mb-6">
                            <label htmlFor="name" className="block text-gray-700 mb-2 font-medium">
                                Brand Name *
                            </label>
                            <Controller
                                name="name"
                                control={control}
                                rules={{ required: 'Brand name is required' }}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="text"
                                        id="name"
                                        placeholder="EcoFriendly Co."
                                        className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#71BE63] focus:border-transparent`}
                                    />
                                )}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                            )}
                        </motion.div>

                        {/* Description */}
                        <motion.div variants={itemVariants} className="mb-6">
                            <label htmlFor="description" className="block text-gray-700 mb-2 font-medium">
                                Description *
                            </label>
                            <Controller
                                name="description"
                                control={control}
                                rules={{ required: 'Description is required', minLength: { value: 10, message: 'Description must be at least 10 characters' } }}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        id="description"
                                        rows={4}
                                        placeholder="Tell us about your brand's mission and values..."
                                        className={`w-full px-4 py-3 rounded-lg border ${errors.description ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#71BE63] focus:border-transparent`}
                                    />
                                )}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                            )}
                        </motion.div>

                        {/* Category Dropdown */}
                        <motion.div variants={itemVariants} className="mb-6">
                            <label htmlFor="category" className="block text-gray-700 mb-2 font-medium">
                                Category *
                            </label>
                            <div className="relative">
                                <Controller
                                    name="category"
                                    control={control}
                                    rules={{ required: 'Category is required' }}
                                    render={({ field }) => (
                                        <>
                                            <button
                                                id="categoryDropdownButton"
                                                className={`w-full text-left px-4 py-3 rounded-lg border ${errors.category ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#71BE63] focus:border-transparent flex justify-between items-center`}
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    document.getElementById('categoryDropdown')?.classList.toggle('hidden');
                                                    // Close location dropdown if open
                                                    document.getElementById('locationDropdown')?.classList.add('hidden');
                                                }}
                                            >
                                                {field.value || 'Select a category'}
                                                <svg className="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                                </svg>
                                            </button>
                                            <div
                                                id="categoryDropdown"
                                                className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-full absolute mt-1 max-h-60 overflow-y-auto"
                                            >
                                                <ul className="py-2 text-sm text-gray-700">
                                                    {CATEGORIES.map((category) => (
                                                        <li key={category}>
                                                            <button
                                                                type="button"
                                                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    field.onChange(category);
                                                                    document.getElementById('categoryDropdown')?.classList.add('hidden');
                                                                }}
                                                            >
                                                                {category}
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </>
                                    )}
                                />
                                {errors.category && (
                                    <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                                )}
                            </div>
                        </motion.div>

                        {/* Location Dropdown */}
                        <motion.div variants={itemVariants} className="mb-6">
                            <label htmlFor="location" className="block text-gray-700 mb-2 font-medium">
                                Location *
                            </label>
                            <div className="relative">
                                <Controller
                                    name="location"
                                    control={control}
                                    rules={{ required: 'Location is required' }}
                                    render={({ field }) => (
                                        <>
                                            <button
                                                id="locationDropdownButton"
                                                className={`w-full text-left pl-10 pr-4 py-3 rounded-lg border ${errors.location ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#71BE63] focus:border-transparent flex justify-between items-center`}
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    document.getElementById('locationDropdown')?.classList.toggle('hidden');
                                                    // Close category dropdown if open
                                                    document.getElementById('categoryDropdown')?.classList.add('hidden');
                                                }}
                                            >
                                                {field.value || 'Select a location'}
                                                <svg className="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                                </svg>
                                            </button>
                                            <FaMapMarkerAlt className="absolute left-3 top-4 text-[#71BE63]" />
                                            <div
                                                id="locationDropdown"
                                                className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-full absolute mt-1 max-h-60 overflow-y-auto"
                                            >
                                                <ul className="py-2 text-sm text-gray-700">
                                                    {egyptCities.map((location) => (
                                                        <li key={location}>
                                                            <button
                                                                type="button"
                                                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    field.onChange(location);
                                                                    document.getElementById('locationDropdown')?.classList.add('hidden');
                                                                }}
                                                            >
                                                                {location}
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </>
                                    )}
                                />
                                {errors.location && (
                                    <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                                )}
                            </div>
                        </motion.div>

                        {/* Social Links */}
                        <motion.div variants={itemVariants} className="mb-8">
                            <h3 className="block text-gray-700 mb-3 font-medium">Social Links</h3>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <FaInstagram className="text-[#71BE63] mr-3 text-xl" />
                                    <Controller
                                        name="socialLinks.instagram"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                type="url"
                                                placeholder="https://instagram.com/yourbrand"
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#71BE63] focus:border-transparent"
                                            />
                                        )}
                                    />
                                </div>

                                <div className="flex items-center">
                                    <FaTwitter className="text-[#71BE63] mr-3 text-xl" />
                                    <Controller
                                        name="socialLinks.twitter"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                type="url"
                                                placeholder="https://twitter.com/yourbrand"
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#71BE63] focus:border-transparent"
                                            />
                                        )}
                                    />
                                </div>

                                <div className="flex items-center">
                                    <FaFacebook className="text-[#71BE63] mr-3 text-xl" />
                                    <Controller
                                        name="socialLinks.facebook"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                type="url"
                                                placeholder="https://facebook.com/yourbrand"
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#71BE63] focus:border-transparent"
                                            />
                                        )}
                                    />
                                </div>

                                <div className="flex items-center">
                                    <FaLinkedin className="text-[#71BE63] mr-3 text-xl" />
                                    <Controller
                                        name="socialLinks.linkedin"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                type="url"
                                                placeholder="https://linkedin.com/company/yourbrand"
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#71BE63] focus:border-transparent"
                                            />
                                        )}
                                    />
                                </div>

                                <div className="flex items-center">
                                    <FaYoutube className="text-[#71BE63] mr-3 text-xl" />
                                    <Controller
                                        name="socialLinks.youtube"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                type="url"
                                                placeholder="https://youtube.com/yourbrand"
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#71BE63] focus:border-transparent"
                                            />
                                        )}
                                    />
                                </div>

                                <div className="flex items-center">
                                    <FaAddressCard className="text-[#71BE63] mr-3 text-xl" />
                                    <Controller
                                        name="socialLinks.website"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                type="url"
                                                placeholder="https://website.com/yourbrand"
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#71BE63] focus:border-transparent"
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.div
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="mt-8"
                        >
                            <button
                                type="submit"
                                disabled={createStatus === 'loading'}
                                className="w-full bg-[#71BE63] hover:bg-[#5aa34a] cursor-pointer text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center"
                            >
                                {createStatus === 'loading' ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating...
                                    </>
                                ) : (
                                    "Create Brand"
                                )}
                            </button>
                        </motion.div>
                    </div>
                </motion.form>
            </div>
        </motion.div>
    );
};

export default CreateBrand;