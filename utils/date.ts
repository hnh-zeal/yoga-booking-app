export const dateOptions: any = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  hour12: true,
};

export const formatDate = (date: any, options?: any) => {
  const classDate = new Date(date.seconds * 1000);
  const dateOptions = options || {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = classDate.toLocaleDateString("en-US", dateOptions);
  return formattedDate;
};
