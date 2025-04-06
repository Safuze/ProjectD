import { options } from '../data'

export default function Header() {
    return (
        <header>
          <h1>{'Документы на основе'.toUpperCase()} <br />{'готовых шаблонов'.toUpperCase()}</h1>
          <div>
            <ul>
              <Description {...options[0]} />
              <Description {...options[1]} />
              <Description {...options[2]} />
              <Description {...options[3]} />
              <Description {...options[4]} />
            </ul>
          </div>
          
        </header>
      )
}

export function Description(props) {
    return (
        <li>
            <p>
                {props.option.toUpperCase()}
            </p>
        </li>
    )
}