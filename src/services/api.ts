import ky from "ky";
import config from "@/config";
import { firebaseAuth, onAuthStateChanged } from "@/services/firebase";

export const api = ky.create({
  prefixUrl: config.api.baseUrl,
  timeout: 30000,
  hooks: {
    beforeRequest: [
      async (request) => {
        await onAuthStateChanged();
        const auth = firebaseAuth();
        const user = auth?.currentUser;

        if (user && user?.emailVerified) {
          const idToken = await auth?.currentUser?.getIdToken();

          request.headers.set("Authorization", `Bearer ${idToken}`);
        }
      },
    ],
    beforeError: [
      async (error) => {
        const { response } = error;
        if (response && response.body) {
          // Clone the response to read the body without consuming it
          try {
            const clonedResponse = response.clone();
            const errorBody = await clonedResponse.json();
            // Store parsed error body on the error object for later use
            (error as any).errorBody = errorBody;
          } catch {
            // If parsing fails, leave error as is
          }
        }
        return error;
      },
    ],
  },
});
