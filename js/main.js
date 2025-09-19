// Main JavaScript for Proper Labs Documentation

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Active navigation highlighting
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');

    function updateActiveNav() {
        let currentSection = '';

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                currentSection = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === currentSection) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();

    // Search functionality (basic implementation)
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();

            // Filter navigation items
            document.querySelectorAll('.nav-link').forEach(link => {
                const text = link.textContent.toLowerCase();
                const parent = link.closest('li');

                if (text.includes(searchTerm) || searchTerm === '') {
                    parent.style.display = 'block';
                } else {
                    parent.style.display = 'none';
                }
            });
        });
    }

    // Copy code blocks
    document.querySelectorAll('pre').forEach(pre => {
        const wrapper = document.createElement('div');
        wrapper.className = 'code-wrapper';
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);

        const button = document.createElement('button');
        button.className = 'copy-button';
        button.textContent = 'Copy';
        wrapper.appendChild(button);

        button.addEventListener('click', () => {
            const code = pre.querySelector('code');
            const text = code ? code.textContent : pre.textContent;

            navigator.clipboard.writeText(text).then(() => {
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = 'Copy';
                }, 2000);
            });
        });
    });

    // Add copy button styles
    const style = document.createElement('style');
    style.textContent = `
        .code-wrapper {
            position: relative;
        }
        .copy-button {
            position: absolute;
            top: 8px;
            right: 8px;
            padding: 4px 12px;
            background: var(--color-gray-800);
            color: var(--color-white);
            border: 1px solid var(--color-gray-700);
            border-radius: var(--radius-md);
            font-size: var(--text-xs);
            cursor: pointer;
            opacity: 0;
            transition: opacity var(--transition-fast);
        }
        .code-wrapper:hover .copy-button {
            opacity: 1;
        }
        .copy-button:hover {
            background: var(--color-gray-700);
        }
    `;
    document.head.appendChild(style);
});