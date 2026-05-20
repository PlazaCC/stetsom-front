"use client";

import { useAdminLogin } from "@/hooks/use-admin";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function AdminLoginPage() {
  const login = useAdminLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    login.mutate({ email, password });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="flex w-full max-w-[898px] overflow-hidden rounded-[16px] shadow-2xl">
        {/* Form panel */}
        <div className="flex w-[449px] shrink-0 flex-col justify-center bg-card p-12">
          <div className="mb-10 flex justify-start">
            <Image
              src="/logo.png"
              alt="Stetsom"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </div>

          <h1 className="mb-1 font-mono text-2xl font-bold text-foreground">
            Bem-vindo de volta!
          </h1>
          <p className="mb-8 text-sm text-muted-foreground">
            Insira suas credenciais para acessar o painel.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-brand"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-border bg-card px-3 py-2 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-brand"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="text-xs text-brand hover:underline"
              >
                Esqueci minha senha
              </button>
            </div>

            {login.isError && (
              <p className="text-sm text-destructive">
                {login.error instanceof Error
                  ? login.error.message
                  : "Erro ao autenticar."}
              </p>
            )}

            <button
              type="submit"
              disabled={login.isPending}
              className="mt-2 w-full rounded-md bg-foreground py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {login.isPending ? "Verificando..." : "Avançar"}
            </button>
          </form>
        </div>

        {/* Brand panel */}
        <div className="relative hidden flex-1 flex-col items-center justify-center gap-6 overflow-hidden bg-surface-elevated md:flex">
          <div className="absolute inset-0 bg-linear-to-br from-surface-elevated/0 via-surface-elevated/90 to-surface-elevated" />
          <div className="relative z-10 flex flex-col items-center gap-4 px-10 text-center">
            <Image
              src="/logo.png"
              alt="Stetsom"
              width={100}
              height={34}
              className="h-8 w-auto brightness-0 invert"
            />
            <p className="font-mono text-lg font-bold text-white">
              CMS Stetsom
            </p>
            <p className="max-w-xs text-sm text-white/60">
              Gerencie produtos, banners e conteúdo do site institucional.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
