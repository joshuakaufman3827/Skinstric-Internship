import { submitImage } from "./api";
import { resizeDataUrl, stripDataUrlPrefix } from "./image";
import { KEYS, storage } from "./storage";

/**
 * Shared by the upload (Phase 2) and selfie (Phase 3) flows:
 * shrink → base64 → POST → save demographics for the summary page.
 */
export async function analyzeImage(dataUrl: string) {
  const small = await resizeDataUrl(dataUrl);
  const base64 = stripDataUrlPrefix(small);
  const res = await submitImage(base64);
  if (!res?.data?.race || !res.data.age || !res.data.gender) {
    throw new Error(res?.message || "Unexpected response from the API");
  }
  storage.setDemographics(res.data);
  storage.setString(KEYS.image, small);
  return res.data;
}
