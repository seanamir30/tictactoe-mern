import React from 'react'

interface PageContainerType {
    children: React.ReactNode
    className?: string
}

const PageContainer = ({children, className}: PageContainerType) => {
  return (
    <main className={`w-full min-h-screen text-white bg-gray-900 flex flex-col p-4 ${className ? className : ''}`}>
        {children}
    </main>
  )
}

export default PageContainer