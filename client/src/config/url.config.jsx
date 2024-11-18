import SalesForecast from "../screens/admin/SalesForecast";

// Destructuring environment variables from import.meta.env
const env = {
  api: {
    host: import.meta.env.VITE_API_HOST,
    port: import.meta.env.VITE_API_PORT,
    prefix: import.meta.env.VITE_API_PREFIX,
  },
  MAILER: {
    HOST: import.meta.env.VITE_MAILER_HOST,
    PORT: import.meta.env.VITE_MAILER_PORT,
    PREFIX: import.meta.env.VITE_MAILER_PREFIX,
  },
};

// Helper function to build URLs
const buildUrl = ({ host, port, prefix }) => `${host}:${port}${prefix}`;

// Checking if environment variables are defined
if (!env.api.host || !env.api.port || !env.api.prefix) {
  throw new Error("Environment variables for API configuration are missing");
}
if (!env.MAILER.HOST || !env.MAILER.PORT || !env.MAILER.PREFIX) {
  throw new Error("Environment variables for Mailer configuration are missing");
}

// Constructing base URLs
const BASE_URL = buildUrl(env.api);
// const MAILER_URL = buildUrl(env.MAILER);
const MAILER_URL = env.MAILER.HOST;

// Defining API_ENDPOINTS
export const API_ENDPOINTS = {
  server: {
    topdishes: `http://167.235.49.72:8880/top_dishes`,
    forecast: `http://167.235.49.72:8880/forecast`,
  },
  auth: {
    login: `${BASE_URL}/auth/login`,
    logout: `${BASE_URL}/auth/logout`,
    register: `${BASE_URL}/auth/register`,
    user: `${BASE_URL}/auth/users`,
    getRole: `${BASE_URL}/user-branch-map/usersWithRoles/login`,
  },
  adminDashboard: {
    organisation: `${BASE_URL}/organisation`,
    branch: `${BASE_URL}/branch`,
    uploadImage: `${BASE_URL}/branch/upload-image`,
    getBranchBasedOnOrganisationId: `${BASE_URL}/branch/organisationId`,
    getBranchManagerDetails: `${BASE_URL}/user-branch-map/managerdata`,
    branchMap: `${BASE_URL}/user-branch-map`,
  },
  generalSettings: {
    pendingInvites: `${BASE_URL}/user-branch-map/invited`,
    invitedStatus: `${BASE_URL}/user-branch-map/invited-status`,
    postUsers: `${BASE_URL}/user-branch-map`,
    userExist: `${BASE_URL}/user-branch-map/exist`,
    sendInviteMail: `${MAILER_URL}`,
  },
  organisation: {
    language: `${BASE_URL}/language`,
    onlyCountry: `${BASE_URL}/country-and-state/only-country`,
    states: `${BASE_URL}/country-and-state/states`,
    primaryInterest: `${BASE_URL}/primary-interest`,
    companySize: `${BASE_URL}/company-size`,
    checkOrganisationFields: `${BASE_URL}/organisation/check-organization-fields`,
    getOrganisation: `${BASE_URL}/organisation`,
    postOrganisation: `${BASE_URL}/organisation`,
    userBranchMap: `${BASE_URL}/user-branch-map/usersWithOrganisationAndBranch`,
    usersWithMatchingEmails: `${BASE_URL}/user-branch-map/users/users-with-matching-emails`,
    roles: `${BASE_URL}/role`,
    branch: `${BASE_URL}/branch`,
  },
  userMangement: {
    assignBranch: `${BASE_URL}/user-branch-map/user/rolebranch`,
    deleteUser: `${BASE_URL}/user-branch-map/user/deactivate`,
  },
  productMangement: {
    product: `${BASE_URL}/product`,
    category: `${BASE_URL}/category`,
    unitofmeasure: `${BASE_URL}/unit-of-measure`,
  },
  supplierManagement: {
    suppliercategory: `${BASE_URL}/supplier-category`,
    supplier: `${BASE_URL}/supplier`,
  },
  bankDetails: {
    bankDetail: `${BASE_URL}/bank-details`,
  },
  SalesForecast: {
    salesForecast: `${BASE_URL}/sales-data-set/distinct`,
  },
  manager: {
    orders: {
      orderResponse: `${BASE_URL}/orders`,
      suppliersResponse: `${BASE_URL}/supplier`,
    },
    inventory: {
      inventoryResponse: `${BASE_URL}/inventory`,
    },
    homepage: {
      branchData: `${BASE_URL}/branch`,
      productData: `${BASE_URL}/product`,
      chefData: `${BASE_URL}/user-branch-map`,
    },
    floorlayout: {
      floorLayoutResponse: `${BASE_URL}/floor-layout`,
    },
    tableLayout: {
      tableLayoutResponse: `${BASE_URL}/table-layout`,
    },
    menuitems: {
      itemsData: `${BASE_URL}/menu-item`,
      singleItemData: `${BASE_URL}/menu-item`,
      branchItems: `${BASE_URL}/menu-item/branchId`,
    },
    menuitemscategory: {
      itemCategoryData: `${BASE_URL}/menu-item-category`,
    },
    menuitemdelete: {
      itemDelete: `${BASE_URL}/menu-item`,
    },
    menuitemsupdate: {
      itemUpdate: `${BASE_URL}/menu-item`,
    },
    customer: {
      getCustomerDetail: `${BASE_URL}/customer`,
      addCustomerData: `${BASE_URL}/customer`,
    },
    diningOrder: {
      placeOrder: `${BASE_URL}/dining-order`,
      getPlacedOrderData: `${BASE_URL}/dining-order/tableId`,
      transferTable: `${BASE_URL}/dining-order`,
      updateForBilling: `${BASE_URL}/dining-order/orderId`,
      orderDetails: `${BASE_URL}/dining-order/tableId`,
    },
    kotItems: {
      deletePendingOrderItem: `${BASE_URL}/kotitems`,
      updatestatus: `${BASE_URL}/kotitems`,
    },
    billing: {
      orderBilling: `${BASE_URL}/bills`,
      customerDetails: `${BASE_URL}/customer`,
      allMenuItems: `${BASE_URL}/menu-item`,
      splitBillEqually: `${BASE_URL}/bills`,
      getSplitBills: `${BASE_URL}/split-bills`,
      tax: `${BASE_URL}/tax`,
      revertSplits: `${BASE_URL}/bills`,
    },
    menuItemDiningOrder: {
      getmenuItemDiningOrder: `${BASE_URL}/menu-item-dining-order`,
    },
  },
};

// Exporting API_ENDPOINTS
export default API_ENDPOINTS;
