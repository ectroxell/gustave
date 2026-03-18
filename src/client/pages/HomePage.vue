<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

const router = useRouter();
const poSearch = ref('');
const isSearching = ref(false);
const searchError = ref('');

async function onSearch() {
  const value = poSearch.value.trim();
  if (!value) return;

  searchError.value = '';
  isSearching.value = true;

  try {
    const res = await fetch(`/api/purchase-orders/${encodeURIComponent(value)}`);
    if (res.status === 404) {
      searchError.value = `No purchase order found for "${value}".`;
      return;
    }
    if (!res.ok) {
      searchError.value = 'Something went wrong. Please try again.';
      return;
    }
    router.push(`/receiving/${encodeURIComponent(value)}`);
  } catch {
    searchError.value = 'Could not connect to the server. Please try again.';
  } finally {
    isSearching.value = false;
  }
}
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
      <!-- Subtle diamond pattern overlay evoking Hylian tilework -->
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
          class="nav-brand inline-flex items-center gap-2 font-display text-xl font-bold tracking-wide text-text-heading
                 hover:text-accent-green transition-colors duration-200
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary rounded"
        >
          <img
            src="/src/client/assets/zelda-crate.png"
            alt=""
            class="crate-logo w-6 h-6"
          >
          Gustave's Warehouse
        </RouterLink>

        <div class="flex items-center gap-6">
          <RouterLink
            to="/"
            class="font-display text-sm font-semibold uppercase tracking-widest text-text-primary
                   hover:text-accent-green transition-colors duration-200
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary rounded px-2 py-1"
            aria-current="page"
          >
            Home
          </RouterLink>
          <RouterLink
            to="/receiving"
            class="font-display text-sm font-semibold uppercase tracking-widest text-text-primary/60
                   hover:text-accent-green transition-colors duration-200
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary rounded px-2 py-1"
          >
            Receiving
          </RouterLink>
        </div>
      </nav>

      <main>
        <!-- Hero Section -->
        <section class="flex flex-col items-center pt-16 pb-10 px-4">
          <!-- Gustave image with atmospheric glow -->
          <div class="relative mb-6">
            <!-- Radial glow behind Gustave -->
            <div
              class="absolute inset-0 scale-150 blur-2xl opacity-20 rounded-full"
              style="background: radial-gradient(circle, rgba(93, 187, 99, 0.5) 0%, rgba(212, 160, 23, 0.2) 50%, transparent 70%);"
            />
            <img
              src="/src/client/assets/gustave-baguette.png"
              alt="Gustave the warehouse keeper, a distinguished figure holding a baguette"
              class="relative w-40 h-40 rounded-full object-cover ring-[3px] ring-[#e0d9b0] drop-shadow-[0_0_20px_rgba(93,187,99,0.15)]"
            >
          </div>

          <h1 class="font-display text-5xl md:text-6xl font-extrabold text-text-heading tracking-tight text-center">
            Gustave's Warehouse
          </h1>

          <p class="mt-4 font-display text-lg font-light text-text-primary/70 text-center max-w-md leading-relaxed">
            Hyrule's premier receiving dock — tracking every rupee, one crate at a time.
          </p>
        </section>

        <!-- PO Search Section -->
        <section
          class="flex justify-center px-4 pb-12"
          aria-label="Purchase order search"
        >
          <!-- SearchInput -->
          <div class="w-full max-w-xl">
            <label
              for="po-search-home"
              class="block font-display text-xs font-semibold uppercase tracking-wider text-text-primary/60 mb-2"
            >
              Purchase Order
            </label>
            <form
              role="search"
              aria-label="Search purchase orders"
              class="flex items-stretch gap-0 w-full"
              @submit.prevent="onSearch"
            >
              <div class="relative flex-1">
                <div class="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-primary/40">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5"
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
                </div>

                <input
                  id="po-search-home"
                  v-model="poSearch"
                  type="text"
                  placeholder="Enter PO number..."
                  :aria-invalid="!!searchError || undefined"
                  aria-describedby="po-search-error"
                  :class="[
                    'w-full h-14 pl-12 pr-4 rounded-l-lg border border-r-0',
                    'bg-bg-elevated text-text-primary font-data text-base tracking-wide',
                    'placeholder:text-text-primary/30',
                    'focus:outline-none focus:ring-1',
                    'transition-colors duration-200',
                    searchError
                      ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500'
                      : 'border-white/15 focus:border-accent-green focus:ring-accent-green',
                  ]"
                  @input="searchError = ''"
                >
              </div>

              <button
                type="submit"
                :disabled="isSearching"
                class="h-14 px-6 rounded-r-lg bg-accent-green text-bg-primary font-display font-bold text-sm uppercase tracking-widest
                       hover:bg-accent-green/85 active:bg-accent-green/70
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary
                       transition-all duration-200 whitespace-nowrap
                       disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {{ isSearching ? 'Looking up…' : 'Look Up' }}
              </button>
            </form>
            <span
              v-if="searchError"
              id="po-search-error"
              role="alert"
              class="mt-2 block text-sm text-red-400 font-display"
            >
              {{ searchError }}
            </span>
          </div>
        </section>

        <!-- Dashboard Summary Cards -->
        <section
          class="max-w-3xl mx-auto px-4 pb-20"
          aria-label="Order status summary"
        >
          <h2 class="font-display text-sm font-semibold uppercase tracking-[0.2em] text-text-primary/40 mb-6">
            Dock Overview
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <!-- Pending Card -->
            <RouterLink
              to="/receiving?status=pending"
              class="dashboard-card relative block bg-bg-elevated rounded-lg border border-white/15 overflow-hidden
                     group hover:border-accent-blue/40 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent-blue/5
                     transition-all duration-300
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
            >
              <!-- Left accent stripe -->
              <div
                class="absolute left-0 top-0 bottom-0 w-1 bg-accent-blue"
              />

              <!-- Hover arrow -->
              <div class="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-60 transition-opacity duration-300 text-accent-blue">
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
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>

              <div class="pl-5 pr-4 py-5">
                <div class="flex items-center justify-between mb-3">
                  <span class="font-display text-xs font-semibold uppercase tracking-wider text-text-primary/50">
                    Pending
                  </span>
                  <!-- Clock icon -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4 h-4 text-accent-blue/50"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                    />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>

                <span class="font-data text-4xl font-semibold text-accent-blue">
                  2
                </span>
              </div>
            </RouterLink>

            <!-- Partial Card -->
            <RouterLink
              to="/receiving?status=partial"
              class="dashboard-card relative block bg-bg-elevated rounded-lg border border-white/15 overflow-hidden
                     group hover:border-accent-gold/40 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent-gold/5
                     transition-all duration-300
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
            >
              <div
                class="absolute left-0 top-0 bottom-0 w-1 bg-accent-gold"
              />

              <!-- Hover arrow -->
              <div class="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-60 transition-opacity duration-300 text-accent-gold">
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
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>

              <div class="pl-5 pr-4 py-5">
                <div class="flex items-center justify-between mb-3">
                  <span class="font-display text-xs font-semibold uppercase tracking-wider text-text-primary/50">
                    Partial
                  </span>
                  <!-- Box icon -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4 h-4 text-accent-gold/50"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line
                      x1="12"
                      y1="22.08"
                      x2="12"
                      y2="12"
                    />
                  </svg>
                </div>

                <span class="font-data text-4xl font-semibold text-accent-gold">
                  3
                </span>
              </div>
            </RouterLink>

            <!-- Received Card -->
            <RouterLink
              to="/receiving?status=received"
              class="dashboard-card relative block bg-bg-elevated rounded-lg border border-white/15 overflow-hidden
                     group hover:border-accent-green/40 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent-green/5
                     transition-all duration-300
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
            >
              <div
                class="absolute left-0 top-0 bottom-0 w-1 bg-accent-green"
              />

              <!-- Hover arrow -->
              <div class="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-60 transition-opacity duration-300 text-accent-green">
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
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>

              <div class="pl-5 pr-4 py-5">
                <div class="flex items-center justify-between mb-3">
                  <span class="font-display text-xs font-semibold uppercase tracking-wider text-text-primary/50">
                    Received
                  </span>
                  <!-- Check-circle icon -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4 h-4 text-accent-green/50"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>

                <span class="font-data text-4xl font-semibold text-accent-green">
                  2
                </span>
              </div>
            </RouterLink>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Entrance animations — staggered reveal */
@media (prefers-reduced-motion: no-preference) {
  @keyframes fade-up {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  main > section {
    animation: fade-up 0.5s ease-out both;
  }

  main > section:nth-child(1) {
    animation-delay: 0.05s;
  }

  main > section:nth-child(2) {
    animation-delay: 0.15s;
  }

  main > section:nth-child(3) {
    animation-delay: 0.25s;
  }

  /* Crate logo wobble on nav hover */
  @keyframes crate-wobble {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-6deg); }
    75% { transform: rotate(6deg); }
  }

  .nav-brand:hover .crate-logo {
    animation: crate-wobble 0.4s ease-in-out;
  }
}
</style>
