// import {
//   useQuery,
//   useMutation,
//   MutationFunction,
//   UseMutationOptions,
// } from "@tanstack/react-query";
//
// export const getQuery = <T>(
//   queryKey: string[],
//   queryFn: () => Promise<ApiResponse<T>>,
//   enabled: boolean = true,
// ) => {
//   const query = useQuery<T | undefined>({
//     queryKey,
//     queryFn: async () => {
//       const response = await queryFn();
//       if (isSuccessResponse(response)) {
//         return response.data;
//       }
//
//       throw new Error(
//         (response as ErrorResponse).error ||
//           "Unknown error. Please try again later.",
//       );
//     },
//     enabled,
//   });
//
//   return [query.data, query] as const;
// };
//
// export const getMutation = <
//   TData = unknown,
//   TError = unknown,
//   TVariables = unknown,
//   TContext = unknown,
// >(
//   mutationKey: string[],
//   mutationFn: MutationFunction<ApiResponse<TData>, TVariables>,
//   options: UseMutationOptions<TData, TError, TVariables, TContext> = {},
// ) => {
//   return useMutation<TData, TError, TVariables, TContext>({
//     mutationKey,
//     mutationFn: async (...args) => {
//       const response = await mutationFn(...args);
//
//       if (isSuccessResponse(response)) {
//         return response.data;
//       }
//
//       throw new Error(
//         (response as ErrorResponse).error ||
//           "Unknown error. Please try again later.",
//       );
//     },
//     ...options,
//   });
// };
//
// const isSuccessResponse = <T>(
//   response: ApiResponse<T>,
// ): response is SuccessResponse<T> => response.success;
