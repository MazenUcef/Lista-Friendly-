

interface DeleteConfirmationModalProps {
    confirmDelete: () => void;
    setShowDeleteModal: (show: boolean) => void;
}

const DeleteConfirmationModal = ({ confirmDelete, setShowDeleteModal }:DeleteConfirmationModalProps) => {
    return (
        <div
            id="logout-modal"
            tabIndex={-1}
            aria-hidden="true"
            className="fixed inset-0 z-50 flex justify-center items-center bg-black/50"
        >
            <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Confirm Delete
                        </h3>
                        <button
                            type="button"
                            onClick={() => setShowDeleteModal(false)}
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="p-4 md:p-5 space-y-4">
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete your account?
                        </p>
                    </div>
                    <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                        <button
                            onClick={confirmDelete}
                            type="button"
                            className="text-white bg-[#71BE63] cursor-pointer hover:bg-[#71BE00] focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-800"
                        >
                            Yes, Delete My Account
                        </button>
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            type="button"
                            className="py-2.5 cursor-pointer px-5 ms-3 text-sm font-medium text-[#71BE00] focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-[#71BE00] focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeleteConfirmationModal