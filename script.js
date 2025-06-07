document.addEventListener('DOMContentLoaded', function() {
    // mobil menü elemanları seç
    const navToggle = document.getElementById('nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    
    // mobil menüyü açar
    navToggle.addEventListener('click', function() {
        mobileMenu.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // mobil menüyü kapatır
    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // menüyü kapatma olaylarını ekler
    mobileMenuClose.addEventListener('click', closeMobileMenu);
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    
    // ESC tuşu ile menüyü kapatır
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // menüdeki bağlantıya tıklayınca menüyü kapatır
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-menu a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // takım sekmelerini başlatır
    function initTeamTabs() {
        const tabs = document.querySelectorAll('.team-tab');
        const members = document.querySelectorAll('.team-member');
        
        if (tabs.length > 0) { // sadece ekibimiz.html'de çalışır
            tabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    // aktif sekmeyi günceller
                    tabs.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    
                    const department = this.getAttribute('data-department');
                    
                    // üyeleri gösterir veya gizler
                    members.forEach(member => {
                        if(department === 'all' || member.getAttribute('data-department') === department) {
                            member.style.display = 'block';
                        } else {
                            member.style.display = 'none';
                        }
                    });
                });
            });
        }
    }
    // sadece ekibimiz.html'de takım sekmelerini başlatır
    if (window.location.pathname.includes('ekibimiz')) {
        initTeamTabs();
    }

    // header'a scroll efekti ekler
    window.addEventListener('scroll', function() {
        const header = document.getElementById('header');
        if (window.scrollY > 100) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });

    // yukarı çık butonunu gösterir veya gizler
    const backToTop = document.getElementById('back-to-top');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });

    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
    });
    
    /**
     * menüde aktif olan bağlantıyı belirler ve 'active' sınıfı ekler
     * sayfa yolu ve hash'e göre uygun menü öğesini vurgular
     */
    function setActiveMenuItem() {
        const navLinks = document.querySelectorAll('.nav-menu a, .mobile-nav-menu a');
        const currentPath = window.location.pathname.toLowerCase();
        const currentHash = window.location.hash.toLowerCase();

        // 1. Tüm aktif sınıfları temizle
        navLinks.forEach(link => link.classList.remove('active'));

        // 2. Ana sayfa kontrolü (Neocities özel)
        const isHomePage = currentPath === '/' || 
                        currentPath === '/index.html' || 
                        currentPath.endsWith('/index.html') || 
                        currentPath === '' ||
                        currentPath.split('/').filter(Boolean).length === 0;

        if (isHomePage) {
            // ANA SAYFA LOGİĞİ (Section takibi)
            const sections = document.querySelectorAll('section[id]');
            let activeSection = null;
            let maxVisibility = 0;

            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const visibilityRatio = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
                
                if (visibilityRatio > maxVisibility && visibilityRatio > window.innerHeight * 0.3) {
                    maxVisibility = visibilityRatio;
                    activeSection = section.id;
                }
            });

            // Fallback: Scroll pozisyonuna göre
            if (!activeSection) {
                const scrollPosition = window.scrollY;
                sections.forEach(section => {
                    if (section.offsetTop <= scrollPosition + 100) {
                        activeSection = section.id;
                    }
                });
            }

            // Aktif menüyü ayarla
            if (activeSection) {
                document.querySelectorAll(`.nav-menu a[href="#${activeSection}"], .mobile-nav-menu a[href="#${activeSection}"]`)
                    .forEach(link => link.classList.add('active'));
            }

            // Son çare: Hero section
            if (!document.querySelector('.nav-menu a.active, .mobile-nav-menu a.active')) {
                document.querySelectorAll('.nav-menu a[href="#hero"], .mobile-nav-menu a[href="#hero"]')
                    .forEach(link => link.classList.add('active'));
            }

        } else {
            // DİĞER SAYFALAR (Neocities için optimize edildi)
            const currentPage = currentPath.split('/').pop().replace('.html', '');

            navLinks.forEach(link => {
                const linkPath = link.getAttribute('href').toLowerCase();
                const linkPage = linkPath.replace('.html', '').split('#')[0];

                // Karşılaştırma mantığı:
                // 1. /dergimiz ↔ dergimiz.html
                // 2. /ekibimiz ↔ ekibimiz.html
                // 3. /iletisim ↔ iletisim.html
                if (linkPage === currentPage) {
                    link.classList.add('active');
                }
            });

            // Ek güvenlik kontrolü
            if (!document.querySelector('.nav-menu a.active, .mobile-nav-menu a.active')) {
                const fallbackPage = currentPage + '.html';
                document.querySelectorAll(`.nav-menu a[href="${fallbackPage}"], .mobile-nav-menu a[href="${fallbackPage}"]`)
                    .forEach(link => link.classList.add('active'));
            }
        }

        // Debug çıktısı
        console.log('Active Menu Item Set:', {
            currentPath,
            isHomePage,
            activeLinks: document.querySelectorAll('.nav-menu a.active, .mobile-nav-menu a.active').length
        });
    }

    // sayfa yüklendiğinde, değiştirildiğinde ve hash değiştiğinde aktif menüyü günceller
    setActiveMenuItem();
    window.addEventListener('hashchange', setActiveMenuItem);
    window.addEventListener('popstate', setActiveMenuItem);

    // sadece ana sayfada scroll ile aktif menüyü günceller
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        const isHomePage = window.location.pathname === '/' || 
                        window.location.pathname === '/index.html' || 
                        window.location.pathname.endsWith('/index.html') || 
                        window.location.pathname === '' ||
                        !window.location.pathname.includes('.html');
        
        if (isHomePage) {
            // Scroll performansı için debounce
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(setActiveMenuItem, 50);
        }
    });

    // tüm anchor linkler için yumuşak kaydırma ekler
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // başka bir sayfaya giden linklerde yumuşak kaydırma yapmaz
            if (this.getAttribute('href').startsWith('#') && 
                !this.getAttribute('href').endsWith('.html')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // url hash'ini günceller
                    history.pushState(null, null, targetId);
                    
                    // aktif menüyü günceller
                    setTimeout(setActiveMenuItem, 300);
                }
            }
        });
    });

    // masaüstüne geçince mobil menüyü kapatır
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });

    // iletişim formu gönderildikten sonra mesaj gösterir
    const contactForm = document.querySelector('.form');
    const successMessage = document.querySelector('.form-success');

    if (contactForm && successMessage) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // formu otomatik göndermez

            const formData = new FormData(contactForm);
            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    contactForm.style.display = 'none';
                    successMessage.style.display = 'block';
                    contactForm.reset();
                    // 5 saniye sonra tekrar formu gösterir
                    setTimeout(() => {
                        successMessage.style.display = 'none';
                        contactForm.style.display = 'block';
                    }, 5000);
                } else {
                    alert("Form gönderilemedi. Lütfen tekrar deneyin.");
                }
            })
            .catch(error => {
                alert("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
            });
        });
    }

});