import React from "react";
import Contact from "@/components/Contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Page",

  // other metadata
  description: "This is Contact page for TOBI",
  icons: "/images/tobi-favicon.png"
};

const ContactPage = () => {
  return (
    <div className="pb-10 pt-20">
      <Contact />
    </div>
  );
};

export default ContactPage;
