import * as z from 'zod';

export const areaSchema = z.object({
    name: z.string().min(1, "El nombre del área es requerido").max(60, "El nombre del área no puede exceder los 60 caracteres"),
    idAgency: z.number().min(1, "Debe seleccionar una agencia"),
    isActive: z.boolean(),
});

export type AreaFormValues = z.infer<typeof areaSchema>;