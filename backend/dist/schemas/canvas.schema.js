import { z } from "zod";
const elementSchema = z.object({
    id: z.string().min(1),
    type: z.enum([
        "rectangle",
        "circle",
        "text",
    ]),
    x: z.number(),
    y: z.number(),
    width: z.number().positive().optional(),
    height: z.number().positive().optional(),
    radius: z.number().positive().optional(),
    rotation: z.number().default(0),
    fill: z.string().default("#000000"),
    text: z.string().optional(),
    fontSize: z.number().positive().optional(),
    zIndex: z.number().default(0),
});
export const createCanvasSchema = z.object({
    title: z.string().min(1).max(100),
    width: z.number().min(100).max(5000),
    height: z.number().min(100).max(5000),
    elements: z.array(elementSchema).default([]),
});
export const updateCanvasSchema = createCanvasSchema.partial();
//# sourceMappingURL=canvas.schema.js.map