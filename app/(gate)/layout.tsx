// ── A ROOM WITH ONE DOOR OUT, AND IT IS A CHOICE ────────────────────────────
//
// Justin, 18 August 2026: "we need to make this page no way around, they have
// to choose one option, so get rid of tabs at top and bottom, anywhere they can
// navigate around."
//
// /dashboard/choose sat inside the dashboard layout, so it arrived wearing the
// full app: six nav tabs across the top, the bottom tab bar, a Settings link, a
// Help now button and a Start subscription chip. A page whose entire job is
// "pick one of these two" was surrounded by nine ways not to.
//
// WHY A ROUTE GROUP AND NOT CSS. Hiding the chrome would have left it in the
// page: still focusable with a keyboard, still read out by a screen reader,
// still one devtools tweak from working. This is the last step of sign up and
// the point at which the product asks for a decision, so it should genuinely
// not have a navigation, rather than appear not to. Route groups do not change
// the URL, so the page is still /dashboard/choose and every link and redirect
// to it is untouched.
//
// The root layout still provides the fonts, the tokens and the html shell. This
// only declines the dashboard chrome.
export default function GateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--app-bg)' }}>
      {children}
    </div>
  )
}
