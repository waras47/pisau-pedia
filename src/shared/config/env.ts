const publicBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";

export const env = {
  apiBaseUrl:
    typeof window === "undefined" && publicBase.startsWith("/")
      ? `http://localhost:8080${publicBase}`
      : publicBase,
};