function initThreeCard() {
  const canvas = document.getElementById('card-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const W = canvas.clientWidth || 420;
  const H = canvas.clientHeight || 300;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
  camera.position.set(0, 0, 6.5);

  // ============================================================
  // ROOT GROUP — everything parented here so it all moves as one
  // ============================================================
  const cardGroup = new THREE.Group();
  scene.add(cardGroup);

  // ===== CREATE CREDIT CARD =====
  function createCreditCard() {
    // Card dimensions
    const width = 3.0;
    const height = 1.89;
    const depth = 0.055;

    // Create gradient texture
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 320;
    const ctx = canvas.getContext('2d');

    // Gradient background
    const cardMat = new THREE.MeshStandardMaterial({
      color: 0x0b0b18,
      metalness: 0.65,
      roughness: 0.22,
    });

    ctx.fillStyle = cardMat;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add subtle pattern
    ctx.globalAlpha = 0.1;
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 3,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    // Card chip
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(50, 100, 80, 60);
    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 100, 80, 60);

    ctx.font = 'bold 24px monospace';
    ctx.fillStyle = '#22c55e';
    ctx.fillText('7777 7777 7777 7777', 50, 200);

    ctx.font = '18px Arial';
    ctx.fillStyle = '#22c55e';
    ctx.fillText('MCFLLY BANK', 50, 250);

    ctx.font = 'bold 20px monospace';
    ctx.fillStyle = '#22c55e';
    ctx.fillText('12/26', 350, 250);

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);

    // Card geometry
    const cardGeometry = new THREE.BoxGeometry(width, height, depth);

    // Card materials
    const materials = [
      new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.3, roughness: 0.4 }), // Right
      new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.3, roughness: 0.4 }), // Left
      new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.3, roughness: 0.4 }), // Top
      new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.3, roughness: 0.4 }), // Bottom
      new THREE.MeshStandardMaterial({ map: texture, metalness: 0.3, roughness: 0.4 }), // Front
      new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.5, roughness: 0.5 })  // Back
    ];

    const card = new THREE.Mesh(cardGeometry, materials);
    card.castShadow = true;
    card.receiveShadow = true;

    return card;
  }

  const card = createCreditCard();
  cardGroup.add(card);


  // ===== CONTACTLESS SYMBOL — child of cardGroup =====
  const nfcGroup = new THREE.Group();
  nfcGroup.position.set(1.05, 0.26, 0.032);
  cardGroup.add(nfcGroup);

  const nfcMat = new THREE.MeshStandardMaterial({
    color: 0x22c55e,
    metalness: 0.2,
    roughness: 0.5,
    emissive: 0x22c55e,
    emissiveIntensity: 0.35,
  });
  for (let i = 0; i < 3; i++) {
    const arc = new THREE.Mesh(
      new THREE.TorusGeometry(0.065 + i * 0.072, 0.013, 8, 28, Math.PI * 0.72),
      nfcMat
    );
    arc.rotation.z = Math.PI * 0.64;
    nfcGroup.add(arc);
  }




  // ===== MAGNETIC STRIPE (back) — child of cardGroup =====
  const stripe = new THREE.Mesh(
    new THREE.BoxGeometry(2.94, 0.34, 0.01),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.0, roughness: 0.9 })
  );
  stripe.position.set(0, 0.46, -0.0335);
  cardGroup.add(stripe);

  // ===== LIGHTS =====
  scene.add(new THREE.AmbientLight(0x10101e, 1.4));

  const mainLight = new THREE.DirectionalLight(0xffffff, 2.8);
  mainLight.position.set(4, 5, 6);
  scene.add(mainLight);

  const greenLight = new THREE.PointLight(0x22c55e, 4, 10);
  greenLight.position.set(-2, 1, 3.5);
  scene.add(greenLight);

  const blueLight = new THREE.PointLight(0x3b82f6, 1.8, 10);
  blueLight.position.set(2.5, -1.5, 3);
  scene.add(blueLight);

  const fillLight = new THREE.DirectionalLight(0x4ade80, 0.7);
  fillLight.position.set(-4, -2, -3);
  scene.add(fillLight);

  // ===== PARTICLES =====
  const pCount = 90;
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    pPos[i * 3] = (Math.random() - 0.5) * 9;
    pPos[i * 3 + 1] = (Math.random() - 0.5) * 6;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 5 - 1.5;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const particles = new THREE.Points(
    pGeo,
    new THREE.PointsMaterial({ color: 0x22c55e, size: 0.02, transparent: true, opacity: 0.35 })
  );
  scene.add(particles);

  // ===== MOUSE TRACKING =====
  let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    mouseY = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
  });

  // ===== RESIZE =====
  function onResize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  window.addEventListener('resize', onResize);

  // ===== ANIMATE =====
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.01;

    targetX += (mouseX - targetX) * 0.045;
    targetY += (mouseY - targetY) * 0.045;

    cardGroup.rotation.y = targetX * 0.42 + Math.sin(t * 0.38) * 0.07;
    cardGroup.rotation.x = targetY * 0.28 + Math.cos(t * 0.28) * 0.04;
    cardGroup.position.y = Math.sin(t * 0.5) * 0.13;

    greenLight.position.x = Math.sin(t * 0.65) * 3;
    greenLight.position.y = Math.cos(t * 0.48) * 1.8;
    greenLight.intensity = 3.2 + Math.sin(t * 1.1) * 1.0;

    particles.rotation.y = t * 0.025;
    particles.rotation.x = t * 0.012;

    renderer.render(scene, camera);
  }

  animate();
}

document.addEventListener('DOMContentLoaded', initThreeCard);