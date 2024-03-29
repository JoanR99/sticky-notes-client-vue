import { z } from "zod";

export const noteSchema = z.object({
  id: z.number(),
  title: z
    .string({
      required_error: "validation.title.required",
      invalid_type_error: "validation.title.type",
    })
    .min(1, "validation.title.required"),
  content: z.string({
    required_error: "validation.content.required",
    invalid_type_error: "validation.content.type",
  }),
  isArchive: z.boolean(),
  authorId: z.number(),
  color: z.enum(
    [
      "red",
      "yellow",
      "orange",
      "blue",
      "teal",
      "green",
      "purple",
      "pink",
      "gray",
      "brown",
      "white",
    ],
    { required_error: "validation.color.required" }
  ),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createNoteSchema = noteSchema.pick({
  title: true,
  content: true,
  color: true,
});

export const updateNoteSchema = noteSchema
  .pick({
    title: true,
    content: true,
    color: true,
    isArchive: true,
  })
  .partial();

export const getNotesInput = noteSchema
  .pick({
    isArchive: true,
    color: true,
  })
  .extend({
    search: z.string(),
  })
  .partial();

export const getNotesResponse = noteSchema.array();

export type Note = z.infer<typeof noteSchema>;
export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
export type GetNotesInput = z.infer<typeof getNotesInput>;
export type GetNotesResponse = z.infer<typeof getNotesResponse>;
export type Color =
  | "red"
  | "yellow"
  | "orange"
  | "blue"
  | "teal"
  | "green"
  | "purple"
  | "pink"
  | "gray"
  | "brown"
  | "white";
