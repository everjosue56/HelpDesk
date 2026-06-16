import { z } from 'zod';

export const userSchema = z.object({
    id: z.number().optional(),
    firstName: z.string().min(1, 'El primer nombre es obligatorio').max(50),
    lastName: z.string().min(1, 'El apellido es obligatorio').max(50),
    userName: z.string().min(1, 'El nombre de usuario es obligatorio').max(20),
    email: z.string().min(1, 'El correo es obligatorio').email('Formato de correo inválido'),
    phoneNumber: z.string().max(13, 'El número no puede pasar de 13 caracteres').optional().or(z.literal('')),
    idRol: z.coerce.number().min(1, 'Seleccione un rol institucional'),
    idAgency: z.coerce.number().min(1, 'Seleccione una agencia'),
    idArea: z.coerce.number().min(1, 'Seleccione un área operativa'),
    isActive: z.boolean().default(true),
    password: z.string().min(8).optional().or(z.literal('')),
}).superRefine((data, ctx) => {
    if (!data.id && (!data.password || data.password.trim().length < 6)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['password'],
            message: 'La contraseña es obligatoria y debe tener al menos 8 caracteres al crear un usuario',
        });
    }
});

export type UserFormValues = z.infer<typeof userSchema>;