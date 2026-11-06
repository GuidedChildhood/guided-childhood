#!/usr/bin/env python3
"""Share to your network notes for every unposted post.

Justin, 6 November 2026: "give me al share notes", after asking for one on the
Manchester post. A share note is the few sentences that sit above the post when
it is reshared to his own network a week or two later, which is a strong 2026
signal in its own right (reshare with commentary is treated close to original
content). It is NOT a summary: it leads on the number, then gives the reader a
second thing the post did not put in its own first two lines, so somebody who
clicks through has not already read the point. Different closing question from
the post's, so the reshare is not a duplicate of the original in the feed.

One dict, written into the pack files and onto the desk, so the two cannot drift.
"""
import re, json, sys, os

SHARES = {
 # 049's share note is written into the pack file by hand rather than here,
 # because it was added before this script existed. Its first line was corrected
 # on 6 November: it said the study "followed 25,629 teenagers for three years",
 # which the paper does not support. The methods say "a final sample of N = 25 629
 # observations", reached by a drop in approach that includes any participant with
 # at least one of the three annual data points. The loose version came from the
 # university's own press release, which is the thing the post criticises, so the
 # post had borrowed the fault it was pointing at.
 '053': {
  'file': '2026-11-05-judging-the-evidence',
  'text': """Court filings unsealed last month show Meta employees discussing a whisper strategy against Jonathan Haidt, and nobody has shown it was ever carried out.

What happened next is the part I wrote about. A researcher who has challenged Haidt's conclusions says a newspaper suggested she was paid by Meta to do it. Her name is not in those filings. The link was made by the reader.

I go through what the documents say, what they don't, and why a researcher with inconvenient findings is somebody you answer rather than somebody you discredit.

When did you last change your mind because of a study you didn't want to be true?""",
  'note': 'Her name is left out of the share note on purpose. The nuance that protects it lives in the post, and a reshare blurb is not the place to put an accusation at the top.',
 },
 '052': {
  'file': '2026-11-02-linkedin-week',
  'text': """Ofcom has four ways to check that a UK user is 16, and each one asks a family to hand over something different.

A passport or driving licence. A digital ID you do once and reuse. A bank check, which about 90 percent of sixteen and seventeen year olds could pass. Or a face scan, which has a margin of error right at the age that matters.

I take each one in turn and say what it costs, including the figure doing the rounds that isn't actually Ofcom's.

Which of the four would you be most reluctant to hand over?""",
 },
 '051': {
  'file': '2026-11-02-linkedin-week',
  'text': """Australia's online safety regulator asked 1,950 children about AI, and 78 percent had used an assistant while only 8 percent had used a companion.

Almost all the worry, and almost all the proposed rules, are aimed at the 8 percent. The tool nearly four children in five actually use is the ordinary assistant, the one parents think of as homework help.

I've written up what the survey found, what its wider numbers can and can't carry, and why these are Australian children rather than British ones.

Does the AI in your house look like homework help, or has it become something else?""",
 },
 '050': {
  'file': '2026-11-02-linkedin-week',
  'text': """Ofcom has named four ways to check that a UK user is 16, and says no method is "completely robust against circumvention by children".

The quieter line in the same document is the one I keep returning to. Ofcom will publish research on how children get round the checks within twelve months of the ban taking effect, which means the first year runs without it.

I go through all four methods, the numbers that decide who actually gets through, and which of those numbers are Ofcom's own.

If the first year runs with no evidence on circumvention, what fills that gap in your house?""",
 },
 '048': {
  'file': '2026-10-26-linkedin-week',
  'text': """Twelve percent of American teenagers have asked a chatbot for emotional support or advice. Fifty four percent have used one for schoolwork.

There are two readings of that twelve percent and I hold both on different days. One is a child who didn't have, or didn't trust, a person to tell at midnight. The other is a child practising the sentence before they say it out loud to somebody.

The survey can't settle which, and nobody has followed these children long enough to find out. What I think it comes down to is in the post.

Who would your child tell first, and would you know either way?""",
 },
 '047': {
  'file': '2026-10-26-linkedin-week',
  'text': """Parents in the UK say half of their children have already been given an AI toy or learning device, and 38 percent own two or more.

That's a parent survey, so it's what parents report. And the headline the British Standards Institution actually drew from it was not about danger. It was about how little guidance exists for the adults buying these things.

I've written up what the numbers do and don't say, and the four things a child should be able to tell you about a toy that talks back.

Is there one in your house already, and do you know what it remembers?""",
 },
 '046': {
  'file': '2026-10-23-readiness-test',
  'text': """I've built a product around the word readiness and I still can't tell you how to test it.

That's the uncomfortable centre of it, and picking a better age doesn't make it go away. One child in this country can face three different legal ages for three different things, and not one of the three describes the child in front of you.

I've written up the closest I've got, which is three things a parent can see for themselves, and I'm open about what we hold no evidence for.

If an age tells you when the door opens, what tells you who's ready to walk through it?""",
 },
 '045': {
  'file': '2026-10-21-fear-both-ways',
  'text': """A study everyone quoted said 85 percent of Australian teenagers got round the under sixteen ban. It doesn't say that.

The number almost nobody quoted is the regulator's own. In its follow up of 803 children, the share who actually held an account fell from 52.4 percent to 42.1 percent. That is the one measurable thing the ban has done so far, and it is missing from both arguments.

I've written up what the BMJ paper found, what the regulator found, and why fear is now the engine on both sides.

Which of those two numbers reached you first?""",
 },
 '044': {
  'file': '2026-10-18-the-ban-teaches',
  'text': """Australia's regulator went back three months after its ban began and asked 803 children. Of those who still had accounts, 37 percent had simply put themselves down as sixteen or over.

That's a child's first real lesson in digital life, and a law delivered it. Though we taught it first. A 2011 survey found a third of American parents had a child on Facebook before thirteen, and two thirds of those parents helped set the account up.

I've written up what the ban has taught so far, and the thing nobody is counting.

What has your child already learnt from watching an adult fill in an age box?""",
 },
 '043': {
  'file': '2026-10-16-sweden-screens',
  'text': """Sweden threw out its national digitisation plan in 2023 and funded printed textbooks in 2024. All of that is accurate, and five years ago I'd have shared it without checking.

What the viral version leaves out is who called it a crisis. Sweden's own education agency never did, and it named a different main problem from the one the government named. Only one of those is a villain you can fix with a book order.

I've written up what the policy actually did, and how thin the research underneath it is.

What makes you check a story you already agree with?""",
 },
 '039': {
  'file': '2026-10-14-gdc-037-to-039',
  'text': """Among parents whose children game, 64 percent said talking to strangers worried them. Only 43 percent set any rule about who their child can play with. Time limits ran at 56 percent.

I set a timer because it was the rule I could actually enforce. That's the honest reason and it took me a while to admit it.

This isn't an argument against online friends. Ofcom's own figures say 96 percent of children who game online play with friends or family at least sometimes. It's an argument that a clock can't tell a child who is trustworthy.

Two children, both an hour. What would tell you the difference?""",
 },
 '038': {
  'file': '2026-10-14-gdc-037-to-039',
  'text': """About four thousand teenagers in Bradford are being assigned either a daily social media limit with an overnight curfew, or their usual use, and then measured.

Nearly everything the rest of us quote, me included, shows an association. This is built to show what changes when use actually goes down. That's a different thing, and I've quietly wanted somebody to do it for a long time.

There are no results yet. Anybody telling you this proves limits work, or proves they don't, hasn't read it.

What would a result have to show before you changed something at home?""",
 },
 '037': {
  'file': '2026-10-14-gdc-037-to-039',
  'text': """The Social Reckoning is in UK cinemas, built on Frances Haugen's disclosures. The spine of it is real. The dialogue isn't.

What I can't do is round the problem up to match the film. Ofcom says personalised recommendations are a main route by which children meet harmful content, and its own evidence says recommender systems aren't inherently harmful, with the risk coming from repetition, combination and intensity. Both of those sit in the same document.

I've written up where the film is accurate, where it isn't, and why being precise about it is not the same as being soft.

I couldn't name the moment a feed turned in my own house. Could you?""",
 },
}

PACKS = '/home/user/guided-childhood/content/packs'
BLOCK = ('### Share to your network\n\nA few sentences to sit above the post when you reshare it.'
         ' Leads on the number, adds something the post keeps until later, and asks a different'
         ' question so the reshare is not a duplicate of the original.\n\n%s\n\n')


def write_packs():
    """Insert each share block immediately before that post's First comment."""
    touched = {}
    for n, s in sorted(SHARES.items(), reverse=True):
        path = os.path.join(PACKS, s['file'], 'linkedin.md')
        t = touched.get(path) or open(path, encoding='utf-8').read()
        head = re.search(r'^#+ +GDC-%s *[·-]' % n, t, re.M)
        assert head, 'no heading for ' + n
        cm = re.search(r'^#{2,4} +First comment\s*$', t[head.end():], re.M)
        assert cm, 'no first comment for ' + n
        at = head.end() + cm.start()
        assert 'Share to your network' not in t[head.end():at], n + ' already has one'
        block = BLOCK % s['text']
        if s.get('note'):
            block += '*%s*\n\n' % s['note']
        touched[path] = t[:at] + block + t[at:]
    for path, t in touched.items():
        open(path, 'w', encoding='utf-8').write(t)
    return len(touched)


DESK = '/tmp/claude-0/-home-user/8607980e-4828-5409-a1c4-d7fee401bbd9/scratchpad/desk/'


def write_desk():
    src = open(DESK + 'index.html', encoding='utf-8').read()
    m = re.search(r'const D = (\{.*?\});\n', src, re.S)
    d = json.loads(m.group(1))
    tail = 'A share to your network note was added on 6 November, %d words.'
    for p in d['posts']:
        if p['n'] in SHARES:
            p['share'] = SHARES[p['n']]['text']
            w = len(p['share'].split())
            if 'share to your network note' not in p['checked']:
                p['checked'] = p['checked'].rstrip() + ' ' + tail % w
    for p in d['posts']:
        assert p.get('share'), p['n'] + ' has no share note'
        for field in ('body', 'comment', 'share', 'checked'):
            assert not re.search(r'[‐-―−]', p[field]), p['n'] + ' ' + field
        assert p['share'].rstrip().endswith('?'), p['n'] + ' share does not end on a question'
        assert p['share'].count('?') == 1, p['n'] + ' share has more than one question'
        assert len(p['share'].split('\n\n')) == 4, p['n'] + ' share is not four paragraphs'
        assert 80 <= len(p['share'].split()) <= 130, p['n'] + ' share is %d words' % len(p['share'].split())
        assert 'http' not in p['share'], p['n']
    out = (open(DESK + 'head.html').read().replace('__DATA__', json.dumps(d, ensure_ascii=False))
           + open(DESK + 'tail.html').read())
    assert 'selectNodeContents' not in out
    assert 'data-copy="share"' in out
    open(DESK + 'index.html', 'w', encoding='utf-8').write(out)
    return d, len(out)


if __name__ == '__main__':
    if 'desk' in sys.argv:
        d, n = write_desk()
        print('DESK OK, %d bytes' % n)
        for p in d['posts']:
            print('  %s  share %3d words' % (p['n'], len(p['share'].split())))
    else:
        print('wrote %d pack files, %d share notes' % (write_packs(), len(SHARES)))
