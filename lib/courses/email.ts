// Turns one course day into the email a lead receives. Shared by the sign up
// (day 1, at once) and the email cron (days 2 to 7), so both build it the same.

import { APP_ORIGIN } from '@/lib/config/site'
import { leadUnsubscribeUrl, starterCtaUrl } from '@/lib/email'
import { courseDayEmail, type EmailContent } from '@/lib/email/templates'
import type { Course, CourseLink } from './registry'

function linkUrl(to: CourseLink['to'], email: string): string {
  if (to === 'agreement') return `${APP_ORIGIN}/agreement`
  if (to === 'scripts') return `${APP_ORIGIN}/scripts`
  // The signed link checks at the tap, so a parent who has since made an
  // account lands in their own app rather than on the pitch.
  return starterCtaUrl(email)
}

export function courseEmailFor(email: string, course: Course, day: number): EmailContent | null {
  const d = course.days[day - 1]
  if (!d) return null
  return courseDayEmail({
    courseTitle: course.title,
    day,
    days: course.days.length,
    subject: d.subject,
    preview: d.preview,
    paragraphs: d.paragraphs,
    tonight: d.tonight,
    link: d.link ? { label: d.link.label, url: linkUrl(d.link.to, email) } : null,
    unsubscribe: leadUnsubscribeUrl(email),
  })
}
