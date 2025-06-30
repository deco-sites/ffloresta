interface Props {
  /**
  * @description The description of name.
  */
  name?: string;
}

export interface Returns {
  name: string
}

export default function loader({ name  = "Capy" }: Props): Returns {
  return { 
    name,
  }
}