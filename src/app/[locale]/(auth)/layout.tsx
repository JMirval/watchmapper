import { useAuthenticatedBlitzContext } from "../../blitz-server"

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  await useAuthenticatedBlitzContext({
    redirectAuthenticatedTo: "/",
  })
  return <div className="flex h-screen w-screen items-center justify-center">{children}</div>
}
