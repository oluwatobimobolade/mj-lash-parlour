import {
  BufferGeometry, CatmullRomCurve3, CanvasTexture, Float32BufferAttribute,
  Group, Mesh, MeshMatcapMaterial, PerspectiveCamera, Scene, SRGBColorSpace,
  Vector3, WebGLRenderer,
} from 'three';

const stage = document.querySelector('.hero-stage');
const surface = stage.querySelector('.stage-surface');
const controls = stage.querySelector('.stage-controls');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const angles = {
  front: { x: .34, y: -.24, z: -.25 },
  profile: { x: .24, y: -.91, z: -.24 },
};

function studioTexture(base, keyTint, fillTint, stripTint) {
  const canvas = Object.assign(document.createElement('canvas'), { width: 256, height: 256 });
  const context = canvas.getContext('2d');
  const image = context.createImageData(256, 256);
  for (let row = 0; row < 256; row += 1) {
    for (let column = 0; column < 256; column += 1) {
      const x = column / 127.5 - 1;
      const y = 1 - row / 127.5;
      const rim = Math.min(1, Math.hypot(x, y)) ** 6;
      const key = Math.exp(-((x * .4 + y - .54) ** 2) / .016);
      const softbox = Math.exp(-((x * .85 - y * .3 + .36) ** 2) / .018);
      const strip = Math.exp(-((x + y * .62 - .46) ** 2) / .004);
      const fill = Math.exp(-((y + .63) ** 2) / .065);
      const index = (row * 256 + column) * 4;
      for (let channel = 0; channel < 3; channel += 1) {
        image.data[index + channel] = base[channel] + keyTint[channel] * (key + softbox * .82)
          + fillTint[channel] * (fill + rim * .68) + stripTint[channel] * strip;
      }
      image.data[index + 3] = 255;
    }
  }
  context.putImageData(image, 0, 0);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

function makeSculpture() {
  const positions = [];
  const normals = [];
  const indices = [];
  const profile = (u) => {
    const arch = Math.sin(u * Math.PI);
    return new Vector3(7.3 * (u - .5), 1.11 * arch - .95, .54 * arch - .24 * u);
  };

  function addTube(curve, thickness, rings, sides) {
    const frame = curve.computeFrenetFrames(rings, false);
    const first = positions.length / 3;
    for (let ring = 0; ring <= rings; ring += 1) {
      const t = ring / rings;
      const point = curve.getPointAt(t);
      const radius = thickness(t);
      for (let side = 0; side < sides; side += 1) {
        const angle = side * Math.PI * 2 / sides;
        const n = frame.normals[ring].clone().multiplyScalar(Math.cos(angle));
        n.addScaledVector(frame.binormals[ring], Math.sin(angle));
        positions.push(point.x + n.x * radius, point.y + n.y * radius, point.z + n.z * radius);
        normals.push(n.x, n.y, n.z);
        if (ring === rings) continue;
        const current = first + ring * sides + side;
        const next = first + ring * sides + (side + 1) % sides;
        indices.push(current, next, current + sides, next, next + sides, current + sides);
      }
    }
  }

  const base = new CatmullRomCurve3(Array.from({ length: 21 }, (_, i) => profile(i / 20)));
  const glassBand = new CatmullRomCurve3(base.points.map((p) => p.clone().add(new Vector3(0, -.13, -.045))));
  addTube(glassBand, (t) => .016 + .158 * Math.sin(Math.PI * t) ** .66, 92, 18);
  const glassCount = indices.length;
  addTube(base, (t) => .017 + .068 * Math.sin(Math.PI * t) ** .52, 92, 14);
  addTube(new CatmullRomCurve3(base.points.map((p) => p.clone().add(new Vector3(0, -.237, .045)))),
    (t) => .005 + .019 * Math.sin(Math.PI * t), 92, 10);
  const railEnd = indices.length;

  for (let index = 0; index < 144; index += 1) {
    const u = (index + .5) / 144;
    const spike = [ .19, .39, .60, .80 ].reduce(
      (peak, at) => Math.max(peak, Math.exp(-((u - at) ** 2) / .00018)), 0);
    const variation = Math.sin(index * 31.41) * .16 + Math.cos(index * 2.28) * .12;
    const length = .67 + 1.5 * Math.sin(Math.PI * u) ** .75 + .72 * u + 1.05 * spike + variation;
    const fan = (u - .48) * (1.44 + .2 * Math.sin(index * .51));
    const root = profile(u);
    const curve = new CatmullRomCurve3([
      root,
      root.clone().add(new Vector3(fan * length * .24, length * .18, .26)),
      root.clone().add(new Vector3(fan * length * .63, length * .56, .18)),
      root.clone().add(new Vector3(fan * length, length * .91, -.59 - length * .26)),
    ]);
    addTube(curve, (t) => (.023 + .017 * spike) * (1 - t) ** .67 + .002, 18, 5);
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new Float32BufferAttribute(normals, 3));
  geometry.setIndex(indices);
  geometry.addGroup(0, glassCount, 0);
  geometry.addGroup(glassCount, railEnd - glassCount, 1);
  geometry.addGroup(railEnd, indices.length - railEnd, 2);
  const glass = studioTexture([26, 16, 26], [90, 67, 87], [66, 42, 68], [177, 159, 185]);
  const chrome = studioTexture([80, 31, 45], [167, 116, 133], [140, 68, 88], [217, 201, 222]);
  const fibres = studioTexture([25, 12, 22], [127, 84, 112], [87, 47, 77], [189, 162, 191]);
  const model = new Mesh(geometry, [glass, chrome, fibres].map((matcap) => new MeshMatcapMaterial({ matcap })));
  model.position.y = -1.04;
  const rig = new Group();
  rig.add(model);
  return rig;
}

function mount() {
  let renderer;
  try {
    renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  } catch {
    return;
  }

  const scene = new Scene();
  const camera = new PerspectiveCamera(32, 1, .1, 70);
  const rig = makeSculpture();
  scene.add(rig);
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  surface.append(canvas);

  const pose = reduceMotion.matches ? { ...angles.front } : { x: .52, y: -.68, z: -.31 };
  let target = angles.front;
  let frame = 0;
  let visible = true;
  let lost = false;
  let drag = null;

  function update() {
    frame = 0;
    if (lost || !visible) return;
    const factor = reduceMotion.matches ? 1 : .17;
    pose.x += (target.x - pose.x) * factor;
    pose.y += (target.y - pose.y) * factor;
    pose.z += (target.z - pose.z) * factor;
    rig.rotation.set(pose.x, pose.y, pose.z);
    renderer.render(scene, camera);
    if (Math.abs(target.x - pose.x) + Math.abs(target.y - pose.y) + Math.abs(target.z - pose.z) > .002) schedule();
  }

  function schedule() {
    if (visible && !lost && !frame) frame = requestAnimationFrame(update);
  }

  function resize() {
    const { clientWidth: width, clientHeight: height } = surface;
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.position.z = Math.max(10.2, 17.2 / camera.aspect);
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    schedule();
  }

  function select(view) {
    target = angles[view];
    for (const button of controls.querySelectorAll('button')) {
      button.setAttribute('aria-pressed', String(button.dataset.view === view));
    }
    schedule();
  }

  resize();
  stage.dataset.ready = 'true';
  controls.hidden = false;

  new ResizeObserver(resize).observe(surface);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (!visible) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
    schedule();
  }).observe(surface);

  controls.addEventListener('click', (event) => {
    const view = event.target.closest('button')?.dataset.view;
    if (view) select(view);
  });
  surface.addEventListener('pointerdown', (event) => {
    if (reduceMotion.matches || !event.isPrimary || event.button !== 0) return;
    surface.setPointerCapture(event.pointerId);
    drag = { x: event.clientX, y: event.clientY, pitch: pose.x, yaw: pose.y };
  });
  surface.addEventListener('pointermove', (event) => {
    if (reduceMotion.matches || !drag) return;
    const x = event.clientX - drag.x;
    const y = event.clientY - drag.y;
    if (Math.abs(x) + Math.abs(y) < 4) return;
    for (const button of controls.querySelectorAll('button[aria-pressed="true"]')) button.setAttribute('aria-pressed', 'false');
    target = {
      x: Math.max(-.25, Math.min(.8, drag.pitch + y * .006)),
      y: Math.max(-1.07, Math.min(1.02, drag.yaw + x * .007)),
      z: angles.front.z,
    };
    schedule();
  });
  surface.addEventListener('lostpointercapture', () => { drag = null; });
  canvas.addEventListener('webglcontextlost', () => {
    lost = true;
    delete stage.dataset.ready;
    controls.hidden = true;
  });
  canvas.addEventListener('webglcontextrestored', () => {
    lost = false;
    stage.dataset.ready = 'true';
    controls.hidden = false;
    resize();
  });
}

if ('IntersectionObserver' in window && 'ResizeObserver' in window) mount();
