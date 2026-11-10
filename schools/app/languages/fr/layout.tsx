import FrenchNav from './FrenchNav'

// Every French page carries the same three rooms at the top (FrenchNav).
export default function FrenchLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FrenchNav />
      {children}
    </>
  )
}
