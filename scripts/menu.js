(function() {
  'use strict';

  const burger = document.querySelector('.burger');
  const nav = document.querySelector('#main-nav');
  const overlay = document.querySelector('.nav-overlay');
  const backToTopBtn = document.querySelector('#back-to-top');
  const navLinks = document.querySelectorAll('.nav__list a');
  const body = document.body;
  
  const SCROLL_THRESHOLD = 300;
  let scrollPosition = 0;

  function isMobile() {
    return window.innerWidth <= 767;
  }

  function openMenu() {
    if (!burger || !nav || !overlay) return;
    
    scrollPosition = window.scrollY;
    
    burger.setAttribute('aria-expanded', 'true');
    nav.classList.add('nav--open');
    overlay.classList.add('visible');
    body.classList.add('menu-open');
    body.style.top = `-${scrollPosition}px`;
  }
  
  function closeMenu() {
    if (!burger || !nav || !overlay) return;
    
    burger.setAttribute('aria-expanded', 'false');
    nav.classList.remove('nav--open');
    overlay.classList.remove('visible');
    body.classList.remove('menu-open');
    body.style.top = '';
    
    window.scrollTo(0, scrollPosition);
  }
  
  function toggleMenu(e) {
    if (e) e.preventDefault();
    
    const isOpen = burger.getAttribute('aria-expanded') === 'true';
    
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function updateBackToTop() {
    if (!backToTopBtn) return;
    
    if (!isMobile()) {
      backToTopBtn.classList.remove('visible');
      return;
    }
    
    const scrollY = window.scrollY || window.pageYOffset;
    
    if (scrollY > SCROLL_THRESHOLD) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }
  
  function scrollToTop(e) {
    if (e) e.preventDefault();
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  function handleNavClick(e) {
    const link = e.currentTarget;
    const href = link.getAttribute('href');
    
    if (!href || !href.startsWith('#')) return;
    
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (!targetElement) return;
    
    e.preventDefault();
    
    const wasMenuOpen = burger && burger.getAttribute('aria-expanded') === 'true';
    
    if (wasMenuOpen) {
      closeMenu();
    }
    
    setTimeout(function() {
      const headerHeight = 70;
      const elementTop = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementTop + window.scrollY - headerHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }, wasMenuOpen ? 350 : 10);
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') {
      const isOpen = burger && burger.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeMenu();
      }
    }
  }
  
  function handleResize() {
    if (!isMobile()) {
      const isOpen = burger && burger.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeMenu();
      }
    }
    
    updateBackToTop();
  }

  function throttle(func, limit) {
    let inThrottle;
    return function() {
      if (!inThrottle) {
        func.apply(this, arguments);
        inThrottle = true;
        setTimeout(function() {
          inThrottle = false;
        }, limit);
      }
    };
  }

  function init() {
    if (burger) {
      burger.addEventListener('click', toggleMenu);
    }
    
    if (overlay) {
      overlay.addEventListener('click', closeMenu);
    }
    
    if (navLinks.length > 0) {
      navLinks.forEach(function(link) {
        link.addEventListener('click', handleNavClick);
      });
    }
    
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', scrollToTop);
    }
    
    window.addEventListener('scroll', throttle(updateBackToTop, 100), { passive: true });
    document.addEventListener('keydown', handleKeydown);
    window.addEventListener('resize', throttle(handleResize, 200));
    
    updateBackToTop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();