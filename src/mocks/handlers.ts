import { rest } from "msw";

export const handlers = [
  rest.post("/api/notes", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];
