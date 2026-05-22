import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Layout do site público — com Header e Footer
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // overflow-x-hidden garante que nenhum elemento vaze horizontalmente
    <div className="w-full overflow-x-hidden">
      <Header />
      <main className="min-h-screen w-full">{children}</main>
      <Footer />
    </div>
  )
}
