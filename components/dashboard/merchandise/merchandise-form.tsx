
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
            