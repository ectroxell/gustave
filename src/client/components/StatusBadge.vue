<template>
  <div class="flex flex-wrap gap-3">
    <!-- variant: pending (blue) -->
    <span
      class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
             bg-accent-blue/15 text-accent-blue
             font-display text-xs font-semibold uppercase tracking-wider
             border border-accent-blue/25"
    >
      <span class="w-1.5 h-1.5 rounded-full bg-accent-blue" />
      Pending
    </span>

    <!-- variant: partial (gold) -->
    <span
      class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
             bg-accent-gold/15 text-accent-gold
             font-display text-xs font-semibold uppercase tracking-wider
             border border-accent-gold/25"
    >
      <span class="w-1.5 h-1.5 rounded-full bg-accent-gold" />
      Partial
    </span>

    <!-- variant: received (green) -->
    <span
      class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
             bg-accent-green/15 text-accent-green
             font-display text-xs font-semibold uppercase tracking-wider
             border border-accent-green/25"
    >
      <span class="w-1.5 h-1.5 rounded-full bg-accent-green" />
      Received
    </span>
  </div>
</template>
