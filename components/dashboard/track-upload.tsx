"use client";

    import { useState } from "react";
    import { useForm } from "react-hook-form";
    import { zodResolver } from "@hookform/resolvers/zod";
    import { z } from "zod";
    import { useToast } from "@/hooks/use-toast";
    import { Button } from "@/components/ui/button";
    import {
      Form,
      FormControl,
      FormField,
      FormItem,
      FormLabel,
      FormMessage,
    } from "@/components/ui/form";
    import { Input } from "@/components/ui/input";
    import { AudioUploader } from "./track-upload/audio-uploader";
    import { useContract } from "@thirdweb-dev/react";
    import { MUSIC_NFT_CONTRACT_ADDRESS } from "@/lib/constants";

    const formSchema = z.object({
      title: z.string().min(1, "Title is required"),
      price: z.string().min(1, "Price is required"),
      royaltyFee: z.string().min(1, "Royalty fee is required"),
      audioFile: z.any(),
    });

    export function TrackUpload() {
      const [isLoading, setIsLoading] = useState(false);
      const { toast } = useToast();
      const { contract } = useContract(MUSIC_NFT_CONTRACT_ADDRESS);

      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          title: "",
          price: "",
          royaltyFee: "2.5",
        },
      });

      const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
          setIsLoading(true);
          // Implementation for minting track NFT will go here
          console.log("Minting track with:", values);
          toast({
            title: "Success",
            description: "Track uploaded successfully",
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to upload track",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };

      return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="audioFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Audio File</FormLabel>
                  <FormControl>
                    <AudioUploader
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (ETH)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.001"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="royaltyFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Royalty Fee (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={isLoading}>
              Upload Track
            </Button>
          </form>
        </Form>
      );
    }
