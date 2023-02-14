<template>
  <div class="w-18">
    <Listbox v-model="color">
      <div class="relative mt-1">
        <ListboxButton
          class="relative flex w-full cursor-pointer rounded-lg bg-white p-2 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
        >
          <span
            class="block truncate h-5"
            :class="[
              color
                ? `${getColor(color)} rounded-full border border-gray-400`
                : '',
              $i18n.locale === 'en' ? 'w-5' : 'w-8',
            ]"
            >{{ color === undefined ? $t("filter_color.all") : "" }}</span
          >
          <v-icon name="bi-caret-down-fill" class="text-gray-400" />
        </ListboxButton>

        <transition
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ListboxOptions
            class="absolute mt-1 w-full overflow-auto rounded-md bg-white p-2 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            <ListboxOption
              v-slot="{ active }"
              v-for="colorInput in colors"
              :key="colorInput === undefined ? 'all' : colorInput"
              :value="colorInput"
              as="template"
            >
              <li
                :class="[
                  active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
                  'relative cursor-pointer select-none p-2',
                ]"
              >
                <span
                  class="block truncate h-5"
                  :class="[colorInput ? `${getColor(colorInput as Color)} rounded-full border border-gray-400` : '', $i18n.locale === 'en' ? 'w-5' : 'w-8']"
                  >{{
                    colorInput === undefined ? $t("filter_color.all") : ""
                  }}</span
                >
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
  </div>
</template>

<script setup lang="ts">
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import { useColorStore } from "../stores/color";
import { storeToRefs } from "pinia";
import getColor from "../utils/getColor";
import type { Color } from "@/schemas/noteSchemas";
const colorStore = useColorStore();
const { color } = storeToRefs(colorStore);

const colors = [
  "blue",
  "red",
  "yellow",
  "brown",
  "green",
  "purple",
  "gray",
  "white",
  "teal",
  "orange",
  "pink",
  undefined,
];
</script>
