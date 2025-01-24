const deepMerge = (obj1: any, obj2: any): any => {
  const output = Object.assign({}, obj1);

  for (const key in obj2) {
    if (Object.prototype.hasOwnProperty.call(obj2, key)) {
      if (typeof obj2[key] === 'object' && obj2[key] !== null && obj1[key]) {
        output[key] = deepMerge(obj1[key], obj2[key]);
      } else {
        output[key] = obj2[key];
      }
    }
  }

  return output;
};

const generateUniqueToken = (): string => {
  const timestamp: number = new Date().getTime();
  const randomString: string = Math.random().toString(36).substring(2, 8); // Random string of length 6

  return `${timestamp}-${randomString}`;
};

// Convert file to binary data using FileReader
const fileToBinary = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

function getShortDesReferences(paragraph: string) {
  const regex = /\b(Điều\s)?\d{1,3}\s\d{2}\/\d{4}\/QH\d{2}\b/g;
  return paragraph.match(regex) || [];
}

function sortMessageListByTime(messageList: any[]) {
  return messageList.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
}

function formatNumberToCurrency(number: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
}

export {
  deepMerge,
  generateUniqueToken,
  fileToBinary,
  getShortDesReferences,
  sortMessageListByTime,
  formatNumberToCurrency
};
