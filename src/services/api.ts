import ky from "ky";
import { config } from "@/services/config";
import { firebaseAuth, onAuthStateChanged } from "@/services/firebase";

export const api = ky.create({
  prefixUrl: config.api.baseUrl,
  hooks: {
    beforeRequest: [
      async (request) => {
        await onAuthStateChanged();
        const idToken = await firebaseAuth.currentUser?.getIdToken();

        request.headers.set("Authorization", `Bearer ${idToken}`);
        // request.headers.set("Content-Type", "application/json");
      },
    ],
  },
});
