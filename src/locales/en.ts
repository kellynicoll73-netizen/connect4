export const en = {
  landing: {
    productLabel: 'Apt · Neighbourhood Fit Tool · Vancouver',
    headline1: 'Find the neighbourhood',
    headline2: 'that fits who you are.',
    body: "Tell us who you are. We'll help you find somewhere that feels like it was waiting for you.",
    subBody: 'Under 10 minutes. No account needed to start.',
    supportingCopy:
      "Finding a neighbourhood isn't just about price per square foot. It's about whether the place fits how you actually live. That's what we're trying to figure out together.",
    cta: 'Start →',
    privacyNote:
      'Your answers are used only to find your match. Nothing is saved unless you save it.',
  },

  quiz: {
    shared: {
      continue: 'Continue →',
      seeMyMatch: 'See my match →',
      back: '← Back',
      backAriaLabel: 'Go back',
      escapeHatch: 'None of these feel right',
      escapeHatchLabel: 'Tell us more',
      escapeHatchPlaceholder: 'Describe what fits better for you...',
      whyWeAsk: 'Why we ask',
      whyWeAskOpen: '− Why we ask',
      whyWeAskClosed: '+ Why we ask',
      phase1Label: 'Practicalities',
      phase2Label: 'Your Lifestyle',
      phase3Label: 'Place Memory',
      phase4Label: 'Your Match',
    },
    q1: {
      question: "What's bringing you to Vancouver?",
      options: {
        work: 'For work',
        school: 'For school',
        family: 'To be closer to family or a partner',
        'chose-vancouver': 'I chose Vancouver — not the other way around',
        'figuring-it-out': 'Still figuring it out',
      },
      whyWeAsk:
        "Your reason for moving shapes what a neighbourhood needs to offer — proximity to a campus is a different priority to proximity to a tech district or a family home.",
    },
    q2: {
      question: 'When do you need to be settled?',
      options: {
        'under-4-weeks': 'Under 4 weeks — this is urgent',
        '1-2-months': '1–2 months — tight but manageable',
        '3-months-plus': '3 months or more — I have time',
        flexible: 'Flexible — researching now, moving later',
      },
      whyWeAsk:
        "Timeline affects how much you can afford to be selective. If you're urgent, we weight neighbourhoods where vacancy rates are higher and move-in is more immediate.",
    },
    q3: {
      question: 'Who are you moving with?',
      subQuestion: 'Select all that apply',
      options: {
        'just-me': 'Just me',
        'me-and-pet': 'Me and a pet',
        'me-and-partner': 'Me and a partner',
        'me-and-children': 'Me and children',
      },
      whyWeAsk:
        "A neighbourhood that works for someone moving solo is a very different place to one that works for a family. Safety, quiet, access to schools and parks all shift significantly depending on who's with you.",
    },
    q3b: {
      question: 'How many bedrooms do you need?',
      options: {
        '1': '1 bedroom',
        '2': '2 bedrooms',
        '3': '3 or more bedrooms',
      },
    },
    q4: {
      question: "What's your monthly rent budget?",
      options: {
        'under-1800': "Under $1,800 — I need to be strategic",
        '1800-2500': '$1,800–$2,500 — realistic for a one-bedroom',
        '2500-3500': '$2,500–$3,500 — I have some flexibility',
        'over-3500': 'Over $3,500 — cost is secondary to fit',
        'not-sure': 'Not sure yet',
      },
      whyWeAsk:
        "Vancouver has significant rent variation by neighbourhood. Budget helps us filter out places where the median rent would stretch you past your comfort zone, so we only show you matches that are actually viable.",
    },
    q5: {
      question: 'How will you get around Vancouver?',
      subQuestion: 'Select all that apply',
      options: {
        transit: 'Public transit — SkyTrain or bus',
        walking: 'Walking — I want to walk everywhere',
        cycling: 'Cycling',
        car: "I'll have a car",
      },
      whyWeAsk:
        "Transport mode fundamentally changes which neighbourhoods work for you. If you're on transit, SkyTrain proximity is critical. If you're walking, walkability scores dominate. Car users have more flexibility.",
      phase2Card: "Now we want to understand how you actually live. Your daily patterns tell us more about neighbourhood fit than any checklist.",
    },
    q6: {
      question: 'Picture a free day.',
      subCopy: 'This tells us more about neighbourhood fit than your commute time.',
      options: {
        'cafe-walking': 'Coffee in a neighbourhood café, walking distance',
        'outdoors-active': 'Out early — trail run, bike ride, or kayak',
        'farmers-market': 'Farmers market, then cooking something good',
        'sleeping-in': 'Sleeping in — whatever happens, happens',
        'cultural-browse': 'Gallery, record shop, bookstore — the kind of day that takes a detour',
      },
      whyWeAsk:
        "How you spend a free day is a proxy for the texture of neighbourhood life you're looking for. An outdoors morning points to very different places than a cultural browse.",
    },
    q7: {
      question: 'What kind of neighbourhood energy do you want to come home to?',
      options: {
        'alive-buzzy': 'Alive and buzzy — I want to step outside and feel it',
        'quiet-grounded': 'Quiet and grounded — I need to come home to somewhere calm',
        'scene-community': 'A scene I can become part of — regular spots, faces I\'ll recognise',
        'space-air': "Space and air — I've been in a city too long",
        'edges-emerging': 'Somewhere with edges — still becoming something',
      },
      whyWeAsk:
        "This is one of the highest-signal questions in the flow. The energy of a neighbourhood is the thing that's hardest to change and easiest to get wrong. We weight your answer heavily.",
    },
    q8: {
      question: 'How important is access to nature and the outdoors?',
      options: {
        essential: 'Essential — trails, mountains, or water need to be close',
        important: 'Important, but not the defining factor',
        'nice-to-have': 'Nice to have',
        'not-a-factor': 'Not a factor for me',
      },
      whyWeAsk:
        "Vancouver is surrounded by mountains and ocean, but access isn't equal across the city. If outdoors access is essential for you, we prioritise neighbourhoods where it's genuinely walkable — not a 40-minute bus ride.",
    },
    q9: {
      question:
        'Does cultural community, food, language, or religious institutions matter to where you live?',
      options: {
        yes: 'Yes — this is important to me',
        somewhat: 'Somewhat — nice to have',
        'not-a-priority': 'Not a priority',
      },
      conditionalLabel: 'Which communities or institutions matter most?',
      conditionalPlaceholder: 'e.g. Sikh gurdwara, Filipino community, Mandarin-speaking neighbours...',
    },
    q10: {
      question: 'What matters most to you when it comes to feeling comfortable where you live?',
      options: {
        'personal-safety': 'Personal safety — feel at ease walking at any hour',
        family: 'Family considerations — schools, parks, safe for children',
        'community-feel': 'Community feel — neighbours who look out for each other',
        'quiet-decompress': 'Quiet and low-key — I need to decompress at home',
        'diversity-inclusion': 'Diversity and inclusion — I want to feel welcome as I am',
        grit: "Character over polish — I'm drawn to real, lived-in neighbourhoods",
      },
      whyWeAsk:
        "Comfort means different things to different people. For some it's personal safety, for others it's knowing your neighbours, for others it's feeling seen. Your answer adjusts how we weight safety, quietness, and cultural diversity.",
    },
    q11: {
      phase3Card:
        "Now we want to understand where you're coming from — literally. Tell us about the neighbourhood you're in now.",
      question: 'Where are you living right now?',
      subCopy:
        "We'll ask you to describe it in your own words next. This is just the location.",
      cityLabel: 'City',
      cityPlaceholder: 'e.g. Dublin, Toronto, Mumbai...',
      neighbourhoodLabel: 'Neighbourhood',
      neighbourhoodOptional: '(if you know it)',
      neighbourhoodPlaceholder: 'e.g. The Liberties, Kensington, Bandra West...',
    },
    q12: {
      headlineWithNeighbourhood: 'How would you describe {neighbourhood} to a friend who\'s never been?',
      headlineWithCity: 'How would you describe {city} to a friend who\'s never been?',
      subCopy: "Don't hold back — the detail is what helps us.",
      placeholder:
        "e.g. It's loud and a bit chaotic but in a good way. Old buildings, cheap food, artists moving in. Feels like it's mid-transformation...",
    },
    q13: {
      phase4Card:
        "Now tell us about a place you've loved — anywhere in the world. This tells us what home feels like to you.",
      phase3Card:
        "Last question. Tell us about a neighbourhood anywhere in the world that just felt right — this is the most interesting thing you can tell us.",
      question: 'Is there a neighbourhood anywhere in the world that just felt right — like it was made for you?',
      cityLabel: 'City',
      cityOptional: '(optional)',
      cityPlaceholder: 'e.g. Barcelona, New York, Cape Town...',
      neighbourhoodLabel: 'Neighbourhood',
      neighbourhoodOptional: '(optional)',
      neighbourhoodPlaceholder: 'e.g. Eixample, West Village, De Waterkant...',
      skipNote: "If you skip this, no problem — it helps but isn't required.",
    },
    q14: {
      question: "What makes it your favourite? What does it have that other places don't?",
      descriptionLabel: 'What makes it feel right?',
      placeholder:
        "e.g. The energy. Everyone's out on the street. Takes itself seriously without being precious. Good food everywhere.",
    },
  },

  loading: {
    headline: 'Finding your match...',
    subCopy: 'This usually takes about 20 seconds.',
    chips: {
      step1: 'Reading your neighbourhood descriptions',
      step2: 'Matching against personality profiles',
      step3: 'Checking budget against real rental data',
      step4: 'Building your results',
    },
  },

  result: {
    matchLabel: 'Your match',
    matchPillsLabel: 'Where it matches',
    gapPillsLabel: "Where it doesn't quite fit",
    alsoConsider: 'Also worth exploring',
    worthKnowing:
      'This is a match, not a certainty. No algorithm replaces walking the streets on a Tuesday morning. Shortlist two or three and visit each before you commit.',
    saveButton: 'Save my results',
    startAgain: 'Start again',
    rentalEntry: "See what's available in {neighbourhood} right now →",
    comingNext: 'Coming next',
    howItCompares: 'How it compares to what you know',
    whatItsLike: 'What this neighbourhood is actually like',
    communityVoice: 'From someone who lives here',
    worthKnowingLabel: 'Worth knowing',
    dataSources: {
      walkscore: 'Walkscore',
      cmhc: 'CMHC vacancy',
      community: 'Community data',
    },
  },

  listing: {
    backLink: '← Back to your match',
    titleBar: '{neighbourhood} · {bedrooms} bed · {price}/month',
    postedAt: 'Posted {time}',
    replyCta: 'Reply to this post / Express interest',
    photoAlt: '{alt} — photo {number}',
  },

  scamShield: {
    header: 'Wait — this listing has 3 red flags.',
    body1:
      'Listings priced below market, described as renovated, and available immediately are the most common pattern used in phantom rental scams targeting newcomers in Vancouver.',
    body2:
      "The typical next step: the \"landlord\" asks for a deposit by e-transfer before you've seen the property. Once sent, it's gone.",
    body3:
      'We flagged this listing deliberately. On Craigslist and Kijiji, real listings and fake ones look identical. Without a way to check, the difference is impossible to spot.',
    flags: {
      belowMedian: 'Price 10% below the neighbourhood median',
      immediateAvailability: '"Available immediately — or sooner for the right person"',
      utilitiesIncluded: 'Utilities included (uncommon at this price point in this area)',
    },
    pitch1:
      'Scam Shield is our listing verification tool. Paste a URL — we\'ll flag phantom listings, suspicious landlord patterns, and illegal deposit requests before you commit.',
    pitch2: "We're building it now. Leave your email for early access.",
    emailPlaceholder: 'your@email.com',
    emailCta: 'Get early access',
    confirmation: "You're on the list.",
    dismiss: 'No thanks, go back',
  },

  save: {
    headline: 'Save your results',
    body: "Your quiz answers, neighbourhood match, and any selections will be saved. We'll send you a link to return.",
    emailPlaceholder: 'your@email.com',
    cta: 'Save my results',
    confirmation: "Done — your results are saved. We'll be in touch.",
    privacyNote: "We won't share your email.",
    ariaLabel: 'Save your results',
    closeAriaLabel: 'Close',
  },

  meta: {
    title: 'Apt — Find your Vancouver neighbourhood',
    description: 'Find the Vancouver neighbourhood that fits who you are.',
  },

  modals: {
    scamShieldAriaLabel: 'Scam Shield warning',
  },
} as const

// ─── t() helper ──────────────────────────────────────────────────────────────


export function t(key: string, params?: Record<string, string>): string {
  const parts = key.split('.')
  let value: unknown = en

  for (const part of parts) {
    if (typeof value === 'object' && value !== null && part in value) {
      value = (value as Record<string, unknown>)[part]
    } else {
      return key
    }
  }

  if (typeof value !== 'string') return key
  if (!params) return value

  return value.replace(/\{(\w+)\}/g, (_, p: string) => params[p] ?? `{${p}}`)
}
