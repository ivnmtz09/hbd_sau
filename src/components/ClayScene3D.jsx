import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ClayScene3D = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. ESCENA, CÁMARA Y RENDERIZADOR
    const scene = new THREE.Scene();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // 2. ILUMINACIÓN ESTILO ESTUDIO CLAYMORPHIC
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff1e6, 2.2);
    keyLight.position.set(5, 8, 8);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe0e7ff, 1.2);
    fillLight.position.set(-6, -3, 5);
    scene.add(fillLight);

    const pinkRimLight = new THREE.PointLight(0xf472b6, 3.5, 30);
    pinkRimLight.position.set(-5, 4, 3);
    scene.add(pinkRimLight);

    const yellowRimLight = new THREE.PointLight(0xfde047, 3.0, 30);
    yellowRimLight.position.set(6, -4, 4);
    scene.add(yellowRimLight);

    // 3. MATERIALES DE PLASTILINA MATE (CLAY)
    const createClayMaterial = (color) => {
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        roughness: 0.65,
        metalness: 0.08,
        flatShading: false,
      });
    };

    const pinkClay = createClayMaterial('#f472b6');
    const purpleClay = createClayMaterial('#a855f7');
    const creamClay = createClayMaterial('#fef3c7');
    const yellowClay = createClayMaterial('#fde047');
    const cyanClay = createClayMaterial('#38bdf8');
    const whiteClay = createClayMaterial('#f8fafc');
    const flameClay = new THREE.MeshBasicMaterial({ color: '#fbbf24' });

    // 4. GRUPO PRINCIPAL: PASTEL DE CUMPLEAÑOS 3D CLAY
    const cakeGroup = new THREE.Group();

    // Base inferior del pastel
    const baseGeo = new THREE.CylinderGeometry(2.3, 2.3, 1.2, 32);
    const baseMesh = new THREE.Mesh(baseGeo, pinkClay);
    baseMesh.position.y = -0.6;
    cakeGroup.add(baseMesh);

    // Capa de glaseado intermedio
    const frostingTorus = new THREE.TorusGeometry(2.32, 0.18, 16, 32);
    const frostingMesh = new THREE.Mesh(frostingTorus, whiteClay);
    frostingMesh.rotation.x = Math.PI / 2;
    frostingMesh.position.y = 0;
    cakeGroup.add(frostingMesh);

    // Piso superior del pastel
    const topTierGeo = new THREE.CylinderGeometry(1.5, 1.5, 1.0, 32);
    const topTierMesh = new THREE.Mesh(topTierGeo, creamClay);
    topTierMesh.position.y = 0.5;
    cakeGroup.add(topTierMesh);

    // Vela Clay
    const candleGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.1, 16);
    const candleMesh = new THREE.Mesh(candleGeo, cyanClay);
    candleMesh.position.y = 1.55;
    cakeGroup.add(candleMesh);

    // Llama de la vela
    const flameGeo = new THREE.ConeGeometry(0.18, 0.45, 16);
    const flameMesh = new THREE.Mesh(flameGeo, flameClay);
    flameMesh.position.y = 2.25;
    cakeGroup.add(flameMesh);

    // Pequeñas gotas decorativas de plastilina
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const dropGeo = new THREE.SphereGeometry(0.14, 16, 16);
      const dropMesh = new THREE.Mesh(dropGeo, yellowClay);
      dropMesh.position.set(Math.cos(angle) * 1.52, 1.0, Math.sin(angle) * 1.52);
      cakeGroup.add(dropMesh);
    }

    // Posición inicial del pastel en la escena
    cakeGroup.position.set(0, -0.2, 0);
    cakeGroup.rotation.x = 0.25;
    scene.add(cakeGroup);

    // 5. OBJETOS FLOTANTES CLAY (Globos, estrellas, donas y gemas)
    const floatingObjects = [];

    // Globo Rosa
    const balloon1 = new THREE.Mesh(new THREE.SphereGeometry(0.85, 24, 24), pinkClay);
    balloon1.position.set(-4.5, 2.5, -1);
    scene.add(balloon1);
    floatingObjects.push({ mesh: balloon1, speed: 0.015, offset: 0, rotSpeed: 0.01 });

    // Globo Púrpura
    const balloon2 = new THREE.Mesh(new THREE.SphereGeometry(0.7, 24, 24), purpleClay);
    balloon2.position.set(4.8, 1.8, -2);
    scene.add(balloon2);
    floatingObjects.push({ mesh: balloon2, speed: 0.012, offset: 2, rotSpeed: 0.008 });

    // Dona de plastilina (Torus)
    const donut = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.22, 16, 24), yellowClay);
    donut.position.set(-4.2, -2.4, 1);
    scene.add(donut);
    floatingObjects.push({ mesh: donut, speed: 0.018, offset: 4, rotSpeed: 0.02 });

    // Esfera suave Cyan
    const sphereCyan = new THREE.Mesh(new THREE.SphereGeometry(0.5, 20, 20), cyanClay);
    sphereCyan.position.set(4.5, -2.6, 0);
    scene.add(sphereCyan);
    floatingObjects.push({ mesh: sphereCyan, speed: 0.014, offset: 1.5, rotSpeed: 0.012 });

    // Estrellas / Icosaedros Clay
    const star1 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.42, 0), yellowClay);
    star1.position.set(2.8, 3.8, 1);
    scene.add(star1);
    floatingObjects.push({ mesh: star1, speed: 0.02, offset: 3, rotSpeed: 0.025 });

    const star2 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.35, 0), pinkClay);
    star2.position.set(-2.5, -3.2, 0.5);
    scene.add(star2);
    floatingObjects.push({ mesh: star2, speed: 0.016, offset: 5, rotSpeed: 0.018 });

    // 6. PARALAJE CON MOUSE, TOUCH Y SCROLL
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let scrollY = window.scrollY || 0;
    let targetScrollY = 0;

    const handlePointerMove = (e) => {
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      mouseX = (clientX / window.innerWidth) * 2 - 1;
      mouseY = -(clientY / window.innerHeight) * 2 + 1;
    };

    const handleScroll = () => {
      scrollY = window.scrollY || 0;
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 7. RESPONSIVIDAD
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // 8. BUCLE DE ANIMACIÓN
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Suavizar scroll con lerp
      targetScrollY += (scrollY - targetScrollY) * 0.05;
      const scrollInfluence = targetScrollY * 0.001;

      // Suave rotación continua del pastel + influencia del scroll
      cakeGroup.rotation.y = elapsedTime * 0.35 + scrollInfluence * 1.5;
      cakeGroup.rotation.x = 0.25 + Math.sin(scrollInfluence) * 0.08;
      cakeGroup.position.y = -0.2 + Math.sin(elapsedTime * 1.5) * 0.15 - Math.min(scrollInfluence * 0.8, 1.5);

      // Parpadeo sutil de la llama
      flameMesh.scale.y = 1 + Math.sin(elapsedTime * 12) * 0.12;
      flameMesh.scale.x = 1 + Math.cos(elapsedTime * 10) * 0.08;

      // Animación de los objetos flotantes con dinamismo de scroll
      floatingObjects.forEach((item, idx) => {
        const factor = idx % 2 === 0 ? 1 : -1;
        item.mesh.position.y += Math.sin(elapsedTime * 2 + item.offset) * 0.005;
        item.mesh.rotation.x += item.rotSpeed;
        item.mesh.rotation.y += item.rotSpeed * 1.2 + scrollInfluence * 0.02 * factor;
      });

      // Efecto Parallax interactivo (Lerp suave)
      targetX += (mouseX * 0.7 - targetX) * 0.05;
      targetY += (mouseY * 0.5 - targetY) * 0.05;

      camera.position.x = targetX;
      camera.position.y = targetY - Math.min(scrollInfluence * 0.3, 0.8);
      camera.lookAt(0, -Math.min(scrollInfluence * 0.3, 0.8), 0);

      renderer.render(scene, camera);
    };

    animate();

    // 9. LIMPIEZA TOTAL EN DESMONTAJE (Previene memory leaks)
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((mat) => mat.dispose());
          } else {
            object.material.dispose();
          }
        }
      });

      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-none -z-5 overflow-hidden"
      style={{ opacity: 0.85 }}
    />
  );
};

export default ClayScene3D;
