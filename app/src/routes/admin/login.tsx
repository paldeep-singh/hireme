import {
  createFileRoute,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Login, LoginResponse } from "shared/generated/routes/admin";
import { userCredentials, UserCredentials } from "shared/types/userCredentials";
import { useAppForm } from "../../forms/useAppForm";
import { storeSessionCookie } from "../../utils/sessionCookies";
import { z } from "zod";

const { method, path } = Login;

interface LoginSearchParams {
  error?: string;
  redirect?: string;
}

const loginSearchParams = z.object({
  error: z.string().optional(),
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/admin/login")({
  component: Admin,
  validateSearch: (search): LoginSearchParams => {
    const { success } = loginSearchParams.safeParse(search);

    if (success) {
      return search;
    }

    return {};
  },
});

function Admin() {
  const { error: urlError, redirect: redirectUrl } = Route.useSearch();

  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (urlError) {
      setError(urlError);
    }
  }, [urlError]);

  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    } as UserCredentials,
    onSubmit: async ({ value }) => {
      setLoading(true);
      try {
        const response = await fetch(path, {
          method,
          body: JSON.stringify(value),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = (await response.json()) as LoginResponse;
          storeSessionCookie(data);

          setLoading(false);
          navigate({
            to: redirectUrl ?? "/admin/dashboard",
            from: "/admin/login",
          });
          return;
        }
        const { error } = await response.json();
        setLoading(false);
        setError(error);
      } catch (error) {
        if (error instanceof Error) {
          setLoading(false);
          setError(error.message);
          return;
        }
      }
    },
    validators: {
      onChange: userCredentials,
    },
  });

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-10 text-center">
      <h1>Admin Login</h1>
      <div className="flex flex-col items-center justify-center gap-1 align-middle">
        <form
          className="flex flex-col items-center"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.AppForm>
            <form.ErrorBanner error={error} />
          </form.AppForm>
          <form.AppField name="email">
            {(field) => (
              <field.TextField
                label="Email"
                type="email"
                error={field.state.meta.errorMap["onChange"]?.[0].message}
              />
            )}
          </form.AppField>
          <form.AppField name="password">
            {(field) => <field.TextField label="Password" type="password" />}
          </form.AppField>
          <form.AppForm>
            <form.SubmitButton label="Submit" loading={loading} />
          </form.AppForm>
        </form>
      </div>
    </div>
  );
}
