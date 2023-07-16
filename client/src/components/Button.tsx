import React from 'react'

interface ButtonTypes {
    children: React.ReactNode
    transparent?: boolean
}

const Button = ({children, onClick, className, transparent, disabled, type = 'button'}: ButtonTypes & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${transparent ? 'border border-blue-700 hover:bg-blue-700 text-blue-700 hover:text-white' : 'bg-blue-700 hover:bg-blue-800 text-white'} ${disabled ? 'pointer-events-none' : ''} px-4 py-1.5 rounded ${className ? className : ''}`}>
        {children}
    </button>
  )
}

export default Button