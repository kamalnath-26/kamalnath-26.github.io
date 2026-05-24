const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const scrollItems = document.querySelectorAll('.animate-up');
const faqItems = document.querySelectorAll('.faq-item');
const contactForm = document.querySelector('.contact-form');
const formSuccess = document.querySelector('.form-success');
const hero3d = document.querySelector('#hero3d');
const hero3dCanvas = document.querySelector('#hero3dCanvas');
const preloader = document.querySelector('.preloader');
const projectTabs = document.querySelectorAll('[data-project-tab]');
const projectPanels = document.querySelectorAll('[data-project-panel]');
let formMessageTimer;

const buildContactMessage = ({ name, phone, email, purpose, message }) => `New portfolio enquiry

Name: ${name}
Phone: ${phone}
Email: ${email}
Purpose: ${purpose}
WhatsApp: 8248886878
Message: ${message}`;

const buildContactMailto = (message) => {
  const subject = encodeURIComponent('New Portfolio Enquiry');
  const body = encodeURIComponent(message);

  return `mailto:kamalnath2603@gmail.com?subject=${subject}&body=${body}`;
};

const buildGmailComposeUrl = (message) => {
  const subject = encodeURIComponent('New Portfolio Enquiry');
  const body = encodeURIComponent(message);

  return `https://mail.google.com/mail/?view=cm&fs=1&to=kamalnath2603@gmail.com&su=${subject}&body=${body}`;
};

const buildWhatsAppUrl = (message) => `https://wa.me/918248886878?text=${encodeURIComponent(message)}`;

const hidePreloader = () => {
  if (!preloader) {
    document.body.classList.remove('is-loading');
    return;
  }

  preloader.classList.add('hide');
  document.body.classList.remove('is-loading');

  setTimeout(() => {
    preloader.remove();
  }, 550);
};

window.addEventListener('load', () => {
  setTimeout(hidePreloader, 900);
});

navToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

const activateProjectTab = (selectedTab, shouldUpdateHash = false) => {
  const activeTab = [...projectTabs].find((tab) => tab.dataset.projectTab === selectedTab);

  if (!activeTab) {
    return;
  }

  projectTabs.forEach((item) => {
    const isActive = item === activeTab;
    item.classList.toggle('active', isActive);
    item.setAttribute('aria-selected', String(isActive));
  });

  projectPanels.forEach((panel) => {
    panel.classList.toggle('active', panel.dataset.projectPanel === selectedTab);
  });

  if (shouldUpdateHash) {
    history.replaceState(null, '', `#${selectedTab}`);
  }
};

projectTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    activateProjectTab(tab.dataset.projectTab, true);
  });
});

if (projectTabs.length && window.location.hash) {
  activateProjectTab(window.location.hash.slice(1));
}

const observerOptions = {
  threshold: 0.15,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

scrollItems.forEach((item) => observer.observe(item));

faqItems.forEach((item) => {
  item.addEventListener('click', () => {
    const panel = item.nextElementSibling;
    const isOpen = !item.classList.contains('active');

    faqItems.forEach((otherItem) => {
      otherItem.classList.remove('active');
      otherItem.querySelector('b').textContent = '+';
      otherItem.nextElementSibling?.classList.remove('open');
    });

    if (isOpen) {
      item.classList.add('active');
      item.querySelector('b').textContent = '-';
      panel?.classList.add('open');
    }
  });
});

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }

  const formData = new FormData(contactForm);
  const name = formData.get('name');
  const phone = formData.get('phone');
  const email = formData.get('email');
  const purpose = formData.get('purpose');
  const message = formData.get('message');
  const contactMessage = buildContactMessage({ name, phone, email, purpose, message });
  const gmailUrl = buildGmailComposeUrl(contactMessage);
  const mailtoUrl = buildContactMailto(contactMessage);
  const whatsappUrl = buildWhatsAppUrl(contactMessage);

  const submitButton = contactForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = 'Opening...';
  clearTimeout(formMessageTimer);
  formSuccess?.classList.remove('show');

  window.open(gmailUrl, '_blank', 'noopener');
  formSuccess.innerHTML = `Email compose opened. <a href="${mailtoUrl}">Open mail app</a> or <a href="${whatsappUrl}" target="_blank" rel="noopener">send on WhatsApp</a>.`;
  formSuccess?.classList.add('show');
  contactForm.reset();

  formMessageTimer = setTimeout(() => {
    formSuccess?.classList.remove('show');
  }, 12000);

  submitButton.disabled = false;
  submitButton.innerHTML = 'Submit <span>&rarr;</span>';
});

const initHero3d = () => {
  if (!hero3d || !hero3dCanvas || !window.THREE) {
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({
    canvas: hero3dCanvas,
    antialias: true,
    alpha: true,
  });
  const pointer = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };
  const clock = new THREE.Clock();
  const workspace = new THREE.Group();
  const floaters = new THREE.Group();

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  if (THREE.SRGBColorSpace) {
    renderer.outputColorSpace = THREE.SRGBColorSpace;
  }
  camera.position.set(0, 2.2, 9.2);
  camera.lookAt(0, 0.35, 0);

  scene.add(new THREE.AmbientLight(0xffffff, 1.45));

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.15);
  keyLight.position.set(4.5, 6, 6);
  scene.add(keyLight);

  const amberLight = new THREE.PointLight(0xffad18, 6, 12);
  amberLight.position.set(-3.8, 2.6, 3.4);
  scene.add(amberLight);

  const greenLight = new THREE.PointLight(0x2f4f35, 4.5, 10);
  greenLight.position.set(3.8, -0.8, 2.2);
  scene.add(greenLight);

  const createBox = (width, height, depth, color, position, rotation = [0, 0, 0], radius = 0.04) => {
    const geometry = new THREE.BoxGeometry(width, height, depth, 4, 4, 4);
    const material = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.48,
      metalness: 0.08,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.rotation.set(...rotation);
    mesh.userData.radius = radius;
    return mesh;
  };

  const base = createBox(5.25, 0.22, 3.2, 0x253f2b, [0, -1.05, 0.35], [0, 0, 0]);
  const keyboard = createBox(3.8, 0.08, 1.75, 0xf4f4f3, [0, -0.86, 0.2], [0, 0, 0]);
  const trackpad = createBox(1.1, 0.09, 0.55, 0xd9ddd6, [0, -0.78, 1.05], [0, 0, 0]);
  const screen = createBox(4.65, 2.7, 0.18, 0x2f4f35, [0, 0.72, -1.04], [-0.18, 0, 0]);
  const screenFace = createBox(4.22, 2.22, 0.08, 0x173820, [0, 0.75, -0.9], [-0.18, 0, 0]);
  const hinge = createBox(4.75, 0.15, 0.18, 0xffad18, [0, -0.63, -1.1], [0, 0, 0]);

  workspace.add(base, keyboard, trackpad, screen, screenFace, hinge);

  const codeColors = [0xffad18, 0xffffff, 0x8fb896, 0xffffff, 0xffad18];
  const codeWidths = [2.6, 1.8, 3.15, 2.2, 1.35];

  codeWidths.forEach((width, index) => {
    const line = createBox(width, 0.08, 0.08, codeColors[index], [-0.38, 1.42 - index * 0.34, -0.78], [-0.18, 0, 0]);
    line.position.x = -1.55 + width / 2;
    workspace.add(line);
  });

  const glowRing = new THREE.Mesh(
    new THREE.TorusGeometry(2.95, 0.035, 16, 96),
    new THREE.MeshStandardMaterial({
      color: 0xffad18,
      emissive: 0xffad18,
      emissiveIntensity: 0.35,
      roughness: 0.35,
    })
  );
  glowRing.position.set(0, 0.15, -0.42);
  glowRing.rotation.set(Math.PI / 2.25, 0, 0);
  workspace.add(glowRing);

  const cubeData = [
    ['Py', 0xffad18, [-2.85, 1.35, 0.85]],
    ['API', 0xffffff, [2.85, 1.02, 0.55]],
    ['DB', 0x2f4f35, [2.25, -0.65, 1.3]],
    ['JS', 0xffffff, [-2.45, -0.42, 1.35]],
  ];

  cubeData.forEach(([label, color, position], index) => {
    const cube = createBox(0.72, 0.72, 0.72, color, position, [0.28, 0.42, 0.12]);
    cube.userData.floatOffset = index * 0.9;
    cube.userData.baseY = position[1];
    cube.userData.spin = 0.35 + index * 0.08;
    floaters.add(cube);

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    context.fillStyle = color === 0x2f4f35 ? '#ffffff' : '#2f4f35';
    context.font = '700 72px Poppins, Arial, sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(label, 128, 132);

    const texture = new THREE.CanvasTexture(canvas);
    const badge = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }));
    badge.scale.set(0.82, 0.82, 1);
    badge.position.copy(cube.position);
    badge.position.z += 0.42;
    badge.userData.cube = cube;
    floaters.add(badge);
  });

  scene.add(workspace, floaters);

  const resize = () => {
    const { width, height } = hero3d.getBoundingClientRect();
    const size = Math.max(1, Math.min(width, height));
    camera.aspect = width / height || 1;
    camera.updateProjectionMatrix();
    renderer.setSize(width || size, height || size, false);
  };

  const handlePointerMove = (event) => {
    const bounds = hero3d.getBoundingClientRect();
    target.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    target.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
  };

  const handlePointerLeave = () => {
    target.x = 0;
    target.y = 0;
  };

  hero3d.addEventListener('pointermove', handlePointerMove);
  hero3d.addEventListener('pointerleave', handlePointerLeave);
  window.addEventListener('resize', resize);
  resize();

  const render = () => {
    const elapsed = clock.getElapsedTime();

    pointer.x += (target.x - pointer.x) * 0.06;
    pointer.y += (target.y - pointer.y) * 0.06;

    workspace.rotation.y = pointer.x * 0.22 + Math.sin(elapsed * 0.35) * 0.06;
    workspace.rotation.x = -0.08 + pointer.y * 0.12;
    floaters.rotation.y = pointer.x * 0.12;
    glowRing.rotation.z = elapsed * 0.16;

    floaters.children.forEach((child) => {
      if (child.isMesh) {
        child.position.y = child.userData.baseY + Math.sin(elapsed * 1.4 + child.userData.floatOffset) * 0.12;
        child.rotation.x += 0.006;
        child.rotation.y += 0.008 * child.userData.spin;
      }

      if (child.isSprite && child.userData.cube) {
        child.position.copy(child.userData.cube.position);
        child.position.z += 0.42;
      }
    });

    renderer.render(scene, camera);

    if (!prefersReducedMotion) {
      requestAnimationFrame(render);
    }
  };

  render();
};

initHero3d();
