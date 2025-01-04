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
    import { Switch } from "@/components/ui/switch";
    import { ImageUpload } from "@/components/shared/image-upload";
    import { TicketTierForm } from "./ticket-tier-form";
    import { PromotionScheduler } from "./promotion-scheduler";
    import { uploadToIPFS } from "@/lib/utils/ipfs";

    const formSchema = z.object({
      title: z.string().min(1, "Title is required"),
      description: z.string().min(1, "Description is required"),
      startDate: z.string().min(1, "Start date is required").refine((date) => {
        try {
          new Date(date);
          return true;
        } catch (error) {
          return false;
        }
      }, "Invalid start date"),
      endDate: z.string().min(1, "End date is required").refine((date) => {
        try {
          new Date(date);
          return true;
        } catch (error) {
          return false;
        }
      }, "Invalid end date"),
      eventType: z.enum(["virtual", "physical", "hybrid"]),
      location: z.string().optional(),
      virtualLink: z.string().optional(),
      bannerImage: z.any(),
      maxAttendees: z.string().min(1, "Maximum attendees is required"),
      isPublic: z.boolean(),
      ticketTiers: z.array(z.object({
        name: z.string(),
        price: z.number(),
        quantity: z.number(),
        description: z.string(),
        isNFT: z.boolean(),
      })),
      promotionalSchedule: z.array(z.object({
        platform: z.string(),
        message: z.string(),
        scheduledDate: z.string(),
      })),
    });

    const EVENT_TYPES = [
      { value: "virtual", label: "Virtual Event" },
      { value: "physical", label: "Physical Event" },
      { value: "hybrid", label: "Hybrid Event" },
    ];

    export function EventForm() {
      const [isLoading, setIsLoading] = useState(false);
      const { toast } = useToast();

      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          title: "",
          description: "",
          startDate: "",
          endDate: "",
          eventType: "virtual",
          maxAttendees: "",
          isPublic: true,
          ticketTiers: [],
          promotionalSchedule: [],
        },
      });

      const eventType = form.watch("eventType");

      const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
          setIsLoading(true);

          // Upload banner image to IPFS
          const ipfsHash = await uploadToIPFS(values.bannerImage, {
            title: values.title,
            description: values.description,
            eventType: values.eventType,
            startTime: values.startDate,
            endTime: values.endDate,
            basePrice: 10, // Placeholder
            maxAttendees: values.maxAttendees,
          });

          // Create event in database
          // Placeholder for actual event creation logic
          console.log("Creating event with:", {
            ipfsHash,
            title: values.title,
            description: values.description,
            eventType: values.eventType,
            startDate: values.startDate,
            endDate: values.endDate,
            location: values.location,
            virtualLink: values.virtualLink,
            maxAttendees: values.maxAttendees,
            ticketTiers: values.ticketTiers,
          });

          toast({
            title: "Success",
            description: "Event created successfully",
          });
        } catch (error) {
          console.error("Error creating event:", error);
          toast({
            title: "Error",
            description: "Failed to create event",
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
                  name="bannerImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Banner</FormLabel>
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
                      <FormLabel>Event Title</FormLabel>
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
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date & Time</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
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
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date & Time</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
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
                  name="eventType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Type</FormLabel>
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select event type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {EVENT_TYPES.map((type) => (
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

                {(eventType === "physical" || eventType === "hybrid") && (
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Venue Location</FormLabel>
                        <FormControl>
                          <Input disabled={isLoading} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {(eventType === "virtual" || eventType === "hybrid") && (
                  <FormField
                    control={form.control}
                    name="virtualLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Virtual Event Link</FormLabel>
                        <FormControl>
                          <Input disabled={isLoading} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="maxAttendees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Attendees</FormLabel>
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

                <FormField
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Public Event
                        </FormLabel>
                        <FormDescription>
                          Make this event visible to everyone
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="ticketTiers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ticket Tiers</FormLabel>
                      <FormControl>
                        <TicketTierForm
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
                  name="promotionalSchedule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Promotional Schedule</FormLabel>
                      <FormControl>
                        <PromotionScheduler
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              Create Event
            </Button>
          </form>
        </Form>
      );
    }
