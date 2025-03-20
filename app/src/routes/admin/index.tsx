import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Login } from "shared/generated/routes/admin";
import { userCredentials, UserCredentials } from "shared/types/userCredentials";
import { useAppForm } from "../../forms/useAppForm";
import { storeSessionCookie } from "../../utils/sessionCookies";

const { method, path } = Login;

export const Route = createFileRoute("/admin/")({
  component: Admin,
});

function Admin() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    } as UserCredentials,
    onSubmit: async ({ value }) => {
      try {
        const response = await fetch(path, {
          method,
          body: JSON.stringify(value),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok) {
          storeSessionCookie(data);
          navigate({ to: "/admin/dashboard" });
          return;
        }

        setError(data.error);
      } catch (error) {
        if (error instanceof Error) {
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
    <div
      style={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <h1>Admin Login</h1>
      <div
        style={{
          gap: 1,
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <form
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
            <form.SubmitButton label="Submit" />
          </form.AppForm>
        </form>
      </div>
    </div>
  );
}
