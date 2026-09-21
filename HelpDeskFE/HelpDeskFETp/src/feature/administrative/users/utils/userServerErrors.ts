import axios from 'axios';

type UserFieldName = 'firstName' | 'lastName' | 'userName' | 'email';

const getResponseMessage = (data: unknown): string => {
    if (typeof data === 'string') {
        return data;
    }

    if (Array.isArray(data)) {
        const firstMessage = data.find((item) => typeof item === 'string');
        return typeof firstMessage === 'string' ? firstMessage : '';
    }

    if (!data || typeof data !== 'object') {
        return '';
    }

    const responseData = data as Record<string, unknown>;
    const nestedData = responseData.data;

    if (nestedData && nestedData !== data) {
        const nestedMessage = getResponseMessage(nestedData);
        if (nestedMessage) {
            return nestedMessage;
        }
    }

    for (const key of ['message', 'Message', 'title', 'detail', 'error']) {
        if (typeof responseData[key] === 'string') {
            return responseData[key];
        }
    }

    return '';
};

export const getUserServerErrorMessage = (error: unknown): string => {
    if (!axios.isAxiosError(error)) {
        return '';
    }

    return getResponseMessage(error.response?.data);
};

export const getServerFieldErrors = (error: unknown): Partial<Record<UserFieldName, string>> => {
    if (!axios.isAxiosError(error)) {
        return {};
    }

    const rawResponseData = error.response?.data;
    const responseData = rawResponseData as {
        errors?: Record<string, string | string[]> | string[] | string;
        Errors?: Record<string, string | string[]> | string[] | string;
    } | undefined;

    const rawErrors = responseData?.errors ?? responseData?.Errors;
    const errors = rawErrors && typeof rawErrors === 'object' && !Array.isArray(rawErrors)
        ? rawErrors
        : undefined;
    const fieldErrors: Partial<Record<UserFieldName, string>> = {};

    if (errors) {
        Object.entries(errors).forEach(([field, value]) => {
            const normalizedField = field.toLowerCase();
            const message = Array.isArray(value) ? value[0] : value;

            if (typeof message !== 'string') {
                return;
            }

            if (normalizedField === 'username' || normalizedField === 'user_name') {
                fieldErrors.userName = message;
            } else if (normalizedField === 'email') {
                fieldErrors.email = message;
            } else if (normalizedField === 'firstname' || normalizedField === 'first_name') {
                fieldErrors.firstName = message;
            } else if (normalizedField === 'lastname' || normalizedField === 'last_name') {
                fieldErrors.lastName = message;
            }
        });
    }

    const generalMessage = getUserServerErrorMessage(error);
    const normalizedMessage = generalMessage.toLowerCase();

    if (!fieldErrors.userName && /(username|user name|nombre de usuario|usuario)/.test(normalizedMessage)) {
        fieldErrors.userName = generalMessage;
    } else if (!fieldErrors.email && /(email|correo)/.test(normalizedMessage)) {
        fieldErrors.email = generalMessage;
    } else if (!fieldErrors.firstName && /(firstname|first name|primer nombre)/.test(normalizedMessage)) {
        fieldErrors.firstName = generalMessage;
    } else if (!fieldErrors.lastName && /(lastname|last name|apellido)/.test(normalizedMessage)) {
        fieldErrors.lastName = generalMessage;
    }

    return fieldErrors;
};
