import { z } from "zod";

export const questionSchema = z
  .object({
    text: z.string().min(5, "Question is too short"),
    type: z.enum(["multiple-choice", "true-false", "short-answer"]),
    options: z.array(z.string()).optional(),
    correctAnswer: z.string().min(1, "Please provide a correct answer"),
    exam: z.string().min(1, "Please select an exam"),
    points: z.coerce.number().min(1, "Points must be at least 1"),
  })
  .superRefine((data, ctx) => {
    if (data.type === "multiple-choice") {
      if (!data.options || data.options.length < 4) {
        ctx.addIssue({
          path: ["options"],
          code: z.ZodIssueCode.custom,
          message:
            "All 4 options must be provided for multiple choice questions",
        });
      }
    } else if (data.type === "true-false") {
      const valid =
        Array.isArray(data.options) &&
        data.options.length === 2 &&
        data.options[0] === "True" &&
        data.options[1] === "False";
      if (!valid) {
        ctx.addIssue({
          path: ["options"],
          code: z.ZodIssueCode.custom,
          message: 'Options for true/false questions must be ["True", "False"]',
        });
      }
    } else if (data.type === "short-answer" && data.options?.length) {
      ctx.addIssue({
        path: ["options"],
        code: z.ZodIssueCode.custom,
        message: "Short answer questions should not have options",
      });
    }
  });
