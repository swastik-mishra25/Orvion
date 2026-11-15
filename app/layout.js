import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Orvion - Full-Stack E-Commerce Platform",
  description: "High-performance full-stack e-commerce platform built with Next.js, Clerk, and MongoDB.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      signInUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/sign-in"}
      signUpUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || "/sign-up"}
      signInFallbackRedirectUrl={process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL || "/"}
      signUpFallbackRedirectUrl={process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || "/"}
      appearance={{
        variables: {
          colorPrimary: "#4f46e5",
          colorText: "#1f2937",
          borderRadius: "0.5rem",
        },
      }}
    >
      <html lang="en">
        <body className={`${outfit.className} antialiased text-gray-700 bg-white min-h-screen flex flex-col`}>
          <Toaster position="top-right" />
          <AppContextProvider>{children}</AppContextProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
