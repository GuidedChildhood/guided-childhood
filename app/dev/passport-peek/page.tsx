import PassportPeek from '@/components/home/PassportPeek'

// Layout harness for the passport peek on Today. No auth, no data: the three
// reasons the rule can give, drawn with a fixed reason each, so the flip in,
// the copy and Not now can be looked at without a family behind them.
export default async function Page({ searchParams }: { searchParams: Promise<{ kind?: string }> }) {
  const { kind } = await searchParams
  const preview = kind === 'behind'
    ? { kind: 'behind' as const, stageId: 1, title: '2 pages behind Teo', line: 'Foundation and Builder are still open. They stay open as long as it takes, one lesson at a time.' }
    : kind === 'nearly'
      ? { kind: 'nearly' as const, stageId: 3, title: 'One thing left on Explorer', line: 'Then the page is ready for its check. Open the book to see which.' }
      : { kind: 'check_ready' as const, stageId: 2, title: 'Builder is ready for its check', line: 'Every lesson and script on the page is done. The stage check is what stamps it, and Teo sits it whenever they are ready.' }
  return (
    <div style={{ padding: '24px 20px', maxWidth: 720, margin: '0 auto' }}>
      <PassportPeek childId={null} preview={preview} />
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)' }}>?kind=check_ready (default), behind, nearly</p>
    </div>
  )
}
