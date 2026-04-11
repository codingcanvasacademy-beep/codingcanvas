"use client";
import dynamic from "next/dynamic";

const BlocksClient = dynamic(() => import("./ClientBlocks"), { ssr: false });

export default function BlocksWrapper() {
  return <BlocksClient />;
}
