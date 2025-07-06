type Props = {
    value : string
    onChange : (value : string | undefined) => void
    disabled? : boolean
    placeholder? : string
}

export const AmountInput = ({
    value,
    onChange,
    disabled,
    placeholder
} : Props) =>{
    return(
        <div>
            Hello
        </div>
    )
}