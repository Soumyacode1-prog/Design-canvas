import { z } from "zod";
export declare const createCanvasSchema: z.ZodObject<{
    title: z.ZodString;
    width: z.ZodNumber;
    height: z.ZodNumber;
    elements: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<{
            circle: "circle";
            rectangle: "rectangle";
            text: "text";
        }>;
        x: z.ZodNumber;
        y: z.ZodNumber;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
        radius: z.ZodOptional<z.ZodNumber>;
        rotation: z.ZodDefault<z.ZodNumber>;
        fill: z.ZodDefault<z.ZodString>;
        text: z.ZodOptional<z.ZodString>;
        fontSize: z.ZodOptional<z.ZodNumber>;
        zIndex: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const updateCanvasSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    width: z.ZodOptional<z.ZodNumber>;
    height: z.ZodOptional<z.ZodNumber>;
    elements: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<{
            circle: "circle";
            rectangle: "rectangle";
            text: "text";
        }>;
        x: z.ZodNumber;
        y: z.ZodNumber;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
        radius: z.ZodOptional<z.ZodNumber>;
        rotation: z.ZodDefault<z.ZodNumber>;
        fill: z.ZodDefault<z.ZodString>;
        text: z.ZodOptional<z.ZodString>;
        fontSize: z.ZodOptional<z.ZodNumber>;
        zIndex: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>>>;
}, z.core.$strip>;
//# sourceMappingURL=canvas.schema.d.ts.map