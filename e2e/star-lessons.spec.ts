import { test, expect, Page } from '@playwright/test'

// THE STAR LESSON GATE (split plan step 4, run before and after step 6).
//
// The one flow the repo split must never break: a parent sends a school
// curriculum lesson to their child, the child opens it on their no login
// kid link, plays the deck, answers the quiz, and the finish screen tells
// them their grown up got the good news. This walks that flow end to end
// against a real deployment, so run it BEFORE the schools schema move and
// again AFTER, and the two runs must both pass.
//
// It needs a real environment and a seeded child:
//   BASE_URL   the app deployment to test (preview or production)
//   KID_TOKEN  a kid_links token for a child who has at least one star
//              lesson mission in status sent (send one from
//              /dashboard/quests first)
//
//   BASE_URL=https://... KID_TOKEN=abc... npx playwright test e2e/star-lessons.spec.ts
//
// No mission in flight is a FAILURE, not a skip: the gate exists to prove
// the flow, and a green run that proved nothing is how the flow breaks
// unnoticed.

const BASE = process.env.BASE_URL
const TOKEN = process.env.KID_TOKEN

test('a child plays a star lesson to the finish and the stars land', async ({ page }) => {
  test.skip(!BASE || !TOKEN, 'Set BASE_URL and KID_TOKEN to run the star lesson gate')
  test.setTimeout(180_000)

  // 1. The kid link opens with no login and shows the star lesson.
  await page.goto(`${BASE}/k/${TOKEN}`, { waitUntil: 'networkidle' })
  const lessonsTab = page.getByText(/lessons/i).first()
  if (await lessonsTab.isVisible().catch(() => false)) await lessonsTab.click()
  const missionCard = page.locator(`a[href*="/k/${TOKEN}/lesson/"]`).first()
  await expect(missionCard, 'No star lesson mission on the kid page. Send one from /dashboard/quests, then rerun.').toBeVisible({ timeout: 15_000 })
  await missionCard.click()

  // 2. The deck plays through. Choice slides need an answer before the
  //    continue button enables; everything else just advances.
  await page.waitForLoadState('networkidle')
  await walkDeck(page)

  // 3. The finish screen: the mission is complete and the parent knows.
  await expect(page.getByText(/good news/i)).toBeVisible({ timeout: 15_000 })
  await expect(page.getByText(/stars/i).first()).toBeVisible()
})

async function walkDeck(page: Page) {
  for (let i = 0; i < 80; i++) {
    const finish = page.getByRole('button', { name: 'Finish lesson' })
    const cont = page.getByRole('button', { name: 'Continue' })
    const pick = page.getByRole('button', { name: 'Pick an answer to continue' })

    if (await pick.isVisible().catch(() => false)) {
      // A choice slide: tap the first answer option, which is a button that
      // is not one of the player chrome buttons.
      const options = page.locator('button').filter({
        hasNotText: /Pick an answer|Continue|Finish lesson|Back/,
      })
      await options.first().click()
      await page.waitForTimeout(400)
      continue
    }
    if (await finish.isVisible().catch(() => false)) {
      await finish.click()
      return
    }
    if (await cont.isVisible().catch(() => false)) {
      await cont.click()
      await page.waitForTimeout(350)
      continue
    }
    // An interactive slide or an animation beat with its own pacing: give
    // it a moment and look again.
    await page.waitForTimeout(700)
  }
  throw new Error('The deck never reached the finish button in 80 steps')
}
