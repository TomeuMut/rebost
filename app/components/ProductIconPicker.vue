<script setup lang="ts">
import type { ProductIconId } from '../../src/domain/product-icons';
defineProps<{ options: { value: ProductIconId; label: string }[]; label: string; help: string }>();
const model = defineModel<ProductIconId>({ required: true });
</script>

<template>
  <fieldset class="icon-picker">
    <legend>{{ label }}</legend>
    <div class="icon-options">
      <button v-for="option in options" :key="option.value" type="button" :aria-pressed="model===option.value" :data-icon="option.value" @click="model=option.value">
        <ProductIcon :name="option.value" :size="26" /><span>{{ option.label }}</span>
      </button>
    </div>
    <p class="help-text">{{ help }}</p>
  </fieldset>
</template>
