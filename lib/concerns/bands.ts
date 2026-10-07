// THE FIVE BANDS, IN ONE PLACE.
//
// The check in asks for one of five words and each word posts the top of its
// band, 2, 4, 6, 8 or 10, so the stored column keeps its 1 to 10 shape and
// every reader of it carries on unchanged. Which band a stored number belongs
// to is therefore a question asked all over the product: the card deciding
// whether today is up on last time, the monthly review counting what moved,
// DiGi reading where a worry has got to.
//
// Until 7 October 2026 that arithmetic was written three times, in the card,
// in lib/email/month-progress.ts and in lib/digi/approaches.ts, plus a fourth
// inline in the save route. Three copies that happen to agree are three
// copies that can stop agreeing, and the failure would be the card calling a
// day "up" that the monthly email calls "held". One function, imported
// everywhere, so the card and the email can never disagree about a band.
//
// A legacy 1 to 10 score from before the five words reads just as happily as
// a new one, which is how last time's mark still lands on the right word for
// a family who has been checking in since before the instrument changed.

/** Which of the five bands a 1 to 10 score belongs to. 1 is really tough, 5 is going great. */
export function bandOf(score: number): number {
  return Math.ceil(Math.min(10, Math.max(1, score)) / 2)
}
