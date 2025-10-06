import ky from "ky";
import config from "@/config";
import { firebaseAuth, onAuthStateChanged } from "@/services/firebase";

export const api = ky.create({
  prefixUrl: config.api.baseUrl,
  hooks: {
    beforeRequest: [
      async (request) => {
        await onAuthStateChanged();
        const user = firebaseAuth.currentUser;

        if (user && user?.emailVerified) {
          const idToken = await firebaseAuth.currentUser?.getIdToken();

          request.headers.set("Authorization", `Bearer ${idToken}`);
        }
      },
    ],
  },
});
