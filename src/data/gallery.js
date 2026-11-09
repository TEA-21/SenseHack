const ph = (seed) => `https://picsum.photos/seed/${seed}/1600/1000`;

export const SLIDES = [
  { title: 'The opening',  sub: 'Day 1 · Inauguration',     alt: 'Opening ceremony',             src: ph('sensehack-opening') },
  { title: 'The hall',     sub: 'Anna Auditorium',          alt: 'Teams settling into the hall', src: ph('sensehack-hall') },
  { title: 'The build',    sub: 'Teams at work',            alt: 'Participants building',        src: ph('sensehack-build') },
  { title: 'The reviews',  sub: 'Staged design reviews',    alt: 'Mentors reviewing a project',  src: ph('sensehack-reviews') },
  { title: 'The demos',    sub: 'Working prototypes',       alt: 'A hardware demo',              src: ph('sensehack-demos') },
  { title: 'The winners',  sub: 'Day 2 · Valedictory',      alt: 'Winning teams on stage',       src: ph('sensehack-winners') }
];
