export const config = {
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
  },
} as const;
