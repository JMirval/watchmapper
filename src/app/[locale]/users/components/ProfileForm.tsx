"use client"
import { useMutation } from "@blitzjs/rpc"
import { Form, FORM_ERROR } from "@/components/Form"
import { UpdateProfile } from "@/lib/validations"
import updateProfile from "../mutations/updateProfile"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ProfileFormProps {
  user: any
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [updateProfileMutation] = useMutation(updateProfile)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your personal information and preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <Form
          schema={UpdateProfile}
          initialValues={{
            name: user.name || "",
            bio: user.bio || "",
            location: user.location || "",
            phone: user.phone || "",
            avatar: user.avatar || "",
          }}
          onSubmit={async (values) => {
            try {
              await updateProfileMutation(values)
              toast.success("Profile updated successfully!")
            } catch (error: any) {
              toast.error("Failed to update profile")
              return { [FORM_ERROR]: error.toString() }
            }
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your full name"
                defaultValue={user.name || ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="Enter your phone number"
                defaultValue={user.phone || ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="Enter your location"
                defaultValue={user.location || ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatar">Profile Picture URL</Label>
              <Input
                id="avatar"
                name="avatar"
                placeholder="Enter profile picture URL"
                defaultValue={user.avatar || ""}
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                placeholder="Tell us about yourself"
                rows={4}
                defaultValue={user.bio || ""}
              />
            </div>
          </div>

          <div className="mt-6">
            <Button type="submit" className="w-full">
              Update Profile
            </Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  )
}
