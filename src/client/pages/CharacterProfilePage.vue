<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import AppTag from '../components/ui/AppTag.vue';
import AppButton from '../components/ui/AppButton.vue';
import AppCard from '../components/ui/AppCard.vue';
import TriforceRule from '../components/ui/TriforceRule.vue';
import type { PurchaseOrderSummary } from '../types/index.js';

type CharacterProfile = {
  id: number;
  name: string;
  title: string;
  race: string;
  createdAt: string;
  bio: string;
  firstAppearanceYear: number;
};

const route = useRoute();
const router = useRouter();

const character = ref<CharacterProfile | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const purchaseOrders = ref<PurchaseOrderSummary[]>([]);

const tenure = computed(() => {
  if (!character.value) return 0;
  return 2026 - character.value.firstAppearanceYear;
});

const poCount = computed(() =>
  purchaseOrders.value.filter((po) => po.characterName === character.value?.name).length,
);

const portraitSrc = computed(() =>
  character.value ? `/src/client/assets/characters/${character.value.name}.png` : '',
);

async function fetchCharacter() {
  const name = route.params.name as string;

  try {
    const res = await fetch(`/api/characters/${encodeURIComponent(name)}`);

    if (res.status === 404) {
      error.value = `Character "${name}" not found`;
      return;
    }

    if (!res.ok) {
      error.value = 'Failed to load character';
      return;
    }

    const json = await res.json() as { data: CharacterProfile };
    character.value = json.data;
  } catch {
    error.value = 'Failed to load character';
  } finally {
    loading.value = false;
  }
}

async function fetchPurchaseOrders() {
  try {
    const res = await fetch('/api/purchase-orders');
    if (!res.ok) return;
    const json = await res.json() as { data: PurchaseOrderSummary[] };
    purchaseOrders.value = json.data;
  } catch {
    // silently ignore — PO count is supplementary
  }
}

onMounted(() => {
  fetchCharacter();
  fetchPurchaseOrders();
});
</script>

<template>
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
      <div class="max-w-4xl mx-auto px-4 py-8">
        <!-- Back button -->
        <div class="mb-6">
          <AppButton
            variant="ghost"
            @click="router.back()"
          >
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
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </AppButton>
        </div>

        <!-- Loading skeleton -->
        <div
          v-if="loading"
          role="status"
        >
          <div class="rounded-lg border border-border bg-bg-surface overflow-hidden animate-pulse">
            <div class="px-5 py-6 flex flex-col items-center gap-4">
              <div class="w-24 h-24 rounded-full bg-bg-elevated/50" />
              <div class="h-7 w-40 rounded bg-bg-elevated/50" />
              <div class="h-4 w-28 rounded bg-bg-elevated/50" />
              <div class="h-5 w-16 rounded-full bg-bg-elevated/50" />
            </div>
            <div class="px-5 py-5 space-y-3">
              <div class="h-4 w-full rounded bg-bg-elevated/50" />
              <div class="h-4 w-3/4 rounded bg-bg-elevated/50" />
            </div>
          </div>
        </div>

        <!-- Error state -->
        <div
          v-else-if="error"
          class="flex flex-col items-center justify-center py-20"
        >
          <p class="text-accent-red font-display text-lg mb-4">
            {{ error }}
          </p>
          <RouterLink to="/receiving">
            <AppButton variant="ghost">
              Return to Receiving
            </AppButton>
          </RouterLink>
        </div>

        <!-- Character Profile -->
        <template v-else-if="character">
          <AppCard class="profile-header">
            <div class="flex flex-col items-center text-center py-4">
              <img
                :src="portraitSrc"
                :alt="character.name"
                class="portrait-glow w-24 h-24 rounded-full object-cover ring-2 ring-accent-green/30 mb-4"
              >
              <h1 class="font-display text-2xl font-bold text-text-heading">
                {{ character.name }}
              </h1>
              <p class="font-display text-sm text-text-primary/60 mt-1">
                {{ character.title }}
              </p>
              <div class="mt-3">
                <AppTag>{{ character.race }}</AppTag>
              </div>
            </div>
          </AppCard>

          <TriforceRule />

          <!-- About Me -->
          <section class="profile-about">
            <h2 class="font-display text-sm font-semibold uppercase tracking-[0.2em] text-text-primary/40 mb-4">
              About Me
            </h2>
            <AppCard>
              <p class="font-data text-sm text-text-primary/80 leading-relaxed">
                {{ character.bio }}
              </p>
            </AppCard>
          </section>

          <TriforceRule />

          <!-- Stats -->
          <section class="profile-stats">
            <h2 class="font-display text-sm font-semibold uppercase tracking-[0.2em] text-text-primary/40 mb-4">
              Stats
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AppCard>
                <dt class="font-display text-xs font-semibold uppercase tracking-wider text-text-primary/50 mb-1">
                  Tenure
                </dt>
                <dd class="font-data text-sm text-text-primary">
                  Working at Gustave's Warehouse for {{ tenure }} years
                </dd>
              </AppCard>
              <AppCard>
                <dt class="font-display text-xs font-semibold uppercase tracking-wider text-text-primary/50 mb-1">
                  Purchase Orders
                </dt>
                <dd class="font-data text-sm text-text-primary">
                  Has placed {{ poCount }} orders
                </dd>
              </AppCard>
            </div>
          </section>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Staggered entrance animations */
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

  .profile-header {
    animation: fade-up 0.5s ease-out both;
    animation-delay: 0.05s;
  }

  .profile-about {
    animation: fade-up 0.5s ease-out both;
    animation-delay: 0.2s;
  }

  .profile-stats {
    animation: fade-up 0.5s ease-out both;
    animation-delay: 0.35s;
  }
}

/* Character portrait glow pulse */
/* @media (prefers-reduced-motion: no-preference) {
  @keyframes glow-pulse {
    0%, 100% {
      box-shadow: 0 0 6px rgba(93, 187, 99, 0.2);
    }
    50% {
      box-shadow: 0 0 14px rgba(93, 187, 99, 0.4);
    }
  }

  .portrait-glow {
    animation: glow-pulse 3.5s ease-in-out infinite;
  }
} */
</style>
