import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PromoBanner } from "@/components/layout/PromoBanner";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PromoBanner />
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
      <Footer />
    </>
  );
}
