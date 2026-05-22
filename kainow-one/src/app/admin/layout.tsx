// Layout isolado para o painel admin — sem Header nem Footer do site
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
