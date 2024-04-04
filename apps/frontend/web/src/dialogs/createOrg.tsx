import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader
} from 'components/ui/dialog'
import { SingleInput } from 'components/ui/singleInput'
import { toast } from 'components/ui/use-toast'
import { useState } from 'react'

interface CreateOrgProps {
  onOrgCreated: () => void
}

const CreateOrg = ({ onOrgCreated }: CreateOrgProps) => {
  const [open, setOpen] = useState(false)

  const handleSubmit = (orgName: string) => {
    setOpen(false)
    if (orgName) {
      const apiEndpoint = `${import.meta.env.VITE_SERVER_URL}/org`
      const token = localStorage.getItem('jwt')
      fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: orgName })
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.id) {
            onOrgCreated()
            toast({
              description: `${orgName} has been created.`
            })
          }
          if (data.statusCode === 401) {
            toast({
              variant: 'destructive',
              description: `${data.statusCode} ${data.message}`
            })
          }
        })
        .catch((error) => console.error('Error:', error))
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="h-9 rounded-md border border-input px-3 hover:bg-accent hover:text-accent-foreground">
        Create New Organization
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Organization</DialogTitle>
          <DialogDescription>
            Fill in the form to create a new Organization.
          </DialogDescription>
        </DialogHeader>
        <SingleInput
          handleEnter={handleSubmit}
          placeholder="Organization Name"
          type="text"
        />
      </DialogContent>
    </Dialog>
  )
}

export default CreateOrg
