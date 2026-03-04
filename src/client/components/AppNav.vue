<template>
  <nav
    role="navigation"
    aria-label="Main navigation"
    class="flex items-center justify-between px-6 py-4 border-b border-border bg-bg-surface/80 backdrop-blur-sm"
  >
    <a
      href="/"
      class="font-display text-xl font-bold tracking-wide text-text-heading
             hover:text-accent-green transition-colors duration-200
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary rounded"
    >
      Gustave's Warehouse
    </a>

    <div class="flex items-center gap-6">
      <a
        href="/"
        class="font-display text-sm font-semibold uppercase tracking-widest text-text-primary
               hover:text-accent-green transition-colors duration-200
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary rounded px-2 py-1"
        aria-current="page"
      >
        Home
      </a>
      <a
        href="/receiving"
        class="font-display text-sm font-semibold uppercase tracking-widest text-text-primary/60
               hover:text-accent-green transition-colors duration-200
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary rounded px-2 py-1"
      >
        Receiving
      </a>
    </div>
  </nav>
</template>
