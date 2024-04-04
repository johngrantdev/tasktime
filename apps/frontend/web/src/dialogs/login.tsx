import React, { useState } from 'react'
import { toast } from '../components/ui/use-toast'
import { SingleInput } from '../components/ui/singleInput'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle
} from 'components/ui/dialog'

const Login = () => {
  const [open, setOpen] = useState(false)

  const handleSubmit = (email: string) => {
    setOpen(false)
    if (email) {
      const apiEndpoint = `${import.meta.env.VITE_API_URL}/auth/login`
      fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ destination: email })
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            toast({
              description: `An email has been sent to ${email}.`
            })
          }
          if (data.error) {
            toast({
              variant: 'destructive',
              title: `${data.statusCode} ${data.error}`,
              description: data.message
            })
          }
        })
        .catch((error) => console.error('Error:', error))
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="h-9 rounded-md border border-input px-3 hover:bg-accent hover:text-accent-foreground">
        Launch
      </DialogTrigger>
      <DialogContent closeButton={false} className="border-none bg-transparent">
        <DialogTitle>Enter your email to recieve a login link.</DialogTitle>
        <SingleInput
          handleEnter={handleSubmit}
          placeholder="Email Address"
          type="email"
        />
      </DialogContent>
    </Dialog>
  )
}

export { Login }
