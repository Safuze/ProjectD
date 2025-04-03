import classNames from 'classnames';

function Button({children, onClick, id, className, disabled}) {
    const btnClass = classNames('btn', className);
    return <button 
                id={id} 
                className={btnClass} 
                onClick={onClick}       
                disabled={disabled}
            >
                { children }
            </button>  
}

export default Button;