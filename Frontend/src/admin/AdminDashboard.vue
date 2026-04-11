<template>
  <AdminLayout>
    <div class="dashboard">
      <div class="page-title">╔══ DASHBOARD ══╗</div>

      <div v-if="loading" class="loading-state">
        <span class="blink">[ LOADING DATA... ]</span>
      </div>

      <template v-else>
        <!-- System Status -->
        <div class="status-bar">
          <span class="status-dot">●</span>
          <span class="status-text">SYSTEM STATUS: ONLINE</span>
          <span class="status-time">{{ currentTime }}</span>
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ stats.visitors.total }}</div>
            <div class="stat-label">TOTAL VISITORS</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ stats.visitors.today }}</div>
            <div class="stat-label">TODAY'S VISITS</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ stats.visitors.weekly }}</div>
            <div class="stat-label">WEEKLY VISITS</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ stats.contacts.total }}</div>
            <div class="stat-label">TOTAL CONTACTS</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ stats.users.total }}</div>
            <div class="stat-label">TOTAL USERS</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ stats.posts.total }}</div>
            <div class="stat-label">TOTAL POSTS</div>
          </div>
        </div>

        <!-- 7-Day Visitor Chart -->
        <div class="section-box">
          <div class="section-title">━━ VISITOR CHART (7 DAYS) ━━</div>
          <div class="bar-chart">
            <div v-for="day in stats.visitors.chart" :key="day.label" class="bar-row">
              <span class="bar-label">{{ day.label }}</span>
              <div class="bar-track">
                <div
                  class="bar-fill"
                  :style="{ width: barWidth(day.count) + '%' }"
                ></div>
              </div>
              <span class="bar-count">{{ day.count }}</span>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="section-box">
          <div class="section-title">━━ RECENT ACTIVITY (LAST 15) ━━</div>
          <div v-if="stats.recentActivity.length === 0" class="empty-state">
            NO ACTIVITY YET.
          </div>
          <table v-else class="data-table">
            <thead>
              <tr>
                <th>TIMESTAMP</th>
                <th>USER</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in stats.recentActivity" :key="log.id">
                <td class="col-time">{{ formatDate(log.created_at) }}</td>
                <td class="col-user">{{ log.username ?? 'SYSTEM' }}</td>
                <td class="col-action">{{ log.action }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Recent Messages -->
        <div class="section-box">
          <div class="section-title">━━ RECENT MESSAGES ━━</div>
          <div v-if="stats.contacts.recent.length === 0" class="empty-state">
            NO MESSAGES YET.
          </div>
          <div v-for="msg in stats.contacts.recent" :key="msg.id" class="message-item">
            <div class="msg-header">
              <span class="msg-from">▶ {{ msg.name }} &lt;{{ msg.email }}&gt;</span>
              <span class="msg-date">{{ formatDate(msg.timestamp) }}</span>
            </div>
            <div class="msg-body">{{ msg.message }}</div>
          </div>
        </div>

        <!-- Achievements -->
        <div class="section-box">
          <div class="section-title">━━ ACHIEVEMENTS ━━</div>
          <div class="achievements-grid">
            <div
              v-for="ach in achievements"
              :key="ach.title"
              class="ach-card"
              :class="ach.unlocked ? 'ach-unlocked' : 'ach-locked'"
            >
              <div class="ach-icon">{{ ach.unlocked ? ach.icon : '🔒' }}</div>
              <div class="ach-title">{{ ach.unlocked ? ach.title : '??? ' + ach.title }}</div>
              <div class="ach-desc">{{ ach.description }}</div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import AdminLayout from './AdminLayout.vue'
import { authFetch } from './useAdminAuth'

interface DayCount { label: string; count: number }
interface LogEntry { id: number; action: string; details: string; created_at: string; username: string | null }
interface ContactEntry { id: string; name: string; email: string; message: string; timestamp: string }

interface Stats {
  visitors: { total: number; today: number; weekly: number; chart: DayCount[] }
  contacts: { total: number; recent: ContactEntry[] }
  users: { total: number }
  posts: { total: number; published: number }
  guestbook: { total: number }
  recentActivity: LogEntry[]
}

const loading = ref(true)
const currentTime = ref('')
let timeInterval: ReturnType<typeof setInterval> | null = null

const stats = ref<Stats>({
  visitors: { total: 0, today: 0, weekly: 0, chart: [] },
  contacts: { total: 0, recent: [] },
  users: { total: 0 },
  posts: { total: 0, published: 0 },
  guestbook: { total: 0 },
  recentActivity: []
})

const achievements = computed(() => [
  {
    icon: '🌐', title: 'FIRST CONTACT',
    description: 'Received your first message',
    unlocked: stats.value.contacts.total >= 1
  },
  {
    icon: '👥', title: 'SOCIAL NODE',
    description: '10+ visitors discovered your site',
    unlocked: stats.value.visitors.total >= 10
  },
  {
    icon: '📝', title: 'AUTHOR',
    description: 'Published your first post',
    unlocked: stats.value.posts.published >= 1
  },
  {
    icon: '📖', title: 'SIGNED IN INK',
    description: 'Got a guestbook entry',
    unlocked: stats.value.guestbook.total >= 1
  },
  {
    icon: '🔥', title: 'VIRAL',
    description: '100+ total visitors',
    unlocked: stats.value.visitors.total >= 100
  },
  {
    icon: '✍️', title: 'PROLIFIC',
    description: '5+ posts created',
    unlocked: stats.value.posts.total >= 5
  },
  {
    icon: '📬', title: 'INBOX HERO',
    description: '10+ contact messages',
    unlocked: stats.value.contacts.total >= 10
  },
  {
    icon: '⚡', title: '1337',
    description: '1337+ total visitors',
    unlocked: stats.value.visitors.total >= 1337
  }
])

const maxChart = computed(() => Math.max(...stats.value.visitors.chart.map(d => d.count), 1))

function barWidth(count: number) {
  return Math.round((count / maxChart.value) * 100)
}

function formatDate(iso: string) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString('en-US', {
      month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false
    })
  } catch {
    return iso
  }
}

function updateTime() {
  currentTime.value = new Date().toLocaleTimeString('en-US', { hour12: false })
}

onMounted(async () => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
  try {
    const res = await authFetch('/admin/stats')
    const data = await res.json()
    if (data.success) {
      stats.value = data
    }
  } catch (err) {
    console.error('Failed to fetch stats:', err)
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval)
})
</script>

<style scoped>
.dashboard {
  font-family: 'Courier New', monospace;
  color: #00ff41;
}

.page-title {
  font-size: 1.1rem;
  color: #00ffff;
  text-shadow: 0 0 8px #00ffff;
  margin-bottom: 1.2rem;
  letter-spacing: 2px;
}

.loading-state {
  text-align: center;
  padding: 3rem;
  font-size: 1rem;
}

.blink {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}

.status-bar {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
  padding: 0.4rem 0.8rem;
  border: 1px solid #1a1a1a;
  background: #0d0d0d;
  font-size: 0.8rem;
}

.status-dot {
  color: #00ff41;
  animation: pulse 2s ease-in-out infinite;
  font-size: 1rem;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}

.status-text { color: #00ff41; }
.status-time { color: #00ffff; margin-left: auto; }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.8rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  border: 1px solid #00ff41;
  padding: 0.8rem;
  background: #0d0d0d;
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  color: #00ff41;
  text-shadow: 0 0 10px #00ff41;
  font-weight: bold;
}

.stat-label {
  font-size: 0.65rem;
  color: #226622;
  letter-spacing: 1px;
  margin-top: 0.3rem;
}

.section-box {
  border: 1px solid #1a1a1a;
  padding: 1rem;
  margin-bottom: 1.2rem;
  background: #0d0d0d;
}

.section-title {
  color: #00ffff;
  font-size: 0.8rem;
  letter-spacing: 1px;
  margin-bottom: 0.8rem;
}

.bar-chart { display: flex; flex-direction: column; gap: 0.4rem; }

.bar-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.78rem;
}

.bar-label { width: 36px; color: #00ffff; text-align: right; flex-shrink: 0; }

.bar-track {
  flex: 1;
  height: 14px;
  background: #1a1a1a;
  border: 1px solid #222;
}

.bar-fill {
  height: 100%;
  background: #00ff41;
  box-shadow: 0 0 4px #00ff41;
  transition: width 0.4s ease;
  min-width: 2px;
}

.bar-count { width: 32px; color: #00ff41; font-size: 0.75rem; }

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.78rem;
}

.data-table th {
  text-align: left;
  color: #00ffff;
  border-bottom: 1px solid #1a1a1a;
  padding: 0.3rem 0.5rem;
  letter-spacing: 1px;
}

.data-table td {
  padding: 0.3rem 0.5rem;
  border-bottom: 1px solid #111;
  color: #00bb30;
}

.data-table tr:hover td { background: #111; }

.col-time { color: #444; white-space: nowrap; }
.col-user { color: #00ffff; }
.col-action { color: #00ff41; }

.empty-state { color: #444; font-size: 0.82rem; padding: 0.5rem; }

.message-item {
  border: 1px solid #1a1a1a;
  padding: 0.6rem;
  margin-bottom: 0.6rem;
  font-size: 0.8rem;
}

.msg-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.3rem;
}

.msg-from { color: #00ffff; }
.msg-date { color: #444; font-size: 0.72rem; }
.msg-body { color: #00bb30; }

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.6rem;
}

@media (max-width: 768px) {
  .achievements-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.ach-card {
  border: 1px solid #1a1a1a;
  padding: 0.7rem;
  text-align: center;
  font-size: 0.72rem;
  transition: box-shadow 0.2s;
}

.ach-unlocked {
  border-color: #00ff41;
  box-shadow: 0 0 8px rgba(0, 255, 65, 0.35);
}

.ach-locked {
  border-color: #222;
  opacity: 0.45;
}

.ach-icon {
  font-size: 1.5rem;
  margin-bottom: 0.3rem;
}

.ach-title {
  color: #00ffff;
  letter-spacing: 1px;
  margin-bottom: 0.25rem;
  font-weight: bold;
}

.ach-locked .ach-title {
  color: #555;
}

.ach-desc {
  color: #226622;
  font-size: 0.65rem;
}

.ach-locked .ach-desc {
  color: #333;
}
</style>
