import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Providers } from "@/components/Providers";
import GlobalScene3D from "@/components/GlobalScene3D";
import AudioPlayer from "@/components/AudioPlayer";
import CinematicIntro from "@/components/CinematicIntro";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "St. Ann's RCM Church | Sattenapalle",
  description: "Official website of St. Ann's RCM Church, Sattenapalle. Join us in worship and community.",
};

import { UIProvider } from "@/components/UIProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <UIProvider>
            <CinematicIntro />
            <AudioPlayer />
            <NavigationWrapper />
            <main>{children}</main>
            <Footer />
          </UIProvider>
        </Providers>
      </body>
    </html>
  );
}

// Wrapper to use the context inside Navigation
function NavigationWrapper() {
  return <Navigation />;
}
