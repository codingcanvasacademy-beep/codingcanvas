import { Metadata } from "next";
import BlocksWrapper from "./BlocksWrapper";

export const metadata: Metadata = {
  title: "Blocks Lab | CodingCanvas",
  description: "Visual Python coding sandbox for kids. Drag, snap, and run real Python code.",
};

export default function BlocksPage() {
  return <BlocksWrapper />;
}
