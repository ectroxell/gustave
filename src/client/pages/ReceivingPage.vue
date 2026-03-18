<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import AppBadge from '../components/ui/AppBadge.vue';
import AppButton from '../components/ui/AppButton.vue';
import AppFilterButton from '../components/ui/AppFilterButton.vue';
import AppInput from '../components/ui/AppInput.vue';
import type { PurchaseOrderSummary } from '../types/index.js';

type StatusFilter = 'all' | 'pending' | 'partial' | 'received';

const validStatuses: StatusFilter[] = ['all', 'pending', 'partial', 'received'];

function parseStatusParam(value: unknown): StatusFilter {
  if (typeof value === 'string' && validStatuses.includes(value as StatusFilter)) {
    return value as StatusFilter;
  }
  // Only redirect if there was an explicit (invalid) value in the URL
  if (value !== undefined) {
    router.replace({ path: '/receiving' });
  }
  return 'all';
}

const route = useRoute();
const router = useRouter();

const purchaseOrders = ref<PurchaseOrderSummary[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const searchQuery = ref('');
const activeFilter = ref<StatusFilter>(parseStatusParam(route.query.status));
const loaded = ref(false);

const statusFilters: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Partial', value: 'partial' },
  { label: 'Received', value: 'received' },
];

const filteredOrders = computed(() => {
  const query = searchQuery.value.trim()
    .toLowerCase();
  const matchesQuery = (text: string) => text.toLowerCase()
    .includes(query);

  return purchaseOrders.value
    .filter((po) => activeFilter.value === 'all' || po.status === activeFilter.value)
    .filter((po) => !query || matchesQuery(po.poNumber) || matchesQuery(po.characterName));
});

const emptyMessage = computed(() =>
  searchQuery.value || activeFilter.value !== 'all'
    ? 'No purchase orders match your filters.'
    : 'The crates are empty.',
);

const statusGlowMap: Record<string, string> = {
  pending: 'var(--color-accent-blue)',
  partial: 'var(--color-accent-gold)',
  received: 'var(--color-accent-green)',
};

function rowHoverStyle(status: string) {
  const color = statusGlowMap[status] ?? 'transparent';
  return { '--row-glow-color': color };
}

function characterAvatar(name: string) {
  return `/src/client/assets/characters/${name}.png`;
}

async function fetchPurchaseOrders() {
  isLoading.value = true;
  error.value = null;

  try {
    const response = await fetch('/api/purchase-orders');
    if (!response.ok) {
      throw new Error(`Failed to load purchase orders (${response.status})`);
    }
    const json = await response.json() as { data: PurchaseOrderSummary[] };
    purchaseOrders.value = json.data;
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An unexpected error occurred';
  } finally {
    isLoading.value = false;
    await nextTick();
    window.requestAnimationFrame(() => {
      loaded.value = true;
    });
  }
}

onMounted(fetchPurchaseOrders);

watch(() => route.query.status, (newStatus) => {
  activeFilter.value = parseStatusParam(newStatus);
});
</script>

<template>
  <!-- AppShell -->
  <div class="min-h-screen bg-bg-primary font-display text-text-primary">
    <!-- Atmospheric background layers -->
    <div class="fixed inset-0 pointer-events-none">
      <div
        class="absolute inset-0"
        style="background: radial-gradient(ellipse 60% 40% at 50% 0%, rgba(93, 187, 99, 0.04) 0%, transparent 70%), radial-gradient(ellipse 80% 50% at 50% 0%, rgba(15, 52, 96, 0.3) 0%, transparent 60%);"
      />
      <div
        class="absolute inset-0 opacity-[0.02]"
        style="background-image: repeating-conic-gradient(rgba(224, 217, 176, 1) 0% 25%, transparent 0% 50%); background-size: 40px 40px;"
      />
    </div>

    <div class="relative z-10">
      <!-- AppNav -->
      <nav
        aria-label="Main navigation"
        class="flex items-center justify-between px-6 py-4 border-b border-accent-green/10 bg-bg-elevated/40 backdrop-blur-md"
        style="box-shadow: 0 1px 8px rgba(0,0,0,0.3), 0 1px 0 rgba(93,187,99,0.06)"
      >
        <RouterLink
          to="/"
          class="nav-logo-link font-display text-xl font-bold tracking-wide text-text-heading
                 hover:text-accent-green transition-colors duration-200
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary rounded
                 flex items-center gap-2"
        >
          <img
            src="/src/client/assets/zelda-crate.png"
            alt=""
            class="nav-crate-logo w-6 h-6"
            aria-hidden="true"
          >
          Gustave's Warehouse
        </RouterLink>

        <div class="flex items-center gap-6">
          <RouterLink
            to="/"
            class="font-display text-sm font-semibold uppercase tracking-widest text-text-primary/60
                   hover:text-accent-green transition-colors duration-200
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary rounded px-2 py-1"
          >
            Home
          </RouterLink>
          <RouterLink
            to="/receiving"
            class="font-display text-sm font-semibold uppercase tracking-widest text-text-primary
                   hover:text-accent-green transition-colors duration-200
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary rounded px-2 py-1"
            aria-current="page"
          >
            Receiving
          </RouterLink>
        </div>
      </nav>

      <main class="max-w-5xl mx-auto px-4 py-10">
        <!-- Page Header -->
        <section class="mb-8">
          <h1 class="font-display text-3xl font-extrabold text-text-heading tracking-tight mb-2">
            Purchase Orders
          </h1>
          <p class="font-display text-sm text-text-primary/60">
            Browse and search all purchase orders at the dock.
          </p>
        </section>

        <!-- Search & Filters -->
        <section
          class="mb-6 space-y-4"
          aria-label="Search and filter controls"
        >
          <!-- Search Input -->
          <div class="max-w-md">
            <AppInput
              v-model="searchQuery"
              label="Search"
              placeholder="Filter by PO number or character..."
            >
              <template #icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="8"
                  />
                  <line
                    x1="21"
                    y1="21"
                    x2="16.65"
                    y2="16.65"
                  />
                </svg>
              </template>
            </AppInput>
          </div>

          <!-- Status Filter Tabs -->
          <div
            role="group"
            aria-label="Filter by status"
            class="flex gap-2"
          >
            <AppFilterButton
              v-for="filter in statusFilters"
              :key="filter.value"
              :active="activeFilter === filter.value"
              @click="activeFilter = filter.value"
            >
              {{ filter.label }}
            </AppFilterButton>
          </div>
        </section>

        <!-- Skeleton Loading State -->
        <div
          v-if="isLoading"
          role="status"
          aria-label="Loading purchase orders"
          class="rounded-lg border border-border bg-bg-surface overflow-hidden"
        >
          <table class="w-full">
            <thead>
              <tr class="border-b border-border bg-bg-surface/50">
                <th class="px-5 py-3 text-left font-display text-xs font-semibold uppercase tracking-wider text-text-primary/50">
                  PO Number
                </th>
                <th class="px-5 py-3 text-left font-display text-xs font-semibold uppercase tracking-wider text-text-primary/50">
                  Character
                </th>
                <th class="px-5 py-3 text-left font-display text-xs font-semibold uppercase tracking-wider text-text-primary/50">
                  Status
                </th>
                <th class="px-5 py-3 text-right font-display text-xs font-semibold uppercase tracking-wider text-text-primary/50">
                  Items
                </th>
                <th class="px-5 py-3 text-right font-display text-xs font-semibold uppercase tracking-wider text-text-primary/50">
                  Ordered
                </th>
                <th class="px-5 py-3 text-right font-display text-xs font-semibold uppercase tracking-wider text-text-primary/50">
                  Received
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="n in 6"
                :key="n"
                class="border-b border-border/50 last:border-b-0"
              >
                <td class="px-5 py-3">
                  <div class="h-4 w-20 animate-pulse rounded bg-bg-elevated/50" />
                </td>
                <td class="px-5 py-3">
                  <div class="flex items-center gap-2">
                    <div class="h-6 w-6 animate-pulse rounded-full bg-bg-elevated/50" />
                    <div class="h-4 w-24 animate-pulse rounded bg-bg-elevated/50" />
                  </div>
                </td>
                <td class="px-5 py-3">
                  <div class="h-5 w-16 animate-pulse rounded-full bg-bg-elevated/50" />
                </td>
                <td class="px-5 py-3 text-right">
                  <div class="ml-auto h-4 w-8 animate-pulse rounded bg-bg-elevated/50" />
                </td>
                <td class="px-5 py-3 text-right">
                  <div class="ml-auto h-4 w-8 animate-pulse rounded bg-bg-elevated/50" />
                </td>
                <td class="px-5 py-3 text-right">
                  <div class="ml-auto h-4 w-8 animate-pulse rounded bg-bg-elevated/50" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Error State -->
        <div
          v-else-if="error"
          class="rounded-lg border border-accent-red/30 bg-accent-red/10 px-5 py-4"
          role="alert"
        >
          <p class="font-display text-sm text-accent-red">
            {{ error }}
          </p>
          <AppButton
            variant="danger"
            size="sm"
            class="mt-2"
            @click="fetchPurchaseOrders"
          >
            Retry
          </AppButton>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="filteredOrders.length === 0 && !isLoading"
          class="flex flex-col items-center py-16 text-text-primary/40"
        >
          <img
            src="/src/client/assets/zelda-crate.png"
            alt=""
            class="w-16 h-16 mb-3 opacity-30 grayscale"
          >
          <p class="font-display text-sm">
            {{ emptyMessage }}
          </p>
        </div>

        <!-- PO Table -->
        <Transition
          v-else
          name="fade-quick"
          mode="out-in"
        >
          <div
            :key="activeFilter"
            class="rounded-lg border border-border bg-bg-surface overflow-hidden"
          >
            <table class="w-full">
              <thead>
                <tr class="border-b border-border bg-bg-surface/50">
                  <th class="px-5 py-3 text-left font-display text-xs font-semibold uppercase tracking-wider text-text-primary/50">
                    PO Number
                  </th>
                  <th class="px-5 py-3 text-left font-display text-xs font-semibold uppercase tracking-wider text-text-primary/50">
                    Character
                  </th>
                  <th class="px-5 py-3 text-left font-display text-xs font-semibold uppercase tracking-wider text-text-primary/50">
                    Status
                  </th>
                  <th class="px-5 py-3 text-right font-display text-xs font-semibold uppercase tracking-wider text-text-primary/50">
                    Items
                  </th>
                  <th class="px-5 py-3 text-right font-display text-xs font-semibold uppercase tracking-wider text-text-primary/50">
                    Ordered
                  </th>
                  <th class="px-5 py-3 text-right font-display text-xs font-semibold uppercase tracking-wider text-text-primary/50">
                    Received
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(po, index) in filteredOrders"
                  :key="po.id"
                  class="po-row border-b border-border/50 last:border-b-0 transition-all duration-300"
                  :class="loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'"
                  :style="{ transitionDelay: loaded ? index * 40 + 'ms' : '0ms', ...rowHoverStyle(po.status) }"
                >
                  <td class="px-5 py-3">
                    <RouterLink
                      :to="`/receiving/${po.poNumber}`"
                      class="font-data text-sm font-semibold text-accent-green hover:text-accent-green/80
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface rounded"
                    >
                      {{ po.poNumber }}
                    </RouterLink>
                  </td>
                  <td class="px-5 py-3 font-display text-sm text-text-primary">
                    <span class="flex items-center gap-2">
                      <img
                        :src="characterAvatar(po.characterName)"
                        :alt="po.characterName"
                        class="w-6 h-6 rounded-full object-cover"
                      >
                      <RouterLink
                        :to="'/characters/' + po.characterName"
                        class="hover:text-accent-green transition-colors duration-200
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface rounded"
                      >
                        {{ po.characterName }}
                      </RouterLink>
                    </span>
                  </td>
                  <td class="px-5 py-3">
                    <AppBadge :variant="po.status">
                      {{ po.status }}
                    </AppBadge>
                  </td>
                  <td class="px-5 py-3 text-right font-data text-sm text-text-primary/70">
                    {{ po.totalItems }}
                  </td>
                  <td class="px-5 py-3 text-right font-data text-sm text-text-primary/70">
                    {{ po.totalOrdered }}
                  </td>
                  <td class="px-5 py-3 text-right font-data text-sm text-text-primary/70">
                    {{ po.totalReceived }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Transition>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Filter content transition */
.fade-quick-enter-active,
.fade-quick-leave-active {
  transition: opacity 150ms ease;
}

.fade-quick-enter-from,
.fade-quick-leave-to {
  opacity: 0;
}

/* Table row hover glow */
.po-row {
  transition: opacity 300ms ease, transform 300ms ease, box-shadow 200ms ease;
}

.po-row:hover {
  background-color: rgba(15, 52, 96, 0.3);
  box-shadow: inset 4px 0 0 var(--row-glow-color);
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .po-row {
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}

/* Nav crate wobble */
.nav-logo-link:hover .nav-crate-logo {
  animation: wobble 0.5s ease-in-out;
}

@keyframes wobble {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(-8deg); }
  50% { transform: rotate(6deg); }
  75% { transform: rotate(-4deg); }
  100% { transform: rotate(0deg); }
}
</style>
