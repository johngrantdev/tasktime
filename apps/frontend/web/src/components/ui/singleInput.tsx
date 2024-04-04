import React, { useState } from 'react'
import { Button } from './button'

type SingleInputProps = {
  handleEnter: (input: string) => void
  placeholder: string
  type: string
}

const SingleInput: React.FC<SingleInputProps> = ({
  handleEnter,
  placeholder,
  type
}) => {
  const [input, setInput] = useState('')

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleEnter(input)
    }
  }

  return (
    <div className="flex h-fit w-full rounded-md border border-input p-2 ring-offset-background">
      <input
        type={type}
        value={input}
        className="ml-1 w-full bg-transparent file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        placeholder={placeholder}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => handleKeyUp(e)}
      />
      <Button asChild className={'m-0'} variant={'outline'} size={'sm'}>
        <div onClick={() => handleEnter(input)}>Enter</div>
      </Button>
    </div>
  )
}

export { SingleInput }
