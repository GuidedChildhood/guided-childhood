import Button, { ButtonLink } from '@/components/ui/Button'

export default function DevButtons() {
  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: 24, background: 'var(--cream)', minHeight: '100dvh', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h1 style={{ fontSize: '1.6rem' }}>Button system</h1>

      <div>
        <p className="eyebrow" style={{ marginBottom: 8 }}>Variants (md)</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="teal">Teal</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="quiet">Quiet</Button>
        </div>
      </div>

      <div>
        <p className="eyebrow" style={{ marginBottom: 8 }}>Sizes</p>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="md">Medium</Button>
          <Button variant="primary" size="lg">Large</Button>
          <Button variant="primary" disabled>Disabled</Button>
        </div>
      </div>

      <div>
        <p className="eyebrow" style={{ marginBottom: 8 }}>With icon + full width</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Button variant="primary" icon={<span>⭐</span>}>Approve the stars</Button>
          <ButtonLink href="#" variant="teal" fullWidth icon={<span>📲</span>}>Send to their phone</ButtonLink>
        </div>
      </div>
    </div>
  )
}
