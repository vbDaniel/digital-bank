import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import styles from "./EditClientForm.module.css";
import Input from "../Input/Input";
import { Button } from "../buttons";
import { useAuth } from "src/contexts/AuthContext";
import { apiUpdateCliente } from "./EditClientForm.util";

// Schema de validação
const userEditSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  phone: z
    .string()
    .refine(
      (val) =>
        val.replace(/\D/g, "").length === 10 ||
        val.replace(/\D/g, "").length === 11,
      { message: "Telefone inválido. Use apenas números com DDD." }
    ),
});

type UserEditFormValues = z.infer<typeof userEditSchema>;

interface EditClientFormProps {}

const EditClientForm: React.FC<EditClientFormProps> = ({}) => {
  const { user, setUser, token, isLoading: authLoading, logout } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    setValue,
    watch,
  } = useForm<UserEditFormValues>({
    resolver: zodResolver(userEditSchema),
    defaultValues: {
      name: user?.nome,
      phone: user?.telefone,
    },
  });

  // Necessário para manter o valor mascarado atualizado
  const phoneValue = watch("phone");

  async function onSubmit(data: UserEditFormValues) {
    const clienteAtualizado = await apiUpdateCliente(
      token,
      Number(user?.id),
      data.name,
      data.phone
    );

    setUser({
      id: user?.id ?? "",
      nome: data.name,
      cpf: user?.cpf ?? "",
      telefone: data.phone,
    });
    alert("Dados salvos com sucesso!  ");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
      <p className={styles.infoText}>
        Mantenha seus dados atualizados para garantir sua segurança e um melhor
        atendimento.
      </p>
      <Input
        label="Nome"
        {...register("name")}
        error={errors.name?.message}
        required
      />
      <Input
        label="Telefone"
        mask="telefone"
        {...register("phone")}
        value={phoneValue}
        onChange={(e: any) => setValue("phone", e?.target?.value)}
        error={errors.phone?.message}
        required
      />

      <Button type="submit" disabled={isSubmitting} variant="filled">
        {isSubmitting ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  );
};

export default EditClientForm;
