export const truncateMessage = (message: string, maxLength: number = 100) => {
  return message.length > maxLength
    ? message.substring(0, maxLength) + "..."
    : message;
};
