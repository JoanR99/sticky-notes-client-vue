<template>
  <v-icon
    v-if="props.note.isArchive"
    aria-label="unarchive"
    name="md-unarchive"
    class="text-dark cursor-pointer"
    @click="openModal"
  />

  <v-icon
    v-else
    aria-label="archive"
    name="bi-archive-fill"
    class="text-dark cursor-pointer"
    @click="openModal"
  />

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
              class="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6 text-gray-900"
              >
                {{
                  props.note.isArchive
                    ? $t("unarchive_note.title")
                    : $t("archive_note.title")
                }}
              </DialogTitle>

              <div class="flex justify-between mt-6">
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-red-300 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-red-400"
                  @click="closeModal"
                >
                  {{ $t("actions.close") }}
                </button>
                <LoadingButton
                  :loading="isLoading"
                  @click="onClick"
                  variant="normal"
                  >{{
                    props.note.isArchive
                      ? $t("actions.unarchive")
                      : $t("actions.archive")
                  }}</LoadingButton
                >
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
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { updateNoteFn } from "../api/authApi";
import type { Note, UpdateNoteInput } from "../schemas/noteSchemas";
import { createToast } from "mosha-vue-toastify";
import LoadingButton from "../components/LoadingButton.vue";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  note: Note;
}>();

const queryClient = useQueryClient();

const { t } = useI18n();

const { isLoading, mutate } = useMutation({
  mutationFn: (note: UpdateNoteInput) => updateNoteFn(props.note.id)(note),
  onError: (error) => {
    if (Array.isArray((error as any).response.data.error)) {
      (error as any).response.data.error.forEach((el: any) =>
        createToast(el.message, {
          position: "top-right",
          type: "warning",
        })
      );
    } else {
      createToast((error as any).response.data.message, {
        position: "top-right",
        type: "danger",
      });
    }
    closeModal();
  },
  onSuccess: () => {
    queryClient.refetchQueries(["notes"]);
    createToast(
      props.note.isArchive
        ? t("unarchive_note.success")
        : t("archive_note.success"),
      {
        position: "top-right",
        type: "success",
      }
    );
    closeModal();
  },
});

const onClick = () => {
  mutate({
    isArchive: !props.note.isArchive,
  });
};

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
