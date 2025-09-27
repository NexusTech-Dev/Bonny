export const formatCPF = (value: string) =>
    value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

export const formatCEP = (value: string) =>
    value.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2");

export const formatPhone = (value: string) =>
    value
        .replace(/\D/g, "")
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4,5})(\d{4})$/, "$1-$2");