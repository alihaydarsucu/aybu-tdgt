document.addEventListener('DOMContentLoaded', function() {
    // Mobil menü elemanları
    const navToggle = document.getElementById('nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    
    // Mobil menüyü aç/kapat
    navToggle.addEventListener('click', function() {
        mobileMenu.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Mobil menüyü kapatma fonksiyonu
    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Menü kapatma olayları
    mobileMenuClose.addEventListener('click', closeMobileMenu);
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    
    // ESC tuşu ile menüyü kapat
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Menüdeki bağlantılara tıklanınca menüyü kapat
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-menu a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Takım sekmelerini başlat
    function initTeamTabs() {
        const tabs = document.querySelectorAll('.team-tab');
        const members = document.querySelectorAll('.team-member');
        
        if (tabs.length > 0) { // Sadece ekibimiz.html'de çalışsın
            tabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    // Aktif sekmeyi güncelle
                    tabs.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    
                    const department = this.getAttribute('data-department');
                    
                    // Üyeleri göster/gizle
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
    // Sadece ekibimiz.html'de takım sekmelerini başlat
    if (window.location.pathname.includes('ekibimiz')) {
        initTeamTabs();
    }

    // Header scroll efekti
    window.addEventListener('scroll', function() {
        const header = document.getElementById('header');
        if (window.scrollY > 100) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });

    // Yukarı çık butonu
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
     * Menüde aktif olan bağlantıyı belirler ve 'active' sınıfını ekler.
     * Sayfa yolu ve hash'e göre uygun menü öğesini vurgular.
     */
    function setActiveMenuItem() {
        const navLinks = document.querySelectorAll('.nav-menu a, .mobile-nav-menu a');
        const currentPath = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
        const currentHash = window.location.hash;
        
        // Önce tüm aktif sınıflarını kaldır
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Tüm linkleri kontrol et
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            
            // 1. Durum: Şu anki sayfa index.html ve hash var
            if ((currentPath === 'index.html' || currentPath === '') && currentHash) {
                if (linkHref === currentHash) {
                    link.classList.add('active');
                }
            } 
            // 2. Durum: Diğer sayfalardaki linkler (dergimiz.html, ekibimiz.html, iletisim.html)
            else if (linkHref.includes('.html')) {
                if (linkHref.replace('.html', '') === currentPath) {
                    link.classList.add('active');
                }
            }
            // 3. Durum: Ana sayfa ve hash yoksa (varsayılan olarak #hero aktif)
            else if ((currentPath === 'index.html' || currentPath === '') && !currentHash && linkHref === '#hero') {
                link.classList.add('active');
            }
        });
    }
    // Sayfa yüklendiğinde ve hash değiştiğinde aktif menüyü güncelle
    setActiveMenuItem();
    window.addEventListener('hashchange', setActiveMenuItem);

    // Sadece ana sayfada scroll ile aktif menüyü güncelle
    if (window.location.pathname.includes('index.html') || 
        window.location.pathname === '/' || 
        window.location.pathname === '') {
        window.addEventListener('scroll', function() {
            setActiveMenuItem();
        });
    }

    // Tüm anchor linkler için yumuşak kaydırma
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Başka bir sayfaya giden linklerde yumuşak kaydırma yapma
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
                    
                    // URL hash'ini güncelle (tarayıcı geçmişi için)
                    history.pushState(null, null, targetId);
                    
                    // Aktif menüyü güncelle
                    setTimeout(setActiveMenuItem, 300);
                }
            }
        });
    });

    // Masaüstüne geçince mobil menüyü kapat
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });

    // İletişim formu gönderildikten sonra mesaj göster
    const contactForm = document.querySelector('.form');
    const successMessage = document.querySelector('.form-success');

    if (contactForm && successMessage) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Formu otomatik gönderme

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
                    // 5 saniye sonra tekrar formu göster
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