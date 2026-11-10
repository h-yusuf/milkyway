# milkyway

An interactive 3D model of the Milky Way, rendered in the browser with three.js. It shows the bar, bulge, four main spiral arms, dust lanes, star-forming regions, and the Sun's place in the Orion Spur.

Live: https://milkyway.dknia.my.id

## Features

- Star colours computed from black-body temperatures: old, cool stars in the bulge and bar, young hot stars on the arm crests.
- Dust lanes on the inner edge of each arm and small Hα (star-forming) regions along the arms.
- Views: overview, face-on, edge-on, and "Find the Sun", which flies to the Sun and follows it as the disk rotates.
- Labels pinned to the galactic center, the arms, and the Sun.
- A scale bar in light-years that updates as you zoom (1 scene unit = 625 light-years).
- Zoom in on the Sun (or click its label) to see the Solar System: the eight planets orbit with their real relative periods, and the orbital plane is tilted about 60° to the galactic disk. Sizes and distances are not to scale.
- Click a planet to fly in for a close-up that follows it along its orbit; planets have simple procedural surfaces (cloud bands, continents, polar caps). Earth links out to Google Earth.
- Click any label, planet, or the Sun for facts. Named nebulae near the Sun (Orion, Lagoon, Eagle, Crab, Carina) sit at their real galactic longitude and distance.
- Respects `prefers-reduced-motion` and lowers detail on phones and low-power devices.

## Run locally

It is a static site with no build step:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploy

Any static file server works. The homelab deployment serves the files with `nginx:alpine` behind a Cloudflare Tunnel. When `script.js`, `styles.css`, or `bodies.js` changes, bump the `?v=` query (in `index.html`, and in the `bodies.js` import inside `script.js`) so Cloudflare does not serve the cached copy.

## Credits

Based on [Milky Way 3D Simulator](https://github.com/sai-educ/Milky-Way-3D-Simulator) by sai-educ. See `CREDITS.md` for the original references.
