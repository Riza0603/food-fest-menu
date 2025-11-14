// Helper — wait for DOM
document.addEventListener('DOMContentLoaded', function () {
  // Entrance animation for hero title
  const title = document.querySelector('.title');
  if (title) {
    title.style.transition = 'transform .9s cubic-bezier(.2,.9,.2,1), opacity .9s';
    requestAnimationFrame(()=> {
      title.style.transform = 'translateY(0)';
      title.style.opacity = '1';
    });
  }

  // Gentle parallax move background on mouse move (desktop)
  const heroBg = document.querySelector('.hero-bg');
  document.addEventListener('mousemove', e => {
    if (!heroBg) return;
    const x = (e.clientX - window.innerWidth/2) / 70;
    const y = (e.clientY - window.innerHeight/2) / 70;
    heroBg.style.transform = `translate(${x}px, ${y}px) scale(1.03)`;
  });

  // Lazy-load images in menu
  const lazyImgs = document.querySelectorAll('img.lazy');
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      img.src = img.dataset.src;
      img.onload = () => img.classList.add('loaded');
      obs.unobserve(img);
    });
  }, {rootMargin: '120px'});
  lazyImgs.forEach(i => io.observe(i));

  // Stagger reveal cards
  const cards = document.querySelectorAll('.card');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(ent => {
      if (ent.isIntersecting) {
        const el = ent.target;
        const index = Array.from(cards).indexOf(el);
        setTimeout(()=> el.classList.add('visible'), index * 80);
        revealObserver.unobserve(el);
      }
    });
  }, {threshold: 0.15});
  cards.forEach(c => revealObserver.observe(c));

  // VanillaTilt on cards (if available)
  if (window.VanillaTilt) {
    const tiltTargets = document.querySelectorAll('.card');
    VanillaTilt.init(tiltTargets, {
      max: 10,
      speed: 400,
      glare: true,
      'max-glare': 0.18,
      scale: 1.02
    });
  }

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCaption = document.getElementById('lbCaption');
  const lbClose = document.getElementById('lbClose');
  document.querySelectorAll('.card').forEach(card => {
card.addEventListener("click", () => {

    const img = card.querySelector("img");
    const rect = img.getBoundingClientRect();

    // 1. CREATE CLONE
    const clone = img.cloneNode(true);
    clone.classList.add("morph-clone");

    // 2. INITIAL POSITION = SAME AS CARD IMAGE
    clone.style.top = rect.top + "px";
    clone.style.left = rect.left + "px";
    clone.style.width = rect.width + "px";
    clone.style.height = rect.height + "px";

    document.body.appendChild(clone);

    // BUMP ANIMATION
    card.classList.add("clicked");
    setTimeout(() => card.classList.remove("clicked"), 250);

    // 3. FORCE REPAINT so browser "applies" initial position first
    clone.getBoundingClientRect();   // <--- IMPORTANT

    // 4. FINAL FULLSCREEN SIZE
    const finalWidth = window.innerWidth * 0.8;
    const finalHeight = window.innerHeight * 0.8;
    const finalX = (window.innerWidth - finalWidth) / 2;
    const finalY = (window.innerHeight - finalHeight) / 2;

    // 5. APPLY FINAL POSITION (ANIMATION STARTS NOW)
    clone.style.transition = "all 0.45s cubic-bezier(.2,.8,.2,1)";
    clone.style.top = finalY + "px";
    clone.style.left = finalX + "px";
    clone.style.width = finalWidth + "px";
    clone.style.height = finalHeight + "px";

    // 6. AFTER ANIMATION ENDS → OPEN REAL LIGHTBOX
    setTimeout(() => {
        lbImg.src = img.src || img.dataset.src;
        lbCaption.textContent =
            card.dataset.title || card.querySelector("h3").textContent;

        lightbox.style.display = "flex";
        document.body.style.overflow = "hidden";

        clone.remove();
    }, 460);
});


  });
  function closeLB(){ lightbox.style.display = 'none'; document.body.style.overflow = ''; }
  if (lbClose) lbClose.addEventListener('click', closeLB);
  lightbox.addEventListener('click', (e)=> { if (e.target === lightbox) closeLB(); });

  // Accessibility: dataset key mapping
  document.querySelectorAll('.card').forEach(c => {
    if (!c.dataset.title && c.querySelector('h3')) {
      c.dataset.title = c.querySelector('h3').textContent;
    }
  });
});
