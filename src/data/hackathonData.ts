// Sense Hack '26 Central Data Store & Strict Interfaces
// Conducted by IEEE SB VIT & IEEE ComSoc SB VIT Student Chapters

export interface Track {
  id: string;
  number: string;
  title: string;
  iconName: string;
  tagline: string;
  description: string;
  challengeIdeas: string[];
  techStack: string[];
}

export interface ScheduleMilestone {
  time: string;
  title: string;
  description: string;
  type: 'milestone' | 'mentoring' | 'food' | 'activity' | 'ceremony';
}

export interface SchedulePhase {
  phaseNumber: number;
  phaseTitle: string;
  day: string;
  timeWindow: string;
  description: string;
  milestones: ScheduleMilestone[];
}

export interface PastStat {
  value: string;
  label: string;
  sublabel: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  title: string;
  caption: string;
  category: 'Venue' | 'Hacking' | 'Mentorship' | 'Valedictory';
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Teams & Eligibility' | 'Hardware & Labs' | 'Logistics & Accommodation';
}

export interface HackathonMetadata {
  name: string;
  edition: string;
  theme: string;
  conductedBy: string;
  chapters: string[];
  collaborators: string[];
  dates: string;
  startDateIso: string;
  endDateIso: string;
  durationHours: number;
  venue: string;
  venueFull: string;
  eligibility: string;
  teamSize: string;
  registrationLinks: {
    internalVit: string; // Google form for VIT students
    externalParticipants: string; // VIT Events portal
    hardwareRequisitionForm: string;
    accommodationForm: string;
  };
  socialLinks: {
    instagram: string;
    linkedin: string;
    github: string;
    discord: string;
    email: string;
  };
}

export const HACKATHON_CONFIG: HackathonMetadata = {
  name: "Sense Hack '26",
  edition: "2026",
  theme: "Advancing Technologies for the Betterment of Humanity",
  conductedBy: "Conducted by IEEE SB VIT and IEEE ComSoc SB VIT (Student Chapters)",
  chapters: ["IEEE SB VIT", "IEEE ComSoc SB VIT"],
  collaborators: [
    "Office of Students' Welfare (DSW), VIT Vellore",
    "School of Electronics Engineering (SENSE), VIT Vellore",
    "Student Activity Council, IEEE Madras Section"
  ],
  dates: "December 9 - 10, 2026",
  startDateIso: "2026-12-09T08:00:00+05:30",
  endDateIso: "2026-12-10T20:00:00+05:30",
  durationHours: 36,
  venue: "Anna Auditorium, VIT Vellore",
  venueFull: "Anna Auditorium & School of Electronics Engineering (SENSE) Labs, Vellore Institute of Technology, Vellore, Tamil Nadu - 632014",
  eligibility: "Open to all undergraduate & postgraduate students across Indian universities",
  teamSize: "2 - 4 Members / Team",
  registrationLinks: {
    internalVit: "https://docs.google.com/forms/d/e/1FAIpQLSc_EXAMPLE_INTERNAL_FORM/viewform",
    externalParticipants: "https://events.vit.ac.in",
    hardwareRequisitionForm: "https://docs.google.com/forms/d/e/1FAIpQLSe_EXAMPLE_HARDWARE_FORM/viewform",
    accommodationForm: "https://docs.google.com/forms/d/e/1FAIpQLSf_EXAMPLE_ACCOMMODATION_FORM/viewform"
  },
  socialLinks: {
    instagram: "https://instagram.com/ieeevitvellore",
    linkedin: "https://linkedin.com/company/ieee-vit-vellore",
    github: "https://github.com/ieee-vitu",
    discord: "https://discord.gg/ieeevit",
    email: "comsoc@ieeevit.org"
  }
};

export const TRACKS: Track[] = [
  {
    id: "healthcare",
    number: "01",
    title: "Smart Healthcare & Well-being",
    iconName: "Activity",
    tagline: "Point-of-care bio-instrumentation, remote vitals & assistive robotics.",
    description: "Develop life-critical diagnostics, non-invasive patient telemetry, optical biosensors, or intelligent assistive medical devices.",
    challengeIdeas: [
      "Low-cost portable ECG / PPG vitals monitor with arrhythmia edge-detection",
      "Myoelectric prosthetic limb interface using surface EMG signal processing",
      "Smart neonatal temperature regulation & distress beacon"
    ],
    techStack: ["Bio-Sensors (ADS1299)", "PPG / ECG front-ends", "ARM Cortex-M4/M7", "BLE 5.3", "Embedded C"]
  },
  {
    id: "smart-cities",
    number: "02",
    title: "Smart Cities & Infrastructure",
    iconName: "Cpu",
    tagline: "Sensory mesh networks, traffic intelligence & structural telemetry.",
    description: "Build distributed telemetry nodes, smart grid automation systems, or civil monitoring architectures to improve urban resilience.",
    challengeIdeas: [
      "Low-power LoRaWAN sensor networks for water pipeline leak detection",
      "Adaptive traffic signal control powered by edge computer vision",
      "Structural health vibration telemetry for bridges and public transit"
    ],
    techStack: ["ESP32 / STM32", "LoRaWAN", "FreeRTOS", "MQTT / CoAP", "Edge AI"]
  },
  {
    id: "education",
    number: "03",
    title: "Digital Education & Skill Development",
    iconName: "Binary",
    tagline: "Accessible hardware kits, interactive tactile learning & STEM lab tools.",
    description: "Innovate physical computing tools, assistive learning devices for specially-abled students, or remote lab instruments.",
    challengeIdeas: [
      "Refreshable tactile Braille display and audio reader for STEM diagrams",
      "Low-cost portable USB oscilloscope & logic analyzer for rural colleges",
      "Interactive haptic learning kit for mechanical kinematics"
    ],
    techStack: ["MicroPython", "Haptic Actuators", "RP2040", "OLED displays", "Open Hardware"]
  },
  {
    id: "fintech",
    number: "04",
    title: "Fintech & Digital Inclusion",
    iconName: "Shield",
    tagline: "Cryptographic POS terminals, secure offline authentication & fraud prevention.",
    description: "Architect hardware-enforced transaction devices, biometric authentication terminals, or low-connectivity financial transaction hardware.",
    challengeIdeas: [
      "Offline micro-payment terminal utilizing sound-wave or acoustic telemetry",
      "Tamper-evident biometric payment validator for rural banking correspondents",
      "Hardware security module (HSM) for local cryptographic key storage"
    ],
    techStack: ["Secure Elements (ATECC608)", "NFC / RFID", "Secure Boot", "Embedded Cryptography"]
  },
  {
    id: "environment",
    number: "05",
    title: "Sustainable Environment & Green Tech",
    iconName: "Zap",
    tagline: "Battery management, kinetic energy harvesting & environmental monitoring.",
    description: "Engineer renewable microgrid controllers, air/water purity analyzers, smart battery management systems (BMS), or regenerative energy systems.",
    challengeIdeas: [
      "Modular Smart BMS with active cell balancing and thermal runaway prediction",
      "Piezoelectric and solar micro-power harvesting for standalone weather nodes",
      "Real-time hyper-local air particulate analyzer with LoRaWAN telemetry"
    ],
    techStack: ["Power Electronics", "TI C2000", "Gas Sensors (NDIR / Electrochemical)", "Solar MPPT"]
  },
  {
    id: "cybersecurity",
    number: "06",
    title: "Cybersecurity & Digital Trust",
    iconName: "Radio",
    tagline: "Hardware trojan detection, RF side-channel defense & secure communication.",
    description: "Protect critical and embedded physical infrastructure against side-channel analysis, frequency spoofing, hardware injection, or unauthorized physical tampering.",
    challengeIdeas: [
      "Side-channel power consumption anomaly detector for IoT gateways",
      "Software Defined Radio (SDR) RF signal spoofing and jamming detector",
      "Physical unclonable function (PUF) authenticator for device identity"
    ],
    techStack: ["RTL-SDR / HackRF", "FPGA", "Hardware PUFs", "GNU Radio", "Secure Microcontrollers"]
  },
  {
    id: "open-innovation",
    number: "07",
    title: "Open Innovation",
    iconName: "Sparkles",
    tagline: "Breakthrough multidisciplinary hardware and exploratory systems.",
    description: "Bring novel ideas that span across defense, space-tech, robotics, consumer electronics, or biomimetic mechanisms.",
    challengeIdeas: [
      "Autonomous sub-surface soil moisture mapping agricultural rover",
      "Atmospheric water generator with closed-loop Peltier optimization",
      "Pneumatically actuated haptic feedback glove for VR teleoperation"
    ],
    techStack: ["Multidisciplinary", "Custom PCB", "Sensors & Actuators", "ROS 2", "3D Printing"]
  }
];

export const SCHEDULE_PHASES: SchedulePhase[] = [
  {
    phaseNumber: 1,
    phaseTitle: "Check-in, Opening & Hacking Commences",
    day: "Day 1 (Wednesday, Dec 9, 2026)",
    timeWindow: "08:00 AM – 08:00 PM",
    description: "Venue preparation, check-in for internal and external teams, opening ceremony, track overview, and review round 1.",
    milestones: [
      { time: "08:00 AM", title: "Participant Check-In & Kit Distribution", description: "Smooth registration check-in at Anna Auditorium, table allocation and hardware kits ready.", type: "food" },
      { time: "09:00 AM", title: "Opening Ceremony", description: "Event overview and 7 tracks explanation by IEEE SB VIT and IEEE ComSoc SB VIT student coordinators.", type: "ceremony" },
      { time: "09:30 AM", title: "Hacking Officially Kicks Off!", description: "36-hour sprint begins. Teams brainstorm and start initial prototyping.", type: "milestone" },
      { time: "11:00 AM", title: "Morning Refreshment Break", description: "Coffee, tea, and quick snacks.", type: "food" },
      { time: "01:00 PM", title: "Networking Lunch", description: "Lunch break for participants and mentors.", type: "food" },
      { time: "04:00 PM", title: "Snack Break & Review Preparation", description: "Evening snacks and prep for the first elimination round.", type: "food" },
      { time: "05:30 PM", title: "Review Round 1 (Elimination Round)", description: "On-site industry alumni and SENSE faculty mentors evaluate initial proofs-of-concept.", type: "mentoring" },
      { time: "07:30 PM", title: "Shortlisted Teams Announced & Vote of Thanks", description: "Phase 1 results announced, shortlisted teams advance to overnight sprint.", type: "milestone" }
    ]
  },
  {
    phaseNumber: 2,
    phaseTitle: "Overnight Sprint & Global Online Mentorship",
    day: "Day 1 Night (Wednesday Night to Thursday Morning)",
    timeWindow: "08:00 PM – 08:00 AM",
    description: "Shortlisted teams build through the night with online reviews from distinguished alumni and industry experts from the USA.",
    milestones: [
      { time: "08:30 PM", title: "Overnight Hacking & Mentorship Desk", description: "Development continues at Anna Auditorium venue.", type: "milestone" },
      { time: "10:30 PM", title: "Global Online Mentor Round (Google Meet)", description: "Interactive progress checks with silicon & hardware experts from Google (USA), Micron, Global Foundries, and Broadcom.", type: "mentoring" },
      { time: "01:00 AM", title: "Midnight Snacks & Hot Beverages", description: "Midnight refreshment to fuel overnight builds.", type: "food" },
      { time: "04:30 AM", title: "Firmware Freeze & Hardware Calibration", description: "Finalizing PCB connections, sensor calibrations, and bug fixes.", type: "milestone" },
      { time: "07:00 AM", title: "Morning Refreshment & Breakfast", description: "Recharge for Phase 3 evaluation rounds.", type: "food" }
    ]
  },
  {
    phaseNumber: 3,
    phaseTitle: "Elimination Round 2, Talks & Final Prep",
    day: "Day 2 (Thursday, Dec 10, 2026)",
    timeWindow: "08:00 AM – 06:00 PM",
    description: "Dignitary visits, second elimination round, Top 10 finalist selection, motivational talks, and final pitch preparation.",
    milestones: [
      { time: "08:00 AM", title: "Day 2 Kickoff & Table Check-in", description: "Teams settle into tables with overnight progress.", type: "milestone" },
      { time: "10:00 AM", title: "University Leadership Venue Visit", description: "University leadership and Student Welfare directors interact with innovating teams.", type: "ceremony" },
      { time: "11:30 AM", title: "Elimination Round 2 (Top 10 Finalists Selection)", description: "Rigorous evaluation by SENSE faculty and industry mentors to select the final 10 teams.", type: "mentoring" },
      { time: "01:00 PM", title: "Lunch Break & Finalist Announcement", description: "Lunch served; top 10 finalist teams announced.", type: "food" },
      { time: "02:00 PM", title: "Motivational Talks & Final Pitch Prep", description: "Insightful talks by DRDO and industry alumni; teams prepare final presentation decks.", type: "activity" },
      { time: "04:30 PM", title: "Final Evaluation Round & Live Q&A", description: "Each finalist team presents their working solution followed by a rigorous judge Q&A session.", type: "milestone" }
    ]
  },
  {
    phaseNumber: 4,
    phaseTitle: "Valedictory Ceremony & Awards Distribution",
    day: "Day 2 (Thursday, Dec 10, 2026)",
    timeWindow: "06:00 PM – 08:00 PM",
    description: "Grand valedictory ceremony graced by Pro-Vice Chancellor, Director of Students' Welfare, and Dean SENSE.",
    milestones: [
      { time: "06:00 PM", title: "Valedictory Ceremony Commences", description: "Welcome address, event overview, and comprehensive statistics presented by faculty coordinators.", type: "ceremony" },
      { time: "07:00 PM", title: "Winner Announcements & Honors Distribution", description: "Sense Hack honors, track awards, and the Best Freshers' Team Award announced.", type: "ceremony" },
      { time: "07:45 PM", title: "Official Vote of Thanks & Group Photographs", description: "Honoring mentors, faculty, student organizers, and concluding the 36-hour sprint.", type: "milestone" }
    ]
  }
];

export const PAST_STATS: PastStat[] = [
  { value: "36", label: "Hours of Non-Stop Hacking", sublabel: "National Level Marathon" },
  { value: "21+", label: "Participating Institutions", sublabel: "Across India + Mauritius" },
  { value: "7", label: "Core Innovation Tracks", sublabel: "Advancing Tech for Humanity" },
  { value: "4", label: "Intensive Review Phases", sublabel: "National & Global Mentorship" },
  { value: "100%", label: "Hands-on Hardware Demos", sublabel: "Physical Prototype Verification" }
];

export const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: "g1",
    src: "/gallery/image4.jpeg",
    title: "Anna Auditorium in Full Swing",
    caption: "Teams from 21+ institutions across India hacking concurrently across 36 hours.",
    category: "Hacking"
  },
  {
    id: "g2",
    src: "/gallery/image3.jpeg",
    title: "Anna Auditorium Main Stage",
    caption: "The iconic split-theme SENSE HACK backdrop and official stage setup at VIT Vellore.",
    category: "Venue"
  },
  {
    id: "g3",
    src: "/gallery/image6.jpeg",
    title: "On-Floor Mentor Evaluation",
    caption: "SENSE faculty and distinguished alumni examining live breadboards and sensor circuits.",
    category: "Mentorship"
  },
  {
    id: "g4",
    src: "/gallery/image7.jpeg",
    title: "Live Hardware Demonstration",
    caption: "Student teams presenting real-time prototype telemetry to evaluating dignitaries.",
    category: "Mentorship"
  },
  {
    id: "g5",
    src: "/gallery/image5.png",
    title: "Overnight Global Mentorship",
    caption: "Overnight interactive review session with silicon experts and Google USA leaders.",
    category: "Mentorship"
  },
  {
    id: "g6",
    src: "/gallery/image8.png",
    title: "Valedictory Ceremony & Leadership",
    caption: "Pro-Vice Chancellor, Director DSW, Dean SENSE, and the student organizing committee.",
    category: "Valedictory"
  },
  {
    id: "g7",
    src: "/gallery/image9.png",
    title: "Certificate & Honors Distribution",
    caption: "Celebrating student engineering excellence at the grand closing ceremony.",
    category: "Valedictory"
  }
];

export const FAQS: FaqItem[] = [
  {
    id: "g1",
    category: "General",
    question: "What is Sense Hack '26?",
    answer: "Sense Hack '26 is a 36-hour national-level hackathon conducted by two student chapters in VIT: IEEE SB VIT (IEEE Student Branch VIT) and IEEE ComSoc SB VIT (IEEE Communications Society Student Branch), in collaboration with the Office of Students' Welfare (DSW), the School of Electronics Engineering (SENSE), and the IEEE Madras Section Student Activity Council (SAC)."
  },
  {
    id: "g2",
    category: "General",
    question: "When and where is Sense Hack '26 scheduled?",
    answer: "Sense Hack '26 takes place on December 9 - 10, 2026 at the prestigious Anna Auditorium, VIT Vellore campus."
  },
  {
    id: "t1",
    category: "Teams & Eligibility",
    question: "Who can participate in Sense Hack '26?",
    answer: "Participation is open to undergraduate and postgraduate students from institutions across the country, as well as VIT Vellore internal students. Inter-disciplinary teams are strongly encouraged."
  },
  {
    id: "t2",
    category: "Teams & Eligibility",
    question: "What is the team size requirement?",
    answer: "Teams must consist of 2 to 4 members. Both internal VIT teams and external college teams follow this regulation."
  },
  {
    id: "t3",
    category: "Teams & Eligibility",
    question: "How do internal VIT students register versus external college students?",
    answer: "Internal VIT students register via our official Google Form using their VTOP registration details. External participants from other colleges must register through the official VIT Events portal to receive sanctioned campus visitor passes and accommodation."
  },
  {
    id: "h1",
    category: "Hardware & Labs",
    question: "What hardware support will be provided during the hackathon?",
    answer: "Participants will have access to the SENSE hardware labs, test benches, oscilloscopes, soldering stations, and standard power supplies. Teams can also request specific microcontrollers, sensors, and actuators via our on-site Hardware Requisition desk."
  },
  {
    id: "h2",
    category: "Hardware & Labs",
    question: "Can we bring our own hardware components and developer boards?",
    answer: "Yes, teams are strongly encouraged to bring their own developer kits (ESP32, Arduino, Raspberry Pi, STM32, FPGAs), sensors, custom PCBs, and laptops. All equipment must be declared at the check-in desk upon arrival."
  },
  {
    id: "l1",
    category: "Logistics & Accommodation",
    question: "Is accommodation provided for external participants from outside Vellore?",
    answer: "Yes! On-campus hostel accommodation is arranged for external teams traveling to VIT Vellore. External teams must submit their arrival/departure details and gender distribution using our Accommodation Form so rooms can be allotted."
  },
  {
    id: "l2",
    category: "Logistics & Accommodation",
    question: "Are food and refreshments provided during the 36 hours?",
    answer: "Yes. Breakfast, lunch, evening high tea, dinner buffets, and midnight refreshments are arranged throughout the entire 36-hour sprint inside Anna Auditorium."
  }
];

export function buildGoogleFormUrl(baseUrl: string, params: Record<string, string>): string {
  if (!baseUrl.includes("docs.google.com/forms")) {
    return baseUrl;
  }
  try {
    const url = new URL(baseUrl);
    url.searchParams.set("usp", "pp_url");
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
    });
    return url.toString();
  } catch {
    return baseUrl;
  }
}
