<template>
  <div class="business-page">
    <!-- Navigation -->
    <nav class="nav-menu">
      <div class="container">
        <div class="nav-items">
          <router-link to="/" class="nav-link">[ &larr; HOME ]</router-link>
          <router-link to="/certifications" class="nav-link">[ CERTIFICATIONS ]</router-link>
        </div>
      </div>
    </nav>

    <!-- Hero: Palace Doors -->
    <section class="hero-section" ref="heroRef">
      <div class="palace-doors" :class="{ 'doors-open': doorsOpen }">
        <div class="door door-left">
          <div class="door-ornament">⚜</div>
          <div class="door-handle"></div>
        </div>
        <div class="door door-right">
          <div class="door-ornament">⚜</div>
          <div class="door-handle"></div>
        </div>
      </div>
      <div class="hero-content" :class="{ 'hero-visible': doorsOpen }">
        <h1 class="empire-title">THE EMPIRE</h1>
        <p class="empire-subtitle">[ BUSINESS VENTURES & ORGANIZATIONS ]</p>
        <div class="scroll-indicator">
          <span>▼ SCROLL TO EXPLORE ▼</span>
        </div>
      </div>
    </section>

    <!-- Corridor Section -->
    <section class="corridor-section">
      <div class="corridor-bg">
        <div class="corridor-floor"></div>
        <div class="corridor-ceiling"></div>
        <div class="corridor-walls">
          <div class="wall-left"></div>
          <div class="wall-right"></div>
        </div>
        <div class="red-carpet"></div>
        <div class="corridor-text">
          <h2>[ ENTER THE INNER SANCTUM ]</h2>
          <p>Where vision meets execution. A portfolio of ventures built on strategy, innovation, and relentless drive.</p>
        </div>
      </div>
    </section>

    <!-- Throne Room: Business Cards -->
    <section class="throne-room">
      <div class="container">
        <!-- Throne -->
        <div class="throne-container">
          <div class="throne" ref="throneRef">
            <div class="throne-back">
              <div class="throne-emblem">👑</div>
              <div class="throne-glow"></div>
            </div>
            <div class="throne-seat"></div>
            <div class="throne-base"></div>
          </div>
          <div class="throne-title">
            <h2 class="section-title">
              <span class="title-brackets">[</span>
              <span class="title-text">BUSINESS VENTURES</span>
              <span class="title-brackets">]</span>
            </h2>
          </div>
        </div>

        <!-- Business Cards Grid -->
        <div class="business-grid">
          <!-- Left Side -->
          <div class="business-side left-side">
            <div
              class="business-card"
              v-for="biz in leftBusinesses"
              :key="biz.name"
              @mouseenter="hoveredBiz = biz"
              @mouseleave="hoveredBiz = null"
            >
              <div class="card-icon">{{ biz.icon }}</div>
              <div class="card-content">
                <h3 class="card-name">{{ biz.name }}</h3>
                <p class="card-tagline">{{ biz.tagline }}</p>
                <div class="card-tags">
                  <span class="card-tag" v-for="tag in biz.tags" :key="tag">{{ tag }}</span>
                </div>
                <a v-if="biz.url" :href="biz.url" target="_blank" rel="noopener" class="card-link">VISIT →</a>
              </div>
            </div>
          </div>

          <!-- Center Throne -->
          <div class="center-throne-area">
            <div class="center-throne">
              <div class="throne-glow-outer"></div>
              <div class="throne-symbol">⚔</div>
            </div>
            <div class="center-quote">
              <p>"Build empires, not just businesses."</p>
            </div>
          </div>

          <!-- Right Side -->
          <div class="business-side right-side">
            <div
              class="business-card"
              v-for="biz in rightBusinesses"
              :key="biz.name"
              @mouseenter="hoveredBiz = biz"
              @mouseleave="hoveredBiz = null"
            >
              <div class="card-icon">{{ biz.icon }}</div>
              <div class="card-content">
                <h3 class="card-name">{{ biz.name }}</h3>
                <p class="card-tagline">{{ biz.tagline }}</p>
                <div class="card-tags">
                  <span class="card-tag" v-for="tag in biz.tags" :key="tag">{{ tag }}</span>
                </div>
                <a v-if="biz.url" :href="biz.url" target="_blank" rel="noopener" class="card-link">VISIT →</a>
              </div>
            </div>
          </div>
        </div>

        <!-- Hover Detail Card -->
        <transition name="fade">
          <div class="hover-detail-card" v-if="hoveredBiz">
            <h3>{{ hoveredBiz.name }}</h3>
            <p>{{ hoveredBiz.description }}</p>
            <div class="detail-tags">
              <span class="detail-tag" v-for="tag in hoveredBiz.tags" :key="tag">{{ tag }}</span>
            </div>
          </div>
        </transition>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-row">
          <div class="stat-box" v-for="stat in empireStats" :key="stat.label">
            <div class="stat-number">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="biz-footer">
      <div class="container">
        <p class="footer-text">© {{ currentYear }} Vinay Yadav — The Empire Grows</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const doorsOpen = ref(false)
const hoveredBiz = ref<any>(null)
const currentYear = new Date().getFullYear()

const leftBusinesses = [
  {
    name: 'Shree Nandi Marketing',
    icon: '📣',
    tagline: 'Digital Marketing Agency',
    description: 'Full-service digital marketing agency helping businesses grow their online presence through strategic campaigns, SEO, and social media management.',
    tags: ['Marketing', 'SEO', 'Social Media'],
    url: 'https://shreenandimarketing.netlify.app'
  },
  {
    name: 'ResumeGen',
    icon: '📄',
    tagline: 'Online Resume Builder',
    description: 'A powerful web application that allows users to build professional resumes online with ease using customizable templates.',
    tags: ['SaaS', 'Web App', 'Vue.js'],
    url: 'https://vinayoo4.github.io/resumegen/'
  },
  {
    name: 'EmailDB',
    icon: '📧',
    tagline: 'Email Database Platform',
    description: 'A centralized email database platform for digital marketing and lead generation purposes.',
    tags: ['Marketing', 'Database', 'Leads'],
    url: 'https://vinayoo4.github.io/Emaildb/'
  },
  {
    name: 'Button Catalog',
    icon: '🔘',
    tagline: 'UI Component Library',
    description: 'A comprehensive catalog of UI button components and design patterns for web developers.',
    tags: ['UI/UX', 'Components', 'Design'],
    url: 'https://buttonpage-n6xbpcxv4-vinayoo4s-projects.vercel.app/'
  }
]

const rightBusinesses = [
  {
    name: 'Virtual Whiteboard',
    icon: '✏️',
    tagline: 'Collaborative Drawing Tool',
    description: 'An intuitive virtual whiteboard application for drawing, teaching, and collaborative brainstorming sessions.',
    tags: ['EdTech', 'Canvas', 'Collaboration'],
    url: 'https://vinayoo4.github.io/Virtualwhiteboard/'
  },
  {
    name: 'Invoice Billing App',
    icon: '🧾',
    tagline: 'Business Invoicing System',
    description: 'A comprehensive invoicing and billing application with role-based access control for businesses of all sizes.',
    tags: ['FinTech', 'TypeScript', 'RBAC'],
    url: 'https://github.com/Vinayoo4/inovice_billing'
  },
  {
    name: 'E-Commerce Platform',
    icon: '🛒',
    tagline: 'Full-Stack Commerce Solution',
    description: 'Enterprise-grade e-commerce platform with payment integration, inventory management, and admin dashboard.',
    tags: ['E-Commerce', 'MongoDB', 'Stripe'],
    url: null
  },
  {
    name: 'Digital Ventures',
    icon: '🚀',
    tagline: 'Future Initiatives',
    description: 'A pipeline of innovative digital ventures currently in development — stay tuned for groundbreaking launches.',
    tags: ['Innovation', 'Stealth', 'Future'],
    url: null
  }
]

const empireStats = [
  { value: '7+', label: 'LIVE PRODUCTS' },
  { value: '2+', label: 'YEARS ACTIVE' },
  { value: '∞', label: 'AMBITION' },
  { value: '100%', label: 'COMMITMENT' }
]

onMounted(() => {
  // Open doors after a brief delay
  setTimeout(() => {
    doorsOpen.value = true
  }, 400)
})
</script>

<style scoped>
/* Base */
.business-page {
  min-height: 100vh;
  background: #0a0a0a;
  color: #ffffff;
  font-family: 'Courier New', monospace;
  line-height: 1.6;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Navigation */
.nav-menu {
  background: #111111;
  border-bottom: 2px solid #333333;
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
  color: #cccccc;
  text-decoration: none;
  font-weight: bold;
  font-size: 1rem;
  padding: 8px 15px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.nav-link:hover {
  border-color: #d4af37;
  background: #333333;
  color: #ffffff;
}

/* Hero: Palace Doors */
.hero-section {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: radial-gradient(ellipse at center, #1a0a00 0%, #0a0a0a 70%);
}

.palace-doors {
  position: absolute;
  inset: 0;
  display: flex;
  z-index: 10;
  pointer-events: none;
}

.door {
  flex: 1;
  background: linear-gradient(135deg, #2a1a00 0%, #1a0d00 40%, #2a1a00 100%);
  border: 3px solid #8b6914;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: transform 1.2s cubic-bezier(0.77, 0, 0.18, 1);
  transform-origin: top;
  position: relative;
}

.door-left {
  transform-origin: left center;
  border-right: 2px solid #8b6914;
}

.door-right {
  transform-origin: right center;
  border-left: 2px solid #8b6914;
}

.palace-doors.doors-open .door-left {
  transform: perspective(1200px) rotateY(-110deg);
}

.palace-doors.doors-open .door-right {
  transform: perspective(1200px) rotateY(110deg);
}

.door-ornament {
  font-size: 4rem;
  color: #d4af37;
  text-shadow: 0 0 20px rgba(212, 175, 55, 0.8);
}

.door-handle {
  width: 12px;
  height: 40px;
  background: #d4af37;
  border-radius: 6px;
  margin-top: 20px;
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
}

.hero-content {
  text-align: center;
  z-index: 5;
  opacity: 0;
  transform: scale(0.8);
  transition: opacity 0.8s ease 0.9s, transform 0.8s ease 0.9s;
}

.hero-content.hero-visible {
  opacity: 1;
  transform: scale(1);
}

.empire-title {
  font-size: 5rem;
  font-weight: bold;
  letter-spacing: 8px;
  color: #d4af37;
  text-shadow: 0 0 30px rgba(212, 175, 55, 0.6), 0 0 60px rgba(212, 175, 55, 0.3);
  margin: 0 0 10px;
}

.empire-subtitle {
  font-size: 1.1rem;
  color: #888888;
  letter-spacing: 4px;
  margin-bottom: 40px;
}

.scroll-indicator {
  font-size: 0.85rem;
  color: #d4af37;
  opacity: 0.7;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* Corridor */
.corridor-section {
  background: #0d0d0d;
  padding: 80px 0;
  overflow: hidden;
}

.corridor-bg {
  position: relative;
  max-width: 900px;
  margin: 0 auto;
  padding: 60px 40px;
  border: 2px solid #1a1a1a;
  background: linear-gradient(to bottom, #111111 0%, #0a0a0a 100%);
}

.corridor-floor {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 8px;
  background: repeating-linear-gradient(90deg, #d4af37 0px, #d4af37 2px, transparent 2px, transparent 20px);
  opacity: 0.4;
}

.corridor-ceiling {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 8px;
  background: repeating-linear-gradient(90deg, #d4af37 0px, #d4af37 2px, transparent 2px, transparent 20px);
  opacity: 0.4;
}

.wall-left, .wall-right {
  position: absolute;
  top: 8px;
  bottom: 8px;
  width: 4px;
  background: linear-gradient(to bottom, #d4af37, #8b6914, #d4af37);
  opacity: 0.3;
}

.wall-left { left: 0; }
.wall-right { right: 0; }

.red-carpet {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: calc(100% - 16px);
  background: linear-gradient(to top, #8b0000, #cc0000, #8b0000);
  opacity: 0.5;
}

.corridor-text {
  position: relative;
  z-index: 2;
  text-align: center;
}

.corridor-text h2 {
  font-size: 1.8rem;
  letter-spacing: 3px;
  color: #d4af37;
  margin-bottom: 20px;
}

.corridor-text p {
  font-size: 1rem;
  color: #888888;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.8;
}

/* Throne Room */
.throne-room {
  padding: 80px 0;
  background: radial-gradient(ellipse at center top, #1a0a00 0%, #0a0a0a 60%);
}

.throne-container {
  text-align: center;
  margin-bottom: 60px;
}

.throne {
  display: inline-block;
  position: relative;
  margin-bottom: 30px;
}

.throne-back {
  width: 120px;
  height: 180px;
  background: linear-gradient(to bottom, #1a0d00, #2a1a00);
  border: 3px solid #8b6914;
  border-bottom: none;
  margin: 0 auto;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 60px 60px 0 0;
}

.throne-emblem {
  font-size: 3rem;
  animation: throneGlow 3s ease-in-out infinite;
}

@keyframes throneGlow {
  0%, 100% { text-shadow: 0 0 15px rgba(212, 175, 55, 0.5); }
  50% { text-shadow: 0 0 40px rgba(212, 175, 55, 1), 0 0 80px rgba(212, 175, 55, 0.4); }
}

.throne-glow {
  position: absolute;
  inset: -10px;
  border-radius: 60px 60px 0 0;
  background: radial-gradient(ellipse at center, rgba(212, 175, 55, 0.15) 0%, transparent 70%);
  animation: throneGlow 3s ease-in-out infinite;
}

.throne-seat {
  width: 140px;
  height: 30px;
  background: linear-gradient(to bottom, #2a1a00, #1a0d00);
  border: 3px solid #8b6914;
  border-top: none;
  margin: 0 auto;
}

.throne-base {
  width: 160px;
  height: 20px;
  background: #d4af37;
  margin: 0 auto;
  opacity: 0.6;
}

.section-title {
  font-size: 2.2rem;
  font-weight: bold;
  letter-spacing: 3px;
  color: #ffffff;
}

.title-brackets { color: #d4af37; }
.title-text { color: #ffffff; margin: 0 10px; }

/* Business Grid */
.business-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 40px;
  align-items: start;
}

.business-side {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.business-card {
  background: linear-gradient(135deg, #111111, #1a1a1a);
  border: 2px solid #333333;
  padding: 20px;
  display: flex;
  gap: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.business-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #d4af37;
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.business-card:hover {
  border-color: #d4af37;
  background: linear-gradient(135deg, #1a1200, #1a1a1a);
  transform: translateX(4px);
}

.business-card:hover::before {
  transform: scaleY(1);
}

.right-side .business-card:hover {
  transform: translateX(-4px);
}

.card-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.card-content {
  flex: 1;
  min-width: 0;
}

.card-name {
  font-size: 1rem;
  font-weight: bold;
  color: #ffffff;
  margin: 0 0 4px;
}

.card-tagline {
  font-size: 0.8rem;
  color: #888888;
  margin-bottom: 10px;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 10px;
}

.card-tag {
  background: #222222;
  border: 1px solid #444444;
  color: #cccccc;
  padding: 2px 8px;
  font-size: 0.7rem;
}

.card-link {
  color: #d4af37;
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: bold;
  transition: color 0.2s;
}

.card-link:hover {
  color: #ffffff;
}

/* Center Throne Area */
.center-throne-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px 0;
}

.center-throne {
  width: 80px;
  height: 80px;
  border: 3px solid #d4af37;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  animation: throneGlow 3s ease-in-out infinite;
}

.throne-glow-outer {
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  background: radial-gradient(ellipse at center, rgba(212, 175, 55, 0.2) 0%, transparent 70%);
}

.throne-symbol {
  font-size: 2rem;
}

.center-quote {
  text-align: center;
  font-style: italic;
  color: #888888;
  font-size: 0.85rem;
  max-width: 120px;
}

/* Hover Detail Card */
.hover-detail-card {
  margin-top: 40px;
  background: linear-gradient(135deg, #1a0d00, #111111);
  border: 2px solid #d4af37;
  padding: 25px;
  text-align: center;
}

.hover-detail-card h3 {
  font-size: 1.3rem;
  color: #d4af37;
  margin-bottom: 10px;
}

.hover-detail-card p {
  color: #cccccc;
  font-size: 0.9rem;
  line-height: 1.7;
  margin-bottom: 15px;
}

.detail-tags {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
}

.detail-tag {
  background: #333333;
  border: 1px solid #555555;
  color: #d4af37;
  padding: 4px 12px;
  font-size: 0.8rem;
}

/* Stats Section */
.stats-section {
  padding: 60px 0;
  background: #111111;
  border-top: 2px solid #222222;
  border-bottom: 2px solid #222222;
}

.stats-row {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 30px;
}

.stat-box {
  text-align: center;
  padding: 20px 30px;
  border: 2px solid #222222;
  background: #0a0a0a;
  min-width: 120px;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #d4af37;
  letter-spacing: 2px;
}

.stat-label {
  font-size: 0.75rem;
  color: #666666;
  letter-spacing: 2px;
  margin-top: 5px;
}

/* Footer */
.biz-footer {
  background: #0a0a0a;
  padding: 30px 0;
  text-align: center;
  border-top: 1px solid #1a1a1a;
}

.footer-text {
  color: #555555;
  font-size: 0.85rem;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Responsive */
@media (max-width: 900px) {
  .business-grid {
    grid-template-columns: 1fr;
  }

  .center-throne-area {
    display: none;
  }

  .empire-title {
    font-size: 3rem;
    letter-spacing: 4px;
  }
}

@media (max-width: 600px) {
  .empire-title {
    font-size: 2rem;
  }

  .stats-row {
    gap: 15px;
  }
}
</style>
