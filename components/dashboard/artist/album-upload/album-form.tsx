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
    import { ImageUpload } from "@/components/shared/image-upload";
    import { TrackSelector } from "./track-selector";
    import { RoyaltySplitForm } from "./royalty-split-form";
    import { useContract } from "@thirdweb-dev/react";
    import { ALBUM_NFT_CONTRACT_ADDRESS } from "@/lib/constants";
    import { uploadToIPFS } from "@/lib/utils/ipfs";

    const formSchema = z.object({
      title: z.string().min(1, "Title is required"),
      description: z.string().min(1, "Description is required"),
      genre: z.string().min(1, "Genre is required"),
      releaseDate: z.string().min(1, "Release date is required"),
      coverImage: z.any(),
      trackIds: z.array(z.string()).min(1, "At least one track is required"),
      price: z.string().min(1, "Price is required"),
      royaltySplits: z.array(z.object({
        username: z.string(),
        percentage: z.number().min(0).max(100),
      })),
      copyrightInfo: z.string(),
      nftType: z.enum(["single", "individual", "hybrid"]),
    });

    const GENRES = [
      "Afrobeats",
      "Afro-fusion",
      "Amapiano",
      "Highlife",
      "Afro-soul",
    ];

    const NFT_TYPES = [
      { value: "single", label: "Single Album NFT" },
      { value: "individual", label: "Individual Track NFTs" },
      { value: "hybrid", label: "Hybrid (Album + Track NFTs)" },
    ];

    export function AlbumForm() {
      const [isLoading, setIsLoading] = useState(false);
      const { toast } = useToast();
      const { contract } = useContract(ALBUM_NFT_CONTRACT_ADDRESS);

      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          title: "",
          description: "",
          genre: "",
          releaseDate: "",
          trackIds: [],
          price: "",
          royaltySplits: [],
          copyrightInfo: "",
          nftType: "single",
        },
      });

      const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
          setIsLoading(true);

          // Upload cover image and metadata to IPFS
          const ipfsHash = await uploadToIPFS(values.coverImage, {
            title: values.title,
            description: values.description,
            artist: "0x123", // Replace with actual artist ID
            releaseDate: values.releaseDate,
            tracks: values.trackIds,
          });

          // Mint Album NFT
          // Placeholder for actual minting logic
          console.log("Minting album with:", {
            ipfsHash,
            trackIds: values.trackIds,
            price: values.price,
            royaltySplits: values.royaltySplits,
          });

          toast({
            title: "Success",
            description: "Album created and minted successfully",
          });
        } catch (error) {
          console.error("Error creating album:", error);
          toast({
            title: "Error",
            description: "Failed to create album",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };

      return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="coverImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Art</FormLabel>
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
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Album Title</FormLabel>
                      <FormControl>
                        <Input disabled={isLoading} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                          placeholder="Include key themes, inspiration, and production notes..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
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

                  <FormField
                    control={form.control}
                    name="releaseDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Release Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="trackIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Track Selection</FormLabel>
                      <FormControl>
                        <TrackSelector
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
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Album Price (ETH)</FormLabel>
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
                  name="nftType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NFT Configuration</FormLabel>
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select NFT type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {NFT_TYPES.map((type) => (
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
                  name="royaltySplits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Royalty Splits</FormLabel>
                      <FormControl>
                        <RoyaltySplitForm
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
                  name="copyrightInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Copyright Information</FormLabel>
                      <FormControl>
                        <Textarea
                          disabled={isLoading}
                          {...field}
                          rows={3}
                          placeholder="Enter copyright and licensing details..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              Create Album
            </Button>
          </form>
        </Form>
      );
    }
