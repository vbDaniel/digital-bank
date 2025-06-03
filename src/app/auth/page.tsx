"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { mockLogin, mockRegister } from "services/mockApi";
import { RegistrationData, LoginData } from "../../../types";
import styles from "./page.module.css";
import Head from "next/head";
import Input from "@/components/Input/Input";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cpf as cpfValidator } from "cpf-cnpj-validator";
import { cleanCPF } from "utils/format";
import { apiLogin, apiRegister } from "./auth.utils";

// Schemas Zod
const loginSchema = z.object({
  cpf: z
    .string()
    .transform(cleanCPF)
    .refine((cpf) => cpf.length === 11, {
      message: "CPF deve conter 11 dígitos numéricos.",
    })
    .refine((cpf) => cpfValidator.isValid(cpf), {
      message: "CPF inválido.",
    }),
  senha: z.string().min(1, "Senha é obrigatória."),
});

const registerSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório."),
  cpf: z
    .string()
    .transform(cleanCPF)
    .refine((cpf) => cpf.length === 11, {
      message: "CPF deve conter 11 dígitos numéricos.",
    })
    .refine((cpf) => cpfValidator.isValid(cpf), {
      message: "CPF inválido.",
    }),
  telefone: z.string().min(1, "Telefone é obrigatório."),
  senha: z.string().min(1, "Senha é obrigatória."),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;
type AuthFormValues = LoginFormValues & Partial<RegisterFormValues>;

const defaultLoginValues: AuthFormValues = { cpf: "", senha: "" };
const defaultRegisterValues: AuthFormValues = {
  nome: "",
  cpf: "",
  telefone: "",
  senha: "",
};

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<AuthFormValues>({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
    defaultValues: isLogin ? defaultLoginValues : defaultRegisterValues,
    mode: "onChange",
  });

  const onSubmit = async (data: AuthFormValues) => {
    setError(null);
    setIsLoading(true);
    try {
      if (isLogin) {
        const { cliente, token } = await apiLogin({
          cpf: data.cpf,
          senha: data.senha,
        });
        login(cliente, token);
      } else {
        const cliente = await apiRegister(data as RegistrationData);

        const { token } = await apiLogin({
          cpf: data.cpf,
          senha: data.senha,
        });
        alert("Cadastro realizado com sucesso!");
        login(cliente, token);
      }
    } catch (err: any) {
      setError("Ocorreu um erro. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Troca entre login/cadastro e reseta form
  const handleToggle = () => {
    setIsLogin((prev) => !prev);
    setError(null);
    reset(isLogin ? defaultRegisterValues : defaultLoginValues);
  };

  return (
    <>
      <Head>
        <title>{isLogin ? "Login" : "Cadastro"} - Banco Digital</title>
      </Head>
      <div className={styles.authContainer}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.authForm}>
          <h1>{isLogin ? "Acessar Perfil" : "Criar Perfil"}</h1>
          {error && <p className={styles.errorMessage}>{error}</p>}

          {/* Cadastro: Nome */}
          {!isLogin && (
            <Controller
              name="nome"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Nome Completo"
                  type="name"
                  error={errors.nome?.message}
                  required
                />
              )}
            />
          )}

          {/* CPF */}
          <Controller
            name="cpf"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="CPF (apenas números)"
                required
                title="CPF deve conter 11 dígitos numéricos"
                mask="cpf"
                error={errors.cpf?.message}
              />
            )}
          />

          {!isLogin && (
            <Controller
              name="telefone"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Telefone"
                  mask="telefone"
                  required
                  type="tel"
                  error={errors.telefone?.message}
                />
              )}
            />
          )}

          <Controller
            name="senha"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Senha"
                type="password"
                required
                error={errors.senha?.message}
              />
            )}
          />

          <button
            type="submit"
            className={`${styles.button} ${
              isLoading ? styles.buttonDisabled : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Processando..." : isLogin ? "Entrar" : "Cadastrar"}
          </button>

          <div className={styles.toggleForm}>
            {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}
            <button type="button" onClick={handleToggle}>
              {isLogin ? "Cadastre-se" : "Faça login"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AuthPage;
