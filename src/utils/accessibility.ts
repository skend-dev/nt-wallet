export const accessibilityLabels = {
  balance: "Current wallet balance",
  addFunds: "Add money to wallet",
  sendMoney: "Send money to another user",
  transactionList: "List of recent transactions",
  filterButton: "Filter transactions",
  refreshButton: "Refresh wallet data",
  button: "Button",
  list: "List",
  card: "Card",
  input: "Input field",
  image: "Image",
  icon: "Icon",
} as const;

export const accessibilityHints = {
  addFunds: "Opens add funds screen",
  sendMoney: "Opens send money screen",
  transactionDetails: "Tap to view transaction details",
  filterTransactions: "Tap to filter transactions by type",
  refreshData: "Pull down to refresh wallet data",
  tapToActivate: "Tap to activate",
  swipeToNavigate: "Swipe to navigate",
  doubleTapToSelect: "Double tap to select",
} as const;

export const getAccessibilityRole = (elementType: string) => {
  const roleMap: Record<string, string> = {
    button: "button",
    link: "link",
    image: "image",
    text: "text",
    header: "header",
    list: "list",
    listitem: "listitem",
    tab: "tab",
    search: "search",
    input: "text",
  };

  return roleMap[elementType] || "none";
};

export const hitSlop = {
  small: { top: 8, bottom: 8, left: 8, right: 8 },
  medium: { top: 12, bottom: 12, left: 12, right: 12 },
  large: { top: 16, bottom: 16, left: 16, right: 16 },
} as const;
