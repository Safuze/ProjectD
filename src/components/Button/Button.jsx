
function Button({children, onClick, id}) {
    return <button id={id} className="btn" onClick={onClick}>{ children }</button>  
}

export default Button;