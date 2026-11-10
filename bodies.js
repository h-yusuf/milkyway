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

// Orbital elements from JPL "Approximate Positions of the Planets" (Table 1,
// valid 1800–2050), each as [value at J2000, change per century]:
// a (AU), e, I (deg), L mean longitude (deg), long. of perihelion (deg), long. of ascending node (deg).
// radiusEarth: equatorial radius relative to Earth.
export const PLANETS = [
    {
        id: 'mercury', name: 'Mercury', kind: 'Rocky planet', au: 0.39, years: 0.241, radiusEarth: 0.383, color: 0x9a948e,
        elements: [0.38709927, 0.00000037, 0.20563593, 0.00001906, 7.00497902, -0.00594749, 252.25032350, 149472.67411175, 77.45779628, 0.16047689, 48.33076593, -0.12534081],
        text: 'The smallest planet and the closest to the Sun. Days reach about 430 °C; nights drop to about −180 °C.',
        facts: [['Distance from the Sun', '0.39 AU (58 million km)'], ['Diameter', '4,879 km'], ['One year', '88 Earth days'], ['Moons', 'None']],
    },
    {
        id: 'venus', name: 'Venus', kind: 'Rocky planet', au: 0.72, years: 0.615, radiusEarth: 0.949, color: 0xe3c79a,
        elements: [0.72333566, 0.00000390, 0.00677672, -0.00004107, 3.39467605, -0.00078890, 181.97909950, 58517.81538729, 131.60246718, 0.00268329, 76.67984255, -0.27769418],
        text: 'A thick carbon dioxide atmosphere traps heat, making it the hottest planet at about 465 °C. It spins backwards compared to most planets.',
        facts: [['Distance from the Sun', '0.72 AU (108 million km)'], ['Diameter', '12,104 km'], ['One year', '225 Earth days'], ['Moons', 'None']],
    },
    {
        id: 'earth', name: 'Earth', kind: 'Rocky planet', au: 1.0, years: 1.0, radiusEarth: 1, color: 0x4a7ec2,
        elements: [1.00000261, 0.00000562, 0.01671123, -0.00004392, -0.00001531, -0.01294668, 100.46457166, 35999.37244981, 102.93768193, 0.32327364, 0.0, 0.0],
        text: 'The only world known to have life. Liquid water covers about 71% of its surface.',
        link: { label: 'Explore Earth in Google Earth', url: 'https://earth.google.com/web/' },
        facts: [['Distance from the Sun', '1 AU (150 million km)'], ['Diameter', '12,742 km'], ['One year', '365.25 days'], ['Moons', '1']],
    },
    {
        id: 'mars', name: 'Mars', kind: 'Rocky planet', au: 1.52, years: 1.88, radiusEarth: 0.532, color: 0xc1663f,
        elements: [1.52371034, 0.00001847, 0.09339410, 0.00007882, 1.84969142, -0.00813131, -4.55343205, 19140.30268499, -23.94362959, 0.44441088, 49.55953891, -0.29257343],
        text: 'A cold desert world. It has Olympus Mons, the largest volcano in the Solar System.',
        facts: [['Distance from the Sun', '1.52 AU (228 million km)'], ['Diameter', '6,779 km'], ['One year', '687 Earth days'], ['Moons', '2']],
    },
    {
        id: 'jupiter', name: 'Jupiter', kind: 'Gas giant', au: 5.2, years: 11.86, radiusEarth: 10.97, color: 0xd8b08a,
        elements: [5.20288700, -0.00011607, 0.04838624, -0.00013253, 1.30439695, -0.00183714, 34.39644051, 3034.74612775, 14.72847983, 0.21252668, 100.47390909, 0.20469106],
        text: 'More than twice the mass of all the other planets combined. The Great Red Spot is a storm wider than Earth.',
        facts: [['Distance from the Sun', '5.2 AU (778 million km)'], ['Diameter', '139,820 km'], ['One year', '11.9 Earth years'], ['Moons', 'More than 90']],
    },
    {
        id: 'saturn', name: 'Saturn', kind: 'Gas giant', au: 9.54, years: 29.46, radiusEarth: 9.14, color: 0xe4cf9a, ring: true,
        elements: [9.53667594, -0.00125060, 0.05386179, -0.00050991, 2.48599187, 0.00193609, 49.95424423, 1222.49362201, 92.59887831, -0.41897216, 113.66242448, -0.28867794],
        text: 'Its rings are mostly chunks of water ice. It is the least dense planet; on average it is lighter than water.',
        facts: [['Distance from the Sun', '9.5 AU (1.43 billion km)'], ['Diameter', '116,460 km'], ['One year', '29.5 Earth years'], ['Moons', 'More than 270']],
    },
    {
        id: 'uranus', name: 'Uranus', kind: 'Ice giant', au: 19.2, years: 84.0, radiusEarth: 3.98, color: 0x9fd8de,
        elements: [19.18916464, -0.00196176, 0.04725744, -0.00004397, 0.77263783, -0.00242939, 313.23810451, 428.48202785, 170.95427630, 0.40805281, 74.01692503, 0.04240589],
        text: 'It rolls around the Sun on its side, with its axis tilted about 98°.',
        facts: [['Distance from the Sun', '19.2 AU (2.87 billion km)'], ['Diameter', '50,724 km'], ['One year', '84 Earth years'], ['Moons', 'More than 25']],
    },
    {
        id: 'neptune', name: 'Neptune', kind: 'Ice giant', au: 30.07, years: 164.8, radiusEarth: 3.86, color: 0x4a6ed8,
        elements: [30.06992276, 0.00026291, 0.00859048, 0.00005105, 1.77004347, 0.00035372, -55.12002969, 218.45945325, 44.96476227, -0.32241464, 131.78422574, -0.00508664],
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

// Major moons. aKm: mean orbital distance from the planet's center; periodDays:
// sidereal orbit; radiusKm: mean radius; inclination: degrees to the planet's
// equator (the Moon's is to the ecliptic). Negative period means retrograde.
export const PLANET_RADIUS_KM = { earth: 6371, mars: 3390, jupiter: 69911, saturn: 58232, uranus: 25362, neptune: 24622 };

export const MOONS = [
    { id: 'moon', parent: 'earth', name: 'The Moon', aKm: 384400, periodDays: 27.32, radiusKm: 1737, inclination: 5.1, color: 0xb9b5ae,
        text: 'Earth\'s only natural satellite. It always shows the same face to Earth, and its gravity drives the ocean tides.' },
    { id: 'phobos', parent: 'mars', name: 'Phobos', aKm: 9376, periodDays: 0.319, radiusKm: 11.3, color: 0x8a7a6a,
        text: 'The larger and closer of Mars\'s two small moons. It circles Mars about three times a day and is slowly spiralling inward.' },
    { id: 'deimos', parent: 'mars', name: 'Deimos', aKm: 23463, periodDays: 1.263, radiusKm: 6.2, color: 0x9c8c78,
        text: 'The smaller, outer moon of Mars, only about 12 km across.' },
    { id: 'io', parent: 'jupiter', name: 'Io', aKm: 421700, periodDays: 1.769, radiusKm: 1822, color: 0xe2c96a,
        text: 'The most volcanically active world in the Solar System.' },
    { id: 'europa', parent: 'jupiter', name: 'Europa', aKm: 671034, periodDays: 3.551, radiusKm: 1561, color: 0xd9cdb4,
        text: 'An ice shell over a global ocean of liquid water.' },
    { id: 'ganymede', parent: 'jupiter', name: 'Ganymede', aKm: 1070412, periodDays: 7.155, radiusKm: 2634, color: 0x9f978a,
        text: 'The largest moon in the Solar System, bigger than Mercury, with a magnetic field of its own.' },
    { id: 'callisto', parent: 'jupiter', name: 'Callisto', aKm: 1882709, periodDays: 16.689, radiusKm: 2410, color: 0x6f6658,
        text: 'One of the most heavily cratered surfaces in the Solar System.' },
    { id: 'enceladus', parent: 'saturn', name: 'Enceladus', aKm: 237948, periodDays: 1.370, radiusKm: 252, color: 0xf2f2f0,
        text: 'Jets of water vapour and ice spray from cracks near its south pole.' },
    { id: 'tethys', parent: 'saturn', name: 'Tethys', aKm: 294619, periodDays: 1.888, radiusKm: 531, color: 0xdedcd6,
        text: 'An icy moon of Saturn marked by a huge crater and a long canyon.' },
    { id: 'dione', parent: 'saturn', name: 'Dione', aKm: 377396, periodDays: 2.737, radiusKm: 561, color: 0xcfccc4,
        text: 'An icy moon of Saturn streaked with bright cliffs.' },
    { id: 'rhea', parent: 'saturn', name: 'Rhea', aKm: 527108, periodDays: 4.518, radiusKm: 764, color: 0xc8c4bb,
        text: 'Saturn\'s second-largest moon, an airless ball of ice and rock.' },
    { id: 'titan', parent: 'saturn', name: 'Titan', aKm: 1221870, periodDays: 15.945, radiusKm: 2575, color: 0xd9a24c,
        text: 'The only moon with a thick atmosphere, and with lakes of liquid methane and ethane.' },
    { id: 'iapetus', parent: 'saturn', name: 'Iapetus', aKm: 3560820, periodDays: 79.32, radiusKm: 735, inclination: 15.5, color: 0x8d8676,
        text: 'One side is dark as coal, the other bright as snow.' },
    { id: 'miranda', parent: 'uranus', name: 'Miranda', aKm: 129390, periodDays: 1.413, radiusKm: 236, color: 0xbfbcb6,
        text: 'A patchwork of ridges and cliffs, including one of the tallest known in the Solar System.' },
    { id: 'ariel', parent: 'uranus', name: 'Ariel', aKm: 190900, periodDays: 2.520, radiusKm: 579, color: 0xcfcbc4,
        text: 'The brightest of Uranus\'s large moons.' },
    { id: 'umbriel', parent: 'uranus', name: 'Umbriel', aKm: 266000, periodDays: 4.144, radiusKm: 585, color: 0x7d7a74,
        text: 'The darkest of Uranus\'s large moons.' },
    { id: 'titania', parent: 'uranus', name: 'Titania', aKm: 435910, periodDays: 8.706, radiusKm: 789, color: 0xb3ada3,
        text: 'The largest moon of Uranus.' },
    { id: 'oberon', parent: 'uranus', name: 'Oberon', aKm: 583520, periodDays: 13.463, radiusKm: 761, color: 0xa39c92,
        text: 'The outermost of Uranus\'s large moons, scarred by old craters.' },
    { id: 'triton', parent: 'neptune', name: 'Triton', aKm: 354759, periodDays: -5.877, radiusKm: 1353, inclination: 157, color: 0xd8cfc4,
        text: 'It orbits Neptune backwards, so it was probably captured from the Kuiper Belt.' },
];
