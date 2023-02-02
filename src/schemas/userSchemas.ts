import { z } from "zod";

export const userResponseSchema = z.object({
  id: z.number(),
  username: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(2)
    .max(20),
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserResponse = z.infer<typeof userResponseSchema>;

export const registerUserSchema = z.object({
  username: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(2)
    .max(20),
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email(),
  password: z
    .string({ required_error: "Password is required" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%])/,
      "Invalid Password"
    )
    .min(8)
    .max(24),
});

export const registerUserSchemaInput = registerUserSchema
  .extend({
    passwordConfirm: z
      .string({
        required_error: "Password repeat is required",
      })
      .min(1),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Passwords does not match",
  });

export type RegisterUser = z.infer<typeof registerUserSchema>;
export type RegisterUserInput = z.infer<typeof registerUserSchemaInput>;

export const loginUserSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email(),
  password: z.string({ required_error: "Password is required" }),
});

export type LoginUserInput = z.infer<typeof loginUserSchema>;

export const loginResponseSchema = z.object({
  accessToken: z.string(),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;
