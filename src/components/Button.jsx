import React from 'react';

const Button = ({ onClick, children, className }) => {
    return (
        <button type="button" onClick={onClick} className={`text-sm lg:text-xl font-semibold text-white bg-ButtonBg rounded-md py-2 px-5 lg:py-[6px] lg:px-[50px] ${className}`}>
            {children}
        </button>
    );
}

export default Button;
