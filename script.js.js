(function() {
  // ----- LOADER -----
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
      loader.classList.add('loader-hidden');
    }, 900);
  });

  // ----- CANVAS PARTICLES (animated background) -----
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2.2 + 0.8;
      this.speedX = (Math.random() - 0.5) * 0.7;
      this.speedY = (Math.random() - 0.5) * 0.7;
      this.opacity = Math.random() * 0.5 + 0.15;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > width) this.speedX *= -1;
      if (this.y < 0 || this.y > height) this.speedY *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(42, 212, 227, ${this.opacity})`;
      ctx.shadowColor = '#2ad4e3';
      ctx.shadowBlur = 8;
      ctx.fill();
    }
  }

  function initParticles(count = 70) {
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }
  initParticles();

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // ----- COUNTER ANIMATION (Intersection Observer) -----
  const counterElements = document.querySelectorAll('.counter');
  const animateCounter = (el) => {
    const target = +el.getAttribute('data-target');
    if (!target || el.classList.contains('counted')) return;
    el.classList.add('counted');
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const update = () => {
      current += step;
      if (current < target) {
        el.textContent = Math.floor(current).toLocaleString() + '+';
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString() + '+';
      }
    };
    update();
  };

  // ----- SCROLL REVEAL (Intersection Observer) -----
  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // trigger counter if inside
        const counter = entry.target.querySelector('.counter');
        if (counter) animateCounter(counter);
      }
    });
  }, { threshold: 0.2, rootMargin: "0px 0px -50px 0px" });

  revealElements.forEach(el => observer.observe(el));

  // Also observe counters directly if not wrapped in reveal
  document.querySelectorAll('.counter').forEach(counter => {
    const parentReveal = counter.closest('.reveal');
    if (!parentReveal) {
      const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) animateCounter(counter); });
      }, { threshold: 0.5 });
      counterObserver.observe(counter);
    }
  });

  // ----- TESTIMONIAL DATA (mixed Bangla + Banglish, realistic) -----
  const testimonials = [
    { name: "Rahim Uddin", location: "Rangpur, Bangladesh", text: "আমি মাত্র ২৫ হাজার টাকা জামানত দিয়ে ৫ লক্ষ টাকা লোন নিয়েছি সাফল্য সমবায় সমিতি থেকে। খুব বিশ্বস্ত প্রতিষ্ঠান।", rating: 5 },
    { name: "Sharmin Akter", location: "Dhaka, Bangladesh", text: "Alhamdulillah, process onek smooth chilo. Ami Khulna theke apply kore very fast approval paisi. সবাইকে recommend করবো।", rating: 5 },
    { name: "Karim Mia", location: "Thakurgaon", text: "প্রথমে ভয় পেয়েছিলাম, কিন্তু সব কিছু legally & transparently complete হয়েছে। সত্যিই নিরাপদ।", rating: 5 },
    { name: "Nasima Begum", location: "Chattogram", text: "Dhaka theke online e installment dite partasi — very helpful system. সময় মত লোন পেয়েছি।", rating: 5 },
    { name: "Sohag Hossain", location: "Khulna", text: "আমি ছোট ব্যবসার জন্য লোন নিয়েছিলাম, এখন business অনেক ভালো চলছে। Safollo Somobay Somiti trusted।", rating: 5 },
    { name: "Jannatul Ferdous", location: "Rangpur", text: "Safollo Somobay Somiti amar life change kore dise. Ami sobai ke bolbo Safollo theke loan nite.", rating: 5 },
    { name: "Rafiq Islam", location: "Dinajpur", text: "Customer support onek bhalo chilo, WhatsApp e sob help paisi. খুব দ্রুত service।", rating: 4 },
    { name: "Momena Khatun", location: "Bogura", text: "আমি আগে অন্য জায়গায় প্রতারিত হয়েছিলাম, কিন্তু এখানে সবকিছু secure and trusted লেগেছে। thank you Safollo.", rating: 5 },
    { name: "Tanvir Ahmed", location: "Sylhet", text: "Sottiei Safollo Somobay Somitir loan onek valo, Kom interest, shudhu oder joma ta beshi dite hoy loan er age baki sob perfect.", rating: 5 },
    { name: "Halima Akhter", location: "Rajshahi", text: "৪ লাখের বেশি happy member dekhe confidence peyechilam. eijonnoi tader ke orgim taka diye loan nichi. kintu interesting fact hocche ami abar joma takao ferot paichi।", rating: 5 }
  ];

  const container = document.getElementById('testimonialContainer');
  function renderTestimonials() {
    if (!container) return;
    container.innerHTML = testimonials.map(t => `
      <div class="testimonial-card reveal">
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
          <div style="width: 50px; height: 50px; background: linear-gradient(145deg, #2ad4e3, #7b5ce7); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">${t.name.charAt(0)}</div>
          <div>
            <h4 style="margin:0;">${t.name}</h4>
            <small style="color:#a0afc7;">${t.location}</small>
          </div>
        </div>
        <div class="star-rating">${'★'.repeat(t.rating)}</div>
        <p style="margin-top: 0.8rem; font-style: italic; color: #e2e8f0;">“${t.text}”</p>
      </div>
    `).join('');
    // re-observe newly added reveals
    document.querySelectorAll('.testimonial-card.reveal').forEach(el => observer.observe(el));
  }
  renderTestimonials();

  // Additional ripple effect for buttons
  document.querySelectorAll('.btn-glow').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.style.position = 'absolute';
      ripple.style.borderRadius = '50%';
      ripple.style.background = 'rgba(255,255,255,0.3)';
      ripple.style.width = '20px';
      ripple.style.height = '20px';
      ripple.style.left = `${e.clientX - btn.getBoundingClientRect().left - 10}px`;
      ripple.style.top = `${e.clientY - btn.getBoundingClientRect().top - 10}px`;
      ripple.style.animation = 'ripple 0.6s linear';
      ripple.style.pointerEvents = 'none';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // inject ripple keyframe dynamically
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `@keyframes ripple { to { transform: scale(4); opacity:0; } }`;
  document.head.appendChild(styleSheet);
})();