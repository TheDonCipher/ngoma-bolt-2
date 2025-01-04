"use client";

    import { useState } from "react";
    import { useForm } from "react-hook-form";
    import { zodResolver } from "@hookform/resolvers/zod";
    import { z } from "zod";
    import {
      Dialog,
      DialogContent,
      DialogHeader,
      DialogTitle,
    } from "@/components/ui/dialog";
    import {
      Form,
      FormControl,
      FormField,
      FormItem,
      FormLabel,
      FormMessage,
    } from "@/components/ui/form";
    import { Input } from "@/components/ui/input";
    import { Button } from "@/components/ui/button";
    import { Textarea } from "@/components/ui/textarea";
    import { ImageUpload } from "@/components/shared/image-upload";
    import { useToast } from "@/hooks/use-toast";

    const formSchema = z.object({
      username: z.string().min(3, "Username must be at least 3 characters"),
      bio: z.string().max(160, "Bio must not exceed 160 characters"),
      profileImage: z.string().optional(),
    });

    interface EditProfileDialogProps {
      open: boolean;
      onOpenChange: (open: boolean) => void;
    }

    export function EditProfileDialog({ open, onOpenChange }: EditProfileDialogProps) {
      const [isLoading, setIsLoading] = useState(false);
      const { toast } = useToast();

      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          username: "John Doe",
          bio: "",
          profileImage: "",
        },
      });

      const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
          setIsLoading(true);
          // Implementation for updating profile will go here
          console.log("Updating profile with:", values);
          toast({
            title: "Success",
            description: "Profile updated successfully",
          });
          onOpenChange(false);
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to update profile",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };

      return (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="profileImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Image</FormLabel>
                      <FormControl>
                        <ImageUpload
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input disabled={isLoading} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          disabled={isLoading}
                          {...field}
                          placeholder="Tell us about yourself..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isLoading} className="w-full">
                  Save Changes
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      );
    }
