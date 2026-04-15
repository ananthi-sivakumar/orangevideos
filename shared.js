/* ═══════════════════════════════════════════════════════════════
   ORANGE VIDEOS — Global Animation Engine
   shared.js v2.0
═══════════════════════════════════════════════════════════════ */

/* ── 1. SCROLL PROGRESS BAR ───────────────────────────────── */
(function() {
  var bar = document.createElement('div');
  bar.id = 'scroll-progress';
  document.body.prepend(bar);
  window.addEventListener('scroll', function() {
    var pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  }, { passive: true });
})();

/* ── 2. PAGE TRANSITION CURTAIN ──────────────────────────── */
(function() {
  var curtain = document.createElement('div');
  curtain.id = 'page-curtain';
  document.body.prepend(curtain);
  // Reveal on load
  curtain.classList.add('out');
  setTimeout(function() { curtain.style.display = 'none'; }, 500);

  // Intercept all same-origin <a> clicks
  document.addEventListener('click', function(e) {
    var a = e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel') || a.target === '_blank') return;
    e.preventDefault();
    curtain.style.display = 'block';
    curtain.classList.remove('out');
    curtain.classList.add('in');
    setTimeout(function() { window.location.href = href; }, 480);
  });
})();

/* ── 3. MAGNETIC CURSOR ──────────────────────────────────── */
var cursor = document.getElementById('cursor');
var ring   = document.getElementById('cursor-ring');
if (cursor && ring) {
  var mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', function(e) {
    mx = e.clientX; my = e.clientY;
    cursor.style.transform = 'translate(' + (mx-5) + 'px,' + (my-5) + 'px)';
  });

  (function animRing() {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    ring.style.transform = 'translate(' + (rx-18) + 'px,' + (ry-18) + 'px)';
    requestAnimationFrame(animRing);
  })();

  var hoverEls = 'a,button,.btn-primary,.btn-outline,.nav-cta,.logo,.footer-logo,.service-card,.work-card,.stat-box,.wc,.svc-card,.feat-card,.proc-card,.mw-card,.val-card,.perk-card,.job-card,.f-soc,.wa-float,.tilt-card';
  function attachCursorHover(root) {
    root.querySelectorAll(hoverEls).forEach(function(el) {
      el.addEventListener('mouseenter', function() { document.body.classList.add('cursor-hover'); });
      el.addEventListener('mouseleave', function() { document.body.classList.remove('cursor-hover'); });
    });
  }
  attachCursorHover(document);

/* Hide cursor ring when hovering over media */
document.querySelectorAll('img, video, iframe, canvas').forEach(function(el) {
  el.addEventListener('mouseenter', function() {
    if (ring) ring.style.opacity = '0';
  });
  el.addEventListener('mouseleave', function() {
    if (ring) ring.style.opacity = '1';
  });
});

}

/* ── 4. NAV SCROLL ────────────────────────────────────────── */
var nav = document.querySelector('nav');
if (nav) {
  window.addEventListener('scroll', function() {
    nav.classList.toggle('scrolled', window.scrollY > 80);
  }, { passive: true });
}

/* ── 5. SCROLL REVEAL (IntersectionObserver) ─────────────── */
var revealClasses = ['.reveal', '.reveal-left', '.reveal-right', '.reveal-scale', '.reveal-3d'];
var io = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) {
      // Stagger siblings at same level
      var siblings = e.target.parentElement ? e.target.parentElement.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale,.reveal-3d') : [];
      var idx = Array.from(siblings).indexOf(e.target);
      var delay = Math.min(idx * 80, 400);
      setTimeout(function() { e.target.classList.add('visible'); }, delay);
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(revealClasses.join(',')).forEach(function(el) { io.observe(el); });

/* ── 6. 3D TILT CARDS ─────────────────────────────────────── */
function initTiltCards() {
  document.querySelectorAll('.tilt-card').forEach(function(card) {
    // Inject glow layer if not present
    if (!card.querySelector('.tilt-card-glow')) {
      var glow = document.createElement('div');
      glow.className = 'tilt-card-glow';
      card.appendChild(glow);
    }
    var glow = card.querySelector('.tilt-card-glow');

    card.addEventListener('mousemove', function(e) {
      var r   = card.getBoundingClientRect();
      var cx  = r.left + r.width  / 2;
      var cy  = r.top  + r.height / 2;
      var dx  = (e.clientX - cx) / (r.width  / 2);
      var dy  = (e.clientY - cy) / (r.height / 2);
      var rx  = -dy * 10; // rotateX
      var ry  =  dx * 10; // rotateY
      var mx  = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
      var my  = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
      card.style.transform = 'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateZ(6px)';
      card.style.boxShadow = '0 ' + (20 + Math.abs(dy)*20) + 'px ' + (50 + Math.abs(dx)*20) + 'px rgba(0,0,0,0.45), 0 0 0 1px rgba(242,101,34,0.15)';
      glow.style.setProperty('--mx', mx + '%');
      glow.style.setProperty('--my', my + '%');
    });

    card.addEventListener('mouseleave', function() {
      card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateZ(0)';
      card.style.boxShadow = '';
    });
  });
}
initTiltCards();

/* ── 7. COUNTER ANIMATION ─────────────────────────────────── */
function animateCounters() {
  document.querySelectorAll('.stat-n[data-t]').forEach(function(el) {
    var target  = +el.dataset.t;
    var suffix  = el.dataset.s || '';
    var current = 0;
    var step    = target / 70;
    var timer   = setInterval(function() {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current) + suffix;
      if (current >= target) clearInterval(timer);
    }, 18);
  });
}
var statsSection = document.querySelector('.stats-bar');
if (statsSection) {
  var so = new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting) { animateCounters(); so.disconnect(); }
  }, { threshold: 0.3 });
  so.observe(statsSection);
}

/* ── 8. MAGNETIC BUTTONS ──────────────────────────────────── */
document.querySelectorAll('.btn-primary, .btn-outline, .nav-cta').forEach(function(btn) {
  btn.addEventListener('mousemove', function(e) {
    var r  = btn.getBoundingClientRect();
    var dx = (e.clientX - (r.left + r.width  / 2)) * 0.28;
    var dy = (e.clientY - (r.top  + r.height / 2)) * 0.28;
    btn.style.transform = 'translate(' + dx + 'px,' + dy + 'px) translateY(-2px)';
  });
  btn.addEventListener('mouseleave', function() {
    btn.style.transform = '';
  });
});

/* ── 9. SECTION TITLE REVEAL — simple fade-up, no DOM mutation ── */
new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'none';
      e.target.style.filter = 'none';
    }
  });
}, { threshold: 0.15 }).observe && document.querySelectorAll('.section-title').forEach(function(el) {
  // Only animate if not already revealed by a parent reveal class
  if (!el.closest('.reveal') && !el.closest('.reveal-3d') && !el.closest('.reveal-left')) {
    el.style.cssText += 'opacity:0;transform:translateY(24px);transition:opacity 0.7s ease,transform 0.7s cubic-bezier(0.16,1,0.3,1);';
    new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) {
        entries[0].target.style.opacity = '1';
        entries[0].target.style.transform = 'none';
      }
    }, { threshold: 0.15 }).observe(el);
  }
});

/* ── 10. PARALLAX ON PAGE HEROES ─────────────────────────── */
var heroImages = document.querySelectorAll('.hero-video-bg, .page-hero');
if (heroImages.length && window.innerWidth > 900) {
  window.addEventListener('scroll', function() {
    var sy = window.scrollY;
    heroImages.forEach(function(el) {
      if (sy < window.innerHeight * 1.5) {
        el.style.backgroundPositionY = (sy * 0.35) + 'px';
      }
    });
  }, { passive: true });
}

/* ── 11. CARD STAGGER on GRID ENTRANCE ────────────────────── */
var gridObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      var cards = entry.target.querySelectorAll(':scope > *');
      cards.forEach(function(card, i) {
        card.style.opacity    = '0';
        card.style.transform  = 'translateY(28px) scale(0.96)';
        card.style.transition = 'opacity 0.55s ease ' + (i * 70) + 'ms, transform 0.55s cubic-bezier(0.34,1.56,0.64,1) ' + (i * 70) + 'ms';
        setTimeout(function() {
          card.style.opacity   = '';
          card.style.transform = '';
        }, 50);
      });
      gridObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.values-grid,.feat-grid,.process-grid,.mini-work-grid,.perks-grid,.why-grid,.bts-grid,.clients-imgs,.footer-social').forEach(function(g) {
  gridObserver.observe(g);
});

/* ── 12. ORANGE LINE REVEAL ──────────────────────────────── */
new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) {
      e.target.style.animation = 'orangeLineIn 0.7s var(--ease-out,ease) forwards';
    }
  });
}, { threshold: 0.5 }).observe && document.querySelectorAll('.orange-line').forEach(function(el) {
  el.style.width = '0';
  new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting) {
      el.style.transition = 'width 0.7s cubic-bezier(0.16,1,0.3,1)';
      el.style.width = '60px';
    }
  }, { threshold: 0.5 }).observe(el);
});

/* ── 13. FLOATING PARTICLES on HERO (index.html only) ──────  */
if (document.getElementById('bg-canvas')) {
  var canvas = document.getElementById('bg-canvas');
  var ctx    = canvas.getContext('2d');
  var particles = [];
  var W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (var i = 0; i < 55; i++) {
    particles.push({
      x:    Math.random() * W,
      y:    Math.random() * H,
      r:    Math.random() * 1.8 + 0.3,
      vx:   (Math.random() - 0.5) * 0.35,
      vy:   (Math.random() - 0.5) * 0.35,
      o:    Math.random() * 0.55 + 0.1,
      hue:  Math.random() > 0.7 ? 'rgba(242,101,34,' : 'rgba(255,140,0,'
    });
  }

  var mouse = { x: W/2, y: H/2 };
  window.addEventListener('mousemove', function(e) { mouse.x = e.clientX; mouse.y = e.clientY; });

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(function(p) {
      // Gentle mouse attraction
      var dxm = mouse.x - p.x, dym = mouse.y - p.y;
      var dm  = Math.sqrt(dxm*dxm + dym*dym);
      if (dm < 200) {
        p.vx += dxm / dm * 0.015;
        p.vy += dym / dm * 0.015;
      }
      p.x += p.vx; p.y += p.vy;
      p.vx *= 0.99; p.vy *= 0.99;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.hue + p.o + ')';
      ctx.fill();
    });

    // Draw connection lines between nearby particles
    for (var a = 0; a < particles.length; a++) {
      for (var b = a + 1; b < particles.length; b++) {
        var dx = particles[a].x - particles[b].x;
        var dy = particles[a].y - particles[b].y;
        var d  = Math.sqrt(dx*dx + dy*dy);
        if (d < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.strokeStyle = 'rgba(242,101,34,' + (0.12 * (1 - d/110)) + ')';
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(drawParticles);
  }
  drawParticles();
}

/* ── 14. FAQ ACCORDION ─────────────────────────────────────── */
document.querySelectorAll('.faq-item').forEach(function(item) {
  var q = item.querySelector('.faq-q');
  var a = item.querySelector('.faq-a');
  if (!q || !a) return;
  q.addEventListener('click', function() {
    var isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(function(it) {
      it.classList.remove('open');
      var ans = it.querySelector('.faq-a');
      if (ans) ans.style.maxHeight = '0';
    });
    if (!isOpen) {
      item.classList.add('open');
      a.style.maxHeight = a.scrollHeight + 32 + 'px';
    }
  });
});

/* ── 15. SMOOTH ANCHOR SCROLL ──────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(function(a) {
  a.addEventListener('click', function(e) {
    var target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── 16. MOBILE NAV HAMBURGER ─────────────────────────────── */
function toggleMobileNav() {
  var ham  = document.getElementById('hamburger');
  var nav  = document.getElementById('mobile-nav');
  if (!ham || !nav) return;
  var open = nav.classList.toggle('open');
  ham.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
  // Stagger link entrance
  if (open) {
    nav.querySelectorAll('a').forEach(function(a, i) {
      a.style.opacity    = '0';
      a.style.transform  = 'translateX(30px)';
      setTimeout(function() {
        a.style.transition = 'opacity 0.4s ease, transform 0.4s var(--ease-spring), color 0.3s, padding-left 0.3s';
        a.style.opacity    = '1';
        a.style.transform  = '';
      }, i * 60 + 80);
    });
  }
}
// Close mobile nav on outside click or ESC
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    var nav = document.getElementById('mobile-nav');
    var ham = document.getElementById('hamburger');
    if (nav && nav.classList.contains('open')) {
      nav.classList.remove('open');
      if (ham) ham.classList.remove('open');
      document.body.style.overflow = '';
    }
  }
});

/* ── 17. INPUT FOCUS GLOW ─────────────────────────────────── */
document.querySelectorAll('.fg input, .fg select, .fg textarea').forEach(function(el) {
  el.addEventListener('focus', function() {
    this.parentElement.style.transition = 'transform 0.3s var(--ease-spring)';
    this.parentElement.style.transform  = 'translateY(-2px)';
  });
  el.addEventListener('blur', function() {
    this.parentElement.style.transform = '';
  });
});

/* ── 18. FOOTER LINK HOVER ARROW ──────────────────────────── */
document.querySelectorAll('.footer-col a').forEach(function(a) {
  a.addEventListener('mouseenter', function() {
    if (!this.querySelector('.arrow-indicator')) {
      var arr = document.createElement('span');
      arr.className = 'arrow-indicator';
      arr.textContent = ' →';
      arr.style.cssText = 'opacity:0;transition:opacity 0.2s,transform 0.3s;transform:translateX(-6px);display:inline-block;color:var(--orange);';
      this.appendChild(arr);
      requestAnimationFrame(function() {
        arr.style.opacity   = '1';
        arr.style.transform = 'translateX(0)';
      });
    }
  });
  a.addEventListener('mouseleave', function() {
    var arr = this.querySelector('.arrow-indicator');
    if (arr) { arr.style.opacity = '0'; setTimeout(function() { if (arr.parentElement) arr.parentElement.removeChild(arr); }, 200); }
  });
});

/* ── 19. STAT NUMBER GLOW ON HOVER ───────────────────────── */
document.querySelectorAll('.stat-box').forEach(function(box) {
  box.addEventListener('mouseenter', function() {
    var n = this.querySelector('.stat-n');
    if (n) n.style.textShadow = '0 0 40px rgba(242,101,34,0.7)';
  });
  box.addEventListener('mouseleave', function() {
    var n = this.querySelector('.stat-n');
    if (n) n.style.textShadow = '0 0 30px rgba(242,101,34,0.35)';
  });
});

/* ── 20. CTA STRIP PARTICLE BURST on hover ───────────────── */
document.querySelectorAll('.cta-strip').forEach(function(strip) {
  strip.addEventListener('mousemove', function(e) {
    var r = strip.getBoundingClientRect();
    strip.style.setProperty('--mx', ((e.clientX - r.left)/r.width*100).toFixed(1) + '%');
    strip.style.setProperty('--my', ((e.clientY - r.top)/r.height*100).toFixed(1) + '%');
  });
});

/* ═══════════════════════════════════════════════════════════════
   PART 2 — PREMIUM UPGRADES
═══════════════════════════════════════════════════════════════ */

/* ── MOBILE NAV ──────────────────────────────────────────────── */
(function() {
  // Inject hamburger into every nav
  var nav = document.querySelector('nav');
  if (!nav) return;

  // Build hamburger button
  var btn = document.createElement('button');
  btn.className = 'hamburger';
  btn.setAttribute('aria-label', 'Menu');
  btn.innerHTML = '<span></span><span></span><span></span>';
  nav.appendChild(btn);

  // Build mobile overlay nav
  var overlay = document.createElement('div');
  overlay.className = 'mobile-nav';
  var links = [
    ['index.html','Home'], ['about.html','About'],
    ['services.html','Services'], ['work.html','Work'],
    ['careers.html','Careers'], ['contact.html','Contact']
  ];
  links.forEach(function(l) {
    var a = document.createElement('a');
    a.href = l[0]; a.textContent = l[1];
    // Mark active
    if (window.location.pathname.includes(l[0].replace('.html','')) ||
        (l[0]==='index.html' && (window.location.pathname==='/'||window.location.pathname.endsWith('index.html')))) {
      a.classList.add('active');
    }
    overlay.appendChild(a);
  });
  document.body.appendChild(overlay);

  btn.addEventListener('click', function() {
    btn.classList.toggle('open');
    overlay.classList.toggle('open');
    document.body.style.overflow = overlay.classList.contains('open') ? 'hidden' : '';
  });

  overlay.querySelectorAll('a').forEach(function(a) {
    a.addEventListener('click', function() {
      btn.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ── SCROLL-TO-TOP BUTTON ────────────────────────────────────── */
(function() {
  var btn = document.createElement('button');
  btn.id = 'scroll-top';
  btn.innerHTML = '↑';
  btn.title = 'Back to top';
  document.body.appendChild(btn);
  window.addEventListener('scroll', function() {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive:true });
  btn.addEventListener('click', function() {
    window.scrollTo({ top:0, behavior:'smooth' });
  });
})();

/* ── CURSOR TRAIL ────────────────────────────────────────────── */
(function() {
  var last = 0;
  document.addEventListener('mousemove', function(e) {
    var now = Date.now();
    if (now - last < 60) return; // throttle
    last = now;
    var dot = document.createElement('div');
    dot.className = 'cursor-trail';
    dot.style.left = e.clientX + 'px';
    dot.style.top  = e.clientY + 'px';
    document.body.appendChild(dot);
    setTimeout(function() { dot.remove(); }, 600);
  });
})();

/* ── BUTTON RIPPLE EFFECT ────────────────────────────────────── */
document.querySelectorAll('.btn-primary, .btn-outline, .nav-cta').forEach(function(btn) {
  btn.addEventListener('click', function(e) {
    var r = btn.getBoundingClientRect();
    var ripple = document.createElement('span');
    ripple.className = 'ripple';
    var size = Math.max(r.width, r.height);
    ripple.style.cssText = [
      'width:' + size + 'px',
      'height:' + size + 'px',
      'left:' + (e.clientX - r.left - size/2) + 'px',
      'top:'  + (e.clientY - r.top  - size/2) + 'px',
    ].join(';');
    btn.appendChild(ripple);
    setTimeout(function() { ripple.remove(); }, 700);
  });
});

/* ── HL GRADIENT ANIMATION on visible ────────────────────────── */
(function() {
  new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) e.target.classList.add('hl-animate');
    });
  }, { threshold:0.5 }).observe && document.querySelectorAll('.section-title .hl').forEach(function(el) {
    var io = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) {
        el.classList.add('hl-animate');
        el.classList.remove('hl');
      }
    }, { threshold:0.5 });
    io.observe(el);
  });
})();

/* ── AMBIENT ORB SECTIONS ────────────────────────────────────── */
(function() {
  var orbSections = document.querySelectorAll('.why-section,.feat-section,.values-section,.intro-section,.culture-section,.join-section,.openings-section,.faq-section');
  orbSections.forEach(function(s) {
    s.classList.add('orb-bg');
  });
  new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      e.target.classList.toggle('orb-active', e.isIntersecting);
    });
  }, { threshold:0.1 }).observe && orbSections.forEach(function(s) {
    var io = new IntersectionObserver(function(entries) {
      entries[0].target.classList.toggle('orb-active', entries[0].isIntersecting);
    }, { threshold:0.05 });
    io.observe(s);
  });
})();

/* ── ABOUT-INTRO SPOTLIGHT ───────────────────────────────────── */
(function() {
  var ai = document.querySelector('.about-intro');
  if (!ai) return;
  ai.classList.add('spotlight-section');
  ai.addEventListener('mousemove', function(e) {
    var r = ai.getBoundingClientRect();
    ai.style.setProperty('--mx', ((e.clientX-r.left)/r.width*100).toFixed(1)+'%');
    ai.style.setProperty('--my', ((e.clientY-r.top)/r.height*100).toFixed(1)+'%');
  });
})();

/* ── SHIMMER ON CARD ENTER ───────────────────────────────────── */
document.querySelectorAll('.tilt-card, .svc-card, .work-card').forEach(function(card) {
  card.classList.add('shimmer-on-enter');
});

/* ── SECTION DIVIDERS (inject between major sections) ────────── */
(function() {
  var targets = document.querySelectorAll('main > section + section, main > div.stats-bar + section');
  targets.forEach(function(s) {
    var div = document.createElement('div');
    div.className = 'section-divider';
    s.parentNode.insertBefore(div, s);
  });
})();

/* ── GEO RING DECORATION on hero ────────────────────────────── */
(function() {
  var hero = document.querySelector('.hero, .page-hero');
  if (!hero) return;
  var ring = document.createElement('div');
  ring.className = 'geo-decor geo-ring';
  ring.style.cssText = 'bottom:-80px;right:-80px;opacity:0.6;';
  hero.appendChild(ring);
})();

/* ── CENTERED SECTION LABELS ─────────────────────────────────── */
document.querySelectorAll('.section-label[style*="justify-content:center"]').forEach(function(el) {
  el.classList.add('centered');
  el.style.removeProperty('justify-content');
});
