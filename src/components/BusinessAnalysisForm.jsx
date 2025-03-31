"use client";

import React, { useState, useEffect } from "react"; // Import useEffect
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import {
  Loader2,
  Lightbulb,
  ArrowLeft,
  ArrowRight,
  Check,
  PlusCircle,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Animation variants for step content (kept for potential future use)
const stepVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

// Form validation schema
const formSchema = z.object({
  contactName: z
    .string()
    .min(2, { message: "Contact name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }), // Made phone required
  businessName: z
    .string()
    .min(2, { message: "Business name must be at least 2 characters." }),
  website: z.string().url({ message: "Please enter a valid URL." }),
  industry: z
    .string()
    .min(2, { message: "Industry must be at least 2 characters." }),
  competitors: z
    .array(
      z.object({
        value: z.string().min(2, {
          message: "Competitor name/URL must be at least 2 characters.",
        }),
      })
    )
    .min(1, { message: "Please enter at least one competitor." }),
});

// Define the fields for each step
const steps = [
  { id: 1, fields: ["contactName", "phone"], title: "Personal Details" },
  {
    id: 2,
    fields: ["businessName", "website", "industry"],
    title: "Business Details",
  }, // Consolidated step 2
  { id: 3, fields: ["competitors"], title: "Competitors" }, // Adjusted ID
];

const BusinessAnalysisForm = ({ onSubmit, isLoading }) => {
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm({
    resolver: zodResolver(formSchema),
    // Keep initial defaultValues empty or standard
    defaultValues: {
      contactName: "",
      phone: "",
      businessName: "",
      website: "",
      industry: "",
      competitors: [{ value: "" }],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "competitors",
  });

  // --- Development Mode Auto-fill ---
  useEffect(() => {
    // Check if running in development environment
    // Note: NEXT_PUBLIC_ prefix is not needed for NODE_ENV check on server/build time,
    // but for client-side checks, ensure NODE_ENV is exposed correctly or use a NEXT_PUBLIC_ var.
    // Assuming standard Next.js setup where NODE_ENV is available client-side in dev.
    if (process.env.NODE_ENV === "development") {
      console.log("DEV MODE: Auto-filling form fields for testing.");
      // Use setTimeout to ensure form is fully initialized before resetting
      setTimeout(() => {
        form.reset({
          contactName: "Dev User", // Using a default name
          phone: "447949053243",
          businessName: "profici",
          website: "https://profici.co.uk", // Added https://
          industry: "digital marketing",
          competitors: [{ value: "https://blazemedia.co.uk/" }],
          email: "dev@profici.co.uk",
        });
      }, 0); // Timeout 0 pushes execution to the end of the event loop
    }
    // Run only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleNext = async () => {
    const fieldsToValidate = steps[currentStep - 1].fields;
    // Removed isOptionalStep logic as phone is now required
    const isValid = await form.trigger(fieldsToValidate);

    if (isValid) {
      if (currentStep < steps.length) {
        setCurrentStep((prev) => prev + 1);
      } else {
        form.handleSubmit(handleFinalSubmit)();
      }
    } else {
      // Simplified error message logic slightly
      const firstErrorField = fieldsToValidate.find(
        (field) => form.formState.errors[field]
      );
      let errorMessage = "Please fill in all required fields correctly."; // General message
      if (
        firstErrorField === "competitors" &&
        form.formState.errors.competitors?.root
      ) {
        errorMessage = form.formState.errors.competitors.root.message;
      } else if (
        firstErrorField === "competitors" &&
        Array.isArray(form.formState.errors.competitors)
      ) {
        const fieldArrayIndex = form.formState.errors.competitors.findIndex(
          (err) => err?.value
        );
        if (fieldArrayIndex !== -1) {
          errorMessage =
            form.formState.errors.competitors[fieldArrayIndex].value.message;
        }
      } else if (firstErrorField && form.formState.errors[firstErrorField]) {
        errorMessage = form.formState.errors[firstErrorField].message;
      }

      if (errorMessage) {
        // Show toast if there's an error message
        toast.warning(errorMessage);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFinalSubmit = async (data) => {
    try {
      const submissionData = {
        ...data,
        competitors: data.competitors.map((c) => c.value).filter(Boolean),
      };
      await onSubmit(submissionData);
      toast.success("Analysis request submitted", {
        description: "Your business analysis request is being processed.",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error submitting analysis request", {
        description: error.message || "Please try again.",
      });
    }
  };

  // No longer need currentStepFields
  // const currentStepFields = steps[currentStep - 1]?.fields || [];

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader>
        <CardTitle>Business Analysis Input</CardTitle>
        <CardDescription>
          Provide your business details step-by-step.
        </CardDescription>
        {/* Step Indicators */}
        <div className="flex items-center justify-center space-x-2 sm:space-x-4 mt-4">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = currentStep === stepNumber;
            const isCompleted = currentStep > stepNumber;
            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-medium transition-all",
                      isActive
                        ? "border-primary text-primary bg-primary/10"
                        : isCompleted
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground bg-muted"
                    )}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : stepNumber}
                  </div>
                  <span
                    className={cn(
                      "mt-1 text-xs text-center",
                      isActive
                        ? "text-primary font-medium"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </span>
                </div>
                {stepNumber < steps.length && (
                  <div
                    className={cn(
                      "h-0.5 w-full flex-1",
                      isCompleted ? "bg-primary" : "bg-border"
                    )}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="pt-2 pb-6">
        <Form {...form}>
          {/* Use explicit conditional rendering based on currentStep */}
          <div className="space-y-6 min-h-[240px]">
            {currentStep === 1 && ( // New Step 1: Personal Details
              <>
                <FormField
                  control={form.control}
                  name="contactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Name</FormLabel>
                      <FormControl asChild>
                        <Input placeholder="Your Full Name" {...field} />
                      </FormControl>
                      <FormDescription>
                        Your name for contact purposes
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel> {/* Removed (Optional) */}
                      <FormControl asChild>
                        <Input
                          type="tel"
                          placeholder="Your Phone Number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Your contact phone number
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {currentStep === 2 && ( // Consolidated Step 2: Business Details
              <>
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl asChild>
                        <Input placeholder="Your Business Name" {...field} />
                      </FormControl>
                      <FormDescription>
                        The name of your business or organization
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website URL</FormLabel>
                      <FormControl asChild>
                        <Input
                          placeholder="https://www.example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The full URL of your business website
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <FormControl asChild>
                        <Input
                          placeholder="e.g. E-commerce, SaaS, Healthcare"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The industry or sector your business operates in
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {currentStep === 3 && ( // Adjusted Step 3: Competitors (was step 5)
              <div className="space-y-4">
                <FormLabel>Competitors</FormLabel>
                {fields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`competitors.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormControl asChild>
                            <Input
                              type="website"
                              placeholder={`Competitor ${
                                index + 1
                              } Website (e.g., example.com)`}
                              {...field}
                            />
                          </FormControl>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(index)}
                              disabled={isLoading}
                            >
                              <XCircle className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )} // Closing parenthesis was already here, but added brace for consistency
                  />
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ value: "" })}
                  disabled={isLoading}
                >
                  <span className="flex items-center">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Competitor
                  </span>
                </Button>
                <FormDescription>
                  Enter the website domain (e.g., example.com) of your main
                  competitors.
                </FormDescription>
                {form.formState.errors.competitors?.root && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.competitors.root.message}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1 || isLoading}
            >
              <span className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </span>
            </Button>
            <Button
              type="button"
              onClick={handleNext}
              disabled={isLoading}
              className={cn(
                currentStep === steps.length
                  ? "bg-green-600 hover:bg-green-700"
                  : ""
              )}
            >
              <span className="flex items-center justify-center">
                {isLoading && currentStep === steps.length ? (
                  <>
                    {" "}
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Generating...{" "}
                  </>
                ) : currentStep === steps.length ? (
                  <>
                    {" "}
                    <Lightbulb className="mr-2 h-4 w-4" /> Generate Analysis{" "}
                  </>
                ) : (
                  <>
                    {" "}
                    Next <ArrowRight className="ml-2 h-4 w-4" />{" "}
                  </>
                )}
              </span>
            </Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BusinessAnalysisForm;
