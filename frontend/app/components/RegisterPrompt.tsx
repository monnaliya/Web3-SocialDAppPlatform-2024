import React from 'react';

interface RegisterPromptProps {
    onClose: () => void;
    onRegister: () => void;
}

const RegisterPrompt: React.FC<RegisterPromptProps> = ({ onClose, onRegister }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h2 className="text-xl font-semibold mb-4">You're not registered</h2>
                <p className="mb-6">Please register to fully access the platform features.</p>
                <button
                    onClick={onRegister}
                    className="bg-blue-500 text-white py-2 px-4 rounded mr-4"
                >
                    Register Now
                </button>
                <button
                    onClick={onClose}
                    className="bg-gray-500 text-white py-2 px-4 rounded"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default RegisterPrompt;
