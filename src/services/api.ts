import ky from "ky";
import { config } from "@/services/config";

export const api = ky.create({
  prefixUrl: config.api.baseUrl,
  hooks: {
    beforeRequest: [
      (request) => {
        request.headers.set(
          "Authorization",
          `Bearer ${localStorage.getItem(config.api.accessTokenKey)}`,
        );

        request.headers.set("Content-Type", "application/json");
      },
    ],
  },
});
