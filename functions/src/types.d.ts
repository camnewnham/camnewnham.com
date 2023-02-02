// Stored under {db}/images/{baseUrl}
export type ImageData = {
  lqip: {
    originalWidth: number;
    originalHeight: number;
    dataURIBase64: string;
  };
};

export type NextImageRequest = {
  src: string;
  w: string;
  q: string;
};
