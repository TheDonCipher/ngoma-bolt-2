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
    import { Textarea } from "@/components/ui/textarea";
    import {
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
    } from "@/components/ui/select";
    import { AudioUploader } from "./audio-uploader";
    import { CollaboratorSelect } from "./collaborator-select";
    import { useContract } from "@thirdweb-dev/react";
    import { MUSIC_NFT_CONTRACT_ADDRESS } from "@/lib/constants";
    import { uploadToIPFS } from "@/lib/utils/ipfs";
    import { validateInput } from "@/lib/utils/security";

    const formSchema = z.object({
      title: z.string().min(1, "Title is required").refine(validateInput, "Invalid characters in title"),
      description: z.string().min(1, "Description is required").refine(validateInput, "Invalid characters in description"),
      genre: z.string().min(1, "Genre is required"),
      price: z.string().min(1, "Price is required"),
      royaltyFee: z.string().min(1, "Royalty fee is required"),
      collaborators: z.array(z.string()).optional(),
      audioFile: z.any().refine((file) => file, "Audio file is required"),
      copyrightInfo: z.string().optional().refine(validateInput, "Invalid characters in copyright info"),
      licenseType: z.enum(["standard", "exclusive", "creative-commons"]),
    });

    const GENRES = [
      "Afrobeats",
      "Afro-fusion",
      "Amapiano",
      "Highlife",
      "Afro-soul",
    ];

    const LICENSE_TYPES = [
      { value: "standard", label: "Standard License" },
      { value: "exclusive", label: "Exclusive License" },
      { value: "creative-commons", label: "Creative Commons" },
    ];

    export function TrackForm() {
      const [isLoading, setIsLoading] = useState(false);
      const { toast } = useToast();
      const { contract } = useContract(MUSIC_NFT_CONTRACT_ADDRESS);

      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          title: "",
          description: "",
          genre: "",
          price: "",
          royaltyFee: "2.5",
          collaborators: [],
          copyrightInfo: "",
          licenseType: "standard",
        },
      });

      const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
          setIsLoading(true);

          // Upload to IPFS
          const ipfsHash = await uploadToIPFS(values.audioFile, {
            title: values.title,
            description: values.description,
            artist: "0x123", // Replace with actual artist ID
            genre: values.genre,
            collaborators: values.collaborators,
            copyrightInfo: values.copyrightInfo,
            licenseType: values.licenseType,
          });

          // Mint NFT
          // Placeholder for actual minting logic
          console.log("Minting track with:", {
            ipfsHash,
            price: values.price,
            royaltyFee: values.royaltyFee,
          });

          toast({
            title: "Success",
            description: "Track uploaded and minted successfully",
          });
        } catch (error) {
          console.error("Error uploading track:", error);
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                name="genre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Genre</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select genre" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {GENRES.map((genre) => (
                          <SelectItem key={genre} value={genre}>
                            {genre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isLoading}
                      {...field}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <FormField
              control={form.control}
              name="collaborators"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collaborators</FormLabel>
                  <FormControl>
                    <CollaboratorSelect
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
              name="licenseType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>License Type</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select license type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {LICENSE_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="copyrightInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Copyright Information</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isLoading}
                      {...field}
                      placeholder="Enter copyright details and any additional licensing information..."
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading} className="w-full">
              Upload Track
            </Button>
          </form>
        </Form>
      );
    }
