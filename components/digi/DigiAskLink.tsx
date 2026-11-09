'use client'

import Link from 'next/link'
import type { ComponentProps } from 'react'
import { digiHeldHref, holdDigiPrompt, type DigiHandoffMode } from '@/lib/digi/handoff'

// A link that opens DiGi with a question already written, without the question
// ever appearing in the URL. The tap holds it in this tab and the link goes to
// /dashboard/digi?held=1, which DiGi collects once. See lib/digi/handoff.ts.
//
// A client component, so a server component can render it too: the question
// travels as a prop in the page itself, which is where it was already printed,
// and never into the address bar, the logs or the next page's Referer.

type Props = Omit<ComponentProps<typeof Link>, 'href'> & {
  /** The question. It may name the child: it never leaves this tab. */
  prompt: string
  /** send asks it straight away; draft leaves it in the box to edit. */
  mode?: DigiHandoffMode
  /** A child's id, so DiGi opens that child's thread. Never a name. */
  child?: string | null
  /** A device guide key, so DiGi loads that guide. */
  device?: string | null
}

export default function DigiAskLink({ prompt, mode = 'send', child, device, onClick, ...rest }: Props) {
  return (
    <Link
      {...rest}
      href={digiHeldHref({ child, device })}
      onClick={e => {
        holdDigiPrompt(prompt, mode)
        onClick?.(e)
      }}
    />
  )
}
