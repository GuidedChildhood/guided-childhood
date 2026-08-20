'use client'
import { useState, useRef, useEffect, type ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { currentChildId } from '@/lib/children/current'
import DigiCharacter, { type DigiMood } from '@gc/shared/components/DigiCharacter'
import DigiHero from '@/components/digi/DigiHero'
import ThinkingReassurance from '@/components/digi/ThinkingReassurance'
import { schoolChipFor } from '@/lib/digi/school-chip'

function DigiAvatar({ size = 26, mood = 'idle' }: { size?: number; mood?: DigiMood }) {
  return <DigiCharacter size={size} mood={mood} />
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

// Render DiGi's bold lead ins (**like this**) as real bold, so a structured
// answer reads with the clarity of a coach, the bold phrase carrying the point
// and the rest of the sentence explaining it. Everything outside the asterisks
// stays plain. A lone trailing ** while the reply is still streaming is ignored.
function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = []
  // Bold lead ins (**like this**) and internal links DiGi drops in to point at a
  // real script it already has ([Title](/dashboard/...)). The link renders as a
  // tappable chip so a parent can open the exact script from the conversation.
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\((\/[^)\s]+)\)/g
  let last = 0
  let key = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index))
    if (m[1] !== undefined) {
      nodes.push(<strong key={key++} style={{ fontWeight: 800, color: 'var(--ink)' }}>{m[1]}</strong>)
    } else {
      nodes.push(
        <Link key={key++} href={m[3]} style={{ color: 'var(--terracotta-dark)', fontWeight: 800, textDecoration: 'underline', textUnderlineOffset: '2px' }}>
          {m[2]} →
        </Link>
      )
    }
    last = m.index + m[0].length
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}


export default function DigiChat({
  initialMessages,
  initialCount,
  dailyLimit,
  stagePrompts,
  faqPrompts,
  pendingReflection,
  stageId,
  stageName,
  childName,
}: {
  initialMessages: Message[]
  initialCount: number
  /**
   * Messages a day, or null when there is no limit.
   *
   * It replaces an isPaid boolean and a `const FREE_LIMIT = 3` sitting in this
   * file. Two problems with that pair. The number was written here AND in the
   * route AND twice in the copy below, so changing the offer meant finding
   * four of them. And isPaid asked hasFullAccess, which is true for the whole
   * trial, so the counter this component drew was invisible to the only people
   * it applies to.
   *
   * The number comes from platform_config now, through the page, so the badge,
   * the two sentences and the server all say the same thing.
   */
  dailyLimit: number | null
  stagePrompts: string[]
  faqPrompts?: string[]
  pendingReflection?: { question: string; answered: boolean } | null
  stageId?: number
  stageName?: string
  childName?: string | null
}) {
  // A NEW CHAT EVERY TIME YOU OPEN IT.
  //
  // Justin: "the previous conversation is scrolled down, I want it hidden up
  // above, not down, and saved like on the left in this chat so I can return to
  // it if I want, but new ones start."
  //
  // It used to seed the live thread with the last twenty messages and scroll to
  // the top, so a parent opened DiGi and met the tail of a conversation they had
  // already read, with every action link from the last answer still attached.
  // The greeting was there but it was competing with a finished exchange.
  //
  // Now the thread starts empty and the history sits above it behind one tap.
  // The important part, and the reason this costs nothing: DIGI STILL REMEMBERS.
  // The route reads the stored conversation server side for context regardless
  // of what is on screen, so hiding it changes what the PARENT sees and nothing
  // about what DiGi knows.
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [historyOpen, setHistoryOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [streamingReply, setStreamingReply] = useState(false)
  // Justin: "when you ask for DiGi's help it does run through what is
  // happening, just not on the first question."
  //
  // The thinking block was gated on `loading && !streamingReply`, so it lived
  // exactly as long as the wait did. The first question of a session is the
  // FASTEST one: no history to send, a cold cache being written rather than
  // read, and the shortest context of the conversation. The first token came
  // back before a parent could read a line, so the one moment we most want to
  // explain ourselves was the one moment we said nothing.
  //
  // So it holds for a beat. Not to fake work, the work is real and is listed in
  // ThinkingReassurance line by line, but because a message that flashes for
  // 300ms was never a message.
  const [thinkingFloor, setThinkingFloor] = useState(false)
  const [error, setError] = useState('')
  // The send to their phone flow: which message index went, or is going.
  // Justin, 19 August 2026: "when we say put this into words for children
  // there should be a send to their phone option."
  const [sentToChild, setSentToChild] = useState<Record<number, 'sending' | 'sent' | 'noapp' | 'failed'>>({})
  const sendToChildPhone = async (index: number, text: string) => {
    const childId = currentChildId()
    setSentToChild(prev => ({ ...prev, [index]: 'sending' }))
    try {
      const res = await fetch('/api/digi/send-to-child', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, child_id: childId }),
      })
      if (res.status === 409) { setSentToChild(prev => ({ ...prev, [index]: 'noapp' })); return }
      if (!res.ok) throw new Error(String(res.status))
      setSentToChild(prev => ({ ...prev, [index]: 'sent' }))
    } catch {
      setSentToChild(prev => ({ ...prev, [index]: 'failed' }))
    }
  }
  const [dailyCount, setDailyCount] = useState(initialCount)
  const [deviceSetupDismissed, setDeviceSetupDismissed] = useState(true)

  useEffect(() => {
    if (stageId) {
      setDeviceSetupDismissed(localStorage.getItem(`gc_device_setup_confirmed_${stageId}`) === '1')
    }
  }, [stageId])

  // Reflection state. A reflection saved before the truncation fix may be a
  // clipped fragment, so only surface one that ends as a proper question.
  const [reflectionQuestion, setReflectionQuestion] = useState<string | null>(
    pendingReflection && !pendingReflection.answered && pendingReflection.question.trim().endsWith('?')
      ? pendingReflection.question
      : null
  )
  const [reflectionInput, setReflectionInput] = useState('')
  const [reflectionSaving, setReflectionSaving] = useState(false)
  const [reflectionDone, setReflectionDone] = useState(
    pendingReflection?.answered ?? false
  )
  // A brief confirmation the moment a reflection saves, then it eases away so
  // it never lingers at the bottom of the thread. Separate from reflectionDone,
  // which stays true so the prompt does not resurface.
  const [reflectionToast, setReflectionToast] = useState(false)
  // What DiGi wrote back. Advice is not a toast: it stays until the parent
  // leaves the page, rather than fading after four seconds like the receipt
  // that used to stand in for it.
  const [reflectionInsight, setReflectionInsight] = useState<string | null>(null)
  useEffect(() => {
    if (!reflectionToast || reflectionInsight) return
    const id = setTimeout(() => setReflectionToast(false), 4000)
    return () => clearTimeout(id)
  }, [reflectionToast, reflectionInsight])

  // The reflection is a gentle end of chat ask, never an interruption. When a
  // reply carries one, we hold it here and only surface the card once the
  // parent has paused (no new message for a spell), so it lands at the natural
  // end of the conversation rather than between two of their questions.
  const reflectionTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const armReflection = (q: string) => {
    if (reflectionTimer.current) clearTimeout(reflectionTimer.current)
    reflectionTimer.current = setTimeout(() => {
      setReflectionQuestion(prev => (prev || reflectionDone ? prev : q))
    }, 22_000)
  }
  useEffect(() => () => { if (reflectionTimer.current) clearTimeout(reflectionTimer.current) }, [])

  // Flagging an answer as off: a quiet way for the parent to tell us when a
  // reply missed, with a short note. It lands server side for the team to work
  // on, and resets the moment the next question is asked.
  const [flagOpen, setFlagOpen] = useState(false)
  const [flagNote, setFlagNote] = useState('')
  const [flagSending, setFlagSending] = useState(false)
  const [flagSent, setFlagSent] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  // Opening the DiGi tab is always a fresh start. Whatever was said before is
  // still there, it is just above the fold: we scroll the line marking today's
  // opening to the top, so the parent lands on a clean page and finds the old
  // conversation by scrolling up, rather than arriving at the tail of a wall of
  // text they have already read. How many messages existed when the tab opened
  // never changes for this visit, so it is a ref, not state.
  // Zero, always: the live thread now opens empty, so the in thread divider and
  // the open at the top behaviour it drove are both retired. The old
  // conversation is reached by the control above instead.
  const historyCount = 0
  const freshRef = useRef<HTMLDivElement>(null)
  const openedRef = useRef(false)
  const wantOpenScroll = useRef(false)
  // The scrolling messages column, and whether the reader is currently pinned
  // to the bottom. While pinned, new text keeps the latest line in view as it
  // streams. The moment the reader scrolls up to re-read, we release, so the
  // stream never yanks them back down mid sentence. A ref, not state, so a
  // scroll never triggers a re-render.
  const scrollRef = useRef<HTMLDivElement>(null)
  const stickRef = useRef(true)
  // Pin the newest question to the very top of the view, the Good Inside feel,
  // until the parent scrolls away or asks the next thing. On its own a scroll
  // cannot lift a fresh question to the top, because nothing has streamed in
  // below it yet, and on a tall laptop a short answer never fills the gap. So we
  // also drop a full viewport of trailing space below on send, which guarantees
  // the question can always reach the top, then trim it once the answer lands.
  const pinRef = useRef(false)
  const tailRef = useRef<HTMLDivElement>(null)
  const [tailSpace, setTailSpace] = useState(0)
  const PIN_PAD = 12
  // The scrollTop we set ourselves, so our own programmatic scroll is never
  // mistaken for the parent taking the wheel.
  const selfScroll = useRef<number | null>(null)

  // Lift the newest question to the top of the view.
  const pinToTop = () => {
    const el = scrollRef.current
    if (!el) return
    const qs = el.querySelectorAll('[data-role="user"]')
    const last = qs[qs.length - 1] as HTMLElement | undefined
    if (!last) return
    const top = el.scrollTop + (last.getBoundingClientRect().top - el.getBoundingClientRect().top) - PIN_PAD
    selfScroll.current = top
    el.scrollTop = top
  }

  // Once the answer is in, trim the trailing space to exactly a viewport below
  // the question, so the pinned position never clamps (the question stays put)
  // and there is no giant empty gap under a short reply.
  const refitTail = () => {
    const el = scrollRef.current, tail = tailRef.current
    if (!el || !tail) return
    const qs = el.querySelectorAll('[data-role="user"]')
    const last = qs[qs.length - 1] as HTMLElement | undefined
    if (!last) return
    const qTop = last.getBoundingClientRect().top - el.getBoundingClientRect().top + el.scrollTop
    const belowQ = (el.scrollHeight - tail.offsetHeight) - qTop
    setTailSpace(Math.max(24, el.clientHeight - belowQ))
  }

  const onMessagesScroll = () => {
    const el = scrollRef.current
    if (!el) return
    // Ignore the scroll our own pin just caused; only a real move ends the pin.
    if (selfScroll.current != null && Math.abs(el.scrollTop - selfScroll.current) < 3) return
    pinRef.current = false
    stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80
  }

  const [deviceKey, setDeviceKey] = useState<string | null>(null)

  // A prompt still waiting to be finished ("My situation: ") never goes
  // into the box itself, that read as a messy half written sentence. It
  // becomes a small topic tag above a clean, empty box instead: the
  // parent sees what they are continuing without typing inside a wall
  // of someone else's words, and their own short answer is quietly
  // joined onto the full sentence only when it is actually sent.
  const [continuingPrefix, setContinuingPrefix] = useState<string | null>(null)
  const [continuingTopic, setContinuingTopic] = useState<string | null>(null)

  // Arriving from Help now, a moment card, a script or a lesson with a
  // ready made question: send it straight away so the conversation is
  // already under way, rather than dumping a long sentence into a one
  // line box where it sits half clipped and looks broken.
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const q = searchParams.get('q')
    const device = searchParams.get('device')
    if (device) setDeviceKey(device)
    if (!q) return
    window.history.replaceState(null, '', window.location.pathname)
    if (/:\s*$/.test(q)) {
      const topicMatch = q.match(/:\s*([^.]+)\.[^.]*:\s*$/)
      setContinuingTopic(topicMatch?.[1]?.trim() ?? 'this script')
      setContinuingPrefix(q)
      requestAnimationFrame(() => textareaRef.current?.focus())
    } else {
      sendMessage(q, device ?? undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // The compose box grows to fit what is in it, including a prefilled
  // question, instead of clipping to one line and hiding the rest.
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [input])

  // A brand new question jumps to the top of the view, the Good Inside feel:
  // the parent reads their own question at the top with DiGi's answer flowing
  // beneath it, rather than being dragged to the foot of a growing thread. Any
  // other update just keeps the newest text in view while pinned to the bottom.
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    // The first pass of this effect is the tab opening. With history behind us
    // we put the fresh start line at the top instead of dropping to the bottom,
    // and release the bottom pin so nothing drags them back down to the old
    // conversation. Everything after this behaves exactly as before.
    if (!openedRef.current && historyCount > 0) {
      // Open on the welcome. This used to lay a whole viewport of empty space
      // below the last message so a fresh start line could reach the top, which
      // meant the first thing a parent saw on tapping DiGi was a blank screen.
      // The hero is the top of this column now, so landing at the top IS the
      // greeting, and no manufactured space is needed to get there.
      openedRef.current = true
      stickRef.current = false
      el.scrollTop = 0
      return
    }
    openedRef.current = true
    if (wantOpenScroll.current) {
      const fresh = freshRef.current
      if (fresh) {
        wantOpenScroll.current = false
        stickRef.current = false
        const top = el.scrollTop + (fresh.getBoundingClientRect().top - el.getBoundingClientRect().top) - PIN_PAD
        selfScroll.current = top
        el.scrollTop = top
        return
      }
    }
    if (pinRef.current) { pinToTop(); return }
    if (stickRef.current) { selfScroll.current = el.scrollHeight; el.scrollTop = el.scrollHeight }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, reflectionQuestion, tailSpace])

  // Safety net: a tap that navigates away while a textarea is still
  // focused can skip the blur handler, which would leave the tab bar
  // hidden on the next page. Always clear it on unmount.
  useEffect(() => () => { document.body.classList.remove('gc-input-focused') }, [])

  // The answer when there is no answer.
  //
  // CLAUDE.md non-negotiable 1: DiGi always returns a calibrated pathway. An
  // error box is a dead end, which is the single thing that rule forbids, and
  // "try again" is a dead end wearing a suggestion's clothes. So when both
  // attempts fail, DiGi still says something true and usable.
  //
  // Written to be honest rather than clever. It does not pretend to have
  // understood the question, because it did not, and a fallback that guesses at
  // advice for a message it never read would be worse than silence. What it can
  // do is the thing that holds for almost every screen moment, and point at the
  // scripts, which are real answers sitting in the product already.
  function showFallback(asked: string) {
    const known = asked.trim().length > 0
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: [
        'I could not get my thinking together just then, and I would rather say so than give you something half made.',
        known ? 'Your message is still in the box, so send it again whenever you like and I will have another go.' : 'Ask me again whenever you like.',
        '',
        'While you are here, the one thing that holds for nearly every screen moment: the time to talk about it is never while the screen is still on. Wait for the calm part of the day, then agree together what happens next time. A rule set during a meltdown never survives the week.',
        '',
        'If you want something concrete right now, the scripts have a line for most of these moments, and they are written to be said out loud.',
      ].join('\n'),
    }])
  }

  async function sendMessage(text?: string, deviceOverride?: string) {
    const typed = text ?? input
    if (!typed.trim() || loading) return

    // Held so a failure can hand the words back.
    //
    // Justin, 2 August, with two screenshots: DiGi timed out and the box was
    // empty. The error said "Your message was not lost, try sending it again"
    // and it was gone from the transcript AND the input, so the only way to try
    // again was to type the whole thing out a second time. His words: "this is
    // where it would annoy, having to type it in again."
    //
    // The promise was the right promise. The code just did not keep it. So the
    // fix is to make it true rather than to soften the wording, because a
    // parent who has just described a hard morning should never be made to
    // describe it twice.
    const priorPrefix = continuingPrefix
    const priorTopic = continuingTopic
    const restoreDraft = () => {
      setInput(typed)
      // Only when the parent typed it. A chip carries no prefix, so putting one
      // back would attach a topic they never chose.
      if (!text && priorPrefix) {
        setContinuingPrefix(priorPrefix)
        setContinuingTopic(priorTopic)
      }
    }
    setThinkingFloor(true)
    // 1400ms: long enough to read one line of what DiGi is doing, short enough
    // that it never feels like it is stalling on an answer it already has.
    window.setTimeout(() => setThinkingFloor(false), 1400)
    const messageText = text ? typed : continuingPrefix ? `${continuingPrefix}${typed}` : typed

    // A new message means the conversation is still going, so any reflection
    // that was waiting to appear stands down and defers to the next real pause.
    if (reflectionTimer.current) { clearTimeout(reflectionTimer.current); reflectionTimer.current = null }
    if (!reflectionDone) setReflectionQuestion(null)
    // A fresh question clears any flag box left open on the previous answer.
    setFlagOpen(false); setFlagSent(false); setFlagNote('')

    // Sending lifts the new question to the top of the view, not the bottom, so
    // the answer reads from the question down, the Good Inside feel. A full
    // viewport of trailing space guarantees the question can reach the very top
    // even before the answer has filled in beneath it.
    stickRef.current = false
    pinRef.current = true
    if (scrollRef.current) setTailSpace(scrollRef.current.clientHeight)
    setMessages(prev => [...prev, { role: 'user', content: messageText }])
    setInput('')
    setContinuingPrefix(null)
    setContinuingTopic(null)
    setLoading(true)
    setError('')

    // The reply streams in as plain text. The reflective question travels in
    // the same stream after a --- marker line and is split out client side.
    const REFLECTION_MARKER = /\n\s*---\s*\n/
    let replyStarted = false

    // One quiet second go, then stop.
    //
    // Justin: "How can we make sure it answers these questions". The parent
    // should not be the retry mechanism. Most failures here are transient and
    // die on a second attempt, and the first real numbers say the normal reply
    // is about four seconds, so a retry is affordable in a way it would not be
    // if DiGi were genuinely slow.
    //
    // ONE retry, not a loop. A second failure means something real is wrong,
    // and hammering a struggling system is how a slow minute becomes a broken
    // one. Only ever retried when NOTHING reached the screen: once a reply has
    // started it is a real partial answer, and replacing it would take words
    // away from a parent who is already reading them.
    async function attempt(): Promise<'ok' | 'retry' | 'stop'> {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 65_000)
      const res = await fetch('/api/digi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // child_id so everything DiGi files, memory, concerns, questions, lands
        // against the child the parent actually has open rather than the
        // primary one. Read at send time from the URL, see lib/children/current.
        body: JSON.stringify({ message: messageText, device_key: deviceOverride ?? deviceKey, child_id: currentChildId() }),
        signal: controller.signal,
      })

      if (!res.ok) {
        clearTimeout(timeout)
        const data = await res.json().catch(() => ({} as { error?: string }))
        // The daily limit is a decision, not a wobble, and asking again will
        // get the same answer. Same for anything else in the 400s: the request
        // was understood and refused. Only a server side fault is worth a
        // second go.
        if (res.status >= 500) return 'retry'
        if (res.status === 429) {
          // The number comes back with the refusal, so this sentence agrees
          // with whatever the limit actually is rather than with what it was
          // when the sentence was written.
          const limit = Number((data as { limit?: number }).limit) || dailyLimit
          setError(`DiGi has helped all it can today, that is your ${limit} free ${limit === 1 ? 'chat' : 'chats'}. It refreshes tomorrow, or go unlimited any time.`)
        } else {
          setError(data.error ?? 'Something went wrong. Please try again.')
        }
        setMessages(prev => prev.slice(0, -1))
        // Including the daily limit. They cannot send it now, but the words are
        // still theirs, and they are still there tomorrow or the moment they go
        // unlimited.
        restoreDraft()
        return 'stop'
      }

      if (!res.body) throw new Error('No response stream')

      const usedToday = Number(res.headers.get('X-Messages-Used-Today'))
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      const showReply = (content: string) => {
        if (!replyStarted) {
          replyStarted = true
          setStreamingReply(true)
          setMessages(prev => [...prev, { role: 'assistant', content }])
        } else {
          setMessages(prev => {
            const next = [...prev]
            next[next.length - 1] = { role: 'assistant', content }
            return next
          })
        }
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        fullText += decoder.decode(value, { stream: true })
        // Hide a partially streamed marker line so it never flashes on screen
        const visible = fullText.split(REFLECTION_MARKER)[0].replace(/\n\s*-{1,3}\s*$/, '')
        if (visible.trim()) showReply(visible)
      }
      fullText += decoder.decode()
      clearTimeout(timeout)

      const parts = fullText.split(REFLECTION_MARKER)
      const mainResponse = parts[0]?.trim() ?? fullText.trim()
      // A real reflection always ends with a question mark. If the reply ran
      // long and the reflection came through truncated, drop it rather than
      // show a half sentence ("...or does he pr").
      const rawReflective = parts[1]?.trim() || null
      const reflective = rawReflective && rawReflective.endsWith('?') ? rawReflective : null

      // An empty reply is not a timeout, whatever the old copy said. It arrives
      // fast and says nothing, and it is worth a second go precisely because it
      // costs so little.
      if (!mainResponse) return 'retry'

      showReply(mainResponse)
      setDailyCount(Number.isFinite(usedToday) && usedToday > 0 ? usedToday : dailyCount + 1)
      // The answer has landed. Re-assert the question at the top, trim the
      // trailing space to a viewport, then release the pin so the parent can
      // read and scroll freely. The trim leaves the pinned position valid, so
      // the question does not slip down even on a tall screen.
      requestAnimationFrame(() => requestAnimationFrame(() => {
        pinToTop()
        refitTail()
        pinRef.current = false
      }))
      // Hold the reflective question back and only let it surface once the
      // parent has paused, so it never interrupts a live back and forth.
      if (reflective && !reflectionQuestion && !reflectionDone) {
        armReflection(reflective)
      }
      return 'ok'
    }

    try {
      let outcome = await attempt()

      // The second go, and only when the screen is still blank. A partial reply
      // is a real answer and must not be thrown away to try for a better one.
      if (outcome === 'retry' && !replyStarted) {
        outcome = await attempt()
      }

      if (outcome === 'retry') {
        // Both attempts failed. CLAUDE.md non-negotiable 1: DiGi always returns
        // a calibrated pathway. An error box is a dead end, which is the one
        // thing that rule forbids, so DiGi still answers. Thinner than usual
        // and honest about being thinner, but never nothing.
        //
        // The message stays in the box as well, so the parent can send it again
        // the moment they want to, without typing it twice.
        setMessages(prev => prev.slice(0, -1))
        restoreDraft()
        setError('')
        showFallback(messageText)
      }
    } catch {
      if (!replyStarted) {
        setMessages(prev => prev.slice(0, -1))
        restoreDraft()
        showFallback(messageText)
      }
      // A reply that started and then dropped is kept exactly as it arrived.
    } finally {
      setLoading(false)
      setStreamingReply(false)

      // THE PATHWAY TICK.
      //
      // Justin, 8 August 2026: "[the] last step is to ask digi a question but i
      // did this and did not update the green tick and say done."
      //
      // Nothing was wrong with the data. The question landed in digi_questions
      // at 07:19 UTC and getTodayLoop counts exactly that. What did not happen
      // was the dashboard being asked again.
      //
      // /dashboard is a server component, and its rendered payload sits in the
      // client router cache. Going back to it, by the "Today's pathway" link or
      // by the back gesture, restores that payload rather than re-rendering it,
      // so the parent is shown the version of the page from before they asked
      // anything. Instant, and a day out of date.
      //
      // router.refresh clears that cache, so the tick is green when they get
      // back. In the finally block, because a reply that failed halfway may
      // still have written the row, and a wasted refresh costs nothing next to
      // a step a parent completed and was told they had not.
      try { router.refresh() } catch { /* nothing to refresh, no harm */ }
    }
  }

  async function submitFlag() {
    if (!flagNote.trim() || flagSending) return
    const last = messages[messages.length - 1]
    const lastQuestion = [...messages].reverse().find(m => m.role === 'user')
    setFlagSending(true)
    try {
      await fetch('/api/digi/flag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: lastQuestion?.content ?? null,
          answer: last?.role === 'assistant' ? last.content : null,
          note: flagNote.trim(),
        }),
      })
      setFlagSent(true)
      setFlagOpen(false)
      setFlagNote('')
    } catch {
      // fail quietly, never block the parent
    } finally {
      setFlagSending(false)
    }
  }

  async function submitReflection() {
    if (!reflectionQuestion || !reflectionInput.trim()) return
    setReflectionSaving(true)
    try {
      const res = await fetch('/api/digi/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: reflectionQuestion,
          response: reflectionInput.trim(),
        }),
      })
      const data = await res.json().catch(() => null)
      setReflectionInsight(typeof data?.insight === 'string' && data.insight.trim() ? data.insight.trim() : null)
      setReflectionDone(true)
      setReflectionToast(true)
      setReflectionQuestion(null)
    } catch {
      // fail silently — not critical
    } finally {
      setReflectionSaving(false)
    }
  }

  async function dismissReflection() {
    if (!reflectionQuestion) return
    // Save with no response (so it doesn't resurface)
    await fetch('/api/digi/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: reflectionQuestion, response: '' }),
    }).catch(() => null)
    setReflectionQuestion(null)
    setReflectionDone(true)
  }

  const atLimit = dailyLimit != null && dailyCount >= dailyLimit

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100dvh - 80px)', maxWidth: '700px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'var(--white)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <DigiAvatar size={36} mood="wave" />
            </div>
            <div>
              <p className="eyebrow" style={{ marginBottom: '1px', fontSize: 'var(--text-sm)' }}>Your evidence led guide</p>
              <h1 style={{ fontSize: 'var(--text-md)', marginBottom: '0', lineHeight: 1 }}>DiGi</h1>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
            {/* The way back, always there.
                A question to DiGi is a detour, not a destination. The pathway
                on Home is what decides what to do next, so a parent who has
                just had their answer should never have to hunt for the road
                back to it or reach for the browser's back button. It sits in
                the header rather than under the answer so it is there while
                they are still typing, and while DiGi is still thinking. */}
            <Link
              href="/dashboard"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)',
                color: 'var(--ink)', textDecoration: 'none',
                background: 'var(--cream)', border: '1.5px solid var(--border)',
                borderRadius: 100, padding: '6px 13px', whiteSpace: 'nowrap',
              }}
            >
              <span aria-hidden>←</span> Today&apos;s pathway
            </Link>
            {dailyLimit != null && (
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)' }}>
                {dailyCount}/{dailyLimit} today
              </span>
            )}
            {atLimit && (
              <Link href="/dashboard/upgrade" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--terracotta)', textDecoration: 'none' }}>
                Upgrade for unlimited →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} onScroll={onMessagesScroll} style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 0', background: '#fff' }}>

        {/* The front door, every time the tab is opened, not only on a first
            ever visit.

            It used to render only when there were NO messages, so the moment a
            family had any history at all, opening DiGi dropped them into an old
            conversation with no greeting and no idea what to do. Worse, the
            open behaviour laid a full viewport of blank space below the last
            message to push a fresh start line to the top, so what a parent
            actually met was a blank screen. Justin: "this is confusing, it
            should welcome and give instructions like the first page does."

            So the hero sits above the thread now. Open DiGi and you are
            greeted and told what this is for; the conversation is underneath,
            where a conversation belongs. */}
        <div style={{ margin: '0 -20px 24px' }}>
          <DigiHero
            title={<>Let&apos;s make today a little easier.</>}
            subtitle="I am trained on the research and I get more useful the more you tell me. What is on your mind?"
            curved={false}
          />
        </div>

        {messages.length === 0 && (
          <div style={{ paddingTop: '4px' }}>

            {stageId && stageName && !deviceSetupDismissed && (
              <div style={{
                background: 'var(--stage-2)',
                border: '1.5px solid var(--border)',
                borderRadius: '16px',
                padding: '16px 18px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  background: 'var(--terracotta)', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 0 var(--terracotta-dark)',
                }}>
                  <span style={{ fontSize: 'var(--text-md)', color: '#fff' }}>⚙</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: 'var(--terracotta)', marginBottom: '4px',
                  }}>
                    Device setup · Stage {stageId}
                  </div>
                  <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.5, marginBottom: '10px' }}>
                    {/* The name of the CHILD, not the name of the stage.
                        Justin: "this came up on DiGi after the updates and I am
                        not sure what Shaper refers to."
                        Shaper is what we call stage 4. The sentence is "device
                        settings for X", which reads as a person, so it named the
                        stage as though it were his son. The eyebrow directly
                        above already says STAGE 4, so the stage was both wrong
                        here and redundant.
                        Falls back to "your child" rather than to the stage,
                        because a family with no name saved should get a plain
                        sentence, not a puzzle. */}
                    Have you set the right device settings for {childName || 'your child'}? I work better when the basics are in place.
                  </p>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <Link
                      href={`/dashboard/pathway`}
                      style={{
                        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                        color: 'var(--terracotta)', textDecoration: 'underline',
                        letterSpacing: '0.04em',
                      }}
                    >
                      Check setup →
                    </Link>
                    <button
                      onClick={() => {
                        if (stageId) localStorage.setItem(`gc_device_setup_confirmed_${stageId}`, '1')
                        setDeviceSetupDismissed(true)
                      }}
                      style={{
                        background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600,
                        color: 'var(--ink-muted)', letterSpacing: '0.04em',
                      }}
                    >
                      All set
                    </button>
                  </div>
                </div>
              </div>
            )}

            <p className="eyebrow" style={{ marginBottom: '12px', fontSize: 'var(--text-sm)' }}>Try asking</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {stagePrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(prompt)}
                  style={{
                    padding: '12px 16px',
                    background: 'var(--white)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    fontSize: 'var(--text-md)',
                    color: 'var(--ink-soft)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    lineHeight: 1.4,
                    transition: 'border-color 0.15s',
                    fontFamily: 'var(--font-body)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--terracotta)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* The earlier conversation, above the new one and shut by default.
            Justin: "hidden up above, not down, so I can return to it if I want,
            but new ones start."

            Deliberately quieter than the live thread: the words, and nothing
            else. Every action link on an old answer (put this in words, back to
            today's pathway, scripts, a lesson) acts on a moment that has passed,
            and seven stale invitations was most of what made arriving here feel
            messy. Reading back what was said is the only thing this is for. */}
        {initialMessages.length > 0 && (
          <div style={{ marginBottom: historyOpen ? 26 : 18 }}>
            <button
              onClick={() => setHistoryOpen(o => !o)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                background: 'var(--cream)', border: '1.5px solid var(--border)',
                borderRadius: 14, padding: '11px 14px', cursor: 'pointer',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
                color: 'var(--ink-soft)', textAlign: 'left',
              }}
            >
              <span aria-hidden style={{
                display: 'inline-block', transition: 'transform 160ms ease',
                transform: historyOpen ? 'rotate(90deg)' : 'none',
              }}>›</span>
              {historyOpen ? 'Hide the earlier chat' : 'Earlier chat'}
              <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)' }}>
                {initialMessages.length} message{initialMessages.length === 1 ? '' : 's'}
              </span>
            </button>

            {historyOpen && (
              <div style={{ marginTop: 14, paddingLeft: 2 }}>
                {initialMessages.map((m, i) => (
                  <div
                    key={`hist-${i}`}
                    style={{
                      display: 'flex',
                      justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                      marginBottom: 12,
                    }}
                  >
                    <div style={{
                      maxWidth: '88%',
                      background: m.role === 'user' ? 'var(--stage-2)' : 'transparent',
                      border: m.role === 'user' ? '1px solid var(--border)' : 'none',
                      borderRadius: 16, padding: m.role === 'user' ? '9px 13px' : '0 2px',
                      // Dimmer than the live thread on purpose. This is a
                      // record, not the conversation a parent is in.
                      fontSize: 'var(--text-base)', lineHeight: 1.55, color: 'var(--ink-soft)',
                      whiteSpace: 'pre-wrap',
                    }}>
                      {m.content}
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0 4px' }}>
                  <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', whiteSpace: 'nowrap' }}>
                    New chat below
                  </span>
                  <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                </div>
              </div>
            )}
          </div>
        )}

        {messages.map((msg, i) => {
          // DiGi speaks as one warm, continuous voice, the way the welcome
          // sheet reads, not a stack of boxed white cards. The whole reply
          // flows inside a single soft butter bubble, its separate thoughts
          // set apart by generous spacing rather than separate boxes. Only the
          // parent's own message wears the solid butter bubble, on the right.
          // A lesson reply still renders as its structured card.
          if (msg.role === 'user') {
            return (
              <div key={i} data-role="user" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '22px' }}>
                <div style={{
                  // The Good Inside blue: a soft periwinkle question pill with
                  // dark ink text, so the parent's question reads clear at the
                  // top with DiGi's answer flowing beneath it.
                  maxWidth: '84%', background: '#DCE7FB', color: '#1B2A4A',
                  borderRadius: '20px', padding: '14px 18px',
                  fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', lineHeight: 1.45,
                  fontWeight: 800, whiteSpace: 'pre-wrap',
                }}>
                  {msg.content}
                </div>
              </div>
            )
          }
          // DiGi answers as clean, flowing guidance now, clear instructions a
          // parent can act on, never a boxed lesson with a play button. Each
          // point stays whole (split on blank lines only), its bold lead in
          // carrying the move.
          const paras = msg.content.split(/\n{2,}/).map(s => s.trim()).filter(Boolean)
          if (paras.length === 0) return null
          // A short one liner is just chat. A multi step how to is the kind of
          // thing a child could hear too, so offer to put it in their words.
          const offerChildVersion = i === messages.length - 1 && !streamingReply && paras.length >= 3
          return (
            <div key={i} style={{ marginBottom: '26px' }}>
              {/* DiGi's mark and name sit once above the answer, the reference
                  feel: no coloured bubble, just a clear note from a coach. */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 11 }}>
                <div style={{ width: 26, height: 26, flexShrink: 0 }}><DigiAvatar size={26} /></div>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>DiGi</span>
              </div>
              {/* The answer flows as plain text on white, its separate points set
                  apart by space, each bold lead in carrying the move. */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {paras.map((text, b) => (
                  <p key={b} style={{
                    margin: 0, fontFamily: 'var(--font-body)', fontSize: 'var(--text-lg)',
                    lineHeight: 1.6, color: 'var(--ink)', fontWeight: 500, whiteSpace: 'pre-wrap',
                  }}>
                    {renderInline(text)}
                  </p>
                ))}
                {offerChildVersion && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 3 }}>
                    <button
                      onClick={() => sendMessage('Put that in simple words for my child to read, at their age, so we can go through it together.')}
                      style={{
                        background: '#fff', border: '1.5px solid var(--terracotta)',
                        color: 'var(--ink)', borderRadius: 12, padding: '9px 14px', cursor: 'pointer',
                        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
                      }}
                    >
                      Put this in words for my child
                    </button>
                    {/* The last metre. Once DiGi has written the child's
                        version, the parent used to hand their own phone over.
                        One tap lands it inside the child's app, with a gentle
                        push saying a note is waiting. 409 means no app yet, and
                        honesty beats a spinner: the button says so. */}
                    <button
                      onClick={() => sendToChildPhone(i, msg.content)}
                      disabled={sentToChild[i] === 'sending' || sentToChild[i] === 'sent'}
                      style={{
                        background: sentToChild[i] === 'sent' ? 'var(--tint-sage)' : '#fff',
                        border: '1.5px solid var(--border)',
                        color: 'var(--ink)', borderRadius: 12, padding: '9px 14px',
                        cursor: sentToChild[i] === 'sent' ? 'default' : 'pointer',
                        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
                      }}
                    >
                      {sentToChild[i] === 'sent' ? 'On their phone ✓'
                        : sentToChild[i] === 'sending' ? 'Sending…'
                        : sentToChild[i] === 'noapp' ? 'Their app is not set up yet'
                        : sentToChild[i] === 'failed' ? 'Did not send, try again'
                        : 'Send to their phone'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        }).flatMap((el, i) => (
          // The fresh start line, dropped in at the point the tab was opened.
          // Nothing is deleted and nothing is hidden: everything above is one
          // scroll away. It only appears when there is history to sit above it.
          i === historyCount && historyCount > 0
            ? [
                <div key="gc-fresh-start" ref={freshRef} style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0 26px' }}>
                  <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', whiteSpace: 'nowrap' }}>
                    Earlier chat above
                  </span>
                  <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                </div>,
                el,
              ]
            : [el]
        ))}
        {historyCount > 0 && messages.length === historyCount && (
          <div ref={freshRef} style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0 20px' }}>
            <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', whiteSpace: 'nowrap' }}>
              Earlier chat above
            </span>
            <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>
        )}

        {/* Between chats, a quiet drop in: a couple of places that help with what
            they just asked, the Good Inside feel. Only once the answer is settled,
            never mid stream, and easy to ignore, so it never distracts. */}
        {messages.length > 0 && messages[messages.length - 1].role === 'assistant' && !streamingReply && !loading && (() => {
          // What they actually asked, so the scripts link can carry it. Same
          // read as the flag box uses: the last thing the parent typed, not the
          // last thing DiGi said.
          const lastAsk = [...messages].reverse().find(m => m.role === 'user')?.content?.slice(0, 140) ?? ''
          return (
          <div style={{ marginBottom: '26px' }}>
            {/* Answered, so the useful next move is almost never another
                question. It is going back and doing the thing. The pathway
                already knows what today needs, so this hands them back to it
                rather than leaving them sat in a chat box wondering. */}
            <Link
              href="/dashboard"
              style={{
                display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none',
                background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)',
                borderRadius: 16, padding: '13px 15px', marginBottom: 18,
              }}
            >
              <span aria-hidden style={{ fontSize: 'var(--text-xl)', lineHeight: 1, flexShrink: 0 }}>🧭</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>
                  Back to today&apos;s pathway
                </span>
                <span style={{ display: 'block', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.4, marginTop: 2 }}>
                  It picks up where you left off and says what to do next.
                </span>
              </span>
              <span aria-hidden style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--terracotta-dark)' }}>›</span>
            </Link>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '9px' }}>
              More that might help
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                // The question goes WITH them. This said "scripts for moments
                // like this" and linked to the whole library, so a parent who
                // had just described their evening was handed 236 scripts and
                // left to find the one. Justin, 11 August 2026: "can we make
                // script suggestions actually pull up scripts that relate to
                // the question, and ability to search others." The finder
                // opens on the matches and stays editable, which is both.
                { icon: '❝', label: 'Scripts for moments like this', href: lastAsk ? `/dashboard/scripts?q=${encodeURIComponent(lastAsk)}` : '/dashboard/scripts' },
                { icon: '🎬', label: 'A lesson to watch together', href: '/dashboard/lessons' },
                // The school pages, but ONLY when the question was a school
                // question. Justin, 11 August 2026: "DiGi prompts now and
                // again, not too often, especially when tired questions or
                // homework questions are asked in DiGi."
                //
                // Not too often is the design rather than a counter. A chip
                // advertising the curriculum checker under every answer becomes
                // furniture in a week, and furniture does not get tapped. The
                // cap is relevance: see lib/digi/school-chip.ts, which stays
                // silent on screens, social media and a parent's own tiredness,
                // and speaks on homework, the class, and a child who is
                // shattered every school morning.
                ...(schoolChipFor(lastAsk) ? [schoolChipFor(lastAsk)!] : []),
              ].map(r => (
                <Link key={r.href} href={r.href} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '7px',
                  background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '12px',
                  padding: '9px 13px', textDecoration: 'none',
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--ink)',
                }}>
                  <span aria-hidden>{r.icon}</span>{r.label}
                </Link>
              ))}
            </div>

            {/* Flag an answer as off. Quiet by default, a small note box when
                opened, a plain thank you once sent. Never in the way. */}
            <div style={{ marginTop: '14px' }}>
              {flagSent ? (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink-muted)' }}>
                  Thank you. We will look at this.
                </div>
              ) : flagOpen ? (
                <div>
                  <textarea
                    value={flagNote}
                    onChange={e => setFlagNote(e.target.value)}
                    placeholder="What was off about this answer? It helps us make DiGi better."
                    rows={2}
                    style={{
                      width: '100%', boxSizing: 'border-box', padding: '10px 13px', borderRadius: '12px',
                      border: '1.5px solid var(--border)', background: 'var(--cream)',
                      fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink)',
                      resize: 'none', outline: 'none', lineHeight: 1.5, marginBottom: '8px',
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = 'var(--terracotta)'; document.body.classList.add('gc-input-focused') }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; document.body.classList.remove('gc-input-focused') }}
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={submitFlag}
                      disabled={flagSending || !flagNote.trim()}
                      style={{
                        background: flagNote.trim() ? 'var(--terracotta)' : 'var(--border)',
                        color: flagNote.trim() ? 'var(--ink)' : 'var(--ink-muted)', border: 'none',
                        borderRadius: '10px', padding: '9px 15px', cursor: flagNote.trim() ? 'pointer' : 'not-allowed',
                        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
                      }}
                    >
                      {flagSending ? 'Sending…' : 'Send'}
                    </button>
                    <button
                      onClick={() => { setFlagOpen(false); setFlagNote('') }}
                      style={{
                        background: 'none', border: '1.5px solid var(--border)', borderRadius: '10px', padding: '9px 14px',
                        cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--ink-soft)',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setFlagOpen(true)}
                  style={{
                    background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                    fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-light)',
                    textDecoration: 'underline', textUnderlineOffset: '3px',
                  }}
                >
                  Something off with this answer? Tell us
                </button>
              )}
            </div>
          </div>
          )
        })()}

        {loading && (!streamingReply || thinkingFloor) && (
          <div style={{ marginBottom: '26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 11 }}>
              <div style={{ width: 26, height: 26, flexShrink: 0 }}><DigiAvatar size={26} mood="thinking" /></div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>DiGi</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ display: 'inline-flex', gap: '5px', alignItems: 'center', background: 'var(--cream)', borderRadius: '100px', padding: '10px 14px' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: '7px', height: '7px', background: 'var(--ink-light)', borderRadius: '50%', animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                ))}
              </div>
              {/* The true reassurance: DiGi is reading vetted research, not the
                  open web, and every answer clears our safety guardrails. */}
              <ThinkingReassurance />
            </div>
          </div>
        )}

        {error && (
          <div style={{ padding: '12px 16px', background: 'var(--stage-1)', borderRadius: '12px', marginBottom: '12px' }}>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.5 }}>{error}</p>
            {error.toLowerCase().includes('upgrade') && (
              <Link href="/dashboard/upgrade" className="btn" style={{ marginTop: '12px', display: 'inline-flex', padding: '10px 20px', fontSize: 'var(--text-base)' }}>
                Unlock unlimited DiGi
              </Link>
            )}
          </div>
        )}

        {/* Reflection card — appears after DiGi has given a daily reflection question */}
        {reflectionQuestion && !reflectionDone && (
          <div style={{
            background: 'var(--white)',
            border: '1.5px solid var(--terracotta-lt)',
            borderLeft: '3px solid var(--terracotta)',
            borderRadius: '16px',
            padding: '18px 18px 16px',
            marginBottom: '16px',
            marginTop: '8px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--terracotta)', flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta)' }}>
                Today's reflection
              </span>
            </div>
            <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.6, marginBottom: 14, fontWeight: 500 }}>
              {reflectionQuestion}
            </p>
            <textarea
              value={reflectionInput}
              onChange={e => setReflectionInput(e.target.value)}
              placeholder="A sentence or two is fine..."
              rows={2}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1.5px solid var(--border)',
                background: 'var(--cream)',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-md)',
                color: 'var(--ink)',
                resize: 'none',
                outline: 'none',
                lineHeight: 1.5,
                marginBottom: 10,
                boxSizing: 'border-box',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--terracotta)'; document.body.classList.add('gc-input-focused') }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; document.body.classList.remove('gc-input-focused') }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={submitReflection}
                disabled={reflectionSaving || !reflectionInput.trim()}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  background: reflectionInput.trim() ? 'var(--terracotta)' : 'var(--border)',
                  color: reflectionInput.trim() ? '#fff' : 'var(--ink-muted)',
                  border: 'none',
                  borderRadius: '10px',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  fontSize: 'var(--text-base)',
                  cursor: reflectionInput.trim() ? 'pointer' : 'not-allowed',
                  transition: 'background 0.15s',
                }}
              >
                {reflectionSaving ? 'Saving...' : 'Send to DiGi'}
              </button>
              <button
                onClick={dismissReflection}
                style={{
                  padding: '10px 14px',
                  background: 'none',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-base)',
                  color: 'var(--ink-muted)',
                  cursor: 'pointer',
                }}
              >
                Skip
              </button>
            </div>
          </div>
        )}

        {reflectionToast && (
          reflectionInsight ? (
            /* DiGi answered. The advice was always written here, four seconds
               before this rendered, and used to be thrown away in favour of a
               receipt. It reads as a reply because that is what it is. */
            <div style={{
              background: 'var(--tint-sage)', border: '1.5px solid #D6E5DF',
              borderRadius: '16px', padding: '15px 17px', margin: '4px 0 12px',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '7px' }}>
                DiGi
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.65, marginBottom: '9px' }}>
                {reflectionInsight}
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                Kept, so it shapes what I suggest next and your Sunday round up.
              </p>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '12px 0 8px', marginBottom: 8, transition: 'opacity 0.4s' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-muted)' }}>
                ✓ Saved. My thinking on it will be on your home page
              </p>
            </div>
          )
        )}

        <div ref={tailRef} aria-hidden style={{ height: Math.max(20, tailSpace) }} />
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', background: 'var(--white)', flexShrink: 0 }}>
        {/* A quiet strip of example questions that stays under the chat once it
            is under way, so a parent always sees the kind of thing they can ask,
            like how long a child their age should be on a screen. Hidden while
            they are typing or continuing a topic, and gone at the daily limit.
            The empty state keeps its own bigger Try asking list above. */}
        {!atLimit && messages.length > 0 && !input.trim() && !continuingTopic && (faqPrompts?.length ?? 0) > 0 && (
          <div
            aria-label="Example questions to ask DiGi"
            style={{
              display: 'flex', gap: '7px', overflowX: 'auto', paddingBottom: '10px',
              margin: '0 -20px', paddingLeft: '20px', paddingRight: '20px', scrollbarWidth: 'none',
            }}
          >
            {faqPrompts!.map((q, i) => (
              <button
                key={i}
                type="button"
                onClick={() => sendMessage(q)}
                style={{
                  flexShrink: 0, whiteSpace: 'nowrap', cursor: 'pointer',
                  background: 'var(--cream)', border: '1px solid var(--border)',
                  borderRadius: '100px', padding: '8px 14px',
                  fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-soft)',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--terracotta)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                {q}
              </button>
            ))}
          </div>
        )}
        {atLimit ? (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)', marginBottom: '12px' }}>
              That is your {dailyLimit} free {dailyLimit === 1 ? 'message' : 'messages'} for today. Come back tomorrow, or join for unlimited DiGi.
            </p>
            <Link href="/dashboard/upgrade" className="btn" style={{ display: 'inline-flex' }}>
              Upgrade for unlimited
            </Link>
          </div>
        ) : (
          <form onSubmit={e => { e.preventDefault(); sendMessage() }} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {continuingTopic && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  background: 'var(--stage-2)', border: '1px solid var(--border)',
                  borderRadius: '100px', padding: '5px 12px',
                  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                  color: 'var(--ink-soft)', maxWidth: '100%',
                }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    Continuing: {continuingTopic}
                  </span>
                  <button
                    type="button"
                    onClick={() => { setContinuingPrefix(null); setContinuingTopic(null) }}
                    aria-label="Stop continuing this topic"
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--ink-muted)', fontSize: 'var(--text-base)', lineHeight: 1, flexShrink: 0 }}
                  >
                    ×
                  </button>
                </span>
              </div>
            )}
            {/* The compose pill: soft rounded field with a butter send tucked
                in the corner, the reference feel in our palette. */}
            <div style={{
              display: 'flex', gap: '8px', alignItems: 'flex-end',
              background: 'var(--cream)', border: '1.5px solid var(--border)',
              borderRadius: '26px', padding: '6px 6px 6px 18px',
              transition: 'border-color 0.15s',
            }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              placeholder={continuingTopic ? 'What is happening, in your own words...' : 'Type your question'}
              rows={1}
              style={{
                flex: 1,
                padding: '9px 0',
                border: 'none',
                background: 'transparent',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-lg)',
                color: 'var(--ink)',
                resize: 'none',
                outline: 'none',
                lineHeight: 1.5,
                maxHeight: '160px',
                overflowY: 'auto',
              }}
              onFocus={e => { const p = e.currentTarget.parentElement; if (p) p.style.borderColor = 'var(--terracotta)'; document.body.classList.add('gc-input-focused') }}
              onBlur={e => { const p = e.currentTarget.parentElement; if (p) p.style.borderColor = 'var(--border)'; document.body.classList.remove('gc-input-focused') }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send to DiGi"
              style={{
                flexShrink: 0, width: 44, height: 44, borderRadius: '50%', border: 'none',
                background: input.trim() ? 'var(--terracotta)' : 'var(--border)',
                color: 'var(--ink)', cursor: input.trim() ? 'pointer' : 'default',
                boxShadow: input.trim() ? '0 4px 0 var(--terracotta-dark)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 'var(--text-xl)', fontWeight: 800, lineHeight: 1,
                transition: 'background 0.15s',
              }}
            >
              ↑
            </button>
            </div>
          </form>
        )}
        {!atLimit && (
          <p style={{ margin: '9px 6px 0', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.4 }}>
            DiGi is a guide, not a crisis line, and can make mistakes. In an emergency call 999, or Samaritans on 116 123.
          </p>
        )}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  )
}
