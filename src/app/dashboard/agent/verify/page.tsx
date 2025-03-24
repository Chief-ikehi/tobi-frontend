"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

const AgentVerification = () => {
  const [status, setStatus] = useState<"UNSUBMITTED" | "PENDING" | "APPROVED" | "REJECTED">(
    "UNSUBMITTED"
  );
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState({
    id_document: null as File | null,
    cac_certificate: null as File | null,
    business_proof: null as File | null,
    authorization_letter: null as File | null,
  });

  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  useEffect(() => {
    const fetchVerification = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/verification/agent/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 200) {
          const data = await res.json();
          setStatus(data.status); // PENDING, APPROVED, REJECTED
        }
      } catch (err) {
        // No submission yet = UNSUBMITTED
      } finally {
        setLoading(false);
      }
    };

    fetchVerification();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof files) => {
    if (e.target.files && e.target.files[0]) {
      setFiles((prev) => ({ ...prev, [field]: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    if (!files.id_document || !files.cac_certificate || !files.business_proof || !files.authorization_letter) {
      toast.error("All 4 documents are required.");
      return;
    }

    formData.append("id_document", files.id_document);
    formData.append("cac_certificate", files.cac_certificate);
    formData.append("business_proof", files.business_proof);
    formData.append("authorization_letter", files.authorization_letter);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/verification/agent/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        toast.success("Verification submitted successfully!");
        setStatus("PENDING");
      } else {
        toast.error("Submission failed. Please try again.");
      }
    } catch {
      toast.error("Something went wrong.");
    }
  };

  if (loading) {
    return <div className="py-40 text-center text-lg">Loading verification status...</div>;
  }

  return (
    <section className="container py-20">
      <h1 className="text-3xl font-bold mb-6">Agent Verification</h1>

      <div className="mb-8 p-5 rounded bg-gray-100 dark:bg-dark-2 border">
        <p className="text-sm">Your current verification status:</p>
        <p className={`font-semibold mt-1 text-lg ${
          status === "APPROVED"
            ? "text-green-600"
            : status === "PENDING"
            ? "text-yellow-600"
            : status === "REJECTED"
            ? "text-red-600"
            : "text-gray-500"
        }`}>
          {status}
        </p>
      </div>

      {status === "UNSUBMITTED" || status === "REJECTED" ? (
        <form onSubmit={handleSubmit} className="grid gap-6 max-w-xl">
          <div>
            <label className="block mb-1 text-sm font-medium">Valid ID Document</label>
            <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => handleFileChange(e, "id_document")} />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">CAC Certificate</label>
            <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => handleFileChange(e, "cac_certificate")} />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Proof of Business Location</label>
            <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => handleFileChange(e, "business_proof")} />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Authorization Letter</label>
            <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => handleFileChange(e, "authorization_letter")} />
          </div>

          <button
            type="submit"
            className="rounded bg-black text-white px-6 py-2 hover:bg-gray-900"
          >
            Submit Documents
          </button>
        </form>
      ) : (
        <p className="text-gray-600">
          You've already submitted your documents. Status: {status}
        </p>
      )}
    </section>
  );
};

export default AgentVerification;