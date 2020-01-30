declare module "@react95/core" {
    type ButtonProps = { value?: string; onClick?: () => void }
    export const Button: React.FC<ButtonProps>

    type InputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
    export const Input: React.FC<InputProps>

    export type TextAreaProps = React.DetailedHTMLProps<
        React.TextareaHTMLAttributes<HTMLTextAreaElement>,
        HTMLTextAreaElement
    >
    export const TextArea: React.FC<TextAreaProps>
    type DropdownProps = React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> & {
        options: string[]
    }
    export const Dropdown: React.FC<DropdownProps>
}
