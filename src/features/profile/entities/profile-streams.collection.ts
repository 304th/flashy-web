import { createCollection } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { streamSchema } from "@/features/streams/schemas/stream.schema";

export interface ProfileStreamsParams {
  userId: string;
  filter?: "upcoming" | "live" | "past" | "all";
}

export const profileStreamsCollection = createCollection<
  Stream,
  ProfileStreamsParams
>({
  async sourceFrom(params) {
    return api
      .get(`streaming/user/${params.userId}`, {
        searchParams: params.filter
          ? {
              filter: params.filter,
            }
          : undefined,
      })
      .json<Stream[]>();
  },
  schema: streamSchema,
  name: "profile-streams",
});
