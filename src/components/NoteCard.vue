<template>
  <article
    class="w-full max-w-lg overflow-hidden rounded-2xl px-6 py-4 text-left align-middle shadow-xl flex flex-col justify-around"
    :class="getColor(props.note.color)"
  >
    <div @click="openModal">
      <h2 class="text-lg font-medium leading-6 text-gray-900 break-words">
        {{ props.note.title }}
      </h2>
      <p class="break-words mt-2 text-md text-gray-700">
        {{ props.note.content }}
      </p>
    </div>

    <div class="mt-2 flex justify-center gap-2">
      <UpdateNote :note="props.note" />
      <ToggleIsArchive :note="props.note" />
      <DeleteNote :note="props.note" />
    </div>
  </article>

  <TransitionRoot v-if="isOpen" appear :show="showAnimation" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all"
              :class="getColor(props.note.color)"
            >
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6 text-gray-900"
              >
                {{ props.note.title }}
              </DialogTitle>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  {{ props.note.content }}
                </p>
              </div>

              <div class="mt-4">
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-red-300 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-red-400"
                  @click="closeModal"
                >
                  {{ $t("actions.close") }}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/vue";
import type { Note } from "@/schemas/noteSchemas";
import getColor from "@/utils/getColor";
import UpdateNote from "./UpdateNote.vue";
import ToggleIsArchive from "./ToggleIsArchive.vue";
import DeleteNote from "./DeleteNote.vue";

const props = defineProps<{ note: Note }>();

const isOpen = ref(false);
const showAnimation = ref(false);

function closeModal() {
  showAnimation.value = false;

  setTimeout(() => {
    isOpen.value = false;
  }, 500);
}
function openModal() {
  isOpen.value = true;
  showAnimation.value = true;
}
</script>
