# Evidence phrases per requirement: short, distinctive strings that must appear
# in the named modules' live slide text. Every one of these was read out of a
# production slide during the audit, so a phrase going missing means the lesson
# changed, not that the phrase was wishful.
#
# Matching is case insensitive substring against the module's whole slide text.
# Keep phrases short enough to survive a copy edit and specific enough that a
# different lesson could not satisfy them by accident.

E = {
 "RSHE-P-OSA-1": ["same kind words", "screen words are still real words"],
 "RSHE-P-OSA-2": ["real, pretend", "never met"],
 "RSHE-P-OSA-3": [],
 "RSHE-P-OSA-4": ["location leaks", "privacy is not hiding everything"],
 "RSHE-P-OSA-5": ["the internet remembers", "journey of one shared photo"],
 "RSHE-P-OSA-6": ["is this real", "never in trouble for telling"],
 "RSHE-P-WO-1":  [],
 "RSHE-P-WO-2":  [],
 "RSHE-P-WO-3":  ["screen time", "bedtime"],
 "RSHE-P-WO-4":  ["how it feels to send", "kind words"],
 "RSHE-P-WO-5":  [],
 "RSHE-P-WO-6":  ["loot box", "gambling machines work"],
 "RSHE-P-WO-7":  ["does not make it real", "detective"],
 "RSHE-P-WO-8":  ["pile on", "bullying"],
 "RSHE-P-WO-9":  ["algorithm"],
 "RSHE-P-WO-10": ["credit", "permission"],
 "RSHE-P-WO-11": ["tell a grown up"],
 "RSHE-S-OSA-1": ["the same rules apply"],
 "RSHE-S-OSA-2": ["privacy setting", "private account"],
 "RSHE-S-OSA-3": ["idealis"],
 "RSHE-S-OSA-4": ["under 18", "the law"],
 "RSHE-S-OSA-5": ["any image of a person under 18"],
 "RSHE-S-OSA-6": ["Report Remove", "Internet Watch Foundation"],
 "RSHE-S-OSA-7": ["deepfake"],
 "RSHE-S-OSA-8": ["misogyn"],
 "RSHE-S-OSA-9": ["escalat"],
 "RSHE-S-OSA-10": [],
 "RSHE-S-OSA-11": ["pornography"],
 "RSHE-S-OSA-12": ["profiling"],
 "RSHE-S-OSA-13": ["advertis"],
 "RSHE-S-OSA-14": ["fraud is a criminal offence", "sextortion"],
 "RSHE-S-OSA-15": ["chatbot"],
 "RSHE-S-WO-1":  ["mood audit", "raw hours"],
 "RSHE-S-WO-2":  ["comparing", "connecting"],
 "RSHE-S-WO-3":  [],
 "RSHE-S-WO-4":  [],
 "RSHE-S-WO-5":  ["misinformation", "disinformation"],
 "RSHE-S-WO-6":  [],
 "RSHE-S-WO-7":  [],
 "RSHE-P-RKR-9": ["pile on", "one unkind moment"],
 "RSHE-P-BS-2":  ["secret"],
 "RSHE-P-BS-4":  ["never met"],
 "RSHE-P-BS-6":  ["feel it, name it", "tell someone who can help"],
 "RSHE-P-GW-7":  ["bullying"],
 "RSHE-P-GW-9":  ["trusted grown up"],
 "RSHE-S-RR-6":  [],
 "RSHE-S-RR-9":  ["misogyn"],
 "RSHE-S-RR-11": ["pornography"],
 "RSHE-S-RR-12": ["incel"],
 "RSHE-S-BS-1":  ["freely given, specific, ongoing"],
 "RSHE-S-BS-2":  ["naming the technique"],
 "RSHE-S-BS-6":  ["under 18"],
 "RSHE-S-BS-11": ["sextortion"],
 "RSHE-S-BS-16": ["not my fault", "Report Remove"],
 "RSHE-S-PS-2":  ["everyone else"],
 "RSHE-S-PS-6":  ["groom"],
 "RSHE-S-MW-8":  [],
}

# Requirements this scheme deliberately does not own. Each names what a digital
# literacy spine does teach towards it, and where the rest belongs, so a PSHE
# lead can hand the row to whoever owns it.
BY_DESIGN = {
 "RSHE-S-BS-1": ("Consent in early romantic and early sexual relationships belongs to your wider RSE. "
                 "This scheme teaches consent as freely given, specific, ongoing and revocable and applies it to images (ks4-16)."),
 "RSHE-S-BS-2": ("Resisting sexual pressure inside a relationship belongs to your wider RSE. "
                 "This scheme teaches identifying and naming pressure techniques, and the pressure scripts used in sextortion (ks4-15, ks4-17)."),
 "RSHE-S-RR-9": ("The full protected characteristics list, including gender reassignment, race, religion, sexual orientation and disability, "
                 "belongs to your wider PSHE and equality teaching. This scheme teaches recognising misogyny and the pipeline that carries it online (ks4-18)."),
 "RSHE-S-BS-11": ("The concepts and laws relating to exploitative harms belong to your wider RSE. "
                  "This scheme teaches the online shape of sexual and financial exploitation and how to end it (ks4-17, ks4-18)."),
 "RSHE-S-BS-16": ("Seeking support for a pupil's own worrying or abusive behaviour belongs to your pastoral and safeguarding provision, "
                  "not to a taught lesson. This scheme teaches where to report abuse experienced from others (ks4-16, ks4-17)."),
 "RSHE-P-GW-9": ("Who in school a child should speak to can only be named by your school. "
                 "This scheme teaches every child to name a trusted grown up at home and at school, and leaves the role for you to fill in (eyfs-01)."),
}
