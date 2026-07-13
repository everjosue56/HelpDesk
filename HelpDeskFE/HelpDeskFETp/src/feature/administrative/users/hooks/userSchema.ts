import { z } from 'zod';

export const userSchema = z.object({
    id: z.number().optional(),
    firstName: z.string().min(1, 'El primer nombre es obligatorio').max(50),
    lastName: z.string().min(1, 'El apellido es obligatorio').max(50),
    userName: z.string().min(1, 'El nombre de usuario es obligatorio').max(20),
    email: z.string().min(1, 'El correo es obligatorio').email('Formato de correo inválido'),
    phoneNumber: z.string().max(13, 'El número no puede pasar de 13 caracteres').optional().or(z.literal('')),
    
    // Usamos coerce para convertir el string del select a number
    idRol: z.coerce.number().min(0, 'Seleccione un rol'),
    idAgency: z.coerce.number().min(0, 'Seleccione una agencia'),
    idArea: z.coerce.number().min(0, 'Seleccione un área'),
    
    isActive: z.boolean().default(true),
    password: z.string().min(8, 'Debe tener al menos 8 caracteres').optional().or(z.literal('')),
}).superRefine((data, ctx) => {
    // Lógica para validación del password solo en creación
    if (!data.id && (!data.password || data.password.trim().length < 8)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['password'],
            message: 'La contraseña es obligatoria al crear un usuario',
        });
    }
});

export type UserFormValues = z.infer<typeof userSchema>;