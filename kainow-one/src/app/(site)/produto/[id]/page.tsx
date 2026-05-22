// Server component — required for static export with dynamic routes
import ProdutoClient from './ProdutoClient'

export function generateStaticParams() {
  // Pre-render all 50 product pages at build time
  return Array.from({ length: 50 }, (_, i) => ({ id: String(i + 1) }))
}

export default function ProdutoPage() {
  return <ProdutoClient />
}
