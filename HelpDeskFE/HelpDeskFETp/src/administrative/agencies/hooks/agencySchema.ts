import { z } from 'zod';

export const agencySchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  address: z.string().min(5, 'La dirección es obligatoria'),
  phoneNumber: z.string().min(8, 'El teléfono debe tener al menos 8 dígitos'),
  email: z.string().email('Ingresa un correo electrónico válido'),
  idOrganization: z.number().min(1, 'Debes seleccionar una organización'),
  isActive: z.boolean(),
});

export type AgencyFormValues = z.infer<typeof agencySchema>;