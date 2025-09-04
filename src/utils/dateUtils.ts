const dateFormatCache = new Map<string, string>();

export const formatTransactionDate = (dateString: string): string => {
  if (dateFormatCache.has(dateString)) {
    return dateFormatCache.get(dateString)!;
  }

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  dateFormatCache.set(dateString, formattedDate);
  return formattedDate;
};

export const formatMonthKey = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

export const clearDateCache = () => {
  dateFormatCache.clear();
};
