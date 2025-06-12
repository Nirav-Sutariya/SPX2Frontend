const Button = ({ onClick, children, className }) => {
    return (
        <button type="button" onClick={onClick} className={`text-sm lg:text-xl font-semibold text-white bg-ButtonBg rounded-md py-2 px-5 lg:py-[6px] lg:px-[50px] shadow-[inset_-2px_-2px_5px_0_#104566] active:shadow-[inset_2px_2px_5px_0_#104566] ${className}`} >
            {children}
        </button>
    );
}

export default Button;
