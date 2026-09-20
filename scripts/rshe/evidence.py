# Evidence phrases per requirement: short, distinctive strings that must appear
# in the named modules' live slide text. Every one of these was read out of a
# production slide during the audit, so a phrase going missing means the lesson
# changed, not that the phrase was wishful.
#
# Matching is case insensitive substring against the module's whole slide text.
# Keep phrases short enough to survive a copy edit and specific enough that a
# different lesson could not satisfy them by accident.

E = {
 "RSHE-P-OSA-1": ["same kind words", "screen words are still real words", "cannot see who is talking to you"],
 "RSHE-P-OSA-2": ["real, pretend", "never met", "anybody can say they are anybody"],
 "RSHE-P-OSA-3": ["thirteen is a real rule", "the protections are wired to the number", "who can reach you"],
 "RSHE-P-OSA-4": ["location leaks", "privacy is not hiding everything", "privacy switch and a location switch"],
 "RSHE-P-OSA-5": ["the internet remembers", "journey of one shared photo"],
 "RSHE-P-OSA-6": ["is this real", "never in trouble for telling"],
 "RSHE-P-WO-1": ["brilliant things in it and rubbish things in it"],
 "RSHE-P-WO-2": ["thinner than being with them"],
 "RSHE-P-WO-3":  ["screen time", "bedtime"],
 "RSHE-P-WO-4":  ["how it feels to send", "kind words"],
 "RSHE-P-WO-5":  ["games carry numbers too", "gambling sites", "find the number, ask what it is for"],
 "RSHE-P-WO-6":  ["loot box", "gambling machines work"],
 "RSHE-P-WO-7":  ["does not make it real", "detective"],
 "RSHE-P-WO-8":  ["pile on", "bullying"],
 "RSHE-P-WO-9": ["algorithm", "search boxes follow a recipe", "first does not mean truest"],
 "RSHE-P-WO-10": ["credit", "permission", "belong to you in exactly the way your drawing does"],
 "RSHE-P-WO-11": ["tell a grown up", "report button and a block button"],
 "RSHE-S-OSA-1": ["the same rules apply", "never what is decent"],
 "RSHE-S-OSA-2": ["privacy setting", "private account", "private space is one where you could name everyone"],
 "RSHE-S-OSA-3": ["idealis", "accounts can be too", "go further online than they would in a room"],
 "RSHE-S-OSA-4": ["under 18", "the law"],
 "RSHE-S-OSA-5": ["any image of a person under 18", "treated exactly like a photograph", "intimate image of an adult without their consent"],
 "RSHE-S-OSA-6": ["Report Remove", "Internet Watch Foundation"],
 "RSHE-S-OSA-7": ["deepfake"],
 "RSHE-S-OSA-8": ["misogyn", "violent video", "report harmful content", "more ordinary than it is"],
 "RSHE-S-OSA-9": ["three brakes", "why it gets bigger online", "name it, save it, say it"],
 "RSHE-S-OSA-10": ["harassment", "coercive control", "stalking is being followed", "four things with real names"],
 "RSHE-S-OSA-11": ["pornography", "carrying that expectation into a real relationship"],
 "RSHE-S-OSA-12": ["profiling", "the profile is what is actually for sale"],
 "RSHE-S-OSA-13": ["advertis", "buy the right to reach the kind of person"],
 "RSHE-S-OSA-14": ["fraud is a criminal offence", "sextortion"],
 "RSHE-S-OSA-15": ["chatbot"],
 "RSHE-S-WO-1":  ["mood audit", "raw hours"],
 "RSHE-S-WO-2": ["comparing", "connecting", "survive the app closing"],
 "RSHE-S-WO-3":  ["name it, save it, say it", "report and block", "childline on 0800 1111", "what helps afterwards"],
 "RSHE-S-WO-4":  ["loot box", "house edge", "how fast is the loop", "borrowing"],
 "RSHE-S-WO-5": ["misinformation", "disinformation", "conspiracy theory", "unfalsifiable"],
 "RSHE-S-WO-6":  ["county lines", "supplying drugs is a serious criminal offence", "knives", "money out of proportion to the task"],
 "RSHE-S-WO-7":  ["self harm content", "you are not in trouble", "samaritans on 116 123", "stop it, report it, say it"],
 "RSHE-P-RKR-9": ["pile on", "one unkind moment"],
 "RSHE-P-BS-2":  ["secret"],
 "RSHE-P-BS-4": ["never met", "asks you to keep the chat secret"],
 "RSHE-P-BS-6":  ["feel it, name it", "tell someone who can help"],
 "RSHE-P-GW-7":  ["bullying"],
 "RSHE-P-GW-9":  ["trusted grown up", "will not go away by itself", "keep it secret", "whose actual job is this"],
 "RSHE-S-RR-6":  ["bystander", "the quiet majority is the whole audience", "bullying is repeated, aimed at one person"],
 "RSHE-S-RR-9":  ["misogyn", "runs on race, on religion, on disability", "a stereotype repeated often enough"],
 "RSHE-S-RR-11": ["pornography", "as though another person owes them something"],
 "RSHE-S-RR-12": ["incel", "attraction is a ranking"],
 "RSHE-S-BS-1":  ["freely given, specific, ongoing", "never only about images", "exactly the same in a room and on a phone"],
 "RSHE-S-BS-2":  ["naming the technique", "pressure is asking again after a no", "read your own messages"],
 "RSHE-S-BS-6": ["under 18", "upskirting", "sexual harassment"],
 "RSHE-S-BS-11": ["sextortion", "exploitation is somebody getting something out of you", "grooming is the part that comes first", "the law calls that exploitation"],
 "RSHE-S-BS-16": ["not my fault", "Report Remove", "the same door opens the other way round", "if it is your own behaviour worrying you", "a gp, or 111, or a and e"],
 "RSHE-S-PS-2":  ["everyone else"],
 "RSHE-S-PS-6": ["groom", "it moves fast, it moves private"],
 "RSHE-S-MW-8":  ["linked with anxiety and with depression", "what it does to a person", "0808 8020 133", "speed is what the law acts on"],
}

# Requirements this scheme deliberately does not own. Each names what a digital
# literacy spine does teach towards it, and where the rest belongs, so a PSHE
# lead can hand the row to whoever owns it.
#
# EMPTY SINCE 20 SEPTEMBER 2026. Six requirements sat here for one day:
# RSHE-S-BS-1, BS-2, BS-11, BS-16, RR-9 and P-GW-9. Justin's decision on
# 19 September was to teach all six through the online context rather than hand
# them to the school's wider RSE, and migration 316 did that without adding a
# slide. Each is now FULL in verdicts.py with evidence phrases read out of the
# appended text. The dict stays so the BY_DESIGN verdict keeps its meaning and
# its guard rule, and so the next honest "we do not own this" has somewhere
# to go.
BY_DESIGN = {}
