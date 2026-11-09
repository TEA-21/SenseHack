// All copy for the new sections lives here so it is easy to edit.
// Track blurbs and gallery captions are PLACEHOLDERS: replace with the real text.

export const TRACKS = [
  { n: '01', name: 'Smart Healthcare', tag: 'Care that reaches everyone', body: 'Sensors, wearables and assistive tech that make diagnosis faster and care more accessible.', chips: ['Wearables', 'Diagnostics', 'Assistive tech'], color: '#141110', stripe: '#ff5a1f' },
  { n: '02', name: 'Smart Cities', tag: 'Infrastructure that thinks', body: 'Connected systems for traffic, water, waste and energy that make crowded places run smoother.', chips: ['IoT', 'Mobility', 'Urban data'], color: '#ff5a1f', stripe: '#141110' },
  { n: '03', name: 'Digital Education', tag: 'Learning without walls', body: 'Tools that make learning personal, hands-on and open to students wherever they study.', chips: ['EdTech', 'Accessibility', 'Learning labs'], color: '#e9e1d6', stripe: '#ff5a1f' },
  { n: '04', name: 'Fintech', tag: 'Money, made legible', body: 'Secure, inclusive financial products: payments, credit, savings and trust at scale.', chips: ['Payments', 'Inclusion', 'Risk'], color: '#2a2522', stripe: '#ffa24a' },
  { n: '05', name: 'Green Tech', tag: 'Hardware for the planet', body: 'Energy, emissions and resource ideas that cut waste and measure what actually matters.', chips: ['Energy', 'Sensing', 'Circular'], color: '#ff7a33', stripe: '#141110' },
  { n: '06', name: 'Cybersecurity', tag: 'Defence by design', body: 'Protect people, devices and networks, from embedded firmware to cloud and AI systems.', chips: ['Embedded', 'Network', 'Privacy'], color: '#6f6862', stripe: '#ff5a1f' },
  { n: '07', name: 'Open Innovation', tag: 'Your problem, your rules', body: 'Bring a problem that fits nowhere else. If it needs building in 36 hours, it belongs here.', chips: ['Any domain', 'Hardware + software', 'Wildcard'], color: '#1a1715', stripe: '#ffa24a' }
];

export const STATS = [
  { n: 60, plus: true, label: 'Teams' },
  { n: 350, plus: true, label: 'Participants' },
  { n: 30, plus: true, label: 'Industry judges' },
  { n: 20, plus: true, label: 'Colleges' },
  { n: 36, plus: false, label: 'Hours' }
];

export const ARCHIVE = {
  kicker: 'Archive · last Sense Hack',
  title: 'Last time,',
  em: 'on the bench.'
};

// Drop real photos into /public/gallery and point `src` at them.
export const GALLERY = [
  { src: '/gallery/g1.jpg', title: 'The Opening', cap: 'Doors open · day 1', alt: 'Placeholder photo for the opening ceremony' },
  { src: '/gallery/g2.jpg', title: 'The Hall', cap: 'Anna Auditorium', alt: 'Placeholder photo of the hall' },
  { src: '/gallery/g3.jpg', title: 'The Build', cap: 'Thirty-six hours, no sleep', alt: 'Placeholder photo of teams building' },
  { src: '/gallery/g4.jpg', title: 'The Reviews', cap: 'Mentors at every bench', alt: 'Placeholder photo of review rounds' },
  { src: '/gallery/g5.jpg', title: 'The Demos', cap: 'Hardware on the table', alt: 'Placeholder photo of demos' },
  { src: '/gallery/g6.jpg', title: 'The Winners', cap: 'Final pitch · Anna Auditorium', alt: 'Placeholder photo of the winners' }
];
