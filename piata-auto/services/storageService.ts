import { storage } from "@/services/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const uploadSingle = async (uri: string, path: string) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  const fileRef = ref(storage!, path);
  await uploadBytes(fileRef, blob);
  return getDownloadURL(fileRef);
};

export const storageService = {
  async uploadListingImages(userId: string, uris: string[]) {
    if (!storage || !uris.length || uris[0].startsWith("https://")) return uris;
    return Promise.all(
      uris.map((uri, idx) => uploadSingle(uri, `listings/${userId}/${Date.now()}-${idx}.jpg`)),
    );
  },
  async uploadAvatar(userId: string, uri: string) {
    if (!storage || uri.startsWith("https://")) return uri;
    return uploadSingle(uri, `avatars/${userId}/${Date.now()}.jpg`);
  },
};
