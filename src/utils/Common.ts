// eslint-disable-next-line no-unused-vars
export const throttle = (func: (...args: any[]) => void, limit: number) => {
  let lastFunc: any;
  let lastRan: number;
  return function (this: any, ...args: any[]) {
    if (!lastRan) {
      func.apply(this, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(
        () => {
          if (Date.now() - lastRan >= limit) {
            func.apply(this, args);
            lastRan = Date.now();
          }
        },
        limit - (Date.now() - lastRan)
      );
    }
  };
};

export const getExtensionFile = (filename: string) => {
  return filename.split('.').pop();
}

export const getUrlFromPresignedUrl = (presignedUrl: string) => {
  return presignedUrl.split('?')[0];
}

export const sliceText = (text: string, length: number) => {
  return text.length > length ? text.slice(0, length) + '...' : text;
}

export const getKeyS3FromUrl = (url: string) => {
  const index = url.indexOf('audit_progress');
  if (index !== -1) {
    console.log('index', url.substring(index));
    return url.substring(index);
  }
  return '';
}