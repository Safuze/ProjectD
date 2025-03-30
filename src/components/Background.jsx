
export default function Background( {id} ) {
    return (
        <div className="background" id={id}>
            <div className="background__image background__image--front"></div>
            <div className="background__image background__image--back"></div>
        </div>
    )
}