// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
        navbar.classList.remove('scroll-up');
        navbar.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
        navbar.classList.remove('scroll-down');
        navbar.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for fade-in animation
document.querySelectorAll('.subject-card, .contact-form, .contact-info').forEach(el => {
    observer.observe(el);
});

// Form submission
const contactForm = document.querySelector('.contact-form');
const submitButton = contactForm.querySelector('.submit-button');
const formStatus = document.querySelector('.form-status');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Basic form validation
    const name = contactForm.querySelector('input[name="name"]').value;
    const email = contactForm.querySelector('input[name="email"]').value;
    const phone = contactForm.querySelector('input[name="phone"]').value;
    const classSelect = contactForm.querySelector('select[name="class"]').value;
    const message = contactForm.querySelector('textarea[name="message"]').value;
    
    if (!name || !email || !phone || !classSelect || !message) {
        showFormStatus('Please fill in all fields', 'error');
        return;
    }
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="button-loader"></span> Sending...';
    
    try {
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success message
        showFormStatus('Message sent successfully! We will contact you soon.', 'success');
        contactForm.reset();
    } catch (error) {
        showFormStatus('Failed to send message. Please try again.', 'error');
    } finally {
        // Reset button state
        submitButton.disabled = false;
        submitButton.innerHTML = 'Send Message';
    }
});

function showFormStatus(message, type) {
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
    formStatus.classList.remove('hidden');
    
    // Hide status after 5 seconds
    setTimeout(() => {
        formStatus.classList.add('hidden');
    }, 5000);
}

// Mobile menu functionality
const createMobileMenu = () => {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');
    
    // Create mobile menu button
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.classList.add('mobile-menu-btn');
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    
    // Add mobile menu button to navbar
    navbar.appendChild(mobileMenuBtn);
    
    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target)) {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        }
    });
};

// Initialize mobile menu
createMobileMenu();

// Add loading animation to subject links
document.querySelectorAll('.subject-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        this.classList.add('loading');
        
        // Simulate loading
        setTimeout(() => {
            this.classList.remove('loading');
            // Add your actual link handling here
            alert('Study materials will be available soon!');
        }, 1000);
    });
});

// PDF Preview Modal
const pdfModal = document.getElementById('pdfModal');
const pdfViewer = document.getElementById('pdfViewer');
const modalTitle = document.getElementById('modalTitle');
const closeModal = document.querySelector('.close-modal');
const pdfLoadingIndicator = document.getElementById('pdfLoadingIndicator');
const pdfProgressBar = document.querySelector('#pdfProgressBar .progress-bar');
const zoomInBtn = document.getElementById('zoomInBtn');
const zoomOutBtn = document.getElementById('zoomOutBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');

let currentZoom = 1.0; // Default zoom level

// Function to open PDF preview
function openPdfPreview(pdfUrl, title) {
    modalTitle.textContent = title;
    pdfViewer.src = ''; // Clear previous PDF
    pdfLoadingIndicator.style.display = 'block'; // Show loading indicator
    pdfProgressBar.style.width = '0%'; // Reset progress bar
    document.getElementById('pdfProgressBar').style.display = 'block'; // Show progress bar container
    
    // Reset zoom and fullscreen
    currentZoom = 1.0;
    pdfViewer.style.transform = 'scale(1.0)';
    exitFullscreen(); // Ensure we're not in fullscreen when opening

    pdfViewer.src = pdfUrl;
    pdfModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Function to close PDF preview
function closePdfPreview() {
    pdfModal.classList.remove('active');
    pdfViewer.src = ''; // Clear the PDF viewer
    pdfLoadingIndicator.style.display = 'none'; // Hide loading indicator
    document.getElementById('pdfProgressBar').style.display = 'none'; // Hide progress bar container
    document.body.style.overflow = ''; // Restore scrolling
    
    // Exit fullscreen if active
    exitFullscreen();
}

// Event listeners for PDF preview
document.querySelectorAll('.preview-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const pdfContainer = button.closest('.pdf-container');
        const pdfLink = pdfContainer.querySelector('.subject-link');
        const pdfUrl = pdfLink.getAttribute('data-pdf');
        const title = pdfLink.getAttribute('data-title');
        openPdfPreview(pdfUrl, title);
    });
});

// Close modal when clicking the close button
closeModal.addEventListener('click', closePdfPreview);

// Close modal when clicking outside the content
pdfModal.addEventListener('click', (e) => {
    if (e.target === pdfModal) {
        closePdfPreview();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && pdfModal.classList.contains('active')) {
        closePdfPreview();
    }
});

// Handle PDF loading
pdfViewer.addEventListener('load', () => {
    pdfLoadingIndicator.style.display = 'none'; // Hide loading indicator
    document.getElementById('pdfProgressBar').style.display = 'none'; // Hide progress bar container
    pdfViewer.style.display = 'block'; // Show the viewer
    // Note: iframe doesn't provide progress events, so progress bar is simple on/off
});

// Zoom functionality (may have limited effect on iframe content)
zoomInBtn.addEventListener('click', () => {
    currentZoom += 0.1;
    pdfViewer.style.transform = `scale(${currentZoom})`;
    pdfViewer.style.transformOrigin = 'top left';
});

zoomOutBtn.addEventListener('click', () => {
    currentZoom = Math.max(0.2, currentZoom - 0.1); // Prevent zooming out too much
    pdfViewer.style.transform = `scale(${currentZoom})`;
    pdfViewer.style.transformOrigin = 'top left';
});

// Fullscreen functionality
function toggleFullscreen() {
    const elem = pdfViewer;
    if (!document.fullscreenElement) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            elem.msRequestFullscreen();
        }
    } else {
        exitFullscreen();
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
    }
}

fullscreenBtn.addEventListener('click', toggleFullscreen);

// Adjust iframe style on fullscreen change
document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
        pdfViewer.style.width = '100%';
        pdfViewer.style.height = '100%';
    } else {
        // Restore original size when exiting fullscreen
        pdfViewer.style.width = '100%';
        pdfViewer.style.height = '100%';
    }
});

document.addEventListener('webkitfullscreenchange', () => {
    if (document.webkitFullscreenElement) {
        pdfViewer.style.width = '100%';
        pdfViewer.style.height = '100%';
    } else {
        pdfViewer.style.width = '100%';
        pdfViewer.style.height = '100%';
    }
});

document.addEventListener('msfullscreenchange', () => {
    if (document.msFullscreenElement) {
        pdfViewer.style.width = '100%';
        pdfViewer.style.height = '100%';
    } else {
        pdfViewer.style.width = '100%';
        pdfViewer.style.height = '100%';
    }
});

// Toggle subject sections
function toggleSubject(element) {
    const subjectSection = element.parentElement;
    const isExpanded = subjectSection.classList.contains('expanded');
    
    // Close all other sections
    document.querySelectorAll('.subject-section.expanded').forEach(section => {
        if (section !== subjectSection) {
            section.classList.remove('expanded');
            section.classList.add('collapsed');
        }
    });
    
    // Toggle current section
    if (isExpanded) {
        subjectSection.classList.remove('expanded');
        subjectSection.classList.add('collapsed');
    } else {
        subjectSection.classList.remove('collapsed');
        subjectSection.classList.add('expanded');
    }
}

// Initialize all sections as collapsed
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.subject-section').forEach(section => {
        section.classList.add('collapsed');
    });
});

// Search Functionality
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
let searchTimeout;

// Create search index with caching
let searchIndex = null;
let searchIndexPromise = null;

const createSearchIndex = () => {
    if (searchIndex) return Promise.resolve(searchIndex);
    if (searchIndexPromise) return searchIndexPromise;

    searchIndexPromise = new Promise((resolve) => {
        const chapters = [];
        document.querySelectorAll('.pdf-container').forEach(container => {
            const link = container.querySelector('.subject-link');
            const title = link.getAttribute('data-title');
            const pdfPath = link.getAttribute('data-pdf');
            const chapterName = link.textContent.split(':')[1]?.trim() || '';
            
            chapters.push({
                title,
                pdfPath,
                element: container,
                chapterName,
                keywords: chapterName.toLowerCase().split(/\s+/)
            });
        });
        searchIndex = chapters;
        resolve(chapters);
    });

    return searchIndexPromise;
};

// Improved search function with fuzzy matching
const performSearch = (query) => {
    query = query.toLowerCase().trim();
    if (!searchIndex) return [];
    
    return searchIndex.filter(chapter => {
        // Search in chapter name
        return chapter.keywords.some(keyword => keyword.includes(query));
    });
};

// Display search results
const displayResults = (results) => {
    searchResults.innerHTML = '';
    
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="search-result-item">
                <span class="result-title">No results found</span>
            </div>
        `;
        searchResults.classList.add('active');
        return;
    }
    
    results.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        resultItem.innerHTML = `
            <div>
                <div class="result-title">${result.chapterName}</div>
            </div>
            <div class="result-actions">
                <button class="preview-btn" title="Preview PDF">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="download-btn" title="Download PDF">
                    <i class="fas fa-download"></i>
                </button>
            </div>
        `;
        
        // Add click handlers for preview and download
        const previewBtn = resultItem.querySelector('.preview-btn');
        const downloadBtn = resultItem.querySelector('.download-btn');
        
        previewBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const pdfLink = result.element.querySelector('.subject-link');
            const title = pdfLink.getAttribute('data-title');
            const pdfPath = pdfLink.getAttribute('data-pdf');
            
            modalTitle.textContent = title;
            pdfViewer.src = pdfPath;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            searchResults.classList.remove('active');
        });
        
        downloadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const pdfLink = result.element.querySelector('.subject-link');
            const pdfPath = pdfLink.getAttribute('data-pdf');
            
            const link = document.createElement('a');
            link.href = pdfPath;
            link.download = pdfPath.split('/').pop();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
        
        // Add click handler to scroll to the chapter
        resultItem.addEventListener('click', () => {
            const subjectSection = result.element.closest('.subject-section');
            
            // Expand the subject section
            subjectSection.classList.remove('collapsed');
            subjectSection.classList.add('expanded');
            
            // Scroll to the chapter
            result.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Highlight the chapter briefly
            result.element.style.transition = 'background-color 0.3s ease';
            result.element.style.backgroundColor = '#e3f2fd';
            setTimeout(() => {
                result.element.style.backgroundColor = '';
            }, 2000);
            
            searchResults.classList.remove('active');
        });
        
        searchResults.appendChild(resultItem);
    });
    
    searchResults.classList.add('active');
};

// Improved search event handlers with loading state
const handleSearch = async () => {
    clearTimeout(searchTimeout);
    
    const query = searchInput.value.trim();
    
    // Show loading state
    searchResults.innerHTML = `
        <div class="search-result-item loading">
            <div class="loading-spinner"></div>
            <span>Searching...</span>
        </div>
    `;
    searchResults.classList.add('active');
    
    // Ensure search index is created
    await createSearchIndex();
    
    searchTimeout = setTimeout(() => {
        if (query.length >= 2) {
            const results = performSearch(query);
            displayResults(results);
        } else {
            searchResults.classList.remove('active');
        }
    }, 150);
};

// Add input event listeners with passive option for better performance
searchInput.addEventListener('input', handleSearch, { passive: true });

// Improved click outside handler
const handleClickOutside = (e) => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.classList.remove('active');
    }
};

document.addEventListener('click', handleClickOutside, { passive: true });

// Add keyboard navigation for search results
searchInput.addEventListener('keydown', (e) => {
    const results = searchResults.querySelectorAll('.search-result-item');
    const currentIndex = Array.from(results).findIndex(item => item.classList.contains('selected'));
    
    switch(e.key) {
        case 'ArrowDown':
            e.preventDefault();
            if (currentIndex < results.length - 1) {
                results[currentIndex]?.classList.remove('selected');
                results[currentIndex + 1].classList.add('selected');
                results[currentIndex + 1].scrollIntoView({ block: 'nearest' });
            }
            break;
        case 'ArrowUp':
            e.preventDefault();
            if (currentIndex > 0) {
                results[currentIndex]?.classList.remove('selected');
                results[currentIndex - 1].classList.add('selected');
                results[currentIndex - 1].scrollIntoView({ block: 'nearest' });
            }
            break;
        case 'Enter':
            e.preventDefault();
            const selectedResult = searchResults.querySelector('.search-result-item.selected');
            if (selectedResult) {
                selectedResult.click();
            }
            break;
        case 'Escape':
            searchResults.classList.remove('active');
            break;
    }
});

// Load chapter names from configuration
let chapterConfig = null;

async function loadChapterConfig() {
    try {
        const response = await fetch('config/chapters.json');
        chapterConfig = await response.json();
        updateChapterNames();
    } catch (error) {
        console.error('Error loading chapter configuration:', error);
    }
}

function updateChapterNames() {
    if (!chapterConfig) return;

    document.querySelectorAll('.pdf-container').forEach(container => {
        const link = container.querySelector('.subject-link');
        const pdfPath = link.getAttribute('data-pdf');
        const [_, classNum, subject, chapter] = pdfPath.split('/');
        
        const className = classNum.toLowerCase();
        const subjectName = subject.toLowerCase();
        const chapterNum = chapter.replace('.pdf', '');
        
        if (chapterConfig[className] && 
            chapterConfig[className][subjectName] && 
            chapterConfig[className][subjectName][chapterNum]) {
            
            const chapterTitle = chapterConfig[className][subjectName][chapterNum];
            link.innerHTML = `<i class="fas fa-file-pdf"></i> Chapter ${chapterNum.replace('chapter', '')}: ${chapterTitle}`;
            link.setAttribute('data-title', `Class ${className.replace('class', '')} ${subjectName.charAt(0).toUpperCase() + subjectName.slice(1)} - Chapter ${chapterNum.replace('chapter', '')}`);
        }
    });
}

// Load configuration when the page loads
document.addEventListener('DOMContentLoaded', function() {
    loadChapterConfig();
}); 