type Item = { kind: string; title: string; detail: string | null; due_date: string | null }

// Words that say nothing about WHICH piece of work it is.
const FILLER = new Set(['the', 'and', 'for', 'your', 'with', 'from', 'into', 'this', 'that', 'bring', 'hand', 'make', 'build', 'create', 'complete', 'finish', 'due', 'school', 'class', 'child', 'their', 'project', 'homework'])
function keyWords(title: string): Set<string> {
  return new Set(title.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter(w => w.length > 2 && !FILLER.has(w)))
}

/**
 * One letter, one item per piece of work.
 *
 * Justin, 19 November 2026: the Anderson shelter letter came back as "Build an
 * Anderson shelter model" and "Hand in Anderson shelter project", both due
 * 1 December, so the bell rang twice for one job. Two items of the same kind on
 * the same date whose titles share two or more meaningful words are the same
 * work: keep the longer title, and fold the other's detail in when it adds
 * something. The prompt asks for this too; this is the belt to its braces.
 */
export function mergeNearDuplicates<T extends Item>(items: T[]): T[] {
  const out: T[] = []
  for (const it of items) {
    const words = keyWords(it.title)
    const twin = out.find(o => o.kind === it.kind && o.due_date === it.due_date
      && [...keyWords(o.title)].filter(w => words.has(w)).length >= 2)
    if (!twin) { out.push({ ...it }); continue }
    if (it.title.length > twin.title.length) twin.title = it.title
    if (it.detail && it.detail !== twin.detail) {
      twin.detail = twin.detail ? `${twin.detail} ${it.detail}`.slice(0, 300) : it.detail
    }
  }
  return out
}

