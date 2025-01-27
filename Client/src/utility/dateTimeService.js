export const formatMessageTime = (timestamp) => {
  const messageDate = new Date(timestamp);
  const today = new Date();
  const isToday = messageDate.toDateString() === today.toDateString();

  if (isToday) {
    return messageDate.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  } else {
    const day = messageDate.getDate().toString().padStart(2, "0");
    const month = (messageDate.getMonth() + 1).toString().padStart(2, "0");
    const year = messageDate.getFullYear();

    return `${day}/${month}/${year}`;
  }
};

export const formatTime = (timeStamp) => {
  const dateInstance = new Date(timeStamp);
  return dateInstance.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};
