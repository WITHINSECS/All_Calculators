import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import React from 'react'
import { ToastContainer} from 'react-toastify';

interface WrapperProps {
    children: React.ReactNode;
    className?: string
}

const Wrapper: React.FC<WrapperProps> = ({ children, className }) => {
    return (
        <div>
            <Navbar />
            <ToastContainer />
            <div className={`${className}`}>
                {children}
            </div>
            <Footer />
        </div>
    )
}

export default Wrapper