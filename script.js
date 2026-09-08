/* ==========================================================================
   PREMIUM EDITORIAL PORTFOLIO - JAVASCRIPT LOGIC
   Designed for: SE235 Web Programming Assignment
   Description: Clean, straightforward DOM manipulation, scroll effects,
                animations, and AJAX form submissions.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. SELECT DOM ELEMENTS (document.querySelector)
  // ==========================================
  const header = document.querySelector('#header-nav');
  const mobileToggle = document.querySelector('#mobile-toggle');
  const navbar = document.querySelector('#navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const contactForm = document.querySelector('#contact-form');
  const formStatus = document.querySelector('#form-status');
  const revealElements = document.querySelectorAll('.reveal');

  // ==========================================
  // 2. MOBILE MENU NAVIGATION TOGGLE
  // ==========================================
  if (mobileToggle && navbar) {
    // Listen for click event on the hamburger button
    mobileToggle.addEventListener('click', () => {
      navbar.classList.toggle('open');
      
      // Toggle icon classes between hamburger list and X close
      const icon = mobileToggle.querySelector('i');
      if (navbar.classList.contains('open')) {
        icon.className = 'bi bi-x';
      } else {
        icon.className = 'bi bi-list';
      }
    });
  }

  // Close mobile navigation menu when clicking any nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navbar.classList.contains('open')) {
        navbar.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        icon.className = 'bi bi-list';
      }
    });
  });

  // ==========================================
  // 3. STICKY NAVBAR BACKGROUND ON SCROLL
  // ==========================================
  window.addEventListener('scroll', () => {
    // If user scrolls down past 50 pixels, apply sticky class to style background
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ==========================================
  // 4. SCROLL SPY (ACTIVE LINK HIGHLIGHTING)
  // ==========================================
  const sections = document.querySelectorAll('section');
  
  function scrollSpy() {
    // Current scrolling position on page plus safety buffer offset
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      // Check if scroll position lies within the boundaries of the section
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  // Run scrollSpy on page scroll
  window.addEventListener('scroll', scrollSpy);

  // ==========================================
  // 5. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  // ==========================================
  // Observer options
  const revealOptions = {
    threshold: 0.15,      // Trigger when 15% of the element is visible
    rootMargin: '0px 0px -50px 0px' // Offset margin before trigger
  };

  // Callback function executed when observed elements cross threshold
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add class to trigger CSS transition visibility
        entry.target.classList.add('reveal-visible');
        
        // If the entry contains a skill card, trigger skill bar animation
        if (entry.target.classList.contains('skill-category-card')) {
          animateSkillBars(entry.target);
        }
        
        // Unobserve the element once it has been revealed to optimize performance
        observer.unobserve(entry.target);
      }
    });
  };

  // Create observer instance
  const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

  // Bind observer to all elements with class '.reveal'
  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // Helper function to animate skill bars on scroll entry
  function animateSkillBars(card) {
    const fills = card.querySelectorAll('.skill-bar-fill');
    fills.forEach(fill => {
      // Access inline style property to trigger transitions
      const targetWidth = fill.style.width;
      // Temporarily set width to 0
      fill.style.width = '0%';
      // Force page reflow / redraw to register transition
      fill.offsetHeight; 
      // Set width to target percentage
      fill.style.width = targetWidth;
    });
  }

  // ==========================================
  // 6. CONTACT FORM AJAX SUBMISSION (FormSubmit.co API)
  // ==========================================
  if (contactForm) {
    // Listen for form submit event
    contactForm.addEventListener('submit', (event) => {
      // Prevent browser from reloading the page (critical for AJAX)
      event.preventDefault();

      // Clear any prior response message states
      formStatus.className = 'form-status-message';
      formStatus.textContent = '';
      formStatus.style.display = 'none';

      // Select submission button to show sending feedback
      const submitBtn = contactForm.querySelector('#form-submit-btn');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Sending message... <i class="bi bi-hourglass-split"></i>';
      submitBtn.disabled = true;

      // Create FormData key-value pairs from form input controls
      const formData = new FormData(contactForm);

      // Perform asynchronous AJAX request (Fetch API)
      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json' // Set header to receive JSON payload back
        }
      })
      .then(response => {
        // Toggle submit button state back to active
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;

        // Check if server transaction returned HTTP 200 OK
        if (response.ok) {
          // 1. Display success message on webpage
          formStatus.className = 'form-status-message success';
          formStatus.textContent = 'Thank you! Your message has been sent successfully.';
          
          // 2. Reset form input fields
          contactForm.reset();
        } else {
          // Handle response error cases (e.g., bad request, limit hit)
          throw new Error('Server returned an error status.');
        }
      })
      .catch(error => {
        // Toggle submit button state back to active
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;

        // Display error message
        formStatus.className = 'form-status-message error';
        formStatus.textContent = 'Oops! There was a problem submitting your form. Please try again.';
        console.error('Submission Error:', error);
      });
    });
  }

});
