document.addEventListener('DOMContentLoaded', function() {
    // Hamburger menü ve overlay elementlerini seç
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const mobileOverlay = document.getElementById('mobile-menu-overlay');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    // Menü toggle fonksiyonu
    function toggleMenu() {
        navMenu.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        
        // İkon değiştirme
        const icon = navToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    }
    
    // Hamburger menüye tıklama
    navToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
    });
    
    // Overlay'e tıklayarak menüyü kapatma
    mobileOverlay.addEventListener('click', toggleMenu);
    
    // Menü linklerine tıklayarak menüyü kapatma
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Sayfa dışına tıklayarak menüyü kapatma
    document.addEventListener('click', function(e) {
        if (navMenu.classList.contains('active') && 
            !e.target.closest('.nav-menu') && 
            !e.target.closest('#nav-toggle')) {
            toggleMenu();
        }
    });

    // Scroll ile header efekti
    window.addEventListener('scroll', function() {
        const header = document.getElementById('header');
        header.classList.toggle('header-scrolled', window.scrollY > 100);
    });

    // Back to top button
    const backToTop = document.getElementById('back-to-top');
    window.addEventListener('scroll', function() {
        backToTop.classList.toggle('active', window.scrollY > 300);
    });

    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Aktif menü item'ını güncelleme
    function updateActiveMenuItem() {
        const sections = document.querySelectorAll('section');
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= (sectionTop - 300) && 
                window.scrollY < (sectionTop + sectionHeight - 300)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Sayfa yüklendiğinde ve scroll olduğunda aktif menüyü güncelle
    window.addEventListener('scroll', updateActiveMenuItem);
    window.addEventListener('load', updateActiveMenuItem);

    // Smooth scroll function
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // URL'de hash güncelleme (sayfa yenilenmesini engellemek için)
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    location.hash = targetId;
                }
            }
        });
    });
});