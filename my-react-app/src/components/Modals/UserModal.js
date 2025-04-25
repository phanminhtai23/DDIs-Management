import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

     return (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
             <div className="bg-white rounded-lg shadow-lg p-7 max-w-4xl w-[95%] max-h-[90vh] overflow-y-auto">
                 {" "}
                 {/* Update these styles */}
                 <div className="flex justify-end">
                     <button
                         onClick={onClose}
                         className="text-gray-500 hover:text-gray-700"
                     >
                         <svg
                             className="w-6 h-6"
                             fill="none"
                             stroke="currentColor"
                             viewBox="0 0 24 24"
                             xmlns="http://www.w3.org/2000/svg"
                         >
                             <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 strokeWidth="2"
                                 d="M6 18L18 6M6 6l12 12"
                             ></path>
                         </svg>
                     </button>
                 </div>
                 {children}
             </div>
         </div>
     );
};

const CompactModal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-5 max-w-md w-[85%] max-h-[80vh] overflow-y-auto">
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            ></path>
                        </svg>
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

export { Modal , CompactModal};
