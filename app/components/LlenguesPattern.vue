<script setup lang="ts">
// Original vector motif inspired by Mallorcan ikat, with irregular feathered edges.
const patternId = `llengues-${useId().replace(/:/g, '')}`;
const grainId = `${patternId}-grain`;
function tonguePath() {
  const edge: [number, number][] = [];
  for (let y = -112; y <= 112; y += 2) {
    const envelope = Math.pow(Math.max(0, 1 - Math.abs(y) / 112), .85);
    const fringe = (Math.sin(y * 2.7) + Math.sin(y * .83)) * 2.4;
    edge.push([Number(Math.max(.3, 27 * envelope + fringe * envelope).toFixed(2)), y]);
  }
  return `M ${edge.map(([x, y]) => `${x},${y}`).join(' L ')} L ${edge.toReversed().map(([x, y]) => `${-x},${y}`).join(' L ')} Z`;
}
const tongue = tonguePath();
const motifs = [
  { x: 32, y: 128, color: 'var(--color-textile-primary)' },
  { x: 96, y: 0, color: 'var(--color-textile-secondary)' },
  { x: 96, y: 256, color: 'var(--color-textile-secondary)' },
  { x: 160, y: 128, color: 'var(--color-textile-tertiary)' },
  { x: 224, y: 0, color: 'var(--color-textile-accent)' },
  { x: 224, y: 256, color: 'var(--color-textile-accent)' },
];
</script>

<template>
  <svg class="llengues-pattern" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" aria-hidden="true" focusable="false">
    <defs>
      <pattern :id="patternId" width="256" height="256" patternUnits="userSpaceOnUse">
        <rect width="256" height="256" fill="var(--color-textile-background)" />
        <g v-for="(motif, index) in motifs" :key="index" :transform="`translate(${motif.x} ${motif.y})`">
          <path :d="tongue" :fill="motif.color" opacity=".9" />
          <path :d="tongue" transform="scale(.53 .76)" fill="var(--color-textile-background)" />
          <path :d="tongue" transform="scale(.19 .5)" :fill="motif.color" opacity=".8" />
        </g>
      </pattern>
      <pattern :id="grainId" width="5" height="4" patternUnits="userSpaceOnUse">
        <path d="M0 0H5M0 2H5" stroke="var(--color-textile-background)" stroke-width=".6" opacity=".5" />
        <path d="M1 0V4" stroke="var(--color-textile-primary)" stroke-width=".4" opacity=".12" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" :fill="`url(#${patternId})`" />
    <rect width="100%" height="100%" :fill="`url(#${grainId})`" />
  </svg>
</template>
