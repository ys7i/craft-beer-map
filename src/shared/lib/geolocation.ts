export interface GeolocationPosition {
  latitude: number;
  longitude: number;
}

export interface GeolocationError {
  code: number;
  message: string;
}

export const GeolocationErrorCodes = {
  PERMISSION_DENIED: 1,
  POSITION_UNAVAILABLE: 2,
  TIMEOUT: 3,
} as const;

export const getGeolocationErrorMessage = (code: number): string => {
  switch (code) {
    case GeolocationErrorCodes.PERMISSION_DENIED:
      return "位置情報の利用が許可されていません";
    case GeolocationErrorCodes.POSITION_UNAVAILABLE:
      return "位置情報を取得できません";
    case GeolocationErrorCodes.TIMEOUT:
      return "位置情報の取得がタイムアウトしました";
    default:
      return "位置情報の取得に失敗しました";
  }
};

export const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject({
        code: GeolocationErrorCodes.POSITION_UNAVAILABLE,
        message: "Geolocation APIがサポートされていません",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject({
          code: error.code,
          message: getGeolocationErrorMessage(error.code),
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
};