// Artimus 2k26 - Arcane/Neuraverse Theme JavaScript

// --- Event Data (Rules & Character details) ---
const eventData = {
    'think-tank': {
        title: 'Prompt Arena (Ask GPT)',
        host: 'Heimerdinger',
        image: 'images/event_Heimerdinger.jpg',
        rules: [
            '<strong>Team Size:</strong> 1 - 2 Members per team.',
            '<strong>Event Duration:</strong> 1 - 2 Hours.',
            '<strong>Rules:</strong>',
            '1. Each team must consist of 1 to 2 members.',
            '2. Teams will be given a word by the event coordinators.',
            '3. Participants must write an explicit description of the word to make GPT guess it correctly.',
            '4. The word itself must not be directly mentioned in the prompt.',
            '5. Teams will be scored based on accuracy, clarity of explanation, and successful AI prediction.',
            '6. The decision of the judges will be final.',
            '<strong>Participants Should Bring:</strong> Laptop or smartphone, Internet connection.',
            '<strong>Instructions:</strong> Read the given word carefully. Write a clear explanation that helps GPT identify the word. Avoid revealing the word directly in the prompt. Follow the instructions given by the coordinators.'
        ]
    },
    'cipher-hunt': {
        title: 'Cipher Run (Treasure hunt)',
        host: 'Jayce',
        image: 'images/event_Jayce.jpg',
        rules: [
            '<strong>Team Size:</strong> 2 - 4 Members per team.',
            '<strong>Event Duration:</strong> 1 - 2 Hours.',
            '<strong>Rules:</strong>',
            '1. Each team must consist of 2 to 4 members.',
            '2. Participants must solve the given problem to obtain the key or clue for the next challenge.',
            '3. Teams must follow the sequence of clues provided by the organizers.',
            '4. Sharing answers or clues with other teams is strictly prohibited.',
            '5. Participants must not tamper with or remove any clues placed by the organizers.',
            '6. The team that successfully completes all challenges in the shortest time will be the winner.',
            '7. The decision of the event coordinators will be final.',
            '<strong>Instructions:</strong> Read each problem carefully before attempting to solve it. Work together as a team to find the correct solution. Use the key obtained to proceed to the next challenge. Follow the instructions of the event coordinators throughout the event.'
        ]
    },
    'code-breakers': {
        title: 'Glitch hunt (Bug Bounty)',
        host: 'Jinx',
        image: 'images/event_Ekko.jpg',
        rules: [
            '<strong>Team Size:</strong> 1 - 3 Members per team.',
            '<strong>Event Duration:</strong> 1 - 2 Hours.',
            '<strong>Rounds:</strong> Round 1: Code Debugging, Round 2: Website Loophole Detection.',
            '<strong>Rules:</strong>',
            '1. Each team must consist of 1 to 3 members.',
            '2. There will be no elimination round. All teams will participate in both rounds.',
            '3. Winners will be selected based on the combined performance in both rounds.',
            '4. Participants must work only on the materials or websites provided by the organizers.',
            '5. The decision of the judges and event coordinators will be final.',
            '<strong>Participants Should Bring:</strong> Laptop, Charger.',
            '<strong>Instructions:</strong> Follow the instructions given by the event coordinators. Manage time effectively for both rounds. Clearly explain the bugs or loopholes you identify. Submit your results before the given deadline.'
        ]
    },
    'innovation-forge': {
        title: 'Code Forge (Mini hackathon)',
        host: 'Viktor',
        image: 'images/event_Viktor.jpg',
        rules: [
            '<strong>Team Size:</strong> 1 - 3 Members per team.',
            '<strong>Event Duration:</strong> 3 Hours.',
            '<strong>Rules:</strong>',
            '1. Each team must consist of 1 to 3 members.',
            '2. Teams must work only on the problem statement provided by the organizers.',
            '3. The total duration of the hackathon will be 3 hours.',
            '4. One new constraint will be introduced every hour, and teams must adapt their solutions accordingly.',
            '5. AI tools and coding assistants are allowed during development.',
            '6. There will be two review rounds during the event to check the progress of the teams.',
            '7. The decision of the judges and organizers will be final.',
            '<strong>Participants Should Bring:</strong> Laptop, Charger, Internet hotspot (if needed), Required software or development tools.',
            '<strong>Instructions:</strong> Arrive at the venue 30 minutes before the event starts. Listen carefully to the problem statement and guidelines given by the coordinators. Work collaboratively with your team to develop the solution. Be prepared to present your progress and final solution during the review rounds.'
        ]
    },
    'power-auction': {
        title: 'PowerPlay Draft (IPL Auction)',
        host: 'Silco',
        image: 'images/event_Silco.jpg',
        rules: [
            'Power comes to those who will do anything to achieve it.',
            'Manage your virtual budget and bid on players to build the ultimate team.',
            'Teams of up to 3 members.',
            'Bidding increments are fixed. No exact tie-breakers.',
            'The highest rated team wins the turf.'
        ]
    },
    'zaun-carnival': {
        title: 'Chaos Carnival (Fun Fiesta)',
        host: 'Ekko',
        image: 'images/event_Jinx.jpg',
        rules: [
            'Welcome to the Fun Fiesta!',
            'Participate in various mini-games and carnival activities.',
            'Collect points at each station to redeem for prizes.',
            'Keep it clean â€“ no fighting with the enforcers!'
        ]
    },
    'battle-nexus': {
        title: 'Jinx Playground (E-Sports)',
        host: 'Vi',
        image: 'images/event_Vi.jpg',
        rules: [
            'Step into the ring. Standard Esports tournament brackets.',
            'Titles include Valorant and BGMI.',
            'Bring your own peripherals (optional but recommended).',
            'Toxic behavior will lead to disqualification. Respect the ring.',
        ]
    },
    'piltover-gala': {
        title: 'SoundStorm (Sound Party)',
        host: 'Caitlyn',
        image: 'images/event_Mel.jpg',
        rules: [
            'A classy Gowned Party event.',
            'Dress code is strictly formal / gala attire.',
            'Enjoy music, networking, and high-society Piltover elegance.',
            'Weapons are to be checked at the door.'
        ]
    }
};

// --- COUNTDOWN TIMER ---
// Set date for the symposium
const eventDate = new Date('2026-12-30T10:00:00+05:30');

function updateCountdown() {
    const now = new Date().getTime();
    const distance = eventDate.getTime() - now;

    if (distance < 0) {
        document.getElementById("days").innerText = "00";
        document.getElementById("hours").innerText = "00";
        document.getElementById("minutes").innerText = "00";
        document.getElementById("seconds").innerText = "00";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Add leading zero
    document.getElementById("days").innerText = String(days).padStart(2, '0');
    document.getElementById("hours").innerText = String(hours).padStart(2, '0');
    document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
    document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// --- EVENT FILTERING ---
const filterBtns = document.querySelectorAll('.filter-btn');
const eventCards = document.querySelectorAll('.neura-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        eventCards.forEach(card => {
            if (filterValue === 'all') {
                card.style.display = 'flex';
                // Trigger reflow for animation
                setTimeout(() => card.style.opacity = '1', 10);
            } else if (card.getAttribute('data-category') === filterValue) {
                card.style.display = 'flex';
                setTimeout(() => card.style.opacity = '1', 10);
            } else {
                card.style.opacity = '0';
                setTimeout(() => card.style.display = 'none', 300); // Wait for fade out
            }
        });
    });
});

// --- MODAL LOGIC ---
const modalContainer = document.getElementById('modal-container');
const modalTitle = document.getElementById('modal-title');
const modalImage = document.getElementById('modal-char-img');
const modalRules = document.getElementById('modal-rules');

function openModal(eventId) {
    const data = eventData[eventId];
    if (!data) return;

    // Populate data
    modalTitle.textContent = data.title;
    modalImage.src = data.image;

    // Populate Rules
    modalRules.innerHTML = '';
    const ul = document.createElement('ul');
    data.rules.forEach(rule => {
        const li = document.createElement('li');
        li.innerHTML = rule;
        ul.appendChild(li);
    });
    modalRules.appendChild(ul);

    // Show modal
    modalContainer.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeModal() {
    modalContainer.classList.remove('active');
    document.body.style.overflow = 'auto'; // Restore background scrolling
}

// Close modal on outside click
modalContainer.addEventListener('click', (e) => {
    if (e.target === modalContainer) {
        closeModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalContainer.classList.contains('active')) {
        closeModal();
    }
});

// --- SCROLL ANIMATIONS ---
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    // Neuraverse shrinks paddings slightly on scroll
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(11, 17, 32, 0.95)';
        navbar.style.padding = '0.5rem 0';
        navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.5)';
    } else {
        navbar.style.background = 'rgba(11, 17, 32, 0.85)';
        navbar.style.padding = '0 0';
        navbar.style.boxShadow = 'none';
    }
});

// Interaction Observers for Element reveals
const revealElements = document.querySelectorAll('.reveal');

function revealVisibleElements() {
    revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 200 && rect.bottom > -200) {
            el.classList.add('active');
        }
    });
}

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.05 });

revealElements.forEach(el => {
    revealObserver.observe(el);
});

window.addEventListener('load', revealVisibleElements);
window.addEventListener('scroll', revealVisibleElements, { passive: true });
window.addEventListener('hashchange', () => {
    setTimeout(revealVisibleElements, 100);
});
setTimeout(revealVisibleElements, 500);
setTimeout(revealVisibleElements, 1800);

// Loader 
window.addEventListener('load', () => {
    const loader = document.getElementById('welcome-loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1500); // 1.5s
    }
});

// --- SPIDER WEB (PARTICLES) BACKGROUND ---
const canvas = document.getElementById('spider-web');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const mouse = { x: null, y: null, radius: 150 };

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initParticles();
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.size = (Math.random() * 2) + 0.5;
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            // Slow, drifting movement
            this.dx = (Math.random() - 0.5) * 0.8;
            this.dy = (Math.random() - 0.5) * 0.8;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 242, 255, 0.4)'; // Cyber cyan
            ctx.fill();
        }

        update() {
            // Bounce off edges
            if (this.x > width || this.x < 0) this.dx = -this.dx;
            if (this.y > height || this.y < 0) this.dy = -this.dy;

            this.x += this.dx;
            this.y += this.dy;

            // Connect to mouse interactions (repel slightly)
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouse.radius - distance) / mouse.radius;
                    const dirX = forceDirectionX * force * 1.5;
                    const dirY = forceDirectionY * force * 1.5;
                    this.x -= dirX;
                    this.y -= dirY;
                }
            }
            this.draw();
        }
    }

    function initParticles() {
        particles = [];
        // Density based on screen size
        let numberOfParticles = Math.floor((width * height) / 10000);
        for (let i = 0; i < numberOfParticles; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
        }

        // Draw connections (Spider web effect)
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 242, 255, ${0.2 * (1 - distance / 120)})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
            // Draw lines from nodes to the mouse if nearby
            if (mouse.x !== null && mouse.y !== null) {
                let dxMouse = mouse.x - particles[a].x;
                let dyMouse = mouse.y - particles[a].y;
                let distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
                if (distanceMouse < mouse.radius) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 242, 255, ${0.3 * (1 - distanceMouse / mouse.radius)})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
    }

    // Initialize Canvas
    window.addEventListener('load', () => {
        resize();
        animateParticles();
    });
}

// --- BACKGROUND SLIDER LOGIC ---
const bgImages = [
    'images/textless_bg_1.jpg',
    'images/textless_bg_2.jpg',
    'images/textless_bg_3.jpg',
    'images/textless_bg_4.jpg',
    'images/textless_bg_5.jpg',
    'images/textless_bg_6.jpg',
    'images/textless_bg_7.jpg',
    'images/textless_bg_8.jpg'
];

const bgSlider = document.getElementById('bg-slider');

if (bgSlider) {
    // 1. Create img tags for each bgImage
    bgImages.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.classList.add('bg-slide');
        if (index === 0) img.classList.add('active'); // First image is active
        bgSlider.insertBefore(img, bgSlider.querySelector('.bg-overlay'));
    });

    const slides = document.querySelectorAll('.bg-slide');
    let currentSlide = 0;

    // 2. Rotate images every 6 seconds
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 6000);
}

// --- REGISTRATION FORM LOGIC ---
const registerForm = document.getElementById('registration-form');
if (registerForm) {
    const checkboxes = registerForm.querySelectorAll('input[type="checkbox"][name="events"]');
    const submitBtn = document.getElementById('submit-btn');
    const submitNote = document.getElementById('submit-note');
    const formMessage = document.getElementById('form-message');

    // Enable/disable submit button based on checkbox selection
    function validateCheckboxes() {
        let isChecked = false;
        checkboxes.forEach(cb => {
            if (cb.checked) isChecked = true;
        });

        if (isChecked) {
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
            submitBtn.style.background = '';
            submitBtn.style.color = '';
            submitBtn.style.borderColor = '';
            submitNote.style.color = 'var(--neon-cyan)';
            submitNote.innerText = 'Ready to register!';
        } else {
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.5';
            submitBtn.style.cursor = 'not-allowed';
            submitBtn.style.background = 'var(--bg-card)';
            submitBtn.style.color = 'var(--text-muted)';
            submitBtn.style.borderColor = 'rgba(255,255,255,0.1)';
            submitNote.style.color = 'var(--neon-pink)';
            submitNote.innerText = 'Please select at least one event to continue';
        }
    }

    checkboxes.forEach(cb => {
        cb.addEventListener('change', validateCheckboxes);
    });

    // Handle form submission
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> SUBMITTING...';
        formMessage.style.display = 'none';

        // Gather form data
        const formData = new FormData(registerForm);
        const data = Object.fromEntries(formData.entries());

        // Handle multiple checkboxes (formData.entries() only gets the last one for identical names if used with Object.fromEntries)
        const selectedEvents = [];
        checkboxes.forEach(cb => {
            if (cb.checked) selectedEvents.push(cb.value);
        });
        data.events = selectedEvents.join(', ');

        try {
            // Replace with your actual backend URL when deployed
            const response = await fetch('http://127.0.0.1:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                formMessage.style.display = 'block';
                formMessage.style.background = 'rgba(253, 224, 71, 0.1)';
                formMessage.style.color = 'var(--neon-cyan)';
                formMessage.style.border = '1px solid var(--neon-cyan)';
                formMessage.innerHTML = '<i class="fa-solid fa-circle-check"></i> Registration successful! Welcome to the Undercity.';
                registerForm.reset();
                validateCheckboxes();
                submitNote.innerText = ''; // Clear the "Please select event" text visually after a success
            } else {
                throw new Error(result.error || 'Failed to register');
            }
        } catch (error) {
            formMessage.style.display = 'block';
            formMessage.style.background = 'rgba(180, 83, 9, 0.1)';
            formMessage.style.color = 'var(--neon-pink)';
            formMessage.style.border = '1px solid var(--neon-pink)';

            let errorMsg = error.message;
            if (errorMsg === 'Failed to fetch') {
                errorMsg = 'Failed to connect to the server. Please ensure the Python backend is running.';
            }

            formMessage.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Error: ${errorMsg}`;
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'REGISTER NOW';
            validateCheckboxes(); // re-validate to set correct visual state
        }
    });
}

// ==========================================================================
// ARTIMUS 2K26 — ML FORECAST DASHBOARD INTEGRATION
// ==========================================================================

const API_BASE = window.location.origin.includes(':5000')
    ? '/api'
    : 'http://127.0.0.1:5000/api';

const forecastState = {
    summary: null,
    monthlyTotals: [],
    forecastRecords: [],
    customers: [],
    historicalData: null,
    activeChartType: 'bar',
    monthlyChartInstance: null,
    historicalChartInstance: null,
    searchQuery: '',
    volumeFilter: 'all',
    isLoading: false,
    isOnline: false
};

/**
 * Initialize Forecast Dashboard
 */
async function initForecastDashboard() {
    const errorBanner = document.getElementById('forecast-error-banner');
    const statusDot = document.getElementById('api-status-dot');
    const statusText = document.getElementById('api-status-text');
    const refreshBtn = document.getElementById('refresh-forecast-btn');
    const refreshIcon = document.getElementById('refresh-icon');

    if (!document.getElementById('forecast')) return;

    try {
        if (refreshIcon) refreshIcon.classList.add('fa-spin');
        forecastState.isLoading = true;

        if (statusDot) {
            statusDot.className = 'pulse-dot warning';
            statusText.textContent = 'CONNECTING TO FORECAST ENGINE...';
        }

        // Fetch all required data in parallel
        const [summaryRes, forecastRes, customersRes, histRes] = await Promise.all([
            fetch(`${API_BASE}/forecast/summary`).then(r => {
                if (!r.ok) throw new Error(`Summary API returned ${r.status}`);
                return r.json();
            }),
            fetch(`${API_BASE}/forecast`).then(r => {
                if (!r.ok) throw new Error(`Forecast API returned ${r.status}`);
                return r.json();
            }),
            fetch(`${API_BASE}/forecast/customers`).then(r => {
                if (!r.ok) throw new Error(`Customer API returned ${r.status}`);
                return r.json();
            }),
            fetch(`${API_BASE}/forecast/historical`).then(r => {
                if (!r.ok) throw new Error(`Historical API returned ${r.status}`);
                return r.json();
            })
        ]);

        // Validate summary payload
        if (summaryRes.status !== 'success') {
            throw new Error(summaryRes.error || 'Failed to load forecast summary');
        }

        forecastState.summary = summaryRes;
        forecastState.monthlyTotals = forecastRes.monthly_totals || [];
        forecastState.forecastRecords = forecastRes.data || [];
        forecastState.customers = customersRes.customers || [];
        forecastState.historicalData = histRes;
        forecastState.isOnline = true;

        // Update status pill
        if (statusDot) {
            statusDot.className = 'pulse-dot';
            statusText.textContent = 'API CONNECTED | 2027 WORKBOOK LIVE';
        }
        if (errorBanner) errorBanner.style.display = 'none';

        // Update Last Updated Timestamp
        const lastUpdatedEl = document.getElementById('last-updated-text');
        if (lastUpdatedEl) {
            const now = new Date();
            const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            lastUpdatedEl.innerHTML = `<i class="fa-solid fa-file-excel" style="color: #22c55e;"></i> Workbook Synced at ${timeStr}`;
        }

        // Render Dashboard Components
        renderKPICards(summaryRes);
        renderMonthlyStats(forecastState.monthlyTotals, forecastState.summary);
        initOrUpdateMonthlyChart();
        initOrUpdateHistoricalChart();
        renderCustomerTable();

        // Ensure reveal container is active
        const forecastSec = document.getElementById('forecast');
        if (forecastSec) {
            const rev = forecastSec.querySelector('.reveal');
            if (rev) rev.classList.add('active');
        }

    } catch (err) {
        console.error('Forecast Dashboard Error:', err);
        forecastState.isOnline = false;

        if (statusDot) {
            statusDot.className = 'pulse-dot error';
            statusText.textContent = 'OFFLINE | BACKEND REQUIRED';
        }

        if (errorBanner) {
            errorBanner.style.display = 'flex';
            const msgEl = document.getElementById('forecast-error-message');
            if (msgEl) {
                msgEl.innerHTML = `Unable to communicate with Flask backend at <code>${API_BASE}</code> (${err.message}). Please ensure <code>python backend/app.py</code> is running.`;
            }
        }
    } finally {
        forecastState.isLoading = false;
        if (refreshIcon) refreshIcon.classList.remove('fa-spin');
    }
}

/**
 * Render A. KPI Cards with dynamic values
 */
function renderKPICards(summary) {
    const totalEl = document.getElementById('kpi-total-bookings');
    const customersEl = document.getElementById('kpi-customers-analysed');
    const monthsEl = document.getElementById('kpi-months-forecasted');
    const yearEl = document.getElementById('kpi-forecast-year');
    const accuracyEl = document.getElementById('kpi-accuracy-status');
    const accuracySubEl = document.getElementById('kpi-accuracy-subtext');

    if (totalEl) {
        totalEl.innerHTML = Number(summary.total_estimated_bookings).toLocaleString();
    }
    if (customersEl) {
        customersEl.innerHTML = summary.customers_analysed;
    }
    if (monthsEl) {
        monthsEl.innerHTML = `${summary.months_forecasted} Months`;
        const sub = document.getElementById('kpi-months-subtext');
        if (sub && summary.forecasted_months) {
            sub.textContent = summary.forecasted_months.join(', ');
        }
    }
    if (yearEl) {
        yearEl.innerHTML = summary.forecast_year;
    }
    if (accuracyEl) {
        accuracyEl.textContent = summary.accuracy || 'Not evaluated';
    }
    if (accuracySubEl) {
        accuracySubEl.textContent = summary.data_type || 'Baseline estimates, not confirmed bookings';
    }
}

/**
 * Render B. Monthly Stats (Cards & Breakdown)
 */
function renderMonthlyStats(monthlyTotals, summary) {
    const total = summary.total_estimated_bookings || 2950;

    monthlyTotals.forEach(m => {
        const mLower = m.month.toLowerCase();
        let boxId = '';
        if (mLower.includes('jan')) boxId = 'jan';
        else if (mLower.includes('feb')) boxId = 'feb';
        else if (mLower.includes('mar')) boxId = 'mar';

        if (boxId) {
            const valEl = document.getElementById(`val-month-${boxId}`);
            const pctEl = document.getElementById(`pct-month-${boxId}`);

            if (valEl) {
                valEl.innerHTML = Number(m.forecast_bookings).toLocaleString();
            }
            if (pctEl) {
                const pct = ((m.forecast_bookings / total) * 100).toFixed(1);
                pctEl.textContent = `${pct}% of Q1`;
            }
        }
    });
}

/**
 * Initialize or Update Monthly Forecast Chart (Chart.js)
 */
function initOrUpdateMonthlyChart() {
    const canvas = document.getElementById('monthlyForecastChart');
    if (!canvas || !window.Chart) return;

    const ctx = canvas.getContext('2d');
    const totals = forecastState.monthlyTotals;

    const labels = totals.map(t => `${t.month} 2027`);
    const dataValues = totals.map(t => t.forecast_bookings);

    if (forecastState.monthlyChartInstance) {
        forecastState.monthlyChartInstance.destroy();
    }

    const isBar = forecastState.activeChartType === 'bar';

    // Gradients for bars / lines
    const goldGradient = ctx.createLinearGradient(0, 0, 0, 300);
    goldGradient.addColorStop(0, 'rgba(253, 224, 71, 0.85)');
    goldGradient.addColorStop(1, 'rgba(180, 83, 9, 0.35)');

    const chartConfig = {
        type: isBar ? 'bar' : 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Forecast Bookings (2027)',
                data: dataValues,
                backgroundColor: isBar ? goldGradient : 'rgba(253, 224, 71, 0.15)',
                borderColor: '#fde047',
                borderWidth: 2,
                borderRadius: isBar ? 8 : 0,
                fill: !isBar,
                tension: 0.35,
                pointBackgroundColor: '#fde047',
                pointBorderColor: '#0b1120',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 9
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#cbd5e1',
                        font: { family: "'Space Mono', monospace", size: 12 }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(11, 17, 32, 0.95)',
                    titleColor: '#fde047',
                    bodyColor: '#f8fafc',
                    borderColor: 'rgba(253, 224, 71, 0.4)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    titleFont: { family: "'Space Mono', monospace", size: 13, weight: 'bold' },
                    bodyFont: { family: "'Inter', sans-serif", size: 12 },
                    callbacks: {
                        label: function (context) {
                            const val = context.parsed.y;
                            const total = forecastState.summary ? forecastState.summary.total_estimated_bookings : 2950;
                            const pct = ((val / total) * 100).toFixed(1);
                            return [
                                `Estimated Bookings: ${val.toLocaleString()}`,
                                `Share of Q1 2027: ${pct}%`,
                                `Status: Arithmetic baseline average`
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: {
                        color: '#cbd5e1',
                        font: { family: "'Space Mono', monospace", size: 12 }
                    }
                },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.08)' },
                    ticks: {
                        color: '#cbd5e1',
                        font: { family: "'Space Mono', monospace", size: 11 },
                        callback: function (val) { return val.toLocaleString(); }
                    },
                    suggestedMax: 1500
                }
            }
        }
    };

    forecastState.monthlyChartInstance = new Chart(ctx, chartConfig);
}

/**
 * Initialize or Update Historical Analysis Chart (Chart.js)
 */
function initOrUpdateHistoricalChart() {
    const canvas = document.getElementById('historicalComparisonChart');
    if (!canvas || !window.Chart || !forecastState.historicalData) return;

    const ctx = canvas.getContext('2d');
    const comp = forecastState.historicalData.comparison || [];

    const labels = comp.map(c => c.month);
    const data2024 = comp.map(c => c.actual_2024);
    const data2025 = comp.map(c => c.actual_2025);
    const data2027 = comp.map(c => c.forecast_2027);

    if (forecastState.historicalChartInstance) {
        forecastState.historicalChartInstance.destroy();
    }

    const chartConfig = {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: '2024 Actual',
                    data: data2024,
                    backgroundColor: 'rgba(180, 83, 9, 0.75)',
                    borderColor: '#b45309',
                    borderWidth: 1.5,
                    borderRadius: 4
                },
                {
                    label: '2025 Actual',
                    data: data2025,
                    backgroundColor: 'rgba(245, 158, 11, 0.85)',
                    borderColor: '#f59e0b',
                    borderWidth: 1.5,
                    borderRadius: 4
                },
                {
                    label: '2027 Forecast',
                    data: data2027,
                    backgroundColor: 'rgba(253, 224, 71, 0.9)',
                    borderColor: '#fde047',
                    borderWidth: 1.5,
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#cbd5e1',
                        font: { family: "'Space Mono', monospace", size: 11 },
                        boxWidth: 14
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(11, 17, 32, 0.95)',
                    titleColor: '#fde047',
                    bodyColor: '#f8fafc',
                    borderColor: 'rgba(253, 224, 71, 0.4)',
                    borderWidth: 1,
                    padding: 10,
                    titleFont: { family: "'Space Mono', monospace", size: 12, weight: 'bold' },
                    bodyFont: { family: "'Inter', sans-serif", size: 11 }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: {
                        color: '#cbd5e1',
                        font: { family: "'Space Mono', monospace", size: 11 }
                    }
                },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.08)' },
                    ticks: {
                        color: '#cbd5e1',
                        font: { family: "'Space Mono', monospace", size: 10 },
                        callback: function (val) { return val.toLocaleString(); }
                    }
                }
            }
        }
    };

    forecastState.historicalChartInstance = new Chart(ctx, chartConfig);
}

/**
 * Render C. Customer Table with Search & Volume Filtering
 */
function renderCustomerTable() {
    const tbody = document.getElementById('customer-table-body');
    const countEl = document.getElementById('table-record-count');
    if (!tbody) return;

    let list = [...forecastState.customers];

    // Filter by search query
    if (forecastState.searchQuery.trim()) {
        const q = forecastState.searchQuery.trim().toLowerCase();
        list = list.filter(c => String(c.customer_id).toLowerCase().includes(q));
    }

    // Filter by volume tier
    if (forecastState.volumeFilter === 'high') {
        list = list.filter(c => c.estimated_bookings >= 100);
    } else if (forecastState.volumeFilter === 'medium') {
        list = list.filter(c => c.estimated_bookings >= 20 && c.estimated_bookings < 100);
    } else if (forecastState.volumeFilter === 'low') {
        list = list.filter(c => c.estimated_bookings < 20);
    }

    if (countEl) {
        countEl.textContent = `Showing ${list.length} of ${forecastState.customers.length} customers`;
    }

    if (list.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-4" style="color: var(--text-muted); font-family: var(--font-mono);">
                    <i class="fa-solid fa-filter-circle-xmark"></i> No customers match query "${forecastState.searchQuery}".
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = list.map(c => {
        const jan = c.monthly_breakdown?.January !== undefined ? c.monthly_breakdown.January : '--';
        const feb = c.monthly_breakdown?.February !== undefined ? c.monthly_breakdown.February : '--';
        const mar = c.monthly_breakdown?.March !== undefined ? c.monthly_breakdown.March : '--';
        const confClass = (c.confidence || '').toLowerCase().includes('very') ? 'very-low' : 'low';

        return `
            <tr>
                <td><span class="customer-id-pill">#${c.customer_id}</span></td>
                <td>${c.forecast_year}</td>
                <td>${jan}</td>
                <td>${feb}</td>
                <td>${mar}</td>
                <td><strong class="booking-highlight">${c.estimated_bookings.toLocaleString()}</strong></td>
                <td><span class="conf-pill ${confClass}">${c.confidence || 'Low'}</span></td>
                <td>
                    <button class="table-btn" onclick="openCustomerModal(${c.customer_id})">
                        <i class="fa-solid fa-chart-pie"></i> Details
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Open Customer Breakdown Modal
 */
function openCustomerModal(customerId) {
    const modal = document.getElementById('customer-modal');
    const title = document.getElementById('cmodal-title');
    const body = document.getElementById('cmodal-body');

    if (!modal || !body) return;

    const customer = forecastState.customers.find(c => c.customer_id === customerId);
    if (!customer) return;

    // Also look up historical patterns for this customer if available
    let histInfo = null;
    if (forecastState.historicalData?.customer_patterns) {
        histInfo = forecastState.historicalData.customer_patterns.find(p => p.customer_id === customerId);
    }

    title.innerHTML = `CUSTOMER #${customer.customer_id} — FORECAST BREAKDOWN`;

    const jan = customer.monthly_breakdown?.January ?? 'N/A';
    const feb = customer.monthly_breakdown?.February ?? 'N/A';
    const mar = customer.monthly_breakdown?.March ?? 'N/A';
    const h2024 = histInfo ? histInfo.actual_2024 : 'Available in sheet';
    const h2025 = histInfo ? histInfo.actual_2025 : 'Available in sheet';

    body.innerHTML = `
        <div style="margin-bottom: 1.25rem;">
            <p style="margin-bottom: 0.5rem; color: var(--text-primary);">
                <strong>Target Year:</strong> ${customer.forecast_year} (Q1 Baseline)
            </p>
            <p style="margin-bottom: 0.5rem; color: var(--text-primary);">
                <strong>Total Estimated Q1 Bookings:</strong> <span class="booking-highlight" style="font-size: 1.2rem;">${customer.estimated_bookings}</span>
            </p>
            <p style="margin-bottom: 0.5rem; color: var(--text-primary);">
                <strong>Confidence Rating:</strong> <span class="conf-pill low">${customer.confidence || 'Low'}</span> (limited historical multi-year records)
            </p>
        </div>

        <div style="background: rgba(11, 17, 32, 0.7); border: 1px solid rgba(253, 224, 71, 0.2); border-radius: 8px; padding: 1rem; margin-bottom: 1.25rem;">
            <h5 style="color: var(--neon-cyan); font-family: var(--font-mono); margin-bottom: 0.75rem;">2027 MONTHLY ESTIMATES</h5>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; text-align: center;">
                <div style="background: rgba(30, 41, 59, 0.5); padding: 8px; border-radius: 6px;">
                    <div style="font-size: 0.75rem; color: var(--text-muted);">JAN 2027</div>
                    <div style="font-size: 1.2rem; font-weight: bold; color: var(--neon-cyan);">${jan}</div>
                </div>
                <div style="background: rgba(30, 41, 59, 0.5); padding: 8px; border-radius: 6px;">
                    <div style="font-size: 0.75rem; color: var(--text-muted);">FEB 2027</div>
                    <div style="font-size: 1.2rem; font-weight: bold; color: var(--neon-cyan);">${feb}</div>
                </div>
                <div style="background: rgba(30, 41, 59, 0.5); padding: 8px; border-radius: 6px;">
                    <div style="font-size: 0.75rem; color: var(--text-muted);">MAR 2027</div>
                    <div style="font-size: 1.2rem; font-weight: bold; color: var(--neon-cyan);">${mar}</div>
                </div>
            </div>
        </div>

        <div style="background: rgba(11, 17, 32, 0.7); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 1rem;">
            <h5 style="color: #cbd5e1; font-family: var(--font-mono); margin-bottom: 0.5rem;">HISTORICAL VOLUME REFERENCE</h5>
            <p style="font-size: 0.82rem; margin-bottom: 0.3rem;">• <strong>2024 Actual Q1 Bookings:</strong> ${h2024}</p>
            <p style="font-size: 0.82rem; margin-bottom: 0.3rem;">• <strong>2025 Actual Q1 Bookings:</strong> ${h2025}</p>
            <p style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.5rem; font-style: italic;">
                Calculation: Arithmetic mean of 2024 & 2025 observations for same month. Months without historical data remain unforecasted.
            </p>
        </div>
    `;

    modal.style.display = 'flex';
}

function closeCustomerModal() {
    const modal = document.getElementById('customer-modal');
    if (modal) modal.style.display = 'none';
}

// Setup Event Listeners for Dashboard Controls
function setupForecastEventListeners() {
    // 1. Chart view toggle (Bar / Line)
    const btnBar = document.getElementById('btn-chart-bar');
    const btnLine = document.getElementById('btn-chart-line');

    if (btnBar && btnLine) {
        btnBar.addEventListener('click', () => {
            btnBar.classList.add('active');
            btnLine.classList.remove('active');
            forecastState.activeChartType = 'bar';
            initOrUpdateMonthlyChart();
        });

        btnLine.addEventListener('click', () => {
            btnLine.classList.add('active');
            btnBar.classList.remove('active');
            forecastState.activeChartType = 'line';
            initOrUpdateMonthlyChart();
        });
    }

    // 2. Customer search input
    const searchInput = document.getElementById('customer-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            forecastState.searchQuery = e.target.value;
            renderCustomerTable();
        });
    }

    // 3. Customer volume filter
    const volumeFilter = document.getElementById('customer-volume-filter');
    if (volumeFilter) {
        volumeFilter.addEventListener('change', (e) => {
            forecastState.volumeFilter = e.target.value;
            renderCustomerTable();
        });
    }

    // 4. Manual sync/refresh button
    const refreshBtn = document.getElementById('refresh-forecast-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            initForecastDashboard();
        });
    }

    // 5. Close customer modal on background click
    const customerModal = document.getElementById('customer-modal');
    if (customerModal) {
        customerModal.addEventListener('click', (e) => {
            if (e.target === customerModal) {
                closeCustomerModal();
            }
        });
    }
}

// Auto-run when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setupForecastEventListeners();
        initForecastDashboard();
    });
} else {
    setupForecastEventListeners();
    initForecastDashboard();
}


