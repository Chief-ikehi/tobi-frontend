import Signin from "@/components/Auth/SignIn";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login Page - TOBI",

  // other metadata
  description: "This is Login page for TOBI"
};

export default function SigninPage() {
  return (
    <>
      <Signin />
    </>
  );
}