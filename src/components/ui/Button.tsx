import React, { HTMLAttributes } from 'react'
import { useButton } from '@react-aria/button'


interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
    onClick?: (e?: any) => void;
    className?: HTMLAttributes<HTMLButtonElement>['className'];
}

function Button({ children, onClick, className }: ButtonProps) {
    const buttonRef = React.useRef<HTMLButtonElement>(null)
    const { buttonProps } = useButton({
        onPress: (e) => {
            alert('Button pressed')
            onClick && onClick();
        }
    }, buttonRef)
    return (
        <button className={`${className} focus:outline-none touch-none select-none`} {...buttonProps} style={{ WebkitTapHighlightColor: 'transparent' }}>{children}</button>
    )
}

export default Button