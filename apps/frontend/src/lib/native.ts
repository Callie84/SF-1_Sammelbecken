import { Capacitor } from "@capacitor/core";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

export const isNative = () => Capacitor.isNativePlatform();

export async function takePhoto() {
  const photo = await Camera.getPhoto({
    quality: 80,
    resultType: CameraResultType.Base64,
    source: CameraSource.Prompt
  });
  return `data:image/${photo.format};base64,${photo.base64String}`;
}
