/**
 * IELTS Assistance Bangladesh - Core Application Controller
 * Bright Red & White Theme
 */

// Application State
const state = {
  selectedCourseId: null,
  activeFaqCategory: 'all',
  faqSearchTerm: '',
  enrollments: [],
  activeBlog: null
};

// Initialize App on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  loadEnrollments();
  renderCourses();
  renderFaqs();
  renderBlog();
  renderTestimonials();
  setupEventListeners();
  setupSmoothScroll();
});

// Load enrollments from localStorage
function loadEnrollments() {
  const saved = localStorage.getItem('iab_enrollments');
  if (saved) {
    try {
      state.enrollments = JSON.parse(saved);
    } catch (e) {
      state.enrollments = [];
    }
  }
}

function saveEnrollments() {
  localStorage.setItem('iab_enrollments', JSON.stringify(state.enrollments));
}

// Render Courses Grid
function renderCourses() {
  const container = document.getElementById('courses-container');
  if (!container) return;

  container.innerHTML = coursesData.map(course => `
    <div class="course-card ${course.badge ? 'featured' : ''}" id="course-${course.id}">
      ${course.badge ? `<span class="course-top-badge">${course.badge}</span>` : ''}
      <div>
        <h3 class="course-title">${course.title}</h3>
        <p class="course-tagline">${course.tagline}</p>
        
        <div class="course-price-box">
          <span class="course-price">৳${course.price.toLocaleString()}</span>
          <span class="course-original-price">৳${course.originalPrice.toLocaleString()}</span>
          <span class="badge badge-red" style="margin-left:auto;">Save ৳${(course.originalPrice - course.price).toLocaleString()}</span>
        </div>

        <ul class="course-meta-list">
          <li class="course-meta-item">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            <strong>Level:</strong> ${course.level}
          </li>
          <li class="course-meta-item">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <strong>Duration:</strong> ${course.duration}
          </li>
          <li class="course-meta-item">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            <strong>Schedule:</strong> ${course.schedule}
          </li>
          <li class="course-meta-item">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <strong>Mock Tests:</strong> ${course.mockTests}
          </li>
        </ul>
      </div>

      <div class="course-actions">
        <button class="btn btn-primary" onclick="openEnrollmentModal('${course.id}')">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
          Enroll Now
        </button>
        <button class="btn btn-outline-red" onclick="showCourseDetails('${course.id}')">Details</button>
      </div>
    </div>
  `).join('');

  // Populate course dropdown in modal
  const dropdown = document.getElementById('modal-course-select');
  if (dropdown) {
    dropdown.innerHTML = coursesData.map(c => 
      `<option value="${c.id}">${c.title} (৳${c.price})</option>`
    ).join('');
  }
}

// Render FAQs Accordion
function renderFaqs() {
  const container = document.getElementById('faq-container');
  if (!container) return;

  const filtered = faqData.filter(faq => {
    const matchCategory = state.activeFaqCategory === 'all' || faq.category === state.activeFaqCategory;
    const matchSearch = faq.question.toLowerCase().includes(state.faqSearchTerm.toLowerCase()) || 
                        faq.answer.toLowerCase().includes(state.faqSearchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--text-muted);">
        <p>No questions found matching your search term. Feel free to contact our support team!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map((faq, idx) => `
    <div class="faq-item ${idx === 0 ? 'active' : ''}">
      <div class="faq-question" onclick="toggleFaq(this)">
        <span>${faq.question}</span>
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
      </div>
      <div class="faq-answer">
        <p>${faq.answer}</p>
      </div>
    </div>
  `).join('');
}

function toggleFaq(element) {
  const item = element.parentElement;
  const isActive = item.classList.contains('active');
  
  // Close all other faqs
  document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));
  
  if (!isActive) {
    item.classList.add('active');
  }
}

// Render Blog Articles
function renderBlog() {
  const container = document.getElementById('blog-container');
  if (!container) return;

  container.innerHTML = blogData.map(post => `
    <div class="blog-card">
      <img src="${post.image}" alt="${post.title}" class="blog-image" />
      <div class="blog-body">
        <div class="blog-meta">
          <span class="badge badge-red">${post.category}</span>
          <span>•</span>
          <span>${post.readTime}</span>
        </div>
        <h3 class="blog-title">${post.title}</h3>
        <p class="blog-summary">${post.summary}</p>
        <button class="blog-read-btn" onclick="openBlogModal('${post.id}')">
          Read Strategy Guide 
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </button>
      </div>
    </div>
  `).join('');
}

// Render Testimonials
function renderTestimonials() {
  const container = document.getElementById('testimonials-container');
  if (!container) return;

  container.innerHTML = testimonialsData.map(t => `
    <div class="testimonial-card">
      <div class="testimonial-user">
        <img src="${t.avatar}" alt="${t.name}" />
        <div class="testimonial-info">
          <h4>${t.name}</h4>
          <p>${t.university}</p>
        </div>
      </div>
      <span class="band-badge">${t.score}</span>
      <p style="font-size:0.8rem; color:var(--text-muted);">${t.breakdown}</p>
      <p class="testimonial-quote">"${t.quote}"</p>
    </div>
  `).join('');
}

// Event Listeners
function setupEventListeners() {
  // Mobile menu toggle
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const navDrawer = document.getElementById('mobile-nav-drawer');
  if (menuToggle && navDrawer) {
    menuToggle.addEventListener('click', () => {
      navDrawer.classList.toggle('open');
    });
  }

  // FAQ Search
  const faqInput = document.getElementById('faq-search-input');
  if (faqInput) {
    faqInput.addEventListener('input', (e) => {
      state.faqSearchTerm = e.target.value;
      renderFaqs();
    });
  }

  // Enrollment Form Submission
  const form = document.getElementById('enrollment-form');
  if (form) {
    form.addEventListener('submit', handleEnrollmentSubmit);
  }

  // Direct Contact Form Submission
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value;
      const phone = document.getElementById('contact-phone').value;
      const message = document.getElementById('contact-message').value;

      fetch("https://formsubmit.co/ajax/ieltsassistancebangladesh@gmail.com", {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `New Instant Inquiry from ${name}`,
          _cc: "yasin1680@gmail.com",
          Student_Name: name,
          Mobile_Phone: phone,
          Message: message,
          Submitted_At: new Date().toLocaleString()
        })
      });

      showToast('Thank you for contacting us! We will call you shortly.');
      contactForm.reset();
    });
  }
}

// Enrollment Modal Handlers
function openEnrollmentModal(courseId = null) {
  state.selectedCourseId = courseId || coursesData[0].id;
  const select = document.getElementById('modal-course-select');
  if (select) {
    select.value = state.selectedCourseId;
  }
  
  const modal = document.getElementById('enrollment-modal');
  if (modal) {
    modal.classList.add('open');
  }
}

function closeEnrollmentModal() {
  const modal = document.getElementById('enrollment-modal');
  if (modal) {
    modal.classList.remove('open');
  }
}

// Submit Enrollment
function handleEnrollmentSubmit(e) {
  e.preventDefault();
  
  const name = document.getElementById('enroll-name').value.trim();
  const phone = document.getElementById('enroll-phone').value.trim();
  const email = document.getElementById('enroll-email').value.trim();
  const courseId = document.getElementById('modal-course-select').value;
  const timing = document.getElementById('enroll-timing').value;
  const targetScore = document.getElementById('enroll-target').value || 'Band 7.5+';

  if (!name || !phone || !email) {
    showToast('Please fill out all required fields.');
    return;
  }

  const selectedCourse = coursesData.find(c => c.id === courseId);

  const newEnrollment = {
    id: 'ENR-' + Math.floor(1000 + Math.random() * 9000),
    name,
    phone,
    email,
    courseId,
    courseTitle: selectedCourse ? selectedCourse.title : courseId,
    timing,
    targetScore,
    date: new Date().toISOString(),
    status: 'Pending'
  };

  state.enrollments.unshift(newEnrollment);
  saveEnrollments();

  // Dispatch email notification to both institute emails
  sendEmailNotification(newEnrollment);

  closeEnrollmentModal();
  document.getElementById('enrollment-form').reset();

  // Show Success Modal
  showSuccessModal(newEnrollment);
}

function sendEmailNotification(enrollment) {
  const formData = new FormData();
  formData.append("_subject", `New IELTS Student Enrollment: ${enrollment.courseTitle} - ${enrollment.name}`);
  formData.append("_cc", "yasin1680@gmail.com");
  formData.append("_captcha", "false");
  formData.append("_template", "table");
  formData.append("Registration_ID", enrollment.id);
  formData.append("Student_Name", enrollment.name);
  formData.append("Phone_Number", enrollment.phone);
  formData.append("Email_Address", enrollment.email);
  formData.append("Selected_Course", enrollment.courseTitle);
  formData.append("Preferred_Batch_Timing", enrollment.timing);
  formData.append("Target_Band_Score", enrollment.targetScore);
  formData.append("Submitted_At", new Date().toLocaleString());

  fetch("https://formsubmit.co/ajax/ieltsassistancebangladesh@gmail.com", {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    console.log("Email notification response:", data);
  })
  .catch(err => {
    console.log("Email dispatch error:", err);
  });
}

function showSuccessModal(enrollment) {
  const successModal = document.getElementById('success-modal');
  const detailsBox = document.getElementById('success-details');

  if (detailsBox) {
    detailsBox.innerHTML = `
      <div style="background: var(--light-bg); padding: 20px; border-radius: 10px; margin-bottom: 20px; text-align: left; border:1px solid var(--border-color);">
        <p><strong>Registration ID:</strong> <span style="color:var(--primary-red); font-weight:800;">${enrollment.id}</span></p>
        <p><strong>Student Name:</strong> ${enrollment.name}</p>
        <p><strong>Mobile Number:</strong> ${enrollment.phone}</p>
        <p><strong>Selected Course:</strong> ${enrollment.courseTitle}</p>
        <p><strong>Batch Timing:</strong> ${enrollment.timing}</p>
      </div>
      <p style="font-size:0.95rem; color:var(--text-muted); margin-bottom:20px;">
        Our team will call you within 30 minutes to complete your admission. You can also chat directly with instructor MD Arifur Rahman on WhatsApp.
      </p>
      <div style="display:flex; gap:12px; flex-wrap:wrap;">
        <a href="https://wa.me/8801794707609?text=${encodeURIComponent('Hello MD Arifur Rahman Sir! My Registration ID is ' + enrollment.id + '. I have just enrolled in ' + enrollment.courseTitle)}" 
           target="_blank" 
           class="btn btn-primary" style="flex:1;">
          Chat on WhatsApp Now
        </a>
        <a href="tel:01794707609" class="btn btn-secondary" style="flex:1;">
          Call Admissions (01794707609)
        </a>
      </div>
    `;
  }

  if (successModal) {
    successModal.classList.add('open');
  }
}

function closeSuccessModal() {
  const successModal = document.getElementById('success-modal');
  if (successModal) {
    successModal.classList.remove('open');
  }
}

// Course Details Modal
function showCourseDetails(courseId) {
  const course = coursesData.find(c => c.id === courseId);
  if (!course) return;

  const modal = document.getElementById('course-details-modal');
  const content = document.getElementById('course-details-content');

  if (content) {
    content.innerHTML = `
      <h2 style="color:var(--text-dark); font-size:1.8rem; font-weight:900; margin-bottom:8px;">${course.title}</h2>
      <p style="color:var(--text-muted); margin-bottom:24px;">${course.description}</p>
      
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:24px; background:var(--light-bg); padding:20px; border-radius:10px; border:1px solid var(--border-color);">
        <div>
          <p><strong>Course Fee:</strong> <span style="color:var(--primary-red); font-size:1.3rem; font-weight:900;">৳${course.price}</span> (Original: ৳${course.originalPrice})</p>
          <p><strong>Course Level:</strong> ${course.level}</p>
          <p><strong>Duration:</strong> ${course.duration}</p>
        </div>
        <div>
          <p><strong>Schedule:</strong> ${course.schedule}</p>
          <p><strong>Platform:</strong> ${course.livePlatform}</p>
          <p><strong>Mock Tests:</strong> ${course.mockTests}</p>
        </div>
      </div>

      <h4 style="font-size:1.1rem; margin-bottom:12px; color:var(--text-dark); font-weight:800;">Included Study Materials:</h4>
      <ul style="list-style:disc; padding-left:20px; margin-bottom:24px; color:var(--text-dark);">
        ${course.materials.map(m => `<li style="margin-bottom:6px;">${m}</li>`).join('')}
      </ul>

      <h4 style="font-size:1.1rem; margin-bottom:12px; color:var(--text-dark); font-weight:800;">Key Learning Highlights:</h4>
      <ul style="list-style:check; padding-left:20px; margin-bottom:24px; color:var(--text-dark);">
        ${course.features.map(f => `<li style="margin-bottom:6px;">${f}</li>`).join('')}
      </ul>

      <div style="display:flex; justify-content:flex-end; gap:12px;">
        <button class="btn btn-secondary" onclick="closeCourseDetailsModal()">Close</button>
        <button class="btn btn-primary" onclick="closeCourseDetailsModal(); openEnrollmentModal('${course.id}')">Enroll in this Masterclass</button>
      </div>
    `;
  }

  if (modal) {
    modal.classList.add('open');
  }
}

function closeCourseDetailsModal() {
  const modal = document.getElementById('course-details-modal');
  if (modal) modal.classList.remove('open');
}

// Blog Reader Modal
function openBlogModal(blogId) {
  const blog = blogData.find(b => b.id === blogId);
  if (!blog) return;

  const modal = document.getElementById('blog-modal');
  const content = document.getElementById('blog-modal-content');

  if (content) {
    content.innerHTML = `
      <span class="badge badge-red" style="margin-bottom:12px;">${blog.category}</span>
      <h2 style="font-size:2rem; color:var(--text-dark); font-weight:900; margin-bottom:12px;">${blog.title}</h2>
      <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:24px;">By <strong>${blog.author}</strong> • ${blog.date} • ${blog.readTime}</p>
      <img src="${blog.image}" alt="${blog.title}" style="width:100%; height:320px; object-fit:cover; border-radius:10px; margin-bottom:24px;" />
      <div style="line-height:1.8; color:var(--text-dark);">
        ${blog.content}
      </div>
      <div style="margin-top:32px; padding-top:24px; border-top:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center;">
        <button class="btn btn-secondary" onclick="closeBlogModal()">Close Article</button>
        <button class="btn btn-primary" onclick="closeBlogModal(); openEnrollmentModal()">Join IELTS Masterclass</button>
      </div>
    `;
  }

  if (modal) modal.classList.add('open');
}

function closeBlogModal() {
  const modal = document.getElementById('blog-modal');
  if (modal) modal.classList.remove('open');
}

// Toast Notifications
function showToast(message) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 4000);
}

// Smooth Scrolling
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth'
          });
          // Close mobile menu if open
          const navDrawer = document.getElementById('mobile-nav-drawer');
          if (navDrawer) navDrawer.classList.remove('open');
        }
      }
    });
  });
}
