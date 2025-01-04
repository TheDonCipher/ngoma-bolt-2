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
    import { VariantManager } from "./variant-manager";
    import { uploadToIPFS } from "@/lib/utils/ipfs";

    const formSchema = z.object({
      title: z.string().min(1, "Title is required"),
      description: z.string().min(1, "Description is required"),
      type: z.enum(["physical", "digital"]),
      category: z.string().min(1, "Category is required"),
      basePrice: z.string().min(1, "Base price is required"),
      images: z.array(z.any()).min(1, "At least one image is required"),
      variants: z.array(z.object({
        name: z.string(),
        options: z.array(z.object({
          value: z.string(),
          price: z.number().optional(),
          stock: z.number(),
        })),
      })).optional(),
      digitalFile: z.any().optional(),
      weight: z.string().optional(),
      dimensions: z.string().optional(),
      shippingNote: z.string().optional(),
      lowStockAlert: z.number().optional(),
    });

    const CATEGORIES = [
      "Clothing",
      "Accessories",
      "Prints",
      "Digital Content",
      "Collectibles",
    ];

    export function MerchandiseForm() {
      const [isLoading, setIsLoading] = useState(false);
      const { toast } = useToast();

      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          title: "",
          description: "",
          type: "physical",
          category: "",
          basePrice: "",
          images: [],
          variants: [],
          weight: "",
          dimensions: "",
          shippingNote: "",
          lowStockAlert: 5,
        },
      });

      const productType = form.watch("type");

      const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
          setIsLoading(true);

          // Upload images to IPFS
          const imageHashes = await Promise.all(
            values.images.map(image => uploadToIPFS(image, {
              type: "product-image",
            }))
          );

          // Upload digital file if present
          let digitalFileHash;
          if (values.digitalFile) {
            digitalFileHash = await uploadToIPFS(values.digitalFile, {
              type: "digital-product",
            });
          }

          // Create product in database
          // Placeholder for actual product creation logic
          console.log("Creating product with:", {
            imageHashes,
            title: values.title,
            description: values.description,
            type: values.type,
            category: values.category,
            basePrice: values.basePrice,
            variants: values.variants,
            digitalFileHash,
            weight: values.weight,
            dimensions: values.dimensions,
            shippingNote: values.shippingNote,
            lowStockAlert: values.lowStockAlert,
          });

          toast({
            title: "Success",
            description: "Product created successfully",
          });
        } catch (error) {
          console.error("Error creating product:", error);
          toast({
            title: "Error",
            description: "Failed to create product",
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
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Images</FormLabel>
                      <FormControl>
                        <ImageUpload
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isLoading}
                          multiple
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
                      <FormLabel>Product Title</FormLabel>
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
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Type</FormLabel>
                        <Select
                          disabled={isLoading}
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="physical">Physical Product</SelectItem>
                            <SelectItem value="digital">Digital Product</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          disabled={isLoading}
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CATEGORIES.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
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
                  name="basePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6">
                {productType === "physical" ? (
                  <>
                    <FormField
                      control={form.control}
                      name="variants"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Variants</FormLabel>
                          <FormControl>
                            <VariantManager
                              value={field.value}
                              onChange={field.onChange}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight (kg)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
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
                        name="dimensions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dimensions (cm)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="L x W x H"
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
                      name="shippingNote"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shipping Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              disabled={isLoading}
                              {...field}
                              rows={2}
                              placeholder="Special handling instructions..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                ) : (
                  <FormField
                    control={form.control}
                    name="digitalFile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Digital Product File</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            onChange={(e) => field.onChange(e.target.files?.[0])}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="lowStockAlert"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Low Stock Alert Threshold</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
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

            <Button type="submit" disabled={isLoading} className="w-full">
              Create Product
            </Button>
          </form>
        </Form>
      );
    }
