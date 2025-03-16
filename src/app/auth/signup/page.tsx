import Signup from '@/components/Auth/SignUp';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up Page - TOBI",

  // other metadata
  description: "This is Sign Up page for TOBI",
  icons: "/images/tobi-favicon.png"
};

export default function SignUpPage() {
  return <Signup />;
}
