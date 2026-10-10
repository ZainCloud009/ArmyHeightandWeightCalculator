/**
 * Main Interactive Script
 * Handles navigation drawer, accordions, back to top, sharing, print, and UI animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Drawer with Backdrop & Body Lock
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    let backdrop = document.querySelector('.nav-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'nav-backdrop';
      document.body.appendChild(backdrop);
    }

    const setMenuState = (isOpen) => {
      navMenu.classList.toggle('is-open', isOpen);
      backdrop.classList.toggle('is-active', isOpen);
      document.body.classList.toggle('nav-open', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      mobileToggle.innerHTML = isOpen
        ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
        : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>`;
    };

    mobileToggle.addEventListener('click', () => {
      const willOpen = !navMenu.classList.contains('is-open');
      setMenuState(willOpen);
    });

    backdrop.addEventListener('click', () => {
      setMenuState(false);
    });

    // Close when clicking any nav link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        setMenuState(false);
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        setMenuState(false);
      }
    });
  }

  // Accordion Logic
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      if (!item) return;
      const isOpen = item.classList.contains('is-open');

      // Close sibling accordions if within a single-expand accordion
      const parentAccordion = item.closest('.accordion');
      if (parentAccordion && parentAccordion.dataset.allowMultiple !== 'true') {
        parentAccordion.querySelectorAll('.accordion-item').forEach(sibling => {
          if (sibling !== item) sibling.classList.remove('is-open');
        });
      }

      item.classList.toggle('is-open', !isOpen);
      header.setAttribute('aria-expanded', !isOpen);
    });
  });

  // Back to Top Button
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        backToTopBtn.classList.add('is-visible');
      } else {
        backToTopBtn.classList.remove('is-visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Print Page / Results Trigger
  const printBtns = document.querySelectorAll('.btn-print-trigger');
  printBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      window.print();
    });
  });

  // Share Result Trigger
  const shareBtns = document.querySelectorAll('.btn-share-trigger');
  shareBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({
          title: 'Army Height and Weight Calculator',
          text: 'Check your official AR 600-9 waist-to-height ratio (WHtR) and body fat standards instantly:',
          url: window.location.href,
        }).catch(() => {});
      } else {
        // Fallback: Copy URL to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
          showToast('Link copied to clipboard!');
        });
      }
    });
  });

  // Search Filter in FAQ page if present
  const faqSearch = document.getElementById('faq-search-input');
  if (faqSearch) {
    faqSearch.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const items = document.querySelectorAll('.faq-item');
      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(query)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
});

// Toast notification helper
function showToast(msg) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('is-show');
  setTimeout(() => {
    toast.classList.remove('is-show');
  }, 3000);
}
