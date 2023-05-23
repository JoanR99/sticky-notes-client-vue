import { z } from "zod";

export const userResponseSchema = z.object({
  message: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  }),
});

export type UserResponse = z.infer<typeof userResponseSchema>;

export const registerUserSchema = z.object({
  username: z
    .string({
      required_error: "validation.username.required",
    })
    .min(2, "validation.username.min")
    .max(20, "validation.username.max"),
  email: z
    .string({
      required_error: "validation.email.required",
      invalid_type_error: "validation.email.invalid",
    })
    .email(),
  password: z
    .string({ required_error: "validation.password.required" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%])/,
      "validation.password.invalid"
    )
    .min(8, "validation.password.min")
    .max(24, "validation.password.max"),
});

export const registerUserSchemaInput = registerUserSchema
  .extend({
    passwordConfirm: z
      .string({
        required_error: "validation.password_confirm.required",
      })
      .min(1),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "validation.password.match",
  });

export type RegisterUser = z.infer<typeof registerUserSchema>;
export type RegisterUserInput = z.infer<typeof registerUserSchemaInput>;

export const loginUserSchema = z.object({
  email: z
    .string({
      required_error: "validation.email.required",
      invalid_type_error: "validation.email.invalid",
    })
    .email(),
  password: z.string({ required_error: "validation.password.required" }),
});

export type LoginUserInput = z.infer<typeof loginUserSchema>;

export const loginResponseSchema = z.object({
  accessToken: z.string(),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;
