// Facts shown in the info panel. Figures are rounded; moon counts change as
// new moons are confirmed, so the outer planets use "more than".

export const SUN = {
    id: 'sun',
    name: 'The Sun',
    kind: 'Our star',
    text: 'An ordinary yellow dwarf, one of a few hundred billion stars in the Milky Way. It carries the planets around the galaxy at about 230 km/s.',
    facts: [
        ['Type', 'G2V main-sequence star'],
        ['Age', 'About 4.6 billion years'],
        ['Diameter', '1.39 million km'],
        ['From the galactic center', 'About 26,000 light-years'],
        ['One lap of the galaxy', 'About 230 million years'],
    ],
};

export const PLANETS = [
    {
        id: 'mercury', name: 'Mercury', kind: 'Rocky planet', au: 0.39, years: 0.241, size: 0.022, color: 0x9a948e,
        text: 'The smallest planet and the closest to the Sun. Days reach about 430 °C; nights drop to about −180 °C.',
        facts: [['Distance from the Sun', '0.39 AU (58 million km)'], ['Diameter', '4,879 km'], ['One year', '88 Earth days'], ['Moons', 'None']],
    },
    {
        id: 'venus', name: 'Venus', kind: 'Rocky planet', au: 0.72, years: 0.615, size: 0.034, color: 0xe3c79a,
        text: 'A thick carbon dioxide atmosphere traps heat, making it the hottest planet at about 465 °C. It spins backwards compared to most planets.',
        facts: [['Distance from the Sun', '0.72 AU (108 million km)'], ['Diameter', '12,104 km'], ['One year', '225 Earth days'], ['Moons', 'None']],
    },
    {
        id: 'earth', name: 'Earth', kind: 'Rocky planet', au: 1.0, years: 1.0, size: 0.036, color: 0x4a7ec2,
        text: 'The only world known to have life. Liquid water covers about 71% of its surface.',
        facts: [['Distance from the Sun', '1 AU (150 million km)'], ['Diameter', '12,742 km'], ['One year', '365.25 days'], ['Moons', '1']],
    },
    {
        id: 'mars', name: 'Mars', kind: 'Rocky planet', au: 1.52, years: 1.88, size: 0.027, color: 0xc1663f,
        text: 'A cold desert world. It has Olympus Mons, the largest volcano in the Solar System.',
        facts: [['Distance from the Sun', '1.52 AU (228 million km)'], ['Diameter', '6,779 km'], ['One year', '687 Earth days'], ['Moons', '2']],
    },
    {
        id: 'jupiter', name: 'Jupiter', kind: 'Gas giant', au: 5.2, years: 11.86, size: 0.075, color: 0xd8b08a,
        text: 'More than twice the mass of all the other planets combined. The Great Red Spot is a storm wider than Earth.',
        facts: [['Distance from the Sun', '5.2 AU (778 million km)'], ['Diameter', '139,820 km'], ['One year', '11.9 Earth years'], ['Moons', 'More than 90']],
    },
    {
        id: 'saturn', name: 'Saturn', kind: 'Gas giant', au: 9.54, years: 29.46, size: 0.064, color: 0xe4cf9a, ring: true,
        text: 'Its rings are mostly chunks of water ice. It is the least dense planet; on average it is lighter than water.',
        facts: [['Distance from the Sun', '9.5 AU (1.43 billion km)'], ['Diameter', '116,460 km'], ['One year', '29.5 Earth years'], ['Moons', 'More than 270']],
    },
    {
        id: 'uranus', name: 'Uranus', kind: 'Ice giant', au: 19.2, years: 84.0, size: 0.046, color: 0x9fd8de,
        text: 'It rolls around the Sun on its side, with its axis tilted about 98°.',
        facts: [['Distance from the Sun', '19.2 AU (2.87 billion km)'], ['Diameter', '50,724 km'], ['One year', '84 Earth years'], ['Moons', 'More than 25']],
    },
    {
        id: 'neptune', name: 'Neptune', kind: 'Ice giant', au: 30.07, years: 164.8, size: 0.045, color: 0x4a6ed8,
        text: 'The windiest planet, with winds faster than 2,000 km/h. It was found by mathematics before anyone saw it.',
        facts: [['Distance from the Sun', '30.1 AU (4.5 billion km)'], ['Diameter', '49,244 km'], ['One year', '165 Earth years'], ['Moons', '16']],
    },
];

// Real nebulae near the Sun, placed by galactic longitude (degrees) and distance.
export const NEBULAE = [
    {
        id: 'orion', name: 'Orion Nebula', kind: 'Emission nebula (M42)', l: 209, ly: 1344,
        text: 'The closest large stellar nursery to Earth. You can see it with the naked eye as the fuzzy middle "star" in Orion\'s sword.',
        facts: [['Distance', 'About 1,344 light-years'], ['Constellation', 'Orion'], ['Width', 'About 24 light-years']],
    },
    {
        id: 'lagoon', name: 'Lagoon Nebula', kind: 'Emission nebula (M8)', l: 6, ly: 4100,
        text: 'A giant cloud of glowing hydrogen where new stars are forming, toward the center of the galaxy.',
        facts: [['Distance', 'About 4,100 light-years'], ['Constellation', 'Sagittarius'], ['Width', 'About 110 light-years']],
    },
    {
        id: 'eagle', name: 'Eagle Nebula', kind: 'Emission nebula (M16)', l: 17, ly: 5700,
        text: 'Home of the Pillars of Creation, towers of gas and dust where stars are being born.',
        facts: [['Distance', 'About 5,700 light-years'], ['Constellation', 'Serpens'], ['Known for', 'Pillars of Creation']],
    },
    {
        id: 'crab', name: 'Crab Nebula', kind: 'Supernova remnant (M1)', l: 184.6, ly: 6500,
        text: 'The expanding debris of a star whose explosion was recorded by astronomers in 1054. A spinning neutron star sits at its center.',
        facts: [['Distance', 'About 6,500 light-years'], ['Constellation', 'Taurus'], ['Exploded', 'Seen in 1054']],
    },
    {
        id: 'carina', name: 'Carina Nebula', kind: 'Emission nebula', l: 287.6, ly: 8500,
        text: 'One of the largest and brightest nebulae in the sky, home to Eta Carinae, one of the most massive stars known.',
        facts: [['Distance', 'About 8,500 light-years'], ['Constellation', 'Carina'], ['Known for', 'Eta Carinae']],
    },
];

export const GALAXY_INFO = {
    core: {
        name: 'Galactic center', kind: 'Sagittarius A*',
        text: 'A supermassive black hole about 4 million times the mass of the Sun, hidden behind thick dust when seen from Earth.',
        facts: [['Distance from the Sun', 'About 26,000 light-years'], ['Mass', 'About 4 million Suns']],
    },
    'Perseus Arm': {
        name: 'Perseus Arm', kind: 'Major spiral arm',
        text: 'One of the two major arms, running just outside the Sun\'s position.',
        facts: [['Nearest point', 'About 6,400 light-years from the Sun']],
    },
    'Scutum–Centaurus Arm': {
        name: 'Scutum–Centaurus Arm', kind: 'Major spiral arm',
        text: 'The other major arm. It starts at the end of the central bar and holds many of the galaxy\'s youngest stars.',
        facts: [['Starts', 'At the end of the central bar']],
    },
    'Sagittarius Arm': {
        name: 'Sagittarius Arm', kind: 'Minor spiral arm',
        text: 'A minor arm between the Sun and the galactic center, rich in nebulae such as the Lagoon and the Eagle.',
        facts: [['Nearest point', 'About 5,000 light-years from the Sun']],
    },
    'Norma Arm': {
        name: 'Norma Arm', kind: 'Minor spiral arm',
        text: 'A minor arm that winds out from near the center and may continue far out as the Outer Arm.',
        facts: [['Position', 'Inner galaxy, toward Norma']],
    },
};
