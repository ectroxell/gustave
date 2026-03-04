import { render, type RenderOptions } from '@testing-library/vue';
import { createRouter, createMemoryHistory } from 'vue-router';
import type { Component } from 'vue';

export function renderWithRouter<C>(
  component: Component,
  options: RenderOptions<C> = {},
) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div>Home</div>' } },
      { path: '/:pathMatch(.*)*', component: { template: '<div>Not Found</div>' } },
    ],
  });

  return render(component, {
    ...options,
    global: {
      ...options.global,
      plugins: [...(options.global?.plugins ?? []), router],
    },
  });
}
