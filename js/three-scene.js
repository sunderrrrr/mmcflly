function initThreeCard() {
  const canvas = document.getElementById('card-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const W = canvas.clientWidth || 420;
  const H = canvas.clientHeight || 300;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true; // Включаем тени для модели

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
  camera.position.set(0, 0, 6.5);

  // ROOT GROUP — всё будет дочерним элементом для единого движения
  const cardGroup = new THREE.Group();
  scene.add(cardGroup);

  // ===== ОПРЕДЕЛЕНИЕ ТИПА УСТРОЙСТВА =====
  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      || window.innerWidth <= 768; // Также проверяем ширину экрана
  }

  const isMobile = isMobileDevice();
  const modelScale = isMobile ? 1.5 : 3; // Масштаб модели: телефон - 2, ПК - 3
  console.log(`Устройство: ${isMobile ? 'Мобильное' : 'ПК'}, масштаб модели: ${modelScale}`);

  // ===== ЗАГРУЗКА ВНЕШНЕЙ МОДЕЛИ =====
  let externalModel = null;

  // Инициализируем загрузчик GLTF (самый популярный формат)
  // Убедитесь, что вы подключили GLTFLoader в HTML:
  // <script type="importmap">
  //   {
  //     "imports": {
  //       "three": "https://unpkg.com/three@0.128.0/build/three.module.js",
  //       "three/addons/": "https://unpkg.com/three@0.128.0/examples/jsm/"
  //     }
  //   }
  // </script>

  import('three/addons/loaders/GLTFLoader.js').then(({ GLTFLoader }) => {
    const loader = new GLTFLoader();

    // Замените URL на путь к вашей модели
    const modelUrl = 'img/card.glb'; // или .gltf

    loader.load(
      modelUrl,
      (gltf) => {
        externalModel = gltf.scene;

        // Настройка модели
        externalModel.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            // Если нужно применить дополнительные текстуры
            if (child.material) {
              // Настройка материалов, если необходимо
              child.material.roughness = 0.7;
              child.material.metalness = 0.5;
            }
          }
        });

        // Масштабирование модели под размер сцены с учетом типа устройства
        const box = new THREE.Box3().setFromObject(externalModel);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);

        // Используем переменную modelScale для масштабирования
        const baseScale = modelScale / maxDim;
        externalModel.scale.set(baseScale, baseScale, baseScale);

        // Центрируем модель
        const center = box.getCenter(new THREE.Vector3());
        externalModel.position.sub(center);

        // Дополнительная корректировка позиции для мобильных устройств
        if (isMobile) {
          // Можно немного сместить модель для лучшего отображения на мобильных
          externalModel.position.y += 0.1;
        }

        cardGroup.add(externalModel);

        // Добавляем небольшой лог для отладки
        console.log(`Модель загружена и отмасштабирована с коэффициентом ${baseScale.toFixed(3)}`);
      },
      (xhr) => {
        // Прогресс загрузки
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      (error) => {
        console.error('Ошибка загрузки модели:', error);
        // Фолбэк: создаем простую карту, если модель не загрузилась
        createFallbackCard();
      }
    );
  }).catch((err) => {
    console.error('GLTFLoader не доступен:', err);
    createFallbackCard();
  });

  // Фолбэк на случай ошибки загрузки
  function createFallbackCard() {
    const geometry = new THREE.BoxGeometry(3.0, 1.89, 0.055);
    const material = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      metalness: 0.5,
      roughness: 0.3
    });
    const fallbackCard = new THREE.Mesh(geometry, material);
    fallbackCard.castShadow = true;
    fallbackCard.receiveShadow = true;
    cardGroup.add(fallbackCard);

    // Также масштабируем фолбэк-карту в зависимости от устройства
    const fallbackScale = isMobile ? 0.8 : 1;
    fallbackCard.scale.set(fallbackScale, fallbackScale, fallbackScale);
  }

  // ===== СВЕТ =====
  scene.add(new THREE.AmbientLight(0x10101e, 1.4));

  const mainLight = new THREE.DirectionalLight(0xffffff, 2.8);
  mainLight.position.set(4, 5, 6);
  mainLight.castShadow = true;
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

  // Дополнительный свет для мобильных устройств для лучшей видимости
  if (isMobile) {
    const mobileFillLight = new THREE.PointLight(0x22c55e, 1.5, 8);
    mobileFillLight.position.set(0, 1, 2);
    scene.add(mobileFillLight);
  }

  // ===== ЧАСТИЦЫ =====
  // На мобильных устройствах уменьшаем количество частиц для производительности
  const pCount = isMobile ? 45 : 90;
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
    new THREE.PointsMaterial({ color: 0x22c55e, size: isMobile ? 0.015 : 0.02, transparent: true, opacity: 0.35 })
  );
  scene.add(particles);

  // ===== ОТСЛЕЖИВАНИЕ МЫШИ =====
  let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;

  // На мобильных устройствах отключаем или уменьшаем эффект отслеживания мыши
  if (!isMobile) {
    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    });
  } else {
    // Для мобильных используем гироскоп если доступен
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (e) => {
        if (e.beta && e.gamma) {
          // Используем наклон устройства для управления
          mouseX = Math.max(-1, Math.min(1, e.gamma / 45)); // gamma: -90 до 90
          mouseY = Math.max(-1, Math.min(1, e.beta / 45));  // beta: -90 до 90
        }
      });
    }
  }

  // ===== АДАПТАЦИЯ К РАЗМЕРУ =====
  function onResize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);

    // При изменении размера экрана проверяем, не изменился ли тип устройства
    const newIsMobile = window.innerWidth <= 768;
    if (newIsMobile !== isMobile && externalModel) {
      // Если тип устройства изменился, пересчитываем масштаб
      const newScale = newIsMobile ? 2 : 3;
      const box = new THREE.Box3().setFromObject(externalModel);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const baseScale = newScale / maxDim;
      externalModel.scale.set(baseScale, baseScale, baseScale);
    }
  }
  window.addEventListener('resize', onResize);

  // ===== АНИМАЦИЯ =====
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.01;

    targetX += (mouseX - targetX) * 0.045;
    targetY += (mouseY - targetY) * 0.045;

    // На мобильных устройствах уменьшаем амплитуду движения
    const rotationAmplitude = isMobile ? 0.5 : 1;
    const positionAmplitude = isMobile ? 0.7 : 1;

    cardGroup.rotation.y = (targetX * 0.42 + Math.sin(t * 0.38) * 0.07) * rotationAmplitude;
    cardGroup.rotation.x = (targetY * 0.28 + Math.cos(t * 0.28) * 0.04) * rotationAmplitude;
    cardGroup.position.y = Math.sin(t * 0.5) * 0.13 * positionAmplitude;

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