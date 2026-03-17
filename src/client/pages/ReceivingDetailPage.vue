<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import AppBadge from '../components/ui/AppBadge.vue';
import AppButton from '../components/ui/AppButton.vue';
import AppCard from '../components/ui/AppCard.vue';
import TriforceRule from '../components/ui/TriforceRule.vue';
import type { Character, Item, WarehouseLocation } from '../types';
import fanfareSound from '../assets/sounds/BOTW_Fanfare_Item.m4a';

type LineItem = {
  id: number;
  quantityOrdered: number;
  quantityReceived: number;
  warehouseLocationId: number | null;
  item: Item;
};

type PurchaseOrderDetail = {
  id: number;
  poNumber: string;
  status: 'pending' | 'partial' | 'received';
  notes: string | null;
  createdAt: string;
  character: Character;
  items: LineItem[];
};

type ReceiptLine = {
  id: number;
  quantityReceived: number;
  item: { id: number; name: string; category: string };
  warehouseLocation: string | null;
};

type Receipt = {
  id: number;
  receiptNumber: string;
  notes: string | null;
  createdAt: string;
  lines: ReceiptLine[];
};

type ReceivingLine = {
  purchaseOrderItemId: number;
  itemName: string;
  quantityOrdered: number;
  quantityReceived: number;
  remaining: number;
  quantityToReceive: number;
  warehouseLocationId: number | null;
};

const route = useRoute();
const router = useRouter();
const po = ref<PurchaseOrderDetail | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

// Receiving mode state
const isReceiving = ref(false);
const isReviewing = ref(false);
const receivingLines = ref<ReceivingLine[]>([]);
const warehouseLocations = ref<WarehouseLocation[]>([]);
const receiptNotes = ref('');
const submitError = ref<string | null>(null);
const isSubmitting = ref(false);

const receipts = ref<Receipt[]>([]);
const receiptsLoading = ref(true);
const expandedReceiptId = ref<number | null>(null);

const newReceiptButton = ref<InstanceType<typeof AppButton> | null>(null);
const receivingSection = ref<HTMLElement | null>(null);

const totalProgress = computed(() => {
  if (!po.value || po.value.items.length === 0) return 0;
  const ordered = po.value.items.reduce((sum, line) => sum + line.quantityOrdered, 0);
  const received = po.value.items.reduce((sum, line) => sum + line.quantityReceived, 0);
  if (ordered === 0) return 0;
  return Math.min((received / ordered) * 100, 100);
});

const progressCircumference = 2 * Math.PI * 24;

const hasReceivableLines = computed(() =>
  receivingLines.value.some((line) => line.quantityToReceive > 0),
);

async function fetchPurchaseOrder() {
  const poNumber = route.params.poNumber as string;

  try {
    const res = await fetch(`/api/purchase-orders/${encodeURIComponent(poNumber)}`);

    if (res.status === 404) {
      error.value = `Purchase order "${poNumber}" not found`;
      return;
    }

    if (!res.ok) {
      error.value = 'Failed to load purchase order';
      return;
    }

    const json = await res.json() as { data: PurchaseOrderDetail };
    po.value = json.data;
  } catch {
    error.value = 'Failed to load purchase order';
  } finally {
    loading.value = false;
  }
}

async function fetchReceipts() {
  const poNumber = route.params.poNumber as string;
  receiptsLoading.value = true;
  try {
    const res = await fetch(`/api/purchase-orders/${encodeURIComponent(poNumber)}/receipts`);
    if (!res.ok) return;
    const json = await res.json() as { data: Receipt[] };
    receipts.value = json.data;
    if (json.data.length > 0 && expandedReceiptId.value === null) {
      expandedReceiptId.value = json.data[0].id;
    }
  } catch {
    // silently ignore
  } finally {
    receiptsLoading.value = false;
  }
}

function toggleReceipt(id: number) {
  expandedReceiptId.value = expandedReceiptId.value === id ? null : id;
}

onMounted(() => {
  fetchPurchaseOrder();
  fetchReceipts();
});

async function enterReceivingMode() {
  submitError.value = null;

  // Fetch warehouse locations
  try {
    const res = await fetch('/api/warehouse-locations');
    if (!res.ok) {
      submitError.value = 'Failed to load warehouse locations';
      return;
    }
    const json = await res.json() as { data: WarehouseLocation[] };
    warehouseLocations.value = json.data;
  } catch {
    submitError.value = 'Failed to load warehouse locations';
    return;
  }

  // Build receiving lines from PO items with remaining quantity
  if (po.value) {
    receivingLines.value = po.value.items.map((line) => {
      const remaining = line.quantityOrdered - line.quantityReceived;
      return {
        purchaseOrderItemId: line.id,
        itemName: line.item.name,
        quantityOrdered: line.quantityOrdered,
        quantityReceived: line.quantityReceived,
        remaining,
        quantityToReceive: remaining > 0 ? 1 : 0,
        warehouseLocationId: line.warehouseLocationId,
      };
    });
  }

  receiptNotes.value = '';
  isReceiving.value = true;
  isReviewing.value = false;

  await nextTick();
  receivingSection.value?.focus();
}

function cancelReceiving() {
  isReceiving.value = false;
  isReviewing.value = false;
  submitError.value = null;

  nextTick(() => {
    const btn = newReceiptButton.value?.$el as HTMLElement | undefined;
    btn?.focus();
  });
}

function enterReview() {
  submitError.value = null;
  isReviewing.value = true;

  nextTick(() => {
    receivingSection.value?.focus();
  });
}

function backToForm() {
  isReviewing.value = false;

  nextTick(() => {
    receivingSection.value?.focus();
  });
}

const linesToSubmit = computed(() =>
  receivingLines.value.filter((line) => line.quantityToReceive > 0),
);

async function confirmReceipt() {
  if (!po.value || isSubmitting.value) return;

  isSubmitting.value = true;
  submitError.value = null;

  const body = {
    lines: linesToSubmit.value.map((line) => ({
      purchaseOrderItemId: line.purchaseOrderItemId,
      quantity: line.quantityToReceive,
    })),
    notes: receiptNotes.value.trim() || null,
  };

  try {
    const res = await fetch(
      `/api/purchase-orders/${encodeURIComponent(po.value.poNumber)}/receive`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
    );

    if (!res.ok) {
      const json = await res.json() as { error?: string };
      submitError.value = json.error ?? 'Failed to submit receipt';
      return;
    }

    // Success — re-fetch PO data and exit receiving mode
    new window.Audio(fanfareSound)
      .play()
      .catch(() => {});
    isReceiving.value = false;
    isReviewing.value = false;
    loading.value = true;
    expandedReceiptId.value = null;
    await Promise.all([fetchPurchaseOrder(), fetchReceipts()]);
  } catch {
    submitError.value = 'Failed to submit receipt. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
}

function receivedColorClass(line: LineItem): string {
  if (line.quantityReceived >= line.quantityOrdered) return 'text-accent-green';
  if (line.quantityReceived > 0) return 'text-accent-gold';
  return 'text-text-primary';
}

function lineProgressPercent(line: LineItem): number {
  if (line.quantityOrdered === 0) return 0;
  return Math.min((line.quantityReceived / line.quantityOrdered) * 100, 100);
}

function lineProgressColor(line: LineItem): string {
  if (line.quantityReceived >= line.quantityOrdered) return 'bg-accent-green';
  if (line.quantityReceived > 0) return 'bg-accent-gold';
  return 'bg-text-primary/10';
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
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
            Back to Receiving
          </AppButton>
        </div>

        <!-- Loading skeleton state -->
        <div
          v-if="loading"
          role="status"
        >
          <!-- Skeleton header card -->
          <div class="rounded-lg border border-border bg-bg-surface overflow-hidden animate-pulse">
            <div class="px-5 py-4 border-b border-border">
              <div class="flex items-center justify-between">
                <div class="h-7 w-32 rounded bg-bg-elevated/50" />
                <div class="h-6 w-20 rounded-full bg-bg-elevated/50" />
              </div>
            </div>
            <div class="px-5 py-5 space-y-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-bg-elevated/50 shrink-0" />
                <div class="h-4 w-48 rounded bg-bg-elevated/50" />
              </div>
              <div class="h-4 w-32 rounded bg-bg-elevated/50" />
            </div>
          </div>

          <!-- Skeleton table rows -->
          <div class="mt-6">
            <div class="h-4 w-24 rounded bg-bg-elevated/50 mb-4 animate-pulse" />
            <div class="rounded-lg border border-border overflow-hidden">
              <div
                v-for="i in 4"
                :key="i"
                class="flex items-center gap-4 px-5 py-3 border-b border-border last:border-b-0 animate-pulse"
              >
                <div class="h-4 w-32 rounded bg-bg-elevated/50" />
                <div class="h-4 w-20 rounded bg-bg-elevated/50" />
                <div class="ml-auto h-4 w-8 rounded bg-bg-elevated/50" />
                <div class="h-4 w-8 rounded bg-bg-elevated/50" />
              </div>
            </div>
          </div>
        </div>

        <!-- Error / 404 state -->
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

        <!-- PO Detail -->
        <template v-else-if="po">
          <!-- Header -->
          <AppCard class="detail-header">
            <template #header>
              <div class="flex items-center justify-between flex-wrap gap-3">
                <div class="flex items-center gap-4">
                  <h1 class="font-display text-2xl font-bold text-text-heading">
                    {{ po.poNumber }}
                  </h1>
                  <AppBadge :variant="po.status">
                    {{ po.status }}
                  </AppBadge>
                </div>

                <!-- Progress Ring -->
                <div class="flex items-center gap-2">
                  <svg
                    class="progress-ring"
                    width="64"
                    height="64"
                    viewBox="0 0 64 64"
                    aria-label="Receiving progress"
                    role="img"
                  >
                    <circle
                      cx="32"
                      cy="32"
                      r="24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="4"
                      class="text-border"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="24"
                      fill="none"
                      stroke-width="4"
                      stroke-linecap="round"
                      class="progress-ring-value"
                      :class="totalProgress >= 100 ? 'text-accent-green' : 'text-accent-gold'"
                      :stroke-dasharray="progressCircumference"
                      :stroke-dashoffset="progressCircumference - (progressCircumference * totalProgress / 100)"
                      transform="rotate(-90 32 32)"
                    />
                    <text
                      x="32"
                      y="32"
                      text-anchor="middle"
                      dominant-baseline="central"
                      class="fill-text-primary font-data text-xs font-semibold"
                      style="font-size: 11px;"
                    >
                      {{ Math.round(totalProgress) }}%
                    </text>
                  </svg>
                </div>
              </div>
            </template>

            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
              <div>
                <dt class="font-display text-xs font-semibold uppercase tracking-wider text-text-primary/50 mb-1">
                  Ordered By
                </dt>
                <dd class="flex items-center gap-3 font-data text-text-primary">
                  <img
                    :src="`/src/client/assets/characters/${po.character.name}.png`"
                    :alt="po.character.name"
                    class="portrait-glow w-10 h-10 rounded-full object-cover ring-2 ring-accent-green/30 shrink-0"
                  >
                  <span>
                    <RouterLink
                      :to="'/characters/' + po.character.name"
                      class="hover:text-accent-green transition-colors duration-200
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface rounded"
                    >
                      {{ po.character.name }}
                    </RouterLink>
                    <span class="text-text-primary/50">
                      — {{ po.character.title }}
                    </span>
                  </span>
                </dd>
              </div>

              <div>
                <dt class="font-display text-xs font-semibold uppercase tracking-wider text-text-primary/50 mb-1">
                  Created
                </dt>
                <dd class="font-data text-text-primary">
                  {{ formatDate(po.createdAt) }}
                </dd>
              </div>

              <div
                v-if="po.notes"
                class="sm:col-span-2"
              >
                <dt class="font-display text-xs font-semibold uppercase tracking-wider text-text-primary/50 mb-1">
                  Notes
                </dt>
                <dd class="font-data text-text-primary/80">
                  {{ po.notes }}
                </dd>
              </div>
            </dl>
          </AppCard>

          <TriforceRule />

          <!-- Line Items -->
          <section class="detail-items">
            <h2 class="font-display text-sm font-semibold uppercase tracking-[0.2em] text-text-primary/40 mb-4">
              Line Items
            </h2>

            <div class="rounded-lg border border-border bg-bg-surface overflow-hidden">
              <table class="w-full text-left">
                <thead>
                  <tr class="bg-bg-surface/50 border-b border-border">
                    <th
                      scope="col"
                      class="px-5 py-3 font-display text-xs font-semibold uppercase tracking-wider text-text-primary/50"
                    >
                      Item
                    </th>
                    <th
                      scope="col"
                      class="px-5 py-3 font-display text-xs font-semibold uppercase tracking-wider text-text-primary/50"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      class="px-5 py-3 font-display text-xs font-semibold uppercase tracking-wider text-text-primary/50 text-right"
                    >
                      Ordered
                    </th>
                    <th
                      scope="col"
                      class="px-5 py-3 font-display text-xs font-semibold uppercase tracking-wider text-text-primary/50 text-right"
                    >
                      Received
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="line in po.items"
                    :key="line.id"
                    class="border-b border-border last:border-b-0 hover:bg-bg-surface/50 transition-colors duration-150"
                  >
                    <td class="px-5 py-3 font-data text-sm text-text-primary">
                      {{ line.item.name }}
                    </td>
                    <td class="px-5 py-3 font-data text-sm text-text-primary/70 capitalize">
                      {{ line.item.category }}
                    </td>
                    <td class="px-5 py-3 font-data text-sm text-text-primary text-right">
                      {{ line.quantityOrdered }}
                    </td>
                    <td class="px-5 py-3 pb-1 font-data text-sm text-right">
                      <span :class="receivedColorClass(line)">
                        {{ line.quantityReceived }}
                      </span>
                      <!-- Progress bar -->
                      <div class="mt-1.5 h-0.5 w-full rounded-full bg-border overflow-hidden">
                        <div
                          class="h-full rounded-full transition-all duration-500"
                          :class="lineProgressColor(line)"
                          :style="{ width: `${lineProgressPercent(line)}%` }"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- New Receipt Button -->
          <div
            v-if="po.status !== 'received' && !isReceiving"
            class="mt-6"
          >
            <AppButton
              ref="newReceiptButton"
              @click="enterReceivingMode"
            >
              New Receipt
            </AppButton>
          </div>

          <!-- Receiving Mode -->
          <section
            v-if="isReceiving"
            ref="receivingSection"
            tabindex="-1"
            aria-label="Receiving mode"
            class="mt-6 detail-receiving focus-visible:outline-none"
          >
            <!-- Error banner -->
            <div
              v-if="submitError"
              role="alert"
              class="mb-4 rounded-lg border border-accent-red/30 bg-accent-red/10 px-4 py-3 text-sm text-accent-red font-data"
            >
              {{ submitError }}
            </div>

            <!-- Receiving Form -->
            <AppCard
              v-if="!isReviewing"
              title="Receive Items"
            >
              <div class="space-y-4">
                <div
                  v-for="line in receivingLines"
                  :key="line.purchaseOrderItemId"
                  class="rounded-lg border px-4 py-3"
                  :class="line.remaining > 0
                    ? 'border-border bg-bg-elevated/30'
                    : 'border-border/50 bg-bg-elevated/10 opacity-50'"
                >
                  <div class="flex flex-col sm:flex-row sm:items-center gap-3">
                    <!-- Item info -->
                    <div class="flex-1 min-w-0">
                      <p class="font-data text-sm text-text-primary font-semibold truncate">
                        {{ line.itemName }}
                      </p>
                      <p class="font-data text-xs text-text-primary/50 mt-0.5">
                        Ordered: {{ line.quantityOrdered }} / Received: {{ line.quantityReceived }}
                        <span
                          v-if="line.remaining > 0"
                          class="text-accent-gold"
                        >
                          ({{ line.remaining }} remaining)
                        </span>
                        <span
                          v-else
                          class="text-accent-green"
                        >
                          (complete)
                        </span>
                      </p>
                    </div>

                    <!-- Quantity input + Location select -->
                    <div
                      v-if="line.remaining > 0"
                      class="flex items-end gap-3 shrink-0"
                    >
                      <div>
                        <label
                          :for="`qty-${line.purchaseOrderItemId}`"
                          class="block font-display text-xs font-semibold uppercase tracking-wider text-text-primary/60 mb-1"
                        >
                          Qty
                        </label>
                        <input
                          :id="`qty-${line.purchaseOrderItemId}`"
                          v-model.number="line.quantityToReceive"
                          type="number"
                          :min="0"
                          :max="line.remaining"
                          class="w-20 h-10 rounded-lg border border-border bg-bg-elevated px-3 text-text-primary font-data text-sm
                                 focus:outline-none focus:ring-1 focus:border-accent-green focus:ring-accent-green transition-colors duration-200"
                        >
                      </div>

                      <div>
                        <label
                          :for="`loc-${line.purchaseOrderItemId}`"
                          class="block font-display text-xs font-semibold uppercase tracking-wider text-text-primary/60 mb-1"
                        >
                          Location
                        </label>
                        <select
                          :id="`loc-${line.purchaseOrderItemId}`"
                          v-model.number="line.warehouseLocationId"
                          class="h-10 rounded-lg border border-border bg-bg-elevated px-3 pr-8 text-text-primary font-data text-sm
                                 focus:outline-none focus:ring-1 focus:border-accent-green focus:ring-accent-green transition-colors duration-200
                                 appearance-none cursor-pointer"
                        >
                          <option
                            :value="null"
                            class="bg-bg-elevated"
                          >
                            Select location
                          </option>
                          <option
                            v-for="loc in warehouseLocations"
                            :key="loc.id"
                            :value="loc.id"
                            class="bg-bg-elevated"
                          >
                            {{ loc.name }} ({{ loc.zone }})
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <template #footer>
                <div class="flex items-center gap-3">
                  <AppButton
                    :disabled="!hasReceivableLines"
                    @click="enterReview"
                  >
                    Review
                  </AppButton>
                  <AppButton
                    variant="ghost"
                    @click="cancelReceiving"
                  >
                    Cancel
                  </AppButton>
                </div>
              </template>
            </AppCard>

            <!-- Review Summary -->
            <AppCard
              v-else
              title="Review Receipt"
            >
              <div class="space-y-3">
                <div
                  v-for="line in linesToSubmit"
                  :key="line.purchaseOrderItemId"
                  class="flex items-center justify-between rounded-lg border border-border bg-bg-elevated/30 px-4 py-3"
                >
                  <div>
                    <p class="font-data text-sm text-text-primary font-semibold">
                      {{ line.itemName }}
                    </p>
                    <p
                      v-if="line.warehouseLocationId"
                      class="font-data text-xs text-text-primary/50 mt-0.5"
                    >
                      Location: {{ warehouseLocations.find((l) => l.id === line.warehouseLocationId)?.name ?? 'Unknown' }}
                    </p>
                  </div>
                  <span class="font-data text-sm text-accent-green font-semibold">
                    +{{ line.quantityToReceive }}
                  </span>
                </div>

                <!-- Notes -->
                <div class="pt-2">
                  <label
                    for="receipt-notes"
                    class="block font-display text-xs font-semibold uppercase tracking-wider text-text-primary/60 mb-2"
                  >
                    Notes (optional)
                  </label>
                  <textarea
                    id="receipt-notes"
                    v-model="receiptNotes"
                    rows="3"
                    placeholder="Add any notes about this receipt..."
                    class="w-full rounded-lg border border-border bg-bg-elevated px-4 py-3 text-text-primary font-data text-sm
                           placeholder:text-text-primary/30 resize-none
                           focus:outline-none focus:ring-1 focus:border-accent-green focus:ring-accent-green transition-colors duration-200"
                  />
                </div>
              </div>

              <template #footer>
                <div class="flex items-center gap-3">
                  <AppButton
                    :disabled="isSubmitting"
                    @click="confirmReceipt"
                  >
                    {{ isSubmitting ? 'Submitting...' : 'Confirm Receipt' }}
                  </AppButton>
                  <AppButton
                    variant="ghost"
                    :disabled="isSubmitting"
                    @click="backToForm"
                  >
                    Back
                  </AppButton>
                </div>
              </template>
            </AppCard>
          </section>

          <!-- Receipt History -->
          <section class="mt-8 detail-history">
            <h2 class="font-display text-sm font-semibold uppercase tracking-[0.2em] text-text-primary/40 mb-4">
              Receipt History
            </h2>

            <!-- Loading skeleton -->
            <div
              v-if="receiptsLoading"
              class="space-y-2"
            >
              <div
                v-for="i in 2"
                :key="i"
                class="rounded-lg border border-border bg-bg-surface px-5 py-4 animate-pulse"
              >
                <div class="flex items-center justify-between">
                  <div class="h-4 w-32 rounded bg-bg-elevated/50" />
                  <div class="h-4 w-20 rounded bg-bg-elevated/50" />
                </div>
              </div>
            </div>

            <!-- Empty state -->
            <p
              v-else-if="receipts.length === 0"
              class="font-data text-sm text-text-primary/40 italic"
            >
              No receipts recorded yet.
            </p>

            <!-- Receipt cards -->
            <div
              v-else
              class="space-y-2"
            >
              <div
                v-for="receipt in receipts"
                :key="receipt.id"
                class="rounded-lg border border-border bg-bg-surface overflow-hidden"
              >
                <!-- Card header (always visible) -->
                <button
                  class="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-bg-elevated/30 transition-colors duration-150
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-inset"
                  :aria-expanded="expandedReceiptId === receipt.id"
                  @click="toggleReceipt(receipt.id)"
                >
                  <div>
                    <span class="font-data text-sm font-semibold text-text-primary">{{ receipt.receiptNumber }}</span>
                    <span class="ml-3 font-data text-xs text-text-primary/50">{{ formatDate(receipt.createdAt) }}</span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4 h-4 text-text-primary/40 transition-transform duration-200"
                    :class="expandedReceiptId === receipt.id ? 'rotate-180' : ''"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                <!-- Expanded content -->
                <div v-if="expandedReceiptId === receipt.id">
                  <div class="border-t border-border">
                    <table class="w-full text-left">
                      <thead>
                        <tr class="bg-bg-surface/50 border-b border-border">
                          <th
                            scope="col"
                            class="px-5 py-2 font-display text-xs font-semibold uppercase tracking-wider text-text-primary/50"
                          >
                            Item
                          </th>
                          <th
                            scope="col"
                            class="px-5 py-2 font-display text-xs font-semibold uppercase tracking-wider text-text-primary/50 text-right"
                          >
                            Qty
                          </th>
                          <th
                            scope="col"
                            class="px-5 py-2 font-display text-xs font-semibold uppercase tracking-wider text-text-primary/50"
                          >
                            Location
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="line in receipt.lines"
                          :key="line.id"
                          class="border-b border-border last:border-b-0"
                        >
                          <td class="px-5 py-2 font-data text-sm text-text-primary">
                            {{ line.item.name }}
                          </td>
                          <td class="px-5 py-2 font-data text-sm text-accent-green text-right">
                            +{{ line.quantityReceived }}
                          </td>
                          <td class="px-5 py-2 font-data text-sm text-text-primary/60">
                            {{ line.warehouseLocation ?? '—' }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p
                    v-if="receipt.notes"
                    class="px-5 py-3 font-data text-xs text-text-primary/50 italic border-t border-border"
                  >
                    {{ receipt.notes }}
                  </p>
                </div>
              </div>
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

  .detail-header {
    animation: fade-up 0.5s ease-out both;
    animation-delay: 0.05s;
  }

  .detail-items {
    animation: fade-up 0.5s ease-out both;
    animation-delay: 0.2s;
  }

  .detail-receiving {
    animation: fade-up 0.4s ease-out both;
  }

  .detail-history {
    animation: fade-up 0.5s ease-out both;
    animation-delay: 0.35s;
  }
}

/* Character portrait glow pulse */
@media (prefers-reduced-motion: no-preference) {
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
}

/* Progress ring animated fill */
.progress-ring-value {
  transition: stroke-dashoffset 1s ease-out;
}
</style>
