import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader
} from 'components/ui/dialog'
import { toast } from 'components/ui/use-toast'

interface profileDialogProps {
  modal: boolean
  open: boolean
  onOpenChange: (state: boolean) => void
}

const ProfileDialog = ({ modal, open, onOpenChange }: profileDialogProps) => {
  const handleSubmit = (orgName: string) => {
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
    <Dialog
      modal={modal}
      open={open}
      onOpenChange={(profileOpen) => onOpenChange(profileOpen)}
    >
      <DialogContent closeButton={true}>
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
          <DialogDescription>Update your profile.</DialogDescription>
        </DialogHeader>

        <Input placeholder="First Name" type="text" />
        <Input placeholder="Last Name" type="text" />
        <Button on>Update</Button>
      </DialogContent>
    </Dialog>
  )
}

export default ProfileDialog
