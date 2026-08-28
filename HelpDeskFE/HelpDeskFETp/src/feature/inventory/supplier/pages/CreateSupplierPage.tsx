import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  SupplierForm,
  type SupplierFormValues,
} from "../components/SupplierForm";
import { useSuppliers } from "../hooks/useSuppliers";
import type { CreateSupplierDto } from "../../../../api/model";
export const CreateSupplierPage: React.FC = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const { createSupplier } = useSuppliers("", 1, 5);
  const submit = async (values: SupplierFormValues) => {
    setSaving(true);
    try {
      await createSupplier({
        ...values,
        idOrganization: Number(values.idOrganization),
        registrationDate: new Date(values.registrationDate).toISOString(),
      } as CreateSupplierDto);
      toast.success("Proveedor creado");
      navigate("/dashboard/supplier");
    } catch {
      toast.error("No se pudo crear el proveedor");
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen">
      <h1 className="text-2xl font-black text-slate-800">Nuevo proveedor</h1>
      <SupplierForm
        onSubmit={submit}
        onCancel={() => navigate("/dashboard/supplier")}
        isSubmitting={saving}
      />
    </div>
  );
};
