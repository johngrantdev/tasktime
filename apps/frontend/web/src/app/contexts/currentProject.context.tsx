import { createContext, useContext, useState } from 'react'

type CurrentProjectContextType = {
  projectId: string
  setProjectId: React.Dispatch<React.SetStateAction<string>>
}

type CurrentProjectProviderProps = {
  children: React.ReactNode
}

const CurrentProjectContext = createContext<
  CurrentProjectContextType | undefined
>(undefined)

export const useCurrentProject = () => {
  const context = useContext(CurrentProjectContext)
  if (!context) {
    throw new Error(
      'useCurrentProject must be used within a CurrentProjectProvider'
    )
  }
  return context
}

export const CurrentProjectProvider: React.FC<CurrentProjectProviderProps> = ({
  children
}) => {
  const [projectId, setProjectId] = useState<string>('')

  return (
    <CurrentProjectContext.Provider value={{ projectId, setProjectId }}>
      {children}
    </CurrentProjectContext.Provider>
  )
}
