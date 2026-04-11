import { Metadata } from "next";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Login | CodingCanvas",
  description: "Sign in to your teacher or admin portal to manage your coding classes.",
};

export default function LoginPage() {
  return <LoginClient />;
}
