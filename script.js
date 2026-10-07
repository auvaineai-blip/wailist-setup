/* =========================================================
   EXANOVA INTELLIGENCE — interaction & 3D layer
   ========================================================= */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- NAV scroll state ---------- */
const nav = document.getElementById('nav');
const onScroll = () => {
  if (window.scrollY > 40) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Waitlist form -> Make.com webhook ---------- */
(function waitlistForm() {
  const form = document.getElementById('waitlistForm');
  if (!form) return;
  const input = document.getElementById('waitlistEmail');
  const submitBtn = document.getElementById('waitlistSubmit');
  const status = document.getElementById('waitlistStatus');
  const inputWrap = form.querySelector('.waitlist-input-wrap');
  const WEBHOOK_URL = 'https://hook.us2.make.com/ezsadhw5cnhygchppev4alp16ma923wo';

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = input.value.trim();

    if (!emailPattern.test(email)) {
      status.textContent = 'Please enter a valid email address.';
      status.className = 'waitlist-status error';
      input.focus();
      return;
    }

    submitBtn.disabled = true;
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<strong>Sending…</strong>';
    status.textContent = '';
    status.className = 'waitlist-status';
    
    let success = false;

    try {
      const params = new URLSearchParams();
      params.append('email', email);
      params.append('joinedAt', new Date().toISOString());
      params.append('Source', 'exanova-website');

      await fetch(WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: params,
      });

      // Success! Trigger animation
      success = true;
      form.reset();
      
      // 1. Collapse the input wrapper
      if (inputWrap) inputWrap.classList.add('sent');
      
      // 2. Hide the standard status text
      status.style.display = 'none';

      // 3. Create and inject the success animation (SVG + Text)
      const successDiv = document.createElement('div');
      successDiv.className = 'waitlist-success';
      successDiv.innerHTML = `
        <svg class="checkmark-svg" viewBox="0 0 52 52">
          <circle class="checkmark-circle" cx="26" cy="26" r="25" />
          <path class="checkmark-check" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
        <span class="waitlist-success-text">You're on the list — check your inbox shortly.</span>
      `;
      form.appendChild(successDiv);

      // Force reflow then trigger CSS transition
      void successDiv.offsetWidth;
      successDiv.classList.add('visible');

    } catch (err) {
      status.textContent = "Something went wrong — please email us directly instead.";
      status.className = 'waitlist-status error';
    } finally {
      // Only restore button state if it failed (so it doesn't snap back during success animation)
      if (!success) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
      }
    }
  });
})();

/* ---------- Waitlist form -> Make.com webhook ---------- */
(function waitlistForm() {
  const form = document.getElementById('waitlistForm');
  if (!form) return;
  const input = document.getElementById('waitlistEmail');
  const submitBtn = document.getElementById('waitlistSubmit');
  const status = document.getElementById('waitlistStatus');
  const WEBHOOK_URL = 'https://hook.us2.make.com/ezsadhw5cnhygchppev4alp16ma923wo';

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = input.value.trim();

    if (!emailPattern.test(email)) {
      status.textContent = 'Please enter a valid email address.';
      status.className = 'waitlist-status error';
      input.focus();
      return;
    }

    submitBtn.disabled = true;
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<strong>Sending…</strong>';
    status.textContent = '';
    status.className = 'waitlist-status';

    try {
      const params = new URLSearchParams();
      params.append('email', email);
      params.append('joinedAt', new Date().toISOString());
      params.append('Source', 'exanova-website');

      // NOTE: no-cors + a URLSearchParams body sends a CORS-safelisted
      // 'application/x-www-form-urlencoded' Content-Type that browsers do
      // NOT downgrade. (JSON.stringify + 'Content-Type: application/json'
      // under no-cors gets silently rewritten to text/plain by the browser,
      // which is why Make.com was previously receiving the whole payload
      // collapsed into a single raw 'value' field instead of separate keys.)
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: params,
      });

      // 'no-cors' mode returns an opaque response, so a resolved fetch
      // is the best success signal we can get from a cross-origin webhook.
      status.textContent = "You're on the list — check your inbox shortly.";
      status.className = 'waitlist-status success';
      form.reset();
    } catch (err) {
      status.textContent = "Something went wrong — please email us directly instead.";
      status.className = 'waitlist-status error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHTML;
    }
  });
})();

/* ---------- Mobile menu ---------- */
const burger = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');
if (burger && mobileNav) {
  const toggleMenu = () => {
    const isOpen = mobileNav.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };
  burger.addEventListener('click', toggleMenu);
  mobileNav.querySelectorAll('a').forEach((a) => a.addEventListener('click', toggleMenu));
}

/* ---------- Footer year ---------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Cursor glow (desktop only) ---------- */
const glow = document.getElementById('cursorGlow');
let glowX = window.innerWidth / 2, glowY = window.innerHeight / 2;
let curX = glowX, curY = glowY;
const isTouch = matchMedia('(pointer: coarse)').matches;
if (!isTouch) {
  window.addEventListener('pointermove', (e) => {
    glowX = e.clientX; glowY = e.clientY;
  });
  const animGlow = () => {
    curX += (glowX - curX) * 0.12;
    curY += (glowY - curY) * 0.12;
    glow.style.transform = `translate(${curX}px, ${curY}px) translate(-50%,-50%)`;
    requestAnimationFrame(animGlow);
  };
  animGlow();
} else {
  glow.style.display = 'none';
}

/* ---------- Scroll reveal ---------- */
const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
revealEls.forEach((el) => io.observe(el));

/* ---------- Card spotlight follow ---------- */
document.querySelectorAll('.card').forEach((card) => {
  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
});

/* ---------- Magnetic buttons ---------- */
if (!isTouch && !prefersReducedMotion) {
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.28;
      const y = (e.clientY - r.top - r.height / 2) * 0.5;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('pointerleave', () => {
      btn.style.transform = 'translate(0,0)';
    });
  });
}

/* =========================================================
   HERO — 3D self-assembling neural network (Three.js)
   ========================================================= */
(function heroScene() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 15);

  const group = new THREE.Group();
  scene.add(group);

  // ----- Generate nodes on a fibonacci sphere for even distribution -----
  const NODE_COUNT = 150;
  const RADIUS = 6.4;
  const nodePositions = [];
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < NODE_COUNT; i++) {
    const y = 1 - (i / (NODE_COUNT - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    // jitter for organic feel
    const jitter = 1 + (Math.random() - 0.5) * 0.35;
    nodePositions.push(new THREE.Vector3(x, y, z).multiplyScalar(RADIUS * jitter));
  }

  // ----- Points (nodes) -----
  const pointsGeo = new THREE.BufferGeometry();
  const posArr = new Float32Array(NODE_COUNT * 3);
  const colorArr = new Float32Array(NODE_COUNT * 3);
  const green = new THREE.Color(0x00ff41);
  const gold = new THREE.Color(0xc4a882);

  nodePositions.forEach((p, i) => {
    posArr[i * 3] = p.x; posArr[i * 3 + 1] = p.y; posArr[i * 3 + 2] = p.z;
    const c = Math.random() > 0.82 ? gold : green;
    colorArr[i * 3] = c.r; colorArr[i * 3 + 1] = c.g; colorArr[i * 3 + 2] = c.b;
  });
  pointsGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
  pointsGeo.setAttribute('color', new THREE.BufferAttribute(colorArr, 3));

  const pointsMat = new THREE.PointsMaterial({
    size: 0.11,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const pointCloud = new THREE.Points(pointsGeo, pointsMat);
  group.add(pointCloud);

  // ----- Connections (lines) between nearby nodes -----
  const MAX_DIST = 2.6;
  const linePositions = [];
  const lineOpacities = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    let connections = 0;
    for (let j = i + 1; j < NODE_COUNT; j++) {
      if (connections >= 3) break;
      const d = nodePositions[i].distanceTo(nodePositions[j]);
      if (d < MAX_DIST) {
        linePositions.push(
          nodePositions[i].x, nodePositions[i].y, nodePositions[i].z,
          nodePositions[j].x, nodePositions[j].y, nodePositions[j].z
        );
        lineOpacities.push(0, 0);
        connections++;
      }
    }
  }

  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));
  const lineOpacityAttr = new Float32Array(lineOpacities);
  lineGeo.setAttribute('aOpacity', new THREE.BufferAttribute(lineOpacityAttr, 1));

  const lineMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uColor: { value: new THREE.Color(0x00ff41) } },
    vertexShader: `
      attribute float aOpacity;
      varying float vOpacity;
      void main() {
        vOpacity = aOpacity;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      varying float vOpacity;
      void main() {
        gl_FragColor = vec4(uColor, vOpacity * 0.35);
      }
    `,
  });
  const lineSegments = new THREE.LineSegments(lineGeo, lineMat);
  group.add(lineSegments);

  // ----- Ambient point light glow via a soft core sphere -----
  const coreGeo = new THREE.SphereGeometry(1.1, 32, 32);
  const coreMat = new THREE.MeshBasicMaterial({ color: 0x00ff41, transparent: true, opacity: 0 });
  const core = new THREE.Mesh(coreGeo, coreMat);
  group.add(core);

  // ----- Resize handling -----
  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // ----- Self-draw entrance animation -----
  const totalLines = lineOpacities.length / 2;
  const clock = new THREE.Clock();
  let drawProgress = 0;

  canvas.classList.add('ready');

  // ----- Mouse parallax -----
  let targetRotX = 0, targetRotY = 0;
  let curRotX = 0, curRotY = 0;
  window.addEventListener('pointermove', (e) => {
    targetRotY = ((e.clientX / window.innerWidth) - 0.5) * 0.6;
    targetRotX = ((e.clientY / window.innerHeight) - 0.5) * 0.4;
  });

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // fade in points + core
    if (pointsMat.opacity < 0.92) pointsMat.opacity += 0.012;
    if (coreMat.opacity < 0.035) coreMat.opacity += 0.0006;

    // progressive line draw-in (staggered)
    if (drawProgress < totalLines) {
      const step = Math.ceil(totalLines / 140); // draw over ~140 frames
      const opacityAttr = lineGeo.getAttribute('aOpacity');
      for (let k = 0; k < step && drawProgress < totalLines; k++, drawProgress++) {
        opacityAttr.setX(drawProgress * 2, 1);
        opacityAttr.setX(drawProgress * 2 + 1, 1);
      }
      opacityAttr.needsUpdate = true;
    }

    // gentle autorotation
    group.rotation.y = t * 0.06;
    group.rotation.x = Math.sin(t * 0.15) * 0.08;

    // mouse parallax (damped)
    curRotX += (targetRotX - curRotX) * 0.04;
    curRotY += (targetRotY - curRotY) * 0.04;
    camera.position.x = curRotY * 4;
    camera.position.y = -curRotX * 3;
    camera.lookAt(0, 0, 0);

    // subtle node pulsing via scale breathing
    pointCloud.material.size = 0.11 + Math.sin(t * 1.2) * 0.012;

    renderer.render(scene, camera);
  }
  if (!prefersReducedMotion) {
    animate();
  } else {
    pointsMat.opacity = 0.9;
    const opacityAttr = lineGeo.getAttribute('aOpacity');
    for (let i = 0; i < opacityAttr.count; i++) opacityAttr.setX(i, 1);
    opacityAttr.needsUpdate = true;
    renderer.render(scene, camera);
  }
})();

/* =========================================================
   PHILOSOPHY PANEL — compact rotating circuit orb
   ========================================================= */
(function philoScene() {
  const canvas = document.getElementById('philo-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const parent = canvas.parentElement;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 50);
  camera.position.set(0, 0, 7.5);

  const group = new THREE.Group();
  scene.add(group);

  const N = 70;
  const R = 3;
  const positions = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    positions.push(new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(R));
  }

  const posArr = new Float32Array(N * 3);
  const colArr = new Float32Array(N * 3);
  const green = new THREE.Color(0x00ff41);
  const gold = new THREE.Color(0xc4a882);
  positions.forEach((p, i) => {
    posArr[i * 3] = p.x; posArr[i * 3 + 1] = p.y; posArr[i * 3 + 2] = p.z;
    const c = i % 6 === 0 ? gold : green;
    colArr[i * 3] = c.r; colArr[i * 3 + 1] = c.g; colArr[i * 3 + 2] = c.b;
  });
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colArr, 3));
  const mat = new THREE.PointsMaterial({ size: 0.09, vertexColors: true, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false });
  group.add(new THREE.Points(geo, mat));

  const linePos = [];
  for (let i = 0; i < N; i++) {
    let c = 0;
    for (let j = i + 1; j < N; j++) {
      if (c >= 2) break;
      if (positions[i].distanceTo(positions[j]) < 1.5) {
        linePos.push(positions[i].x, positions[i].y, positions[i].z, positions[j].x, positions[j].y, positions[j].z);
        c++;
      }
    }
  }
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePos), 3));
  const lineMat = new THREE.LineBasicMaterial({ color: 0x00ff41, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending });
  group.add(new THREE.LineSegments(lineGeo, lineMat));

  function resize() {
    const s = parent.clientWidth;
    renderer.setSize(s, parent.clientHeight);
    camera.aspect = parent.clientWidth / parent.clientHeight;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  const ro = new ResizeObserver(resize);
  ro.observe(parent);

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    group.rotation.y = t * 0.18;
    group.rotation.x = Math.sin(t * 0.3) * 0.15;
    renderer.render(scene, camera);
  }
  if (!prefersReducedMotion) animate();
  else renderer.render(scene, camera);
})();