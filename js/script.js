/* ========================================
   Everest Portfolio - JavaScript
   Navigation, Typewriter, Carousel, Scroll
   ======================================== */

(function () {
  'use strict';

  /* ---- Preloader ---- */
  window.addEventListener('load', function () {
    var preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.classList.add('hidden');
      document.body.classList.remove('no-scroll');
    }
  });

  /* ---- Navbar Scroll Effect with Color Change ---- */
  var navbar = document.querySelector('.navbar');
  var sections = document.querySelectorAll('section[id]');

  function updateNavbar() {
    var scrollPos = window.scrollY + 80;

    // Add sticky class when scrolled
    if (window.scrollY >= 20) {
      navbar.classList.add('sticky');
    } else {
      navbar.classList.remove('sticky');
    }

    // Change navbar background based on current section
    var currentSection = null;
    sections.forEach(function (section) {
      var sectionTop = section.offsetTop;
      var sectionHeight = section.offsetHeight;
      var sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSection = sectionId;
      }
    });

    if (currentSection) {
      var targetClass = '';
      if (currentSection === 'home' || currentSection === 'home-about' || currentSection === 'projects') {
        targetClass = 'nav-pink';
      } else if (currentSection === 'resume') {
        targetClass = 'nav-green';
      } else if (currentSection === 'gallery') {
        targetClass = 'nav-white';
      } else if (currentSection === 'awards') {
        targetClass = 'nav-blue';
      } else if (currentSection === 'about-new' || currentSection === 'about') {
        targetClass = 'nav-cream';
      }

      var allClasses = ['nav-pink', 'nav-green', 'nav-white', 'nav-cream', 'nav-blue'];
      allClasses.forEach(function (cls) {
        if (cls !== targetClass) {
          navbar.classList.remove(cls);
        }
      });
      if (targetClass && !navbar.classList.contains(targetClass)) {
        navbar.classList.add(targetClass);
      }
    }
  }

  if (navbar) {
    // Initialize navbar state immediately
    updateNavbar();
    // Update on scroll
    window.addEventListener('scroll', updateNavbar);
  }

  /* ---- Mobile Nav Toggle ---- */
  var toggler = document.querySelector('.navbar-toggler');
  var navMenu = document.querySelector('.navbar-nav');
  if (toggler && navMenu) {
    toggler.addEventListener('click', function () {
      toggler.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when a nav link is clicked
    var navLinks = navMenu.querySelectorAll('.nav-item a');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        toggler.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  /* ---- Smooth Scroll for Anchor Links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var rect = target.getBoundingClientRect();
        var offsetTop = rect.top + window.scrollY - 60;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ---- Typewriter Effect ---- */
  var typewriterEl = document.getElementById('typewriter');
  var zhTexts, enTexts, textIndex, charIndex, isDeleting, typewriterTimer;
  if (typewriterEl) {
    zhTexts = [
      '可可爱爱收藏家🥰',
      '最爱兔兔₍ᐢ..ᐢ₎～❤',
      '文创设计师🎨'
    ];
    enTexts = [
      'A collector of beautiful things ✨',
      'A scholar with a well-rounded education 🎓',
      'A girl full of imagination 💡'
    ];
    textIndex = 0;
    charIndex = 0;
    isDeleting = false;

    function getCurrentTexts() {
      var lang = localStorage.getItem('lang') || 'en';
      return lang === 'zh' ? zhTexts : enTexts;
    }

    function typeWriter() {
      var texts = getCurrentTexts();
      var currentText = texts[textIndex];
      
      // 将字符串转换为字符数组，正确处理 emoji
      var chars = [...currentText];

      if (isDeleting) {
        // 删除阶段
        if (charIndex > 0) {
          charIndex--;
          typewriterEl.textContent = chars.slice(0, charIndex).join('');
          typewriterTimer = setTimeout(typeWriter, 50);
        } else {
          // 删除完成，切换到下一段
          isDeleting = false;
          textIndex = (textIndex + 1) % texts.length;
          charIndex = 0;
          typewriterTimer = setTimeout(typeWriter, 500);
        }
      } else {
        // 打字阶段
        if (charIndex < chars.length) {
          typewriterEl.textContent = chars.slice(0, charIndex + 1).join('');
          charIndex++;
          typewriterTimer = setTimeout(typeWriter, 100);
        } else {
          // 打字完成，显示完整文字后停顿1.5秒
          typewriterEl.textContent = currentText;
          typewriterTimer = setTimeout(function() {
            isDeleting = true;
            typeWriter();
          }, 1500);
          return;
        }
      }
    }

    window.restartTypewriter = function() {
      if (typewriterTimer) clearTimeout(typewriterTimer);
      textIndex = 0;
      charIndex = 0;
      isDeleting = false;
      typewriterEl.textContent = '';
      typeWriter();
    };

    // Start after preloader
    setTimeout(typeWriter, 1500);
  }

  /* ---- Carousel ---- */
  var carouselInner = document.querySelector('.carousel-inner');
  var prevBtn = document.querySelector('.carousel-btn.prev');
  var nextBtn = document.querySelector('.carousel-btn.next');
  var carouselDots = document.querySelector('.carousel-dots');

  if (carouselInner && prevBtn && nextBtn) {
    var items = carouselInner.querySelectorAll('.item');
    var currentIndex = 0;
    var totalItems = items.length;

    // Create dots
    if (carouselDots) {
      for (var i = 0; i < totalItems; i++) {
        var dot = document.createElement('span');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('data-index', i);
        dot.style.cssText = 'display:inline-block;width:10px;height:10px;border-radius:50%;background:rgba(253,85,174,0.4);margin:0 5px;cursor:pointer;transition:all 0.3s;';
        dot.addEventListener('click', function () {
          goToSlide(parseInt(this.getAttribute('data-index')));
        });
        carouselDots.appendChild(dot);
      }
    }

    function updateCarousel() {
      carouselInner.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
      var dots = carouselDots ? carouselDots.querySelectorAll('.carousel-dot') : [];
      dots.forEach(function (dot, idx) {
        dot.style.background = idx === currentIndex ? '#fd55ae' : 'rgba(253,85,174,0.4)';
        dot.style.transform = idx === currentIndex ? 'scale(1.3)' : 'scale(1)';
      });
    }

    function goToSlide(index) {
      currentIndex = index;
      if (currentIndex < 0) currentIndex = totalItems - 1;
      if (currentIndex >= totalItems) currentIndex = 0;
      updateCarousel();
    }

    prevBtn.addEventListener('click', function () {
      goToSlide(currentIndex - 1);
    });

    nextBtn.addEventListener('click', function () {
      goToSlide(currentIndex + 1);
    });

    // Auto-play
    setInterval(function () {
      goToSlide(currentIndex + 1);
    }, 4000);

    updateCarousel();
  }

  /* ---- Scroll To Top Button ---- */
  var scrollTopBtn = document.querySelector('.scroll-to-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });

    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ---- Scroll Reveal Animation ---- */
  var revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    function checkReveal() {
      var windowHeight = window.innerHeight;
      revealElements.forEach(function (el) {
        var elementTop = el.getBoundingClientRect().top;
        var revealPoint = 120;
        if (elementTop < windowHeight - revealPoint) {
          el.classList.add('revealed');
        }
      });
    }

    window.addEventListener('scroll', checkReveal);
    checkReveal();
  }

  /* ---- Active Nav Highlight on Scroll ---- */
  var sections = document.querySelectorAll('section[id]');
  var navItems = document.querySelectorAll('.nav-item a');

  if (sections.length > 0 && navItems.length > 0) {
    window.addEventListener('scroll', function () {
      var scrollPos = window.scrollY + 100;

      sections.forEach(function (section) {
        var sectionTop = section.offsetTop;
        var sectionHeight = section.offsetHeight;
        var sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          navItems.forEach(function (item) {
            item.style.color = '#1f1f1f';
            if (item.getAttribute('href') === '#' + sectionId) {
              item.style.color = '#fd55ae';
            }
          });
        }
      });
    });
  }

  /* ---- Timeline Filter Functionality ---- */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var timelineItems = document.querySelectorAll('.timeline-item[data-category]');

  if (filterBtns.length > 0 && timelineItems.length > 0) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = this.getAttribute('data-filter');

        // Update active button state
        filterBtns.forEach(function (b) {
          b.classList.remove('active');
        });
        this.classList.add('active');

        // Filter timeline items with animation
        timelineItems.forEach(function (item) {
          var category = item.getAttribute('data-category');

          if (filter === 'all' || category === filter) {
            // Show item
            item.classList.remove('hidden');
            setTimeout(function () {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, 10);
          } else {
            // Hide item with fade out
            item.style.opacity = '0';
            item.style.transform = 'translateY(-10px)';
            setTimeout(function () {
              item.classList.add('hidden');
            }, 300);
          }
        });
      });
    });
  }

  /* ---- Timeline Detail Expand Functionality ---- */
  var detailItems = document.querySelectorAll('.timeline-item[data-detail]');
  
  detailItems.forEach(function(item) {
    var content = item.querySelector('.timeline-content');
    var detail = item.querySelector('.timeline-detail');
    
    if (content && detail) {
      // Click content to toggle
      content.addEventListener('click', function(e) {
        // Don't toggle if clicking inside the detail area (let detail handle it)
        if (e.target.closest('.timeline-detail')) {
          return;
        }
        
        // Toggle the detail
        detail.classList.toggle('show');
      });
      
      // Mouse enter to show
      content.addEventListener('mouseenter', function() {
        detail.classList.add('show');
      });
      
      // Mouse leave to hide
      content.addEventListener('mouseleave', function() {
        detail.classList.remove('show');
      });
      
      // Click detail to close
      detail.addEventListener('click', function() {
        detail.classList.remove('show');
      });
    }
  });

  // Contact tooltip for Phone and WeChat
  var activeTooltip = null;

  function createContactTooltip(btn, type, value) {
    if (activeTooltip) {
      activeTooltip.remove();
      activeTooltip = null;
    }

    var tooltip = document.createElement('div');
    tooltip.className = 'contact-tooltip';
    
    var currentLangValue = localStorage.getItem('lang') || 'en';
    var titleZh = btn.getAttribute('data-title-zh') || '电话';
    var titleEn = btn.getAttribute('data-title-en') || 'Phone';
    var infoZh = btn.getAttribute('data-info-zh') || '电话: ' + value;
    var infoEn = btn.getAttribute('data-info-en') || 'Phone: ' + value;
    
    var titleText;
    if (type === 'phone') {
      titleText = currentLangValue === 'zh' ? titleZh : titleEn;
    } else if (type === 'wechat') {
      var wechatTitleZh = btn.getAttribute('data-title-zh') || '微信';
      var wechatTitleEn = btn.getAttribute('data-title-en') || 'WeChat';
      titleText = currentLangValue === 'zh' ? wechatTitleZh : wechatTitleEn;
    } else {
      var emailTitleZh = btn.getAttribute('data-title-zh') || '邮箱';
      var emailTitleEn = btn.getAttribute('data-title-en') || 'Email';
      titleText = currentLangValue === 'zh' ? emailTitleZh : emailTitleEn;
    }
    
    var infoText = currentLangValue === 'zh' ? infoZh : infoEn;
    var copyText = currentLangValue === 'zh' ? '复制' : 'Copy';
    var copiedText = currentLangValue === 'zh' ? '已复制!' : 'Copied!';
    
    tooltip.innerHTML = 
      '<div class="tooltip-title">' + titleText + '</div>' +
      '<div class="tooltip-content">' + infoText + '</div>' +
      '<button class="copy-btn">' + copyText + '</button>';
    
    document.body.appendChild(tooltip);
    
    var rect = btn.getBoundingClientRect();
    tooltip.style.top = (rect.top - tooltip.offsetHeight - 10 + window.scrollY) + 'px';
    tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
    
    activeTooltip = tooltip;

    var copyBtn = tooltip.querySelector('.copy-btn');
    copyBtn.addEventListener('click', function () {
      navigator.clipboard.writeText(value).then(function () {
        copyBtn.textContent = copiedText;
        copyBtn.classList.add('copied');
        setTimeout(function () {
          if (activeTooltip) {
            activeTooltip.remove();
            activeTooltip = null;
          }
        }, 1000);
      });
    });

    setTimeout(function () {
      if (activeTooltip === tooltip) {
        tooltip.remove();
        activeTooltip = null;
      }
    }, 4000);
  }

  var phoneBtn = document.querySelector('.social-icon-btn[data-phone]');
  if (phoneBtn) {
    phoneBtn.addEventListener('click', function (e) {
      e.preventDefault();
      createContactTooltip(this, 'phone', this.getAttribute('data-phone'));
    });
  }

  var wechatBtn = document.querySelector('.social-icon-btn[data-wechat]');
  if (wechatBtn) {
    wechatBtn.addEventListener('click', function (e) {
      e.preventDefault();
      createContactTooltip(this, 'wechat', this.getAttribute('data-wechat'));
    });
  }

  var emailBtn = document.querySelector('.social-icon-btn[data-email]');
  if (emailBtn) {
    emailBtn.addEventListener('click', function (e) {
      e.preventDefault();
      createContactTooltip(this, 'email', this.getAttribute('data-email'));
    });
  }

  // Close tooltip when clicking outside
  document.addEventListener('click', function (e) {
    if (activeTooltip && !e.target.closest('.contact-tooltip') && !e.target.closest('.social-icon-btn[data-phone]') && !e.target.closest('.social-icon-btn[data-wechat]') && !e.target.closest('.social-icon-btn[data-email]')) {
      activeTooltip.remove();
      activeTooltip = null;
    }
  });

  /* ---- Language Switcher ---- */
  var langBtns = document.querySelectorAll('.lang-btn');
  var currentLang = localStorage.getItem('lang') || 'en';

  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);

    // Update lang buttons
    langBtns.forEach(function(btn) {
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update all elements with data-zh and data-en
    var translatables = document.querySelectorAll('[data-zh][data-en]');
    translatables.forEach(function(el) {
      var text = el.getAttribute('data-' + lang);
      if (text !== null) {
        el.textContent = text;
      }
    });

    // Update navbar nav items
    var navLinks = document.querySelectorAll('.nav-item a');
    navLinks.forEach(function(link) {
      var zh = link.getAttribute('data-zh');
      var en = link.getAttribute('data-en');
      if (zh && en) {
        link.textContent = lang === 'zh' ? zh : en;
      }
    });

    // Update main name
    var mainNameEl = document.querySelector('.main-name');
    if (mainNameEl) {
      var mainZh = mainNameEl.getAttribute('data-zh');
      var mainEn = mainNameEl.getAttribute('data-en');
      if (mainZh && mainEn) {
        mainNameEl.textContent = ' ' + (lang === 'zh' ? mainZh : mainEn) + ' ';
      }
    }

    // Update click hints in timeline descriptions
    var descElements = document.querySelectorAll('.timeline-desc');
    descElements.forEach(function(el) {
      var hintZh = el.getAttribute('data-click-hint-zh');
      var hintEn = el.getAttribute('data-click-hint-en');
      if (hintZh && hintEn) {
        var span = el.querySelector('span[style*="color: #ff9800"], span[style*="color: #64b5f6"]');
        if (span) {
          span.textContent = lang === 'zh' ? hintZh : hintEn;
        }
      }
    });

    // Update carousel buttons aria-label
    var prevBtn = document.querySelector('.carousel-btn.prev');
    var nextBtn = document.querySelector('.carousel-btn.next');
    if (prevBtn) {
      var prevZh = prevBtn.getAttribute('data-aria-zh');
      var prevEn = prevBtn.getAttribute('data-aria-en');
      if (prevZh && prevEn) {
        prevBtn.setAttribute('aria-label', lang === 'zh' ? prevZh : prevEn);
      }
    }
    if (nextBtn) {
      var nextZh = nextBtn.getAttribute('data-aria-zh');
      var nextEn = nextBtn.getAttribute('data-aria-en');
      if (nextZh && nextEn) {
        nextBtn.setAttribute('aria-label', lang === 'zh' ? nextZh : nextEn);
      }
    }

    // Update typewriter text
    var typewriterEl = document.getElementById('typewriter');
    if (typewriterEl) {
      var zhText = typewriterEl.getAttribute('data-zh');
      var enText = typewriterEl.getAttribute('data-en');
      if (zhText && enText) {
        typewriterEl.textContent = lang === 'zh' ? zhText : enText;
      }
    }

    // Update contact tooltips when shown
    var socialBtns = document.querySelectorAll('.social-icon-btn[data-info-zh]');
    socialBtns.forEach(function(btn) {
      btn.setAttribute('data-info', lang === 'zh' ? btn.getAttribute('data-info-zh') : btn.getAttribute('data-info-en'));
      btn.setAttribute('data-title', lang === 'zh' ? btn.getAttribute('data-title-zh') : btn.getAttribute('data-title-en'));
    });

    // Update filter buttons text
    var filterBtns = document.querySelectorAll('.filter-btn[data-zh]');
    filterBtns.forEach(function(btn) {
      var zh = btn.getAttribute('data-zh');
      var en = btn.getAttribute('data-en');
      if (zh && en) {
        btn.textContent = lang === 'zh' ? zh : en;
      }
    });

    // Update contact tooltip function to use localized text
    if (typeof createContactTooltip === 'function') {
      var phoneBtn = document.querySelector('.social-icon-btn[data-phone]');
      var wechatBtn = document.querySelector('.social-icon-btn[data-wechat]');
      var emailBtn = document.querySelector('.social-icon-btn[data-email]');
      
      // Store the createContactTooltip function reference for use in click handlers
      window.langCreateTooltip = function(btn, type, value) {
        if (activeTooltip) {
          activeTooltip.remove();
          activeTooltip = null;
        }

        var tooltip = document.createElement('div');
        tooltip.className = 'contact-tooltip';
        
        var currentLangValue = localStorage.getItem('lang') || 'en';
        var titleZh = btn.getAttribute('data-title-zh') || '电话';
        var titleEn = btn.getAttribute('data-title-en') || 'Phone';
        var infoZh = btn.getAttribute('data-info-zh') || '电话: ' + value;
        var infoEn = btn.getAttribute('data-info-en') || 'Phone: ' + value;
        
        var titleText = type === 'phone' ? (currentLangValue === 'zh' ? titleZh : titleEn) : 
                        (type === 'wechat' ? (currentLangValue === 'zh' ? titleZh : titleEn) : 
                        (currentLangValue === 'zh' ? titleZh : titleEn));
        var infoText = currentLangValue === 'zh' ? infoZh : infoEn;
        var copyText = currentLangValue === 'zh' ? '复制' : 'Copy';
        var copiedText = currentLangValue === 'zh' ? '已复制!' : 'Copied!';
        
        tooltip.innerHTML = 
          '<div class="tooltip-title">' + titleText + '</div>' +
          '<div class="tooltip-content">' + infoText + '</div>' +
          '<button class="copy-btn">' + copyText + '</button>';
        
        document.body.appendChild(tooltip);
        
        var rect = btn.getBoundingClientRect();
        tooltip.style.top = (rect.top - tooltip.offsetHeight - 10 + window.scrollY) + 'px';
        tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
        
        activeTooltip = tooltip;

        var copyBtn = tooltip.querySelector('.copy-btn');
        copyBtn.addEventListener('click', function () {
          navigator.clipboard.writeText(value).then(function () {
            copyBtn.textContent = copiedText;
            copyBtn.classList.add('copied');
            setTimeout(function () {
              if (activeTooltip) {
                activeTooltip.remove();
                activeTooltip = null;
              }
            }, 1000);
          });
        });

        setTimeout(function () {
          if (activeTooltip === tooltip) {
            tooltip.remove();
            activeTooltip = null;
          }
        }, 4000);
      };
    }

    // Restart typewriter with new language
    if (typeof window.restartTypewriter === 'function') {
      window.restartTypewriter();
    }
  }

  // Add click handlers to lang buttons
  langBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var lang = this.getAttribute('data-lang');
      setLanguage(lang);
    });
  });

  // Initialize language on page load
  setLanguage(currentLang);

  // Update contact tooltip function
  var originalCreateTooltip = window.createContactTooltip;
  window.createContactTooltip = function(btn, type, value) {
    if (window.langCreateTooltip) {
      window.langCreateTooltip(btn, type, value);
    } else {
      if (activeTooltip) {
        activeTooltip.remove();
        activeTooltip = null;
      }

      var tooltip = document.createElement('div');
      tooltip.className = 'contact-tooltip';
      
      var currentLangValue = localStorage.getItem('lang') || 'en';
      var titleZh = btn.getAttribute('data-title-zh') || '电话';
      var titleEn = btn.getAttribute('data-title-en') || 'Phone';
      var infoZh = btn.getAttribute('data-info-zh') || '电话: ' + value;
      var infoEn = btn.getAttribute('data-info-en') || 'Phone: ' + value;
      
      var titleText = type === 'phone' ? (currentLangValue === 'zh' ? titleZh : titleEn) : 
                      (type === 'wechat' ? (currentLangValue === 'zh' ? titleZh : titleEn) : 
                      (currentLangValue === 'zh' ? titleZh : titleEn));
      var infoText = currentLangValue === 'zh' ? infoZh : infoEn;
      var copyText = currentLangValue === 'zh' ? '复制' : 'Copy';
      var copiedText = currentLangValue === 'zh' ? '已复制!' : 'Copied!';
      
      tooltip.innerHTML = 
        '<div class="tooltip-title">' + titleText + '</div>' +
        '<div class="tooltip-content">' + infoText + '</div>' +
        '<button class="copy-btn">' + copyText + '</button>';
      
      document.body.appendChild(tooltip);
      
      var rect = btn.getBoundingClientRect();
      tooltip.style.top = (rect.top - tooltip.offsetHeight - 10 + window.scrollY) + 'px';
      tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
      
      activeTooltip = tooltip;

      var copyBtn = tooltip.querySelector('.copy-btn');
      copyBtn.addEventListener('click', function () {
        navigator.clipboard.writeText(value).then(function () {
          copyBtn.textContent = copiedText;
          copyBtn.classList.add('copied');
          setTimeout(function () {
            if (activeTooltip) {
              activeTooltip.remove();
              activeTooltip = null;
            }
          }, 1000);
        });
      });

      setTimeout(function () {
        if (activeTooltip === tooltip) {
          tooltip.remove();
          activeTooltip = null;
        }
      }, 4000);
    }
  };

})();
