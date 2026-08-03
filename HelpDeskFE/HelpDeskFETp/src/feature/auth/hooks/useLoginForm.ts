import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getUsers } from "../../../api/generated/users/users";
import type { UserLoginDto } from "../../../api/model";
import { AXIOS_INSTANCE } from "../../../api/axios-instance";
import { useAuth } from "../../../context/AuthContext";

interface BackendLoginResponse {
  status: boolean;
  message: string;
  statusCode: number;
  data: {
    id: number;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    roleName: string;
    areaName: string;
    agencyName: string;
    isActive: boolean;
    token: string;
  };
}

export const useLoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const usersService = getUsers(AXIOS_INSTANCE);

  const [formData, setFormData] = useState<UserLoginDto>({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.email || !formData.password) {
      setErrorMessage("Por favor, completa todos los campos.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await usersService.postApiUsersLogin(formData);

      const backendResponse = response.data as unknown as BackendLoginResponse;

      const userData = backendResponse?.data;

      if (userData && userData.token) {
        const fullName =
          `${userData.firstName || ""} ${userData.lastName || ""}`.trim();

        login(userData.token, {
          id: userData.id,
          username: fullName || userData.userName,
          email: userData.email || formData.email,
          roles:
            userData.roleName === "Administrador" ||
            userData.roleName === "TI" ||
            userData.roleName === "Cliente"
              ? [userData.roleName]
              : ["Cliente"],
          permissions: [],
        });

        navigate("/dashboard");
      } else {
        setErrorMessage("El servidor no devolvió un perfil de usuario válido.");
      }
    } catch (error: unknown) {
      console.error("Error en el login:", error);

      if (axios.isAxiosError(error) && error.response && error.response.data) {
        const backendError = error.response.data as { message?: string; Message?: string };
        setErrorMessage(backendError.message || backendError.Message || "Credenciales incorrectas.");
      } else {
        setErrorMessage("No se pudo establecer conexión con el servidor.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    errorMessage,
    handleInputChange,
    handleSubmit,
  };
};
