  // 🧾 Generate unique order ID
export const generateUniqueID = () => {
  const random = Math.random().toString(36).substring(2, 10);
  const timestamp = Date.now().toString(36);
  return `${timestamp}${random}`;
};

export  const generateDate = () => {
     return new Date().toLocaleDateString();
  }

      