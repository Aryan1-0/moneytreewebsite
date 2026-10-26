/**
 * Content of the "Green World Story" book (home page).
 *
 * The book is a stack of SHEETS. Each sheet has a front (a right-hand page
 * while the sheet is unturned) and a back (the left-hand page once it has
 * been turned). With the book open at spread `n`, you see
 * SHEETS[n - 1].back on the left and SHEETS[n].front on the right.
 *
 * ▸ To change the words or pictures, edit the faces below — the pages are
 *   drawn from this data, nothing else needs to change.
 * ▸ Images must be same-origin (put them in /public), so they can be painted
 *   onto the page textures.
 */

export type Face =
  | { kind: 'cover'; title: string; subtitle: string; tagline: string; logo: string }
  | { kind: 'back-cover'; title: string; body: string; logo: string }
  | { kind: 'text'; eyebrow: string; title: string; body: string[]; bullets?: string[] }
  | { kind: 'image'; img: string; caption: string; quote?: string }
  | { kind: 'step'; step: string; eyebrow: string; title: string; body: string; img: string }

export type Sheet = { front: Face; back: Face }

export const SHEETS: Sheet[] = [
  {
    front: {
      kind: 'cover',
      title: 'The Green World Story',
      subtitle: 'About Us · Why Us · How It Works',
      tagline: 'Plant. Play. Prosper.',
      logo: '/book/logo.webp',
    },
    back: {
      kind: 'text',
      eyebrow: 'Chapter 1 · About Us',
      title: 'Growing a greener world, together',
      body: [
        'Green World turns everyday play into real-world impact. Every tree you grow in the game is matched by a real tree planted by our partners on the ground.',
        'We are a team of gamers, growers and builders who believe climate action should feel rewarding — not like a chore.',
      ],
    },
  },
  {
    front: {
      kind: 'image',
      img: '/book/about.webp',
      caption: 'Every sapling in the game is a real tree on the ground.',
      quote: '12,450 trees planted across 18 countries',
    },
    back: {
      kind: 'text',
      eyebrow: 'Chapter 2 · Why Us',
      title: 'Impact you can see and verify',
      body: ['We built Green World so that doing good and growing value are the same action.'],
      bullets: [
        'Real trees, geo-tagged and tracked',
        'Transparent, on-chain rewards',
        'Gardens you can visit in person',
        'A global community of growers',
      ],
    },
  },
  {
    front: {
      kind: 'image',
      img: '/book/why.webp',
      caption: 'The GWT token powers a fair, sustainable economy.',
      quote: 'Play with purpose. Earn with impact.',
    },
    back: {
      kind: 'text',
      eyebrow: 'Chapter 3 · How It Works',
      title: 'Three simple steps',
      body: [
        'From your first seed to a thriving forest, getting started takes minutes.',
        'Turn the page to see how a single tap becomes a real tree.',
      ],
      bullets: ['Connect your wallet', 'Plant your garden', 'Grow & earn'],
    },
  },
  {
    front: {
      kind: 'step',
      step: '01',
      eyebrow: 'Step One',
      title: 'Connect your wallet',
      body: 'Link your wallet in one tap. No paperwork, no middlemen — you are ready in under a minute.',
      img: '/book/step1.webp',
    },
    back: {
      kind: 'step',
      step: '02',
      eyebrow: 'Step Two',
      title: 'Plant your garden',
      body: 'Choose a seed and a region. A real, verified tree is planted for every sapling you grow.',
      img: '/book/step2.webp',
    },
  },
  {
    front: {
      kind: 'step',
      step: '03',
      eyebrow: 'Step Three',
      title: 'Grow & earn',
      body: 'Care for your trees, watch your forest mature and earn rewards as your impact grows.',
      img: '/book/step3.webp',
    },
    back: {
      kind: 'back-cover',
      title: 'Ready to grow?',
      body: 'Join thousands of growers building a greener tomorrow.',
      logo: '/book/logo.webp',
    },
  },
]

/** Chapter shortcuts. `page` = how many sheets are turned to show it. */
export const CHAPTERS = [
  { label: 'Cover', page: 0 },
  { label: 'About Us', page: 1 },
  { label: 'Why Us', page: 2 },
  { label: 'How It Works', page: 3 },
] as const

/** Highest page state: every sheet turned (book closed, back cover up). */
export const LAST_PAGE = SHEETS.length
