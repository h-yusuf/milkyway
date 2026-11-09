import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// =============================================================================
// SCALE
// 1 scene unit = 625 light-years, so the 80-unit disk radius is ~50,000 ly.
// =============================================================================
const LY_PER_UNIT = 625;
const SUN_RADIUS = 26000 / LY_PER_UNIT;

// =============================================================================
// MILKY WAY CONFIGURATION
// Star colours come from black-body temperatures: old, cool stars in the
// bulge and bar, young hot stars along the arm crests.
// =============================================================================
const config = {
    core: { outerRadius: 4.5, count: 20000, tempMin: 4300, tempMax: 5600 },
    bar: { length: 26, width: 4, height: 1.0, angle: Math.PI * 0.16, count: 32000, tempMin: 3700, tempMax: 5000 },
    bulge: { radius: 14, count: 26000, tempMin: 3600, tempMax: 5200 },

    arms: {
        pitchAngle: 16 * Math.PI / 180,
        innerRadius: 11,
        outerRadius: 80,
        definitions: [
            { name: 'Perseus Arm', offset: 0, strength: 1.0, width: 3.6 },
            { name: 'Scutum–Centaurus Arm', offset: Math.PI, strength: 1.0, width: 3.6 },
            { name: 'Sagittarius Arm', offset: Math.PI * 0.55, strength: 0.6, width: 2.8 },
            { name: 'Norma Arm', offset: Math.PI * 1.55, strength: 0.6, width: 2.8 },
        ],
        starCount: 110000,
    },

    // Orion Spur: a short minor arm between Sagittarius and Perseus, home of the Sun.
    spur: { offset: Math.PI * 0.27, rMin: 33, rMax: 50, width: 1.6, count: 7000 },

    glow: { count: 42000 },
    nebulae: { count: 1700, clusterSize: 1.0 },
    dust: { count: 30000, width: 0.4, offsetAngle: -0.11 },
    disk: { count: 36000, radius: 86, height: 1.4 },
    halo: { count: 5000, radius: 95 },
    background: { starCount: 9000, radius: 900 },

    physics: { rotationSpeed: 0.00003, rotationDirection: -1, expansionDuration: 3.2 },
};

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
const isLikelyMobile = isTouchDevice || /Android|webOS|iPhone|iPad|iPod|Mobi/i.test(navigator.userAgent);
const isLowPowerDevice = Boolean(
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
    (navigator.deviceMemory && navigator.deviceMemory <= 4)
);

const performanceProfile = isLikelyMobile || isLowPowerDevice
    ? { particleScale: 0.45, maxPixelRatio: 1.25, initialRenderScale: 0.9, minRenderScale: 0.55, targetFrameMs: 1000 / 45, bloomStrength: 0.6, bloomRadius: 0.5, bloomThreshold: 0.3, exposure: 0.95 }
    : { particleScale: 0.8, maxPixelRatio: 1.75, initialRenderScale: 1.0, minRenderScale: 0.7, targetFrameMs: 1000 / 60, bloomStrength: 0.7, bloomRadius: 0.55, bloomThreshold: 0.28, exposure: 1.0 };

function scaledCount(value, minimum = 600) {
    return Math.max(minimum, Math.floor(value * performanceProfile.particleScale));
}

for (const key of ['core', 'bar', 'bulge', 'spur', 'glow', 'nebulae', 'dust', 'disk', 'halo']) {
    config[key].count = scaledCount(config[key].count);
}
config.arms.starCount = scaledCount(config.arms.starCount);
config.background.starCount = scaledCount(config.background.starCount);

// =============================================================================
// RENDERER
// =============================================================================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
const canvas = document.getElementById('galaxyCanvas');

const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 1);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = performanceProfile.exposure;

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 3000);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.enablePan = false;
controls.minDistance = 8;
controls.maxDistance = 520;
controls.rotateSpeed = isLikelyMobile ? 0.6 : 0.8;
controls.zoomSpeed = isLikelyMobile ? 0.75 : 1;
controls.touches.ONE = THREE.TOUCH.ROTATE;
controls.touches.TWO = THREE.TOUCH.DOLLY_ROTATE;

// =============================================================================
// SHADERS
// =============================================================================
const rotatingVertexShader = `
    attribute float size;
    attribute vec3 customColor;
    attribute float alpha;
    varying vec3 vColor;
    varying float vAlpha;
    uniform float uTime;
    uniform float uExpansion;
    uniform float uRotationDirection;
    uniform float uPixelRatio;

    void main() {
        vColor = customColor;
        vAlpha = alpha;
        vec3 pos = position * uExpansion;
        float radius = length(pos.xz);
        float a = uTime * uRotationDirection * (1.0 + 6.0 / (radius + 3.0));
        float c = cos(a);
        float s = sin(a);
        vec4 mvPosition = modelViewMatrix * vec4(pos.x * c - pos.z * s, pos.y, pos.x * s + pos.z * c, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = clamp(size * uPixelRatio * (300.0 / -mvPosition.z), 0.6, MAX_SIZE * uPixelRatio);
    }
`;

const skyVertexShader = `
    attribute float size;
    attribute vec3 customColor;
    attribute float alpha;
    varying vec3 vColor;
    varying float vAlpha;
    uniform float uPixelRatio;

    void main() {
        vColor = customColor;
        vAlpha = alpha;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = clamp(size * uPixelRatio, 0.8, 6.0);
    }
`;

// Stars: sharp core with a faint halo, like a point source through optics.
const starFragmentShader = `
    varying vec3 vColor;
    varying float vAlpha;
    void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        float core = exp(-d * d * 60.0);
        float halo = exp(-d * d * 9.0) * 0.35;
        float i = core + halo;
        gl_FragColor = vec4(vColor * i, vAlpha * i);
    }
`;

// Diffuse light and nebulae: very soft falloff.
const glowFragmentShader = `
    varying vec3 vColor;
    varying float vAlpha;
    void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        float i = exp(-d * d * 10.0) * (1.0 - smoothstep(0.35, 0.5, d));
        gl_FragColor = vec4(vColor, vAlpha * i);
    }
`;

// Dust absorbs light: drawn with normal blending over the stars.
const dustFragmentShader = `
    varying vec3 vColor;
    varying float vAlpha;
    void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        float i = pow(1.0 - d * 2.0, 1.4);
        gl_FragColor = vec4(vColor, vAlpha * i);
    }
`;

// =============================================================================
// HELPERS
// =============================================================================
function gaussian(mean = 0, stdev = 1) {
    const u = 1 - Math.random();
    const v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v) * stdev + mean;
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

// Approximate sRGB colour of a black body at the given temperature (Kelvin).
function blackbody(kelvin) {
    const t = kelvin / 100;
    let r;
    let g;
    let b;
    if (t <= 66) {
        r = 255;
        g = 99.4708025861 * Math.log(t) - 161.1195681661;
        b = t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307;
    } else {
        r = 329.698727446 * Math.pow(t - 60, -0.1332047592);
        g = 288.1221695283 * Math.pow(t - 60, -0.0755148492);
        b = 255;
    }
    const clamp = (v) => Math.min(255, Math.max(0, v)) / 255;
    return new THREE.Color(clamp(r), clamp(g), clamp(b));
}

// Many faint stars, few bright ones.
function magnitudeSize(min, max, steepness = 3) {
    return min + (max - min) * Math.pow(Math.random(), steepness);
}

const spiralA = config.arms.innerRadius;
const spiralB = Math.tan(config.arms.pitchAngle);

function armTheta(r, offset) {
    return Math.log(r / spiralA) / spiralB + offset + config.bar.angle;
}

// Same differential rotation as the vertex shader, for anything tracked on the CPU.
function rotatePoint(x, z, time, expansion, out) {
    const ex = x * expansion;
    const ez = z * expansion;
    const radius = Math.hypot(ex, ez);
    const a = time * config.physics.rotationDirection * (1 + 6 / (radius + 3));
    out.set(ex * Math.cos(a) - ez * Math.sin(a), 0, ex * Math.sin(a) + ez * Math.cos(a));
    return out;
}

function createBuffer() {
    return { positions: [], colors: [], sizes: [], alphas: [] };
}

function push(buffer, x, y, z, color, size, alpha) {
    buffer.positions.push(x, y, z);
    buffer.colors.push(color.r, color.g, color.b);
    buffer.sizes.push(size);
    buffer.alphas.push(alpha);
}

// =============================================================================
// GALAXY GENERATION
// =============================================================================
const SUN_THETA = armTheta(SUN_RADIUS, config.spur.offset);
const SUN_POSITION = new THREE.Vector3(Math.cos(SUN_THETA) * SUN_RADIUS, 0.3, Math.sin(SUN_THETA) * SUN_RADIUS);

function generateGalaxy() {
    const stars = createBuffer();
    const glow = createBuffer();
    const dust = createBuffer();
    const { arms } = config;

    // Core: dense, warm white, slightly flattened.
    for (let i = 0; i < config.core.count; i++) {
        const r = Math.pow(Math.random(), 2.6) * config.core.outerRadius;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const t = r / config.core.outerRadius;
        const color = blackbody(lerp(config.core.tempMax, config.core.tempMin, t + Math.random() * 0.2));
        push(stars,
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.cos(phi) * (0.5 + 0.3 * t),
            r * Math.sin(phi) * Math.sin(theta),
            color, magnitudeSize(0.9, 3.0, 2.6) * (1 - t * 0.35), 0.35 + (1 - t) * 0.3);
    }

    // Bulge: old orange stars, peanut-flattened.
    for (let i = 0; i < config.bulge.count; i++) {
        const r = Math.pow(Math.random(), 1.6) * config.bulge.radius;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const t = r / config.bulge.radius;
        const color = blackbody(lerp(config.bulge.tempMin, config.bulge.tempMax, Math.random()));
        push(stars,
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.cos(phi) * 0.38,
            r * Math.sin(phi) * Math.sin(theta),
            color, magnitudeSize(0.7, 2.4), (0.22 + (1 - t) * 0.28));
    }

    // Bar.
    const barCos = Math.cos(config.bar.angle);
    const barSin = Math.sin(config.bar.angle);
    for (let i = 0; i < config.bar.count; i++) {
        const bx = (Math.random() - 0.5) * config.bar.length;
        const t = Math.abs(bx) / (config.bar.length * 0.5);
        if (Math.random() < t * 0.35) continue;
        const bz = gaussian(0, config.bar.width * 0.32 * (1 - t * 0.4));
        const color = blackbody(lerp(config.bar.tempMax, config.bar.tempMin, t * 0.7 + Math.random() * 0.3));
        push(stars,
            bx * barCos - bz * barSin,
            gaussian(0, config.bar.height * 0.32),
            bx * barSin + bz * barCos,
            color, magnitudeSize(0.7, 2.4), 0.32 + (1 - t) * 0.25);
    }

    // Spiral arms: young, hot stars cluster on the arm crest.
    for (let i = 0; i < arms.starCount; i++) {
        const arm = arms.definitions[Math.floor(Math.random() * arms.definitions.length)];
        if (Math.random() > arm.strength) continue;
        const t = Math.pow(Math.random(), 0.8);
        const baseRadius = lerp(arms.innerRadius, arms.outerRadius, t);
        const spread = arm.width * (0.55 + t * 0.45);
        const scatter = gaussian(0, spread);
        const r = baseRadius + scatter;
        const theta = armTheta(baseRadius, arm.offset) + gaussian(0, 0.1 / (t + 0.4));
        const crest = Math.exp(-(scatter * scatter) / (2 * (spread * 0.45) ** 2));
        const temp = Math.random() < crest * 0.7
            ? lerp(9000, 26000, Math.pow(Math.random(), 2))
            : lerp(4800, 8000, Math.random());
        const fade = 1 - Math.pow(t, 2.4) * 0.55;
        push(stars,
            r * Math.cos(theta),
            gaussian(0, (1.1 - t * 0.6) * 0.32),
            r * Math.sin(theta),
            blackbody(temp), magnitudeSize(0.5, 3.0, 3.5) * fade, (0.45 + Math.random() * 0.4) * fade);
    }

    // Orion Spur.
    for (let i = 0; i < config.spur.count; i++) {
        const r = lerp(config.spur.rMin, config.spur.rMax, Math.random());
        const scatter = gaussian(0, config.spur.width);
        const theta = armTheta(r, config.spur.offset) + gaussian(0, 0.04);
        const temp = Math.random() < 0.45 ? lerp(8000, 20000, Math.random() ** 2) : lerp(4800, 7500, Math.random());
        push(stars,
            (r + scatter) * Math.cos(theta),
            gaussian(0, 0.28),
            (r + scatter) * Math.sin(theta),
            blackbody(temp), magnitudeSize(0.5, 2.4, 3.5), 0.4 + Math.random() * 0.35);
    }

    // Thin disk: the smooth, mostly yellow-white population between the arms.
    for (let i = 0; i < config.disk.count; i++) {
        const r = -config.disk.radius * 0.32 * Math.log(1 - Math.random() * 0.96);
        const theta = Math.random() * Math.PI * 2;
        const fade = 1 - (r / config.disk.radius) * 0.6;
        push(stars,
            r * Math.cos(theta),
            gaussian(0, config.disk.height * (1 - r / config.disk.radius * 0.5)),
            r * Math.sin(theta),
            blackbody(lerp(4300, 6800, Math.random())), magnitudeSize(0.4, 1.6), (0.22 + Math.random() * 0.18) * fade);
    }

    // Stellar halo: sparse, faint, old.
    for (let i = 0; i < config.halo.count; i++) {
        const r = config.halo.radius * Math.pow(Math.random(), 0.55);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        push(stars,
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.cos(phi) * 0.75,
            r * Math.sin(phi) * Math.sin(theta),
            blackbody(lerp(3600, 5200, Math.random())), magnitudeSize(0.4, 1.3), 0.12 + Math.random() * 0.12);
    }

    // Diffuse unresolved light: warm toward the center, blue in the arms.
    const warmGlow = new THREE.Color(0xe0b47c);
    const armGlow = new THREE.Color(0x6f93cf);
    for (let i = 0; i < config.glow.count; i++) {
        const inArms = Math.random() < 0.82;
        let x;
        let z;
        let r;
        if (inArms) {
            const arm = arms.definitions[Math.floor(Math.random() * arms.definitions.length)];
            const t = Math.random();
            const baseRadius = lerp(arms.innerRadius * 0.9, arms.outerRadius * 0.95, t);
            r = baseRadius + gaussian(0, arm.width * 1.3);
            const theta = armTheta(baseRadius, arm.offset) + gaussian(0, 0.12);
            x = r * Math.cos(theta);
            z = r * Math.sin(theta);
        } else {
            r = Math.abs(gaussian(0, 16));
            const theta = Math.random() * Math.PI * 2;
            x = r * Math.cos(theta);
            z = r * Math.sin(theta);
        }
        // Arm scatter can push r below zero; use the distance from the center.
        const distance = Math.abs(r);
        const t = Math.min(1, distance / 60);
        const color = warmGlow.clone().lerp(armGlow, Math.pow(t, 0.7));
        const fade = 1 - Math.pow(Math.min(1, distance / 85), 2) * 0.7;
        push(glow, x, gaussian(0, 0.9), z, color, lerp(6, 16, Math.random()) * fade, lerp(0.025, 0.07, Math.random()) * fade * (inArms ? 1 : 0.6));
    }

    // HII regions: small pink-red Hα knots on the arm crest.
    const hAlpha = [new THREE.Color(0xff4d6d), new THREE.Color(0xff6b80), new THREE.Color(0xe8475f)];
    for (let i = 0; i < config.nebulae.count; i++) {
        const arm = arms.definitions[Math.floor(Math.random() * arms.definitions.length)];
        const t = 0.12 + Math.random() * 0.68;
        const baseRadius = lerp(arms.innerRadius, arms.outerRadius * 0.9, t);
        const r = baseRadius + gaussian(0, arm.width * 0.3) + 0.6;
        const theta = armTheta(baseRadius, arm.offset) + gaussian(0, 0.05);
        const knots = 2 + Math.floor(Math.random() * 4);
        for (let j = 0; j < knots; j++) {
            push(glow,
                r * Math.cos(theta) + gaussian(0, config.nebulae.clusterSize),
                gaussian(0, 0.25),
                r * Math.sin(theta) + gaussian(0, config.nebulae.clusterSize),
                hAlpha[Math.floor(Math.random() * hAlpha.length)], lerp(1.2, 3.0, Math.random()), lerp(0.2, 0.45, Math.random()));
        }
    }

    // Dust lanes on the inner edge of each arm, plus the dusty inner disk.
    const dustA = new THREE.Color(0x0a0604);
    const dustB = new THREE.Color(0x150a05);
    for (let i = 0; i < config.dust.count; i++) {
        let x;
        let z;
        if (Math.random() < 0.82) {
            const arm = arms.definitions[Math.floor(Math.random() * arms.definitions.length)];
            const t = Math.random();
            const baseRadius = lerp(arms.innerRadius, arms.outerRadius * 0.85, t);
            const r = baseRadius - arm.width * 0.55 + gaussian(0, arm.width * config.dust.width);
            const theta = armTheta(baseRadius, arm.offset) + config.dust.offsetAngle + gaussian(0, 0.04);
            x = r * Math.cos(theta);
            z = r * Math.sin(theta);
        } else {
            const r = lerp(7, 30, Math.random());
            const theta = Math.random() * Math.PI * 2;
            x = r * Math.cos(theta);
            z = r * Math.sin(theta);
        }
        push(dust, x, gaussian(0, 0.18), z, Math.random() < 0.6 ? dustA : dustB, lerp(2.0, 5.5, Math.random()), lerp(0.45, 0.8, Math.random()));
    }

    return { stars, glow, dust };
}

// Distant stars on a sphere, independent of the galaxy's rotation.
function generateSky() {
    const sky = createBuffer();
    const { background } = config;
    for (let i = 0; i < background.starCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = background.radius;
        const bright = Math.pow(Math.random(), 6);
        push(sky,
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.cos(phi),
            r * Math.sin(phi) * Math.sin(theta),
            blackbody(lerp(3200, 14000, Math.random() ** 1.5)), 1 + bright * 3, 0.25 + bright * 0.75);
    }
    return sky;
}

// =============================================================================
// POINT SYSTEMS
// =============================================================================
const uniforms = {
    uTime: { value: 0 },
    uExpansion: { value: reducedMotion ? 1 : 0 },
    uRotationDirection: { value: config.physics.rotationDirection },
    uPixelRatio: { value: 1 },
};

function createPoints(data, material) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(data.positions, 3));
    geometry.setAttribute('customColor', new THREE.Float32BufferAttribute(data.colors, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(data.sizes, 1));
    geometry.setAttribute('alpha', new THREE.Float32BufferAttribute(data.alphas, 1));
    const points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    return points;
}

// Stars stay point-like up close; diffuse light and dust may grow.
function material(vertexShader, fragmentShader, blending, maxSize = 64) {
    return new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending,
        defines: { MAX_SIZE: maxSize.toFixed(1) },
    });
}

const galaxy = generateGalaxy();
const skyPoints = createPoints(generateSky(), material(skyVertexShader, starFragmentShader, THREE.AdditiveBlending));
const glowPoints = createPoints(galaxy.glow, material(rotatingVertexShader, glowFragmentShader, THREE.AdditiveBlending));
const starPoints = createPoints(galaxy.stars, material(rotatingVertexShader, starFragmentShader, THREE.AdditiveBlending, 7));
const dustPoints = createPoints(galaxy.dust, material(rotatingVertexShader, dustFragmentShader, THREE.NormalBlending));

skyPoints.renderOrder = -1;
glowPoints.renderOrder = 0;
starPoints.renderOrder = 1;
dustPoints.renderOrder = 2;
scene.add(skyPoints, glowPoints, starPoints, dustPoints);

// =============================================================================
// POST PROCESSING
// =============================================================================
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    performanceProfile.bloomStrength,
    performanceProfile.bloomRadius,
    performanceProfile.bloomThreshold
);
composer.addPass(bloomPass);

const renderState = { renderScale: performanceProfile.initialRenderScale, frameTimeEMA: performanceProfile.targetFrameMs, adjustTimer: 0, appliedPixelRatio: 0 };

function applyRenderScale(scale, force = false) {
    const clamped = THREE.MathUtils.clamp(scale, performanceProfile.minRenderScale, 1);
    renderState.renderScale = clamped;
    const pixelRatio = Math.min(window.devicePixelRatio, performanceProfile.maxPixelRatio) * clamped;
    if (!force && Math.abs(pixelRatio - renderState.appliedPixelRatio) < 0.02) return;
    renderState.appliedPixelRatio = pixelRatio;
    uniforms.uPixelRatio.value = pixelRatio;
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    composer.setPixelRatio(pixelRatio);
    composer.setSize(window.innerWidth, window.innerHeight);
}

function updateAdaptiveResolution(delta) {
    renderState.frameTimeEMA = lerp(renderState.frameTimeEMA, delta * 1000, 0.08);
    renderState.adjustTimer += delta;
    if (renderState.adjustTimer < 1.25) return;
    renderState.adjustTimer = 0;
    const slow = performanceProfile.targetFrameMs * 1.2;
    const fast = performanceProfile.targetFrameMs * 0.82;
    let next = renderState.renderScale;
    if (renderState.frameTimeEMA > slow) next -= 0.08;
    else if (renderState.frameTimeEMA < fast) next += 0.04;
    if (Math.abs(next - renderState.renderScale) >= 0.03) applyRenderScale(next);
    bloomPass.enabled = !(renderState.frameTimeEMA > slow * 1.15 && renderState.renderScale <= performanceProfile.minRenderScale + 0.02);
}

applyRenderScale(performanceProfile.initialRenderScale, true);

// =============================================================================
// LABELS PINNED TO THE SCENE
// =============================================================================
const labelLayer = document.getElementById('labels');
const labels = [];

function addLabel(text, className, getWorldPosition) {
    const el = document.createElement('div');
    el.className = `label ${className}`;
    el.textContent = text;
    labelLayer.appendChild(el);
    labels.push({ el, getWorldPosition, world: new THREE.Vector3() });
}

const tmp = new THREE.Vector3();
addLabel('Galactic center', 'core', (out) => out.set(0, 0, 0));
for (const arm of config.arms.definitions) {
    const r = arm.strength < 1 ? 52 : 64;
    const theta = armTheta(r, arm.offset);
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    addLabel(arm.name, 'arm', (out) => rotatePoint(x, z, uniforms.uTime.value, uniforms.uExpansion.value, out));
}
addLabel('The Sun', 'sun', (out) => sunWorldPosition(out));

function sunWorldPosition(out) {
    rotatePoint(SUN_POSITION.x, SUN_POSITION.z, uniforms.uTime.value, uniforms.uExpansion.value, out);
    out.y = SUN_POSITION.y * uniforms.uExpansion.value;
    return out;
}

function updateLabels() {
    if (labelLayer.classList.contains('is-hidden')) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const distance = camera.position.distanceTo(controls.target);
    // Seen edge-on, the arms collapse into one line and their names overlap.
    const elevation = Math.asin(Math.min(1, Math.abs(camera.position.y - controls.target.y) / distance));
    const armsReadable = distance >= 45 && elevation > THREE.MathUtils.degToRad(12);
    for (const label of labels) {
        label.getWorldPosition(label.world);
        tmp.copy(label.world).project(camera);
        const onScreen = tmp.z < 1 && tmp.x > -1.1 && tmp.x < 1.1 && tmp.y > -1.1 && tmp.y < 1.1;
        const hideArm = label.el.classList.contains('arm') && !armsReadable;
        label.el.style.opacity = onScreen && !hideArm && uniforms.uExpansion.value > 0.97 ? '1' : '0';
        if (onScreen) {
            const x = (tmp.x * 0.5 + 0.5) * w - 2.5;
            const y = (-tmp.y * 0.5 + 0.5) * h - 9;
            label.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
        }
    }
}

// =============================================================================
// SCALE BAR
// =============================================================================
const scaleBar = document.getElementById('scaleBar');
const scaleText = document.getElementById('scaleText');
const niceSteps = [100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000];
let lastScaleKey = '';

function updateScaleBar() {
    const distance = camera.position.distanceTo(controls.target);
    const visibleHeight = 2 * distance * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const pxPerLy = window.innerHeight / (visibleHeight * LY_PER_UNIT);
    let step = niceSteps[niceSteps.length - 1];
    for (const candidate of niceSteps) {
        if (candidate * pxPerLy >= 70) {
            step = candidate;
            break;
        }
    }
    const width = Math.round(step * pxPerLy);
    const key = `${step}:${width}`;
    if (key === lastScaleKey) return;
    lastScaleKey = key;
    scaleBar.style.width = `${width}px`;
    scaleText.textContent = `${step.toLocaleString('en-US')} light-years`;
}

// =============================================================================
// VIEWS
// =============================================================================
// Portrait screens need more distance to fit the disk's width.
const fit = () => (camera.aspect < 0.8 ? 1.45 : 1);
const views = {
    overview: () => ({ target: new THREE.Vector3(0, 0, 0), position: new THREE.Vector3(0, 92, 150).multiplyScalar(fit()) }),
    face: () => ({ target: new THREE.Vector3(0, 0, 0), position: new THREE.Vector3(0, 185 * fit(), 0.01) }),
    edge: () => ({ target: new THREE.Vector3(0, 0, 0), position: new THREE.Vector3(0, 2.5, 175 * fit()) }),
    sun: () => {
        const sun = sunWorldPosition(new THREE.Vector3());
        const outward = new THREE.Vector3(sun.x, 0, sun.z).normalize();
        return { target: sun, position: sun.clone().add(outward.multiplyScalar(14)).add(new THREE.Vector3(0, 9, 0)) };
    },
};

let activeView = 'overview';
let tween = null;
const followOffset = new THREE.Vector3();

function goToView(name) {
    activeView = name;
    const { target, position } = views[name]();
    document.querySelectorAll('[data-view]').forEach((btn) => btn.setAttribute('aria-pressed', String(btn.dataset.view === name)));
    if (reducedMotion) {
        controls.target.copy(target);
        camera.position.copy(position);
        return;
    }
    tween = {
        start: performance.now(),
        duration: 1800,
        fromTarget: controls.target.clone(),
        fromPosition: camera.position.clone(),
        toTarget: target,
        toPosition: position,
    };
}

function updateTween(now) {
    if (!tween) return;
    const p = Math.min(1, (now - tween.start) / tween.duration);
    const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
    if (activeView === 'sun') {
        tween.toTarget = sunWorldPosition(new THREE.Vector3());
    }
    controls.target.lerpVectors(tween.fromTarget, tween.toTarget, e);
    camera.position.lerpVectors(tween.fromPosition, activeView === 'sun' ? views.sun().position : tween.toPosition, e);
    if (p >= 1) tween = null;
}

// While viewing the Sun, ride along with it as the disk rotates.
const prevSun = new THREE.Vector3();
const currentSun = new THREE.Vector3();
function followSun() {
    sunWorldPosition(currentSun);
    if (activeView === 'sun' && !tween) {
        followOffset.subVectors(currentSun, prevSun);
        controls.target.add(followOffset);
        camera.position.add(followOffset);
    }
    prevSun.copy(currentSun);
}

document.querySelectorAll('[data-view]').forEach((btn) => {
    btn.addEventListener('click', () => goToView(btn.dataset.view));
});

const labelToggle = document.getElementById('toggleLabels');
labelToggle.addEventListener('click', () => {
    const hidden = labelLayer.classList.toggle('is-hidden');
    labelToggle.setAttribute('aria-pressed', String(!hidden));
});

// Dragging leaves any preset view.
controls.addEventListener('start', () => {
    tween = null;
    hint.classList.add('is-done');
    if (activeView !== 'sun') {
        document.querySelectorAll('[data-view]').forEach((btn) => btn.setAttribute('aria-pressed', 'false'));
        activeView = 'free';
    }
});

const hint = document.getElementById('hint');

// =============================================================================
// INTRO + LOOP
// =============================================================================
const overview = views.overview();
controls.target.copy(overview.target);
if (reducedMotion) {
    camera.position.copy(overview.position);
} else {
    // One orchestrated moment: the disk unfolds while the camera settles in.
    // Start from a small disk with exposure at zero; collapsing every star into
    // one point would saturate the additive blend into a white flash.
    camera.position.set(0, 40, 330);
    renderer.toneMappingExposure = 0;
    const introStart = performance.now();
    const introDuration = config.physics.expansionDuration * 1000;
    const from = camera.position.clone();
    const intro = (now) => {
        const p = Math.min(1, (now - introStart) / introDuration);
        const e = 1 - Math.pow(1 - p, 3);
        uniforms.uExpansion.value = lerp(0.35, 1, e);
        renderer.toneMappingExposure = performanceProfile.exposure * Math.min(1, p * 1.8);
        if (!tween && activeView === 'overview') camera.position.lerpVectors(from, overview.position, e);
        if (p < 1) requestAnimationFrame(intro);
    };
    requestAnimationFrame(intro);
}

const loading = document.getElementById('loading');
const clock = new THREE.Clock();
let started = false;

let viewW = window.innerWidth;
let viewH = window.innerHeight;

function syncSize() {
    if (window.innerWidth === viewW && window.innerHeight === viewH) return;
    viewW = window.innerWidth;
    viewH = window.innerHeight;
    camera.aspect = viewW / viewH;
    camera.updateProjectionMatrix();
    applyRenderScale(renderState.renderScale, true);
}

function animate(now) {
    requestAnimationFrame(animate);
    syncSize();
    const delta = Math.min(clock.getDelta(), 0.1);
    if (!reducedMotion) uniforms.uTime.value += delta * config.physics.rotationSpeed * 1000;

    updateTween(now);
    followSun();
    controls.update();
    updateAdaptiveResolution(delta);
    composer.render();
    updateLabels();
    updateScaleBar();

    if (!started) {
        started = true;
        loading.classList.add('is-done');
    }
}


requestAnimationFrame(animate);

