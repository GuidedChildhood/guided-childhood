'use client'

// "Add a reminder", directly under the page heading.
//
// Justin, 23 November 2026: "when adding reminders it should be easy and one
// of the first tasks here". Typing one in was a quiet third button inside the
// snap card, under whatever was coming up. This is the first thing on the page
// after its name. It opens the sheet the snap card already owns, by an event,
// so the add flow and its save stay in one place (SchoolCatch).

export const SCHOOL_ADD_EVENT = 'gc-school-add'

export default function SchoolQuickAdd() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(SCHOOL_ADD_EVENT))}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8, minHeight: 48, cursor: 'pointer',
        background: 'var(--butter)', border: 'var(--edge)', boxShadow: 'var(--lift)',
        borderRadius: 'var(--radius-button, 16px)', padding: '0 20px', margin: '4px 0 18px',
        fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)',
      }}
    >
      <span aria-hidden>+</span> Add a reminder
    </button>
  )
}
