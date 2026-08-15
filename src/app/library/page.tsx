import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Library",
};

export default function LibraryPage() {
  redirect("/research-library");
}
