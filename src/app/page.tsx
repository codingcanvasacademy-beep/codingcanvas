import HomeClient from "./HomeClient";

// Metadata is already in layout.tsx as a good default for the homepage,
// but we can refine it here if we want to be explicit.
export const metadata = {
  title: "CodingCanvas — Premium Python Coding for Kids",
  description: "Join the top-rated online coding academy for children. Learn Python through visual blocks and expert mentorship. Book your free intro class today!",
};

export default function Page() {
  return <HomeClient />;
}
