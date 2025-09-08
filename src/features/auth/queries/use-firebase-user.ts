import { getQuery } from "@/lib/query";
import { firebaseAuth, onAuthStateChanged} from "@/services/firebase";

export const useFirebaseUser = () => getQuery(['firebaseUser'], async () => {
  await onAuthStateChanged();

  return firebaseAuth.currentUser;
})