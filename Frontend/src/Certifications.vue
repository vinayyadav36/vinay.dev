<template>
  <div class="cert-page">
    <!-- Navigation back to Home -->
    <nav class="nav-menu">
      <div class="container">
        <div class="nav-items">
          <router-link to="/" class="nav-link">[ &larr; HOME ]</router-link>
          <router-link to="/business" class="nav-link">[ BUSINESS ]</router-link>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main">
      <div class="container">
        <section id="certifications" class="section">
          <h2 class="section-title">
            <span class="title-brackets">[</span>
            <span class="title-text">CERTIFICATIONS</span>
            <span class="title-brackets">]</span>
          </h2>
          <p class="road-subtitle">Click any milestone to explore details</p>

          <!-- Candy Crush Road -->
          <div class="cert-road">
            <div class="road-track">
              <div
                v-for="(cert, index) in certifications"
                :key="cert.name"
                class="road-node"
                :class="['node-' + (index % 3), { 'node-active': selectedCert === cert }]"
                @click="openModal(cert)"
              >
                <div class="node-milestone">
                  <span class="node-icon">{{ cert.icon }}</span>
                  <div class="node-pulse"></div>
                </div>
                <div class="node-label">{{ cert.name.length > 20 ? cert.name.slice(0, 18) + '…' : cert.name }}</div>
                <div class="node-issuer">{{ cert.issuer }}</div>
                <div class="node-connector" v-if="index < certifications.length - 1"></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- Modal -->
    <transition name="modal-fade">
      <div class="modal-overlay" v-if="selectedCert" @click.self="closeModal">
        <div class="modal-box">
          <div class="modal-header">
            <div class="modal-buttons">
              <span class="modal-btn close" @click="closeModal"></span>
              <span class="modal-btn minimize"></span>
              <span class="modal-btn maximize"></span>
            </div>
            <span class="modal-title">{{ selectedCert.name }}</span>
          </div>
          <div class="modal-content">
            <div class="modal-cert-icon">{{ selectedCert.icon }}</div>
            <h2 class="modal-cert-name">{{ selectedCert.name }}</h2>
            <p class="modal-issuer">Issued by: <strong>{{ selectedCert.issuer }}</strong></p>
            <p class="modal-date">📅 Date: {{ selectedCert.date }}</p>

            <div class="modal-section">
              <h4>🎯 What I Learned</h4>
              <p>{{ selectedCert.learning }}</p>
            </div>

            <div class="modal-section">
              <h4>💼 Real-Life Applications</h4>
              <p>{{ selectedCert.realLife }}</p>
            </div>

            <div class="modal-section">
              <h4>🔑 Key Points</h4>
              <ul class="key-points">
                <li v-for="point in selectedCert.keyPoints" :key="point">{{ point }}</li>
              </ul>
            </div>

            <div class="modal-links">
              <a :href="selectedCert.url" target="_blank" rel="noopener" class="modal-link primary-link">
                🏆 VERIFY CERTIFICATE →
              </a>
              <a
                v-for="res in selectedCert.resources"
                :key="res.url"
                :href="res.url"
                target="_blank"
                rel="noopener"
                class="modal-link resource-link"
              >
                📚 {{ res.label }} →
              </a>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Certification {
  name: string
  issuer: string
  date: string
  icon: string
  url: string
  learning: string
  realLife: string
  keyPoints: string[]
  resources: { label: string; url: string }[]
}

const selectedCert = ref<Certification | null>(null)

const openModal = (cert: Certification) => { selectedCert.value = cert }
const closeModal = () => { selectedCert.value = null }

const certifications: Certification[] = [
  {
    name: 'Data Analytics and Visualization',
    issuer: 'Accenture | FORAGE',
    date: 'May 2024',
    icon: '📊',
    url: 'https://drive.google.com/file/d/14E6UOV1H8x3KA0p885eSKmCseuy-jjG5/view?usp=sharing',
    learning: 'Mastered data analysis pipelines, visualization best practices, and storytelling with data using real-world business scenarios.',
    realLife: 'Applied to create business dashboards, identify trends in large datasets, and present insights to stakeholders.',
    keyPoints: ['Data cleaning and preprocessing', 'Chart selection for data storytelling', 'Business insight communication', 'Excel and visualization tools'],
    resources: [{ label: 'Tableau Public', url: 'https://public.tableau.com' }, { label: 'Power BI Docs', url: 'https://docs.microsoft.com/en-us/power-bi/' }]
  },
  {
    name: 'INVESTMENT BANKING',
    issuer: 'J.P Morgan | FORAGE',
    date: 'May 2024',
    icon: '🏦',
    url: 'https://drive.google.com/file/d/14E6UOV1H8x3KA0p885eSKmCseuy-jjG5/view?usp=sharing',
    learning: 'Gained hands-on experience in investment banking workflows including deal structuring, financial modeling, and client presentations.',
    realLife: 'Applicable to corporate finance, mergers & acquisitions analysis, and capital markets understanding.',
    keyPoints: ['Financial modeling basics', 'Deal structuring', 'Valuation methods (DCF, comps)', 'Investment banking processes'],
    resources: [{ label: 'Investopedia IB', url: 'https://www.investopedia.com/investment-banking-4689814' }, { label: 'WSO IB Guide', url: 'https://www.wallstreetoasis.com/career-paths/investment-banking' }]
  },
  {
    name: 'Web Development Basics',
    issuer: 'IBM SKILL BUILD',
    date: 'May 2024',
    icon: '🌐',
    url: 'https://drive.google.com/file/d/12kfjX4O41r71fqCz57qX6OqrQsBPxP5O/view?usp=sharing',
    learning: 'Covered fundamentals of web development including HTML structure, CSS styling, responsive design, and basic JavaScript.',
    realLife: 'Used to build personal projects, client websites, and portfolio applications.',
    keyPoints: ['HTML5 semantic elements', 'CSS layouts and flexbox', 'JavaScript DOM manipulation', 'Responsive web design'],
    resources: [{ label: 'MDN Web Docs', url: 'https://developer.mozilla.org' }, { label: 'freeCodeCamp', url: 'https://www.freecodecamp.org' }]
  },
  {
    name: 'Learn JavaScript',
    issuer: 'IBM SKILL BUILD | CodeAcademy',
    date: 'May 2024',
    icon: '⚡',
    url: 'https://drive.google.com/file/d/12pqwYs2mbyaqrtOWOyHG7cg1NdrNyPA-/view?usp=sharing',
    learning: 'Deep dive into JavaScript programming: variables, functions, objects, arrays, async programming, and modern ES6+ features.',
    realLife: 'Core language for all frontend and Node.js backend development in professional projects.',
    keyPoints: ['ES6+ syntax (arrow functions, destructuring, spread)', 'Promises and async/await', 'DOM manipulation', 'Object-oriented programming'],
    resources: [{ label: 'JavaScript.info', url: 'https://javascript.info' }, { label: 'Eloquent JavaScript', url: 'https://eloquentjavascript.net' }]
  },
  {
    name: 'WEB DESIGN & DEVELOPMENT',
    issuer: 'NSDC',
    date: 'Jun 2025',
    icon: '🎨',
    url: 'https://drive.google.com/file/d/1_Kip75Sv5FIS3Azhac3fC6u_9XHK1oNs/view?usp=sharing',
    learning: 'Comprehensive program covering UI/UX principles, advanced CSS, JavaScript frameworks, and professional web development practices.',
    realLife: 'Applied to design and develop professional websites and web applications for clients and personal projects.',
    keyPoints: ['UI/UX design principles', 'Advanced CSS animations', 'JavaScript frameworks (Vue, React)', 'Professional development workflow'],
    resources: [{ label: 'NSDC Portal', url: 'https://www.nsdcindia.org' }, { label: 'CSS-Tricks', url: 'https://css-tricks.com' }]
  },
  {
    name: 'INTRODUCTION TO DIGITAL BUSINESS SKILLS',
    issuer: 'HP LIFE | HP FOUNDATION',
    date: 'Aug 2023',
    icon: '💡',
    url: 'https://drive.google.com/file/d/13nW8kTdoYz7D88XR3dWJNXe9RfSs1fTY/view?usp=sharing',
    learning: 'Explored digital business fundamentals including online presence, digital marketing, e-commerce basics, and digital communication.',
    realLife: 'Applied to launch and manage digital marketing campaigns, social media strategy, and online business operations.',
    keyPoints: ['Digital marketing fundamentals', 'Online business model design', 'Social media for business', 'Digital communication skills'],
    resources: [{ label: 'HP LIFE Platform', url: 'https://www.life-global.org' }, { label: 'Google Digital Garage', url: 'https://learndigital.withgoogle.com' }]
  },
  {
    name: 'STRATEGIC HUMAN RESOURCE MANAGEMENT',
    issuer: 'AMITY UNIVERSITY',
    date: 'May 2024',
    icon: '👥',
    url: 'https://drive.google.com/file/d/10EUlHQbPLrg2gFNaOVw9DZAeMq0iIq8V/view?usp=sharing',
    learning: 'Studied HR strategy alignment with business goals, talent management, organizational behavior, and performance management systems.',
    realLife: 'Applicable to team building, recruitment strategy, and organizational culture development.',
    keyPoints: ['HR strategic planning', 'Talent acquisition & retention', 'Performance management', 'Organizational development'],
    resources: [{ label: 'SHRM Resources', url: 'https://www.shrm.org' }, { label: 'HR Knowledge Base', url: 'https://www.cipd.co.uk/knowledge' }]
  },
  {
    name: 'LEADERSHIP AND MOTIVATION IN ORGANIZATIONS',
    issuer: 'AMITY UNIVERSITY',
    date: 'Nov 2024',
    icon: '🏆',
    url: 'https://drive.google.com/file/d/14aHR-E3fMbJ2if3ogxZDYwy_mHnJYhaM/view?usp=sharing',
    learning: 'Explored leadership styles, motivation theories (Maslow, Herzberg, McGregor), team dynamics, and organizational behavior.',
    realLife: 'Used to inspire team members, improve productivity, and build positive workplace culture.',
    keyPoints: ['Leadership styles (transformational, transactional)', 'Motivation theories', 'Team dynamics', 'Conflict resolution'],
    resources: [{ label: 'MindTools Leadership', url: 'https://www.mindtools.com/leadership' }, { label: 'Harvard Leadership', url: 'https://hbr.org/topic/leadership' }]
  },
  {
    name: 'PRINCIPLES OF RETAILING',
    issuer: 'AMITY UNIVERSITY',
    date: 'Nov 2024',
    icon: '🛍️',
    url: 'https://drive.google.com/file/d/14SVfG01D9im4FH3SeRT3C50Q0CB3LU_m/view?usp=sharing',
    learning: 'Learned retail management principles, store operations, consumer behavior, visual merchandising, and retail marketing strategies.',
    realLife: 'Applicable to managing retail operations, e-commerce stores, and consumer experience optimization.',
    keyPoints: ['Retail store management', 'Visual merchandising', 'Consumer behavior analysis', 'Retail pricing strategies'],
    resources: [{ label: 'Retail Dive', url: 'https://www.retaildive.com' }, { label: 'NRF Resources', url: 'https://nrf.com' }]
  },
  {
    name: 'PROFESSIONAL AND LIFE SKILLS',
    issuer: 'AMITY UNIVERSITY',
    date: 'Oct 2023',
    icon: '⭐',
    url: 'https://drive.google.com/file/d/14JAWAq0KVtngv4VOlXRAhI7-TkxgxH14/view?usp=sharing',
    learning: 'Developed essential soft skills including communication, time management, critical thinking, networking, and personal branding.',
    realLife: 'Applied daily in professional interactions, presentations, project management, and career development.',
    keyPoints: ['Effective communication', 'Time management techniques', 'Personal branding', 'Networking skills'],
    resources: [{ label: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/' }, { label: 'Coursera Soft Skills', url: 'https://www.coursera.org/browse/personal-development' }]
  },
  {
    name: 'SALES SPECIALIST',
    issuer: 'GROMO',
    date: 'Jun 2023',
    icon: '💰',
    url: 'https://drive.google.com/file/d/10ckfiVgiwt0iCwv-aHPICyGVVjQQNTKB/view?usp=sharing',
    learning: 'Mastered sales techniques, client relationship management, financial product selling, and persuasive communication.',
    realLife: 'Applied to sales pitches, client onboarding, fintech product sales, and commission-based selling.',
    keyPoints: ['Sales funnel management', 'Client relationship building', 'Product knowledge (fintech)', 'Objection handling'],
    resources: [{ label: 'HubSpot Sales', url: 'https://academy.hubspot.com/courses/inbound-sales' }, { label: 'Gromo Platform', url: 'https://gromo.in' }]
  },
  {
    name: 'DIGITAL ADVERTISMENT',
    issuer: 'ALEPH',
    date: 'Jun 2023',
    icon: '📣',
    url: 'https://drive.google.com/file/d/1-xLh0e20C2si-V4rmYq6aKLrSzgzgdSJ/view?usp=sharing',
    learning: 'Studied digital advertising platforms, ad targeting, campaign optimization, analytics, and ROI measurement.',
    realLife: 'Used to run Google Ads, Meta Ads campaigns, and measure advertising effectiveness for clients.',
    keyPoints: ['Google Ads basics', 'Facebook/Meta advertising', 'Ad targeting and retargeting', 'Campaign analytics and ROI'],
    resources: [{ label: 'Google Skillshop', url: 'https://skillshop.withgoogle.com' }, { label: 'Meta Blueprint', url: 'https://www.facebook.com/business/learn' }]
  },
  {
    name: 'BASIC MATHEMATICS',
    issuer: 'ALEPH',
    date: 'Apr 2024',
    icon: '🔢',
    url: 'https://drive.google.com/file/d/100Clu-OAfD08eanD5MWkJrEMfEtUvWZW/view?usp=sharing',
    learning: 'Reinforced mathematical foundations including algebra, statistics, probability, and quantitative reasoning for business applications.',
    realLife: 'Applied to financial calculations, data analysis, statistical modeling, and logical problem solving.',
    keyPoints: ['Algebraic reasoning', 'Descriptive statistics', 'Probability concepts', 'Business mathematics'],
    resources: [{ label: 'Khan Academy Math', url: 'https://www.khanacademy.org/math' }, { label: 'Brilliant.org', url: 'https://brilliant.org' }]
  },
  {
    name: 'ADVANCED EXCEL',
    issuer: 'AMITY UNIVERSITY',
    date: 'Nov 2024',
    icon: '📗',
    url: 'https://drive.google.com/file/d/14R5l2uJCIaZu921-5ZXnKDInId0pS0oQ/view?usp=sharing',
    learning: 'Mastered advanced Excel features including pivot tables, VLOOKUP/XLOOKUP, Power Query, macros, and data modeling.',
    realLife: 'Used extensively for financial modeling, business reports, data analysis dashboards, and automation.',
    keyPoints: ['Pivot tables & Power Pivot', 'Advanced formulas (XLOOKUP, INDEX-MATCH)', 'Data visualization in Excel', 'VBA macros for automation'],
    resources: [{ label: 'Excel Campus', url: 'https://www.excelcampus.com' }, { label: 'Microsoft Excel Training', url: 'https://support.microsoft.com/en-us/excel' }]
  },
]
</script>

<style scoped>
/* Base styling to match the theme */
.cert-page {
  min-height: 100vh;
  background: #ffffff;
  color: #000000;
  font-family: 'Courier New', monospace;
  line-height: 1.6;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Navigation Menu */
.nav-menu {
  background: #f0f0f0;
  border-bottom: 2px solid #000000;
  padding: 15px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-items {
  display: flex;
  justify-content: center;
  gap: 40px;
}

.nav-link {
  color: #000000;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.1rem;
  padding: 8px 15px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.nav-link:hover {
  border-color: #000000;
  background: #000000;
  color: #ffffff;
}

/* Main Content */
.main {
  padding: 60px 0;
}

.section {
  margin-bottom: 80px;
}

.section-title {
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
  letter-spacing: 3px;
}

.title-brackets {
  color: #666666;
}

.title-text {
  color: #000000;
  margin: 0 10px;
}

.road-subtitle {
  text-align: center;
  color: #666666;
  font-size: 0.9rem;
  margin-bottom: 50px;
  letter-spacing: 1px;
}

/* Candy Crush Road */
.cert-road {
  position: relative;
  padding: 20px 0;
}

.road-track {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  position: relative;
}

.road-node {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 0 0 40px;
  z-index: 1;
  width: 100%;
  max-width: 500px;
}

/* Alternating positions for road effect */
.road-node.node-0 { align-self: flex-start; padding-left: 10%; }
.road-node.node-1 { align-self: center; }
.road-node.node-2 { align-self: flex-end; padding-right: 10%; }

.node-milestone {
  position: relative;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
  border: 3px solid #000000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 4px 4px 0px #cccccc;
}

.road-node:hover .node-milestone,
.road-node.node-active .node-milestone {
  background: linear-gradient(135deg, #000000, #333333);
  transform: scale(1.15);
  box-shadow: 6px 6px 0px #999999;
}

.node-pulse {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 2px solid #000000;
  opacity: 0;
  animation: nodePulse 2s ease-in-out infinite;
}

.road-node:hover .node-pulse {
  opacity: 1;
}

@keyframes nodePulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.2); opacity: 0; }
}

.node-icon {
  font-size: 2rem;
  transition: filter 0.3s;
}

.road-node:hover .node-icon {
  filter: invert(1);
}

.node-label {
  margin-top: 12px;
  font-weight: bold;
  font-size: 0.85rem;
  text-align: center;
  max-width: 200px;
  transition: color 0.3s;
}

.road-node:hover .node-label {
  color: #000000;
}

.node-issuer {
  font-size: 0.75rem;
  color: #666666;
  text-align: center;
}

.node-connector {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 3px;
  height: 40px;
  background: repeating-linear-gradient(
    to bottom,
    #000000 0px,
    #000000 6px,
    transparent 6px,
    transparent 12px
  );
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.modal-box {
  background: #ffffff;
  border: 3px solid #000000;
  box-shadow: 8px 8px 0px #cccccc;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  background: #cccccc;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  border-bottom: 2px solid #000000;
  position: sticky;
  top: 0;
}

.modal-buttons {
  display: flex;
  gap: 8px;
}

.modal-btn {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid #000000;
  cursor: pointer;
}

.modal-btn.close { background: #ff5f57; }
.modal-btn.minimize { background: #febc2e; }
.modal-btn.maximize { background: #28c840; }
.modal-btn.close:hover { opacity: 0.7; }

.modal-title {
  font-weight: bold;
  font-size: 0.85rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.modal-content {
  padding: 30px;
}

.modal-cert-icon {
  font-size: 3rem;
  text-align: center;
  margin-bottom: 15px;
}

.modal-cert-name {
  font-size: 1.4rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.modal-issuer {
  text-align: center;
  color: #555555;
  margin-bottom: 5px;
  font-size: 0.9rem;
}

.modal-date {
  text-align: center;
  color: #555555;
  margin-bottom: 25px;
  font-size: 0.9rem;
}

.modal-section {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eeeeee;
}

.modal-section h4 {
  font-size: 0.95rem;
  font-weight: bold;
  margin-bottom: 8px;
  color: #000000;
}

.modal-section p {
  font-size: 0.9rem;
  color: #333333;
  line-height: 1.7;
}

.key-points {
  margin: 0;
  padding-left: 20px;
}

.key-points li {
  font-size: 0.9rem;
  color: #333333;
  line-height: 1.7;
  margin-bottom: 3px;
}

.modal-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.modal-link {
  display: block;
  text-align: center;
  padding: 12px 20px;
  text-decoration: none;
  font-weight: bold;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  border: 2px solid #000000;
}

.primary-link {
  background: #000000;
  color: #ffffff;
}

.primary-link:hover {
  background: #333333;
}

.resource-link {
  background: #ffffff;
  color: #000000;
}

.resource-link:hover {
  background: #000000;
  color: #ffffff;
}

/* Modal Transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Responsive */
@media (max-width: 600px) {
  .road-node.node-0,
  .road-node.node-1,
  .road-node.node-2 {
    align-self: center;
    padding-left: 0;
    padding-right: 0;
  }

  .section-title {
    font-size: 1.8rem;
  }
}
</style>