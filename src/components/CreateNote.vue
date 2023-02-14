<template>
  <button
    class="fixed bottom-10 right-10 rounded-full p-3 bg-teal-700"
    @click="openModal"
  >
    <v-icon name="md-create-round" class="h-6 w-6 text-white" />
  </button>

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
              class="w-full max-w-lg transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all"
              :class="color ? getColor(color as Color): 'bg-white'"
            >
              <form
                @submit="onSubmit"
                class="max-w-[27rem] mx-auto overflow-hidden p-4"
                :class="color ? getColor(color as Color): 'bg-white'"
              >
                <div class="">
                  <label for="title" class="hidden">{{
                    $t("labels.title")
                  }}</label>
                  <input
                    type="text"
                    :placeholder="$t('labels.title')"
                    v-model="title"
                    class="text-lg font-medium leading-6 text-gray-900 px-2 py-1 outline-none w-full placeholder:text-gray-500"
                    :class="color ? getColor(color as Color): 'bg-white'"
                    id="title"
                    autofocus
                  />
                  <span class="text-red-500 text-xs pt-1 block">{{
                    $t(errors.title ?? "")
                  }}</span>
                </div>
                <div class="">
                  <label for="content" class="hidden">{{
                    $t("labels.content")
                  }}</label>
                  <textarea
                    v-model="content"
                    :placeholder="$t('labels.content')"
                    class="text-md font-medium leading-6 text-gray-600 px-2 py-1 outline-none w-full resize-none placeholder:text-gray-500"
                    :class="color ? getColor(color as Color): 'bg-white'"
                    rows="4"
                    id="content"
                  ></textarea>
                  <span class="text-red-500 text-xs pt-1 block">{{
                    $t(errors.content ?? "")
                  }}</span>
                </div>

                <div class="">
                  <label for="color" class="hidden">Color</label>
                  <div class="flex gap-1">
                    <div>
                      <input
                        value="white"
                        type="radio"
                        name="color"
                        placeholder=" "
                        v-model="color"
                        class="hidden peer"
                        id="white"
                        checked
                      />

                      <label
                        for="white"
                        :class="`bg-white rounded-full border border-gray-400 w-8 h-8 block truncate peer-checked:border-2 peer-checked:border-blue-500`"
                      ></label>
                    </div>

                    <div v-for="colorInput in colors" v-bind:key="colorInput">
                      <input
                        :value="colorInput"
                        type="radio"
                        name="color"
                        placeholder=" "
                        v-model="color"
                        class="hidden peer"
                        :id="colorInput"
                      />
                      <label
                        :for="colorInput"
                        :class="`${getColor(
                          colorInput
                        )} rounded-full border border-gray-400 w-8 h-8 block truncate peer-checked:border-2 peer-checked:border-blue-500`"
                      >
                      </label>
                    </div>
                  </div>

                  <span class="text-red-500 text-xs pt-1 block">{{
                    $t(errors.color ?? "")
                  }}</span>
                </div>

                <div class="flex justify-between mt-6">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-red-300 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-red-400"
                    @click="closeModal"
                  >
                    {{ $t("actions.cancel") }}
                  </button>
                  <LoadingButton variant="normal" :loading="isLoading">{{
                    $t("actions.add")
                  }}</LoadingButton>
                </div>
              </form>
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
} from "@headlessui/vue";
import { useField, useForm } from "vee-validate";
import { toFormValidator } from "@vee-validate/zod";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { createNoteFn } from "../api/authApi";
import {
  createNoteSchema,
  type Color,
  type CreateNoteInput,
} from "../schemas/noteSchemas";
import { createToast } from "mosha-vue-toastify";
import LoadingButton from "../components/LoadingButton.vue";
import getColor from "@/utils/getColor";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const colors: Color[] = [
  "blue",
  "red",
  "yellow",
  "brown",
  "green",
  "purple",
  "gray",
  "teal",
  "orange",
  "pink",
];

const queryClient = useQueryClient();

const createSchema = toFormValidator(createNoteSchema);

const { handleSubmit, errors, resetForm } = useForm({
  validationSchema: createSchema,
  initialValues: {
    title: "",
    content: "",
    color: "white" as Color,
  },
});

const { value: title } = useField<string>("title");
const { value: content } = useField<string>("content");
const { value: color } = useField<string>("color");

const { isLoading, mutate } = useMutation({
  mutationFn: (note: CreateNoteInput) => createNoteFn(note),
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
    resetForm();
    closeModal();
  },
  onSuccess: () => {
    queryClient.refetchQueries(["notes"]);
    createToast(t("add_note.success"), {
      position: "top-right",
      type: "success",
    });
    resetForm();
    closeModal();
  },
});

const onSubmit = handleSubmit((values) => {
  mutate({
    title: values.title,
    content: values.content,
    color: values.color,
  });
  resetForm();
});

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
