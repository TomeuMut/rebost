<script setup lang="ts">
import { PhJar, PhBeerBottle, PhCarrot, PhPepper, PhOrange, PhGrains, PhLeaf, PhFish, PhBread, PhCheese, PhBag, PhBowlFood, PhSparkle } from '@phosphor-icons/vue';
import type { ProductIconId } from '../../src/domain/product-icons';
withDefaults(defineProps<{ name: ProductIconId; size?: number }>(), { size: 31 });
const icons = { auto: PhSparkle, jar: PhJar, bottle: PhBeerBottle, carrot: PhCarrot, pepper: PhPepper, fruit: PhOrange, grains: PhGrains, leaf: PhLeaf, fish: PhFish, bread: PhBread, cheese: PhCheese, bag: PhBag, bowl: PhBowlFood };
</script>

<template>
  <svg v-if="name==='tomato'" :width="size" :height="size" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M128 83C103 58 47 76 39 122C25 195 87 228 128 215C169 228 231 195 217 122C209 76 153 58 128 83Z" fill="currentColor" opacity=".2" />
    <path d="M96 76C65 70 43 93 39 122C25 195 87 228 128 215C169 228 231 195 217 122C213 93 191 70 160 76" stroke="currentColor" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M128 79L95 64L105 91L80 106L116 105L128 129L140 105L176 106L151 91L161 64L128 79ZM128 78C127 56 136 39 151 32" stroke="currentColor" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M72 135C67 154 73 174 85 184" stroke="currentColor" stroke-width="12" stroke-linecap="round" />
  </svg>
  <component :is="icons[name]" v-else :size="size" weight="duotone" aria-hidden="true" />
</template>
