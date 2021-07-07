import moment from "moment";

export const formatDate = (date: string | Date | moment.Moment): string => {
  if (typeof date === "string") {
    date = new Date(date);
  }

  if (date instanceof Date) {
    date = moment(date);
  }

  return date.format("DD/MM/yyyy");
};
