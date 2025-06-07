function initTeamTabs() {
    const tabs = document.querySelectorAll('.team-tab');
    const members = document.querySelectorAll('.team-member');
    
    if (tabs.length > 0) { // Sadece team.html'de çalışsın
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Aktif tabı güncelle
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

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu elements
    const navToggle = document.getElementById('nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    
    // Toggle mobile menu
    navToggle.addEventListener('click', function() {
        mobileMenu.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Close mobile menu function
    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Close menu events
    mobileMenuClose.addEventListener('click', closeMobileMenu);
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    
    // Close menu with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Close menu when clicking on links
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-menu a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Initialize team tabs if on team.html
    if (window.location.pathname.includes('team.html')) {
        initTeamTabs();
    }

    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.getElementById('header');
        if (window.scrollY > 100) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });

    // Back to top button
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

    // Aktif menü öğesini belirleme fonksiyonu
    function setActiveMenuItem() {
        const navLinks = document.querySelectorAll('.nav-menu a, .mobile-nav-menu a');
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const currentHash = window.location.hash;
        
        // Önce tüm aktif sınıflarını kaldır
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Eğer hash varsa (index.html sayfasındaki bölümler için)
        if (currentHash) {
            const activeLink = document.querySelector(`.nav-menu a[href="${currentHash}"], .mobile-nav-menu a[href="${currentHash}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        } 
        // Eğer hash yoksa, hangi sayfada olduğumuza bak
        else {
            navLinks.forEach(link => {
                const linkPage = link.getAttribute('href');
                // Link bir sayfaya mı gidiyor yoksa bölüme mi?
                if (linkPage.includes('.html')) {
                    if (linkPage === currentPage) {
                        link.classList.add('active');
                    }
                } else if (currentPage === 'index.html' && linkPage === '#hero') {
                    // Ana sayfada ve hash yoksa Ana Sayfa linkini aktif yap
                    link.classList.add('active');
                }
            });
        }
    }

    // Sayfa yüklendiğinde ve hash değiştiğinde aktif menüyü güncelle
    setActiveMenuItem();
    window.addEventListener('hashchange', setActiveMenuItem);

    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Don't smooth scroll if it's a link to another page
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
                    
                    // Aktif menüyü güncelle
                    setTimeout(setActiveMenuItem, 300);
                }
            }
        });
    });

    // Close mobile menu when resizing to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });
});