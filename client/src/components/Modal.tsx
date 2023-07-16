import React, { useRef, useEffect } from 'react'

interface ModalType {
    isOpen: boolean
    closeModal?: () => void
    className?: string
    children: React.ReactNode
}

const Modal = ({isOpen, closeModal, className ,children}: ModalType) => {
  const modalRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      const checkIfClickedOutside = (e: MouseEvent) => {
        if (closeModal && modalRef.current && !modalRef.current.contains(e.target as Node)) {
          closeModal()
        }
      }
      if (isOpen) {
        document.addEventListener("click", checkIfClickedOutside)
      }

      return () => {
        document.removeEventListener("click", checkIfClickedOutside)
      }
    }, [closeModal, isOpen])

    useEffect(() => {
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = "auto"
      }
    }, [])

    if (!isOpen) return <></>

    return (
      <div className='h-screen w-full absolute top-0 right-0 bg-gray-950 bg-opacity-70 flex items-center justify-center'>
          <div ref={modalRef} className={`w-full sm:w-3/4 xl:w-1/4 bg-gray-800 rounded-md p-4 mx-2 ${className ? className : ''}`}>
            {children}
          </div>
      </div>
    )
}

export default Modal