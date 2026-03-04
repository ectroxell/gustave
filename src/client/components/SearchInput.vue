<template>
  <div class="w-full max-w-xl">
    <label
      for="po-search"
      class="block font-display text-xs font-semibold uppercase tracking-wider text-text-primary/60 mb-2"
    >
      Purchase Order
    </label>
    <form
      role="search"
      aria-label="Search purchase orders"
      class="flex items-stretch gap-0 w-full"
    >
      <div class="relative flex-1">
        <!-- Magnifying glass icon -->
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
          id="po-search"
          type="text"
          placeholder="Enter PO number..."
          class="w-full h-14 pl-12 pr-4 rounded-l-lg border border-r-0 border-white/15
                 bg-bg-elevated text-text-primary font-data text-base tracking-wide
                 placeholder:text-text-primary/30
                 focus:outline-none focus:border-accent-green focus:ring-1 focus:ring-accent-green
                 transition-colors duration-200"
        >
      </div>

      <button
        type="submit"
        class="h-14 px-6 rounded-r-lg bg-accent-green text-bg-primary font-display font-bold text-sm uppercase tracking-widest
               hover:bg-accent-green/85 active:bg-accent-green/70
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary
               transition-all duration-200 whitespace-nowrap"
      >
        Look Up
      </button>
    </form>
  </div>
</template>
