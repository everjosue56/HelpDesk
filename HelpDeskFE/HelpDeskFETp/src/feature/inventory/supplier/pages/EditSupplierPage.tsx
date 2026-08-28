import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  SupplierForm,
  type SupplierFormValues,
} from "../components/SupplierForm";
import { useSuppliers } from "../hooks/useSuppliers";
import type { UpdateSupplierDto } from "../../../../api/model";
export const EditSupplierPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const { supplier, isFetching, getSupplierById, updateSupplier } =
    useSuppliers("", 1, 1);
  useEffect(() => {
    if (id) void getSupplierById(Number(id));
  }, [id, getSupplierById]);
  const submit = async (values: SupplierFormValues) => {
    if (!id) return;
    setSaving(true);
    try {
      await updateSupplier(Number(id), {
        ...values,
        idOrganization: Number(values.idOrganization),
        registrationDate: new Date(values.registrationDate).toISOString(),
      } as UpdateSupplierDto);
      toast.success("Proveedor actualizado");
      navigate("/dashboard/supplier");
    } catch {
      toast.error("No se pudo actualizar el proveedor");
    } finally {
      setSaving(false);
    }
  };
  const formData = supplier
    ? { ...supplier, idOrganization: String(supplier.idOrganization) }
    : null;
  return (
    <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen">
      <h1 className="text-2xl font-black text-slate-800">Editar proveedor</h1>
      {isFetching ? (
        <p>Cargando proveedor...</p>
      ) : (
        <SupplierForm
          initialData={formData}
          onSubmit={submit}
          onCancel={() => navigate("/dashboard/supplier")}
          isSubmitting={saving}
        />
      )}
    </div>
  );
};
