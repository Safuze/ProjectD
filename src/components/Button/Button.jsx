import classNames from 'classnames';

function Button({children,  className, ...props}) {
    const btnClass = classNames('btn', className);
    return <button 
                className={btnClass} 
                {...props}
            >
                { children }
            </button>  
}

export default Button;