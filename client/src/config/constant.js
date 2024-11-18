export const ORDER_STATUS = {
  RECEIVED: "Received",
  PARTIALLY_RECEIVED: "Partially Received",
  PENDING: "Pending",
};
import twoseater from "../assets/images/2seater.svg";
import fourseater from "../assets/images/4seater.svg";
import sixseater from "../assets/images/6seater.svg";
import eightseater from "../assets/images/8seater.svg";

export const tableImages = {
  2: twoseater,
  4: fourseater,
  6: sixseater,
  8: eightseater,
};

export const VIEW_TYPES = {
  CARD: "card",
  TABLE: "table",
};
export const floorsToShow = 10;

import {
  faDrumstickBite,
  faLeaf,
  faBowlRice,
  faCakeCandles,
  faMugHot,
  faWineGlass,
} from "@fortawesome/free-solid-svg-icons";

export const categoriesIcon = [
  { category_name: "Appetizers", icon: faDrumstickBite },
  { category_name: "Main Course", icon: faBowlRice },
  { category_name: "Dessert", icon: faCakeCandles },
  { category_name: "Beverage", icon: faWineGlass },
  { category_name: "Cafe Selection", icon: faMugHot },
];

export const status = {
  Pending: "Pending",
  InProgress: "In progress",
  Served: "Served",
  WaitingForPickup: "Waiting for pickup",
  Completed: "Completed",
  Cancelled: "Cancelled",
  NewOrder: "New Order",
};

export const takeaway = "Takeaway";

export const ORDER_STATUSES = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  READY: "ready",
  COMPLETED: "completed",
  NEW_ORDER: "new_order",
};
// dateUtils.js

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const formattedDate = `${
    date.getMonth() + 1
  }-${date.getDate()}-${date.getFullYear()}`;
  return formattedDate;
};

export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};
export const statusFilters = {
  "ALL ORDER": (orders) => orders, // No filtering, return all orders
  "NEW ORDER": (orders) =>
    orders.filter((order) => order.orderStatus === ORDER_STATUSES.NEW_ORDER),
  ["IN PROGRESS"]: (orders) =>
    orders.filter((order) => order.orderStatus === ORDER_STATUSES.IN_PROGRESS),
  "READY FOR PICKUP": (orders) =>
    orders.filter((order) => order.orderStatus === ORDER_STATUSES.READY),
  COMPLETED: (orders) =>
    orders.filter((order) => order.orderStatus === ORDER_STATUSES.COMPLETED),
  PRIORITY: (orders) => orders.filter((order) => order.hasPriority === true), // Filter by priority
};

export const splitType = {
  EQUAL: "equal",
  CUSTOM: "custom",
};

export const numberofFloors = 4;

export const stockLevel = {
  LOW_STOCK: "lowStock",
  CRITICAL_STOCK: "criticalStock",
  OUT_OF_STOCK: "outofStock",
};
