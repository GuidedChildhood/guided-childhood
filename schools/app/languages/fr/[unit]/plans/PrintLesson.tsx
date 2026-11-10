'use client'

// Print one lesson's plan from the page that holds them all. The browser
// prints the whole page, so for the length of the print the wanted plan is
// marked and the print stylesheet (in page.tsx) hides the others.
export default function PrintLesson({ id, label }: { id: string; label: string }) {
  return (
    <button
      type="button"
      className="no-print gc-fr-print-one"
      onClick={() => {
        const el = document.getElementById(id)
        if (!el) return
        document.body.classList.add('gc-fr-printing-one')
        el.classList.add('gc-fr-print-me')
        window.addEventListener('afterprint', () => {
          document.body.classList.remove('gc-fr-printing-one')
          el.classList.remove('gc-fr-print-me')
        }, { once: true })
        window.print()
      }}
    >
      {label}
    </button>
  )
}
