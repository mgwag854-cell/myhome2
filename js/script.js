/* 🌿 그린테이블(Green Table) 인터랙티브 스크립트 */

document.addEventListener('DOMContentLoaded', () => {
  
  /* ==========================================
     1. GNB Sticky & Scroll-to-Top FAB Visibility
     ========================================== */
  const header = document.getElementById('header');
  const scrollTopBtn = document.getElementById('scroll-top');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Header Sticky Effect
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll-to-Top Button Visibility
    if (scrollY > 300) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }

    // Scrollspy - GNB Active Link Tracking
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // Scroll to Top Event
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });


  /* ==========================================
     2. Mobile Hamburger Menu Toggle
     ========================================== */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  const toggleMobileMenu = () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    
    // Prevent background scrolling when menu is open
    if (mobileMenu.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  hamburger.addEventListener('click', toggleMobileMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });


  /* ==========================================
     3. Hero Banner Auto Slider (3s transition)
     ========================================= */
  const slides = document.querySelectorAll('.hero-slider .slide');
  const dots = document.querySelectorAll('.slider-dots .dot');
  let currentSlide = 0;
  const slideIntervalTime = 3000; // 3 seconds
  let slideInterval;

  const showSlide = (index) => {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;
  };

  const nextSlide = () => {
    let next = (currentSlide + 1) % slides.length;
    showSlide(next);
  };

  const startSlideShow = () => {
    slideInterval = setInterval(nextSlide, slideIntervalTime);
  };

  const resetSlideShow = () => {
    clearInterval(slideInterval);
    startSlideShow();
  };

  // Dots click handler
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      resetSlideShow();
    });
  });

  // Start Slider
  startSlideShow();


  /* ==========================================
     4. Brand & Menu Reveal Animations on Scroll
     ========================================== */
  const revealItems = document.querySelectorAll('.reveal-item');
  
  const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Unobserve once revealed to keep layout performant
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealItems.forEach(item => {
    revealOnScroll.observe(item);
  });


  /* ==========================================
     5. Menu Category Filtering Functionality
     ========================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const menuCards = document.querySelectorAll('.menu-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active filter button
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      menuCards.forEach(card => {
        // Animation for hiding/showing menu cards
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8) translateY(20px)';
        
        setTimeout(() => {
          const category = card.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue) {
            card.classList.remove('hidden');
            // Slight delay for reflow and triggering transition
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1) translateY(0)';
            }, 50);
          } else {
            card.classList.add('hidden');
          }
        }, 300);
      });
    });
  });


  /* ==========================================
     6. Eco-Friendly Count-up Animation
     ========================================== */
  const counter = document.getElementById('plastic-counter');
  
  const countUp = (targetElement) => {
    const targetValue = parseInt(targetElement.getAttribute('data-target'), 10);
    const duration = 2000; // 2 seconds
    const startValue = 0;
    let startTime = null;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const currentValue = Math.floor(progress * (targetValue - startValue) + startValue);
      
      targetElement.textContent = currentValue.toLocaleString('ko-KR');

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        targetElement.textContent = targetValue.toLocaleString('ko-KR');
      }
    };

    requestAnimationFrame(animate);
  };

  // Observer to trigger count-up when visible
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });

  if (counter) {
    counterObserver.observe(counter);
  }


  /* ==========================================
     7. Floating Label Validation & Contact Form
     ========================================== */
  const contactForm = document.getElementById('contact-form');
  const formInputs = contactForm.querySelectorAll('input[required], textarea[required]');
  const agreePrivacy = document.getElementById('agree-privacy');

  // Input styling feedback on focus/blur
  formInputs.forEach(input => {
    const parent = input.parentElement;
    
    input.addEventListener('blur', () => {
      validateField(input);
    });

    input.addEventListener('input', () => {
      if (parent.classList.contains('has-error')) {
        validateField(input);
      }
    });
  });

  agreePrivacy.addEventListener('change', () => {
    const parent = agreePrivacy.closest('.form-group-checkbox');
    if (agreePrivacy.checked) {
      parent.classList.remove('has-error');
    } else {
      parent.classList.add('has-error');
    }
  });

  // Validation function
  const validateField = (input) => {
    const parent = input.parentElement;
    let isValid = true;

    if (input.value.trim() === '') {
      isValid = false;
    } else if (input.type === 'email') {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      isValid = emailRegex.test(input.value.trim());
    } else if (input.type === 'tel') {
      const telRegex = /^\d{9,11}$/; // 9-11 digits without hyphens
      isValid = telRegex.test(input.value.replace(/[^0-9]/g, ''));
    }

    if (isValid) {
      parent.classList.remove('has-error');
    } else {
      parent.classList.add('has-error');
    }

    return isValid;
  };

  // Form Submit Handler
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isFormValid = true;

    // Check standard inputs
    formInputs.forEach(input => {
      if (!validateField(input)) {
        isFormValid = false;
      }
    });

    // Check privacy agreement
    const privacyParent = agreePrivacy.closest('.form-group-checkbox');
    if (!agreePrivacy.checked) {
      privacyParent.classList.add('has-error');
      isFormValid = false;
    } else {
      privacyParent.classList.remove('has-error');
    }

    // Success Actions
    if (isFormValid) {
      const inquiryType = contactForm.querySelector('input[name="inquiry-type"]:checked').value;
      let typeLabel = "정기구독";
      if (inquiryType === 'group') typeLabel = "단체 주문";
      if (inquiryType === 'other') typeLabel = "일반/기타";
      
      const userName = document.getElementById('user-name').value.trim();

      // Show gorgeous Alert Message (Korean)
      alert(
        `🌿 [그린테이블] 문의가 정상적으로 접수되었습니다!\n\n` +
        `• 신청자: ${userName} 님\n` +
        `• 문의유형: ${typeLabel}\n\n` +
        `그린테이블을 찾아주셔서 감사합니다. 남겨주신 연락처로 담당 매니저가 신속하게 연락드리겠습니다.`
      );

      // Reset form and UI labels
      contactForm.reset();
      formInputs.forEach(input => {
        // Trigger blur/input classes reset
        input.parentElement.classList.remove('has-error');
      });
      privacyParent.classList.remove('has-error');
    } else {
      // Focus first error element
      const firstError = contactForm.querySelector('.has-error input, .has-error textarea');
      if (firstError) firstError.focus();
    }
  });

});
