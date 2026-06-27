# Guided Childhood — Design System

One accent. Two fonts. Generous space. The opposite of busy.

---

## Colour

| Token | Value | Use |
|---|---|---|
| `--white` | `#FFFFFF` | Primary background |
| `--cream` | `#FBF7F0` | Alternate sections, announcement bar, cards |
| `--ink` | `#2B2B2B` | All body text (never pure black) |
| `--ink-soft` | `#5A5A5A` | Secondary text |
| `--ink-muted` | `#8A8A8A` | Labels, eyebrows, placeholders |
| `--border` | `#E8E2DA` | Dividers, card borders |
| `--terracotta` | `#C8643C` | Single accent — ALL buttons, ALL links, emphasis |
| `--terracotta-dark` | `#A8502E` | Button shadow, hover state |
| `--terracotta-lt` | `#F5EAE4` | Terracotta card tint |

### Card tints (muted, low saturation — backgrounds only)
| Token | Value | Use |
|---|---|---|
| `--tint-terracotta` | `#F5EAE4` | Tools card 1 |
| `--tint-blue` | `#E8EDF5` | Tools card 2 |
| `--tint-sage` | `#E8EDE4` | Tools card 3 |
| `--tint-amber` | `#F5F0E4` | Stage cards, accent blocks |
| `--tint-green` | `#E8F0E8` | Stage cards |

**Rule:** No colour outside this list. Remove every gold, yellow, purple, and
bright green from the interface.

---

## Typography

```css
/* Google Fonts import — always first in CSS */
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,600;1,600&family=Inter:wght@400;500;600;700&display=swap');

--font-display: 'Fraunces', Georgia, serif;   /* headings */
--font-body:    'Inter', system-ui, sans-serif; /* everything else */
```

### Scale
| Role | Family | Weight | Size |
|---|---|---|---|
| Eyebrow | Inter | 600 | 11px, 0.1em tracking, uppercase |
| Hero H1 | Fraunces | 600 | clamp(2.4rem, 5vw, 4rem) |
| Section H2 | Fraunces | 600 | clamp(1.8rem, 3.5vw, 2.8rem) |
| Card title | Fraunces | 600 | 1.2rem–1.5rem |
| Body | Inter | 400 | 16px / 1.65 |
| Body small | Inter | 400 | 14px |
| Label | Inter | 600 | 11px |
| Button | Inter | 600 | 15px |

**Italic emphasis** in hero headings: Fraunces italic 600, terracotta colour.

---

## Spacing

8px base scale: 8 / 16 / 24 / 32 / 48 / 64 / 80 / 96 / 128

Section vertical padding: 96px desktop, 64px mobile.
Card inner padding: 32px desktop, 24px mobile.
Gap between cards: 24px.

---

## Card

One card style used everywhere.

```css
.card {
  background: var(--cream);          /* or a tint colour */
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(43,43,43,0.06);
}
```

No other card variants. No raised cards, no gradient borders, no glow.

---

## Button

One button style. Terracotta only.

```css
.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--terracotta);
  color: #fff;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 15px;
  padding: 14px 28px;
  border-radius: 10px;
  border: none;
  box-shadow: 0 4px 0 var(--terracotta-dark);
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.1s, box-shadow 0.1s;
}
.btn:hover  { transform: translateY(-1px); box-shadow: 0 5px 0 var(--terracotta-dark); }
.btn:active { transform: translateY(2px);  box-shadow: 0 2px 0 var(--terracotta-dark); }
```

Outline variant (secondary actions only):
```css
.btn-outline {
  background: transparent;
  color: var(--terracotta);
  border: 1.5px solid var(--terracotta);
  box-shadow: none;
}
```

**Rule:** No gold, green, coral, or any other coloured button anywhere.

---

## Announcement Bar

Cream background. Sits above nav. Dismissible.

```html
<div id="announce-bar" style="background:var(--cream);border-bottom:1px solid var(--border);padding:10px 24px;text-align:center;font-family:var(--font-body);font-size:14px;color:var(--ink-soft);position:relative">
  The UK under-16 social media ban is coming. Spring 2027. Your child's preparation is yours to build.
  <a href="/starter-pack" style="color:var(--terracotta);font-weight:600;margin-left:8px;text-decoration:none">Start here →</a>
  <button onclick="document.getElementById('announce-bar').remove()" style="position:absolute;right:16px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--ink-muted);cursor:pointer;font-size:18px;line-height:1">×</button>
</div>
```

---

## Nav

Links: Inter 500, charcoal, no underline. Active/hover: terracotta.
Right: single terracotta "Get started →" button.

Items: Find Your Stage · How It Works · Tools ▾ · For Schools · Pricing

Tools dropdown contains:
- Mental Health Checker → /digitalwellbeing
- Safe YouTube Playlists → waitlist link
- Why Digital Literacy Works → /digital-literacy

---

## Tester Quote Block

Sits just above the tools section. No stars, no photo.

```html
<blockquote style="font-family:var(--font-display);font-size:clamp(1.1rem,2vw,1.4rem);font-weight:600;color:var(--ink);line-height:1.5;margin:0 0 20px">
  "..."
</blockquote>
<cite style="font-family:var(--font-body);font-size:14px;color:var(--ink-muted);font-style:normal">
  Name · Role
</cite>
```

Background: cream card, no border, generous padding.

---

## Self-check before shipping

- [ ] Only Fraunces and Inter used
- [ ] Only terracotta for interactive elements
- [ ] No gold, green, yellow, purple buttons
- [ ] Card radius 16px, shadow matches spec
- [ ] Announcement bar sits quietly, never competes
- [ ] 375px: hero stacked, cards single column
- [ ] 1440px: hero two-column, cards in row
