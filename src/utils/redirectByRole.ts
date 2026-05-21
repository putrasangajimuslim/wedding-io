// src/utils/redirectByRole.ts

export const redirectByRole = (
  role: string
) => {
  switch (role) {
    case "admin":
      return "/admin/dashboard";

    case "client":
      return "/client/dashboard";

    default:
      return "/login";
  }
};