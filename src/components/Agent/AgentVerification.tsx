"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Upload,
  CheckCircle,
  AlertCircle,
  Building,
  FileText,
  MapPin,
  User,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Badge } from "@/components/ui/badge";

// Define the form schema
const formSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  businessAddress: z.string().min(5, "Please enter a valid address"),
  registrationNumber: z.string().min(5, "Please enter a valid CAC number"),
  phoneNumber: z.string().min(11, "Please enter a valid phone number"),
  description: z.string().min(50, "Please provide a detailed description"),
});

// Infer the form type from the schema
type FormValues = z.infer<typeof formSchema>;

// Define document types
type DocumentStatus = "PENDING" | "UPLOADED" | "ERROR";

interface Document {
  id: string;
  type: string;
  label: string;
  description: string;
  file?: File;
  status: DocumentStatus;
  error?: string;
}

export function AgentVerification() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<
    "UNVERIFIED" | "PENDING" | "VERIFIED"
  >("UNVERIFIED");
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      type: "CAC",
      label: "CAC Certificate",
      description: "Upload your CAC certificate or business registration document",
      status: "PENDING",
    },
    {
      id: "2",
      type: "ID",
      label: "Valid ID",
      description: "Upload a valid government-issued ID (International passport, Driver's license, or National ID)",
      status: "PENDING",
    },
    {
      id: "3",
      type: "PROOF_OF_ADDRESS",
      label: "Proof of Address",
      description: "Upload a recent utility bill or bank statement (not older than 3 months)",
      status: "PENDING",
    },
  ]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      businessAddress: "",
      registrationNumber: "",
      phoneNumber: "",
      description: "",
    },
  });

  useEffect(() => {
    const checkVerificationStatus = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/agent/verification-status`,
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch verification status");
        }

        const { status } = await response.json();
        setVerificationStatus(status);

        if (status === "VERIFIED") {
          router.push("/agent/dashboard");
        }
      } catch (error) {
        console.error("Error checking verification status:", error);
        toast.error("Failed to check verification status");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      checkVerificationStatus();
    }
  }, [session, router]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    documentId: string
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Update document status
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === documentId
          ? { ...doc, file, status: "UPLOADED", error: undefined }
          : doc
      )
    );

    // Upload file
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", documents.find((d) => d.id === documentId)?.type || "");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/agent/upload-document`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload document");
      }

      toast.success("Document uploaded successfully");
    } catch (error) {
      console.error("Error uploading document:", error);
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === documentId
            ? { ...doc, status: "ERROR", error: "Failed to upload document" }
            : doc
        )
      );
      toast.error("Failed to upload document");
    }
  };

  const onSubmit = async (data: FormValues) => {
    // Check if all documents are uploaded
    const missingDocuments = documents.filter((doc) => doc.status !== "UPLOADED");
    if (missingDocuments.length > 0) {
      toast.error("Please upload all required documents");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/agent/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
          body: JSON.stringify({
            ...data,
            documents: documents.map((doc) => ({
              type: doc.type,
              fileId: doc.id,
            })),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit verification");
      }

      setVerificationStatus("PENDING");
      toast.success(
        "Verification submitted successfully. We'll review your application shortly."
      );
      router.push("/agent/dashboard");
    } catch (error) {
      console.error("Error submitting verification:", error);
      toast.error("Failed to submit verification");
    } finally {
      setLoading(false);
    }
  };

  const DocumentUpload = ({ document }: { document: Document }) => {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">{document.label}</CardTitle>
          </div>
          <CardDescription>{document.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileChange(e, document.id)}
                className="flex-1"
              />
              {document.status === "UPLOADED" && (
                <Badge variant="success" className="ml-2">
                  Uploaded
                </Badge>
              )}
              {document.status === "ERROR" && (
                <Badge variant="destructive" className="ml-2">
                  Error
                </Badge>
              )}
            </div>
            {document.error && (
              <p className="text-sm text-destructive">{document.error}</p>
            )}
            {document.file && (
              <p className="text-sm text-muted-foreground">
                Selected file: {document.file.name}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">
            Processing your verification...
          </p>
        </div>
      </div>
    );
  }

  if (verificationStatus === "PENDING") {
    return (
      <div className="container mx-auto px-4 py-32">
        <div className="rounded-lg bg-white p-8 text-center shadow-solid-8 dark:bg-blacksection">
          <CheckCircle className="mx-auto mb-4 h-12 w-12 text-yellow-500" />
          <h2 className="mb-2 text-2xl font-bold text-black dark:text-white">
            Verification Under Review
          </h2>
          <p className="mb-8 text-body-color">
            Your verification request has been submitted and is being reviewed by our
            team. We'll notify you once it's approved.
          </p>
          <Button variant="outline" onClick={() => router.push("/")}>
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Agent Verification
        </h1>
        <p className="text-muted-foreground">
          Complete your verification to start listing properties on TOBI
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your business name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="registrationNumber"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>CAC Registration Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your CAC number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="businessAddress"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Business Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your business address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Business Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Business Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your business and experience"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Include your experience in real estate and property management
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Required Documents</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {documents.map((document) => (
                <DocumentUpload key={document.id} document={document} />
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Verification"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
} 