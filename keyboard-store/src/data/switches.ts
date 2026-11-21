export interface KeyboardSwitch {
  id: string
  name: string
  category: 'Linear' | 'Tactile' | 'Clicky'
  force: string
  travel: string
  description: string
  source: string
}

export const switches: KeyboardSwitch[] = [
  {
    id: 'mx-red',
    name: 'Cherry MX Red',
    category: 'Linear',
    force: '45 cN',
    travel: '4.0 mm',
    description:
      'A light, uninterrupted stroke with a restrained bottom-out. An easy starting point for linear switches.',
    source: 'https://www.cherry.de/en-gb/product/mx2a-red',
  },
  {
    id: 'mx-black',
    name: 'Cherry MX Black',
    category: 'Linear',
    force: '60 cN',
    travel: '4.0 mm',
    description:
      'A firmer linear stroke. More spring resistance, without a tactile bump or dedicated click.',
    source:
      'https://www.cherry.de/en-us/company/news/cherry-blog/article/how-to-diy-keyboard-part-3-cherry-mx-original',
  },
  {
    id: 'gateron-yellow',
    name: 'Gateron Yellow',
    category: 'Linear',
    force: '50 gf',
    travel: '4.0 mm',
    description:
      'A medium-weight linear with a smooth stroke and rounded bottom-out character.',
    source: 'https://www.gateron.co/blogs/news/which-gateron-switch-should-i-choose',
  },
  {
    id: 'mx-brown',
    name: 'Cherry MX Brown',
    category: 'Tactile',
    force: '55 cN',
    travel: '4.0 mm',
    description:
      'A subtle tactile bump gives feedback without a click mechanism. A gentle introduction to tactile switches.',
    source:
      'https://www.cherry.de/en-us/company/news/cherry-blog/article/how-to-diy-keyboard-part-3-cherry-mx-original',
  },
  {
    id: 'boba-u4t',
    name: 'Boba U4T',
    category: 'Tactile',
    force: 'Not specified',
    travel: 'Variant dependent',
    description:
      'Known for a pronounced bump and full bottom-out. Common 62 g and 68 g spring ratings describe bottom-out, not actuation force.',
    source: 'https://www.gazzew.com/',
  },
  {
    id: 'mx-blue',
    name: 'Cherry MX Blue',
    category: 'Clicky',
    force: '60 cN',
    travel: '4.0 mm',
    description:
      'A distinct tactile event with an audible click. Crisp feedback for deliberate typing.',
    source:
      'https://www.cherry.de/en-us/company/news/cherry-blog/article/how-to-diy-keyboard-part-3-cherry-mx-original',
  },
  {
    id: 'box-jade',
    name: 'Kailh BOX Jade',
    category: 'Clicky',
    force: '50 gf',
    travel: '3.6 mm',
    description:
      'A thick click bar produces strong tactile feedback and a bold, sharp click on the stroke.',
    source: 'https://www.kailh.net/products/kailh-box-thick-clicky-switch-set',
  },
]

export const sampleUrl = (id: string) =>
  `${import.meta.env.BASE_URL}audio/switches/${id}.wav`
