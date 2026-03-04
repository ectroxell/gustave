<template>
  <div class="min-h-screen bg-bg-primary font-display text-text-primary">
    <!-- Atmospheric background: radial torchlight glow from top-center -->
    <div class="fixed inset-0 pointer-events-none">
      <div
        class="absolute inset-0"
        style="background: radial-gradient(ellipse 60% 40% at 50% 0%, rgba(93, 187, 99, 0.04) 0%, transparent 70%), radial-gradient(ellipse 80% 50% at 50% 0%, rgba(15, 52, 96, 0.3) 0%, transparent 60%);"
      />
    </div>

    <div class="relative z-10">
      <!-- AppNav component goes here -->
      <slot name="nav" />

      <main>
        <slot />
      </main>
    </div>
  </div>
</template>
