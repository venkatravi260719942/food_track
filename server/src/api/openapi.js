import swaggerJsDoc from "swagger-jsdoc";

import {
  loginSchema,
  registerSchema,
  changePasswordSchema,
  userSchema,
} from "./schemas/auth.js";
import countryAndStateSchema from "./schemas/countryandstate.js";
import primaryInterestSchema from "./schemas/primaryinterest.js";
import warehouseSchema from "./schemas/warehouse.js";
import branchSchema from "./schemas/branch.js";
import eventTableSchema from "./schemas/eventtable.js";
import inventorySchema from "./schemas/inventory.js";
import languageSchema from "./schemas/language.js";
import organisationSchema from "./schemas/organisation.js";
import passwordSchema from "./schemas/password.js";
import productSchema from "./schemas/product.js";
import roleSchema from "./schemas/role.js";
import tenantSchema from "./schemas/tenant.js";
import unitOfMeasureSchema from "./schemas/unitofmeasure.js";
import userBranchMapSchema from "./schemas/userbranchmap.js";
import userSettingSchema from "./schemas/usersetting.js";
import companySizeSchema from "./schemas/companysize.js";
import categorySchema from "./schemas/category.js";
import supplierSchema from "./schemas/supplier.js";
import supplierCategorySchema from "./schemas/suppliercategory.js";
import bankDetailsSchema from "./schemas/bankdetails.js";
import ordersSchema from "./schemas/orders.js";
import menuItemSchema from "./schemas/menuitem.js";
import menuItemCategorySchema from "./schemas/menuitemcategory.js";
import menuItemInventorySchema from "./schemas/menuiteminventory.js";
import floorLayoutSchema from "./schemas/floorlayout.js";
import tableLayoutSchema from "./schemas/tablelayout.js";
import diningOrderSchema from "./schemas/diningorder.js";
import customerSchema from "./schemas/customer.js";
import menuItemDiningOrderSchema from "./schemas/menuitemdiningorder.js";
import taxSchema from "./schemas/tax.js";
import orderTaxSchema from "./schemas/ordertax.js";
import billsSchema from "./schemas/bills.js";
import billItemsSchema from "./schemas/billitems.js";
import splitBillsSchema from "./schemas/splitbills.js";
import vouchersSchema from "./schemas/vouchers.js";
import voucherUsageSchema from "./schemas/voucherusage.js";
import paymentsSchema from "./schemas/payments.js";
import receiptsSchema from "./schemas/receipts.js";
import kOTSchema from "./schemas/kot.js";
import kOTItemsSchema from "./schemas/kotitems.js";
import tableTransferSchema from "./schemas/tabletransfer.js";
export const definition = {
  openapi: "3.0.0",
  info: {
    title: "Foodtracz",
    version: "0.0.1",
    description: "Inventory management",
  },
  servers: [
    {
      url: "/api/v1",
      description: "API v1",
    },
  ],
  components: {
    schemas: {
      CountryAndState: countryAndStateSchema,
      PrimaryInterest: primaryInterestSchema,
      Warehouse: warehouseSchema,
      Branch: branchSchema,
      EventTable: eventTableSchema,
      Inventory: inventorySchema,
      Language: languageSchema,
      Organisation: organisationSchema,
      Password: passwordSchema,
      Product: productSchema,
      Role: roleSchema,
      Tenant: tenantSchema,
      UnitOfMeasure: unitOfMeasureSchema,
      UserBranchMap: userBranchMapSchema,
      UserSetting: userSettingSchema,
      CompanySize: companySizeSchema,
      Category: categorySchema,
      Supplier: supplierSchema,
      SupplierCategory: supplierCategorySchema,
      BankDetails: bankDetailsSchema,
      Orders: ordersSchema,
      MenuItem: menuItemSchema,
      MenuItemCategory: menuItemCategorySchema,
      MenuItemInventory: menuItemInventorySchema,
      FloorLayout: floorLayoutSchema,
      TableLayout: tableLayoutSchema,
      DiningOrder: diningOrderSchema,
      Customer: customerSchema,
      MenuItemDiningOrder: menuItemDiningOrderSchema,
      Tax: taxSchema,
      OrderTax: orderTaxSchema,
      Bills: billsSchema,
      BillItems: billItemsSchema,
      SplitBills: splitBillsSchema,
      Vouchers: vouchersSchema,
      VoucherUsage: voucherUsageSchema,
      Payments: paymentsSchema,
      Receipts: receiptsSchema,
      KOT: kOTSchema,
      KOTItems: kOTItemsSchema,
      TableTransfer: tableTransferSchema,
      loginSchema,
      registerSchema,
      changePasswordSchema,
      User: userSchema,
    },
    securitySchemes: {
      BearerAuth: {
        type: "http",
        description: "Simple bearer token",
        scheme: "bearer",
        bearerFormat: "simple",
      },
    },
  },
};

const options = {
  definition,
  apis: ["./src/api/routes/*.js"],
};

const spec = swaggerJsDoc(options);

export default spec;
