const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    accessTokenKey: "access_token",
    query: {
      defaultOptions: {
        queries: {
          refetchOnMount: false,
          refetchOnWindowFocus: false,
          retry: 0,
        },
      },
    },
  },
  misc: {
    notificationCenterId: "notification-center",
    passwordResetRoute: "/reset-password",
  },
  content: {
    social: {
      maxLength: 500,
    },
    comments: {
      maxLength: 500,
    },
    uploads: {
      maxSize: 3 * 1024 * 1024, // 3 MB
    },
  },
} as const;

export const env = {
  IS_BROWSER: typeof window === "object",
  IS_LOCAL:
    typeof window === "object" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"),
};

export default config;
