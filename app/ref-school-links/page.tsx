import SchoolLinks from '@/app/(dashboard)/dashboard/admin/schools/SchoolLinks'

// Layout fixture for the founder's school links page (migration 353), which
// needs a login and the database. ?empty=1 shows the page before any school.
//
// 404s in production via middleware, like every other ref- page.

const ROWS = [
  { code: 'st-marys-c-of-e-primary', name: "St Mary's C of E Primary", active: true, url: 'https://guidedchildhood.com/s/st-marys-c-of-e-primary', signedUp: 14, cardOn: 3, paying: 5 },
  { code: 'oldfield-park-junior', name: 'Oldfield Park Junior', active: false, url: 'https://guidedchildhood.com/s/oldfield-park-junior', signedUp: 2, cardOn: 0, paying: 0 },
]

export default async function RefSchoolLinks({ searchParams }: { searchParams: Promise<{ empty?: string }> }) {
  const { empty } = await searchParams
  return (
    <main style={{ background: 'var(--app-bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '24px 18px 60px' }}>
        <SchoolLinks rows={empty ? [] : ROWS} />
      </div>
    </main>
  )
}
