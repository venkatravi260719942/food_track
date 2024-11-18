import repl from "repl";

import config from "../src/utils/config.js";
import app from "../src/app.js";
import {
  User,
  CountryAndState,
  PrimaryInterest,
  Warehouse,
  Branch,
  EventTable,
  Inventory,
  Language,
  Organisation,
  Password,
  Product,
  Role,
  Tenant,
  UnitOfMeasure,
  UserBranchMap,
  UserSetting,
  Users,
  CompanySize,
  Category,
  Supplier,
  SupplierCategory,
  BankDetails,
  Orders,
  MenuItem,
  MenuItemCategory,
  MenuItemInventory,
  FloorLayout,
  TableLayout,
  DiningOrder,
  Customer,
  MenuItemDiningOrder,
  Tax,
  OrderTax,
  Bills,
  BillItems,
  SplitBills,
  Vouchers,
  VoucherUsage,
  Payments,
  Receipts,
  KOT,
  KOTItems,
  TableTransfer,
} from "../src/models/init.js";
import UserService from "../src/services/user.js";
import CountryAndStateService from "../src/services/countryandstate.js";
import PrimaryInterestService from "../src/services/primaryinterest.js";
import WarehouseService from "../src/services/warehouse.js";
import BranchService from "../src/services/branch.js";
import EventTableService from "../src/services/eventtable.js";
import InventoryService from "../src/services/inventory.js";
import LanguageService from "../src/services/language.js";
import OrganisationService from "../src/services/organisation.js";
import PasswordService from "../src/services/password.js";
import ProductService from "../src/services/product.js";
import RoleService from "../src/services/role.js";
import TenantService from "../src/services/tenant.js";
import UnitOfMeasureService from "../src/services/unitofmeasure.js";
import UserBranchMapService from "../src/services/userbranchmap.js";
import UserSettingService from "../src/services/usersetting.js";
import UsersService from "../src/services/users.js";
import CompanySizeService from "../src/services/companysize.js";
import CategoryService from "../src/services/category.js";
import SupplierService from "../src/services/supplier.js";
import SupplierCategoryService from "../src/services/suppliercategory.js";
import BankDetailsService from "../src/services/bankdetails.js";
import OrdersService from "../src/services/orders.js";
import MenuItemService from "../src/services/menuitem.js";
import MenuItemCategoryService from "../src/services/menuitemcategory.js";
import MenuItemInventoryService from "../src/services/menuiteminventory.js";
import FloorLayoutService from "../src/services/floorlayout.js";
import TableLayoutService from "../src/services/tablelayout.js";
import DiningOrderService from "../src/services/diningorder.js";
import CustomerService from "../src/services/customer.js";
import MenuItemDiningOrderService from "../src/services/menuitemdiningorder.js";
import TaxService from "../src/services/tax.js";
import OrderTaxService from "../src/services/ordertax.js";
import BillsService from "../src/services/bills.js";
import BillItemsService from "../src/services/billitems.js";
import SplitBillsService from "../src/services/splitbills.js";
import VouchersService from "../src/services/vouchers.js";
import VoucherUsageService from "../src/services/voucherusage.js";
import PaymentsService from "../src/services/payments.js";
import ReceiptsService from "../src/services/receipts.js";
import KOTService from "../src/services/kot.js";
import KOTItemsService from "../src/services/kotitems.js";
import TableTransferService from "../src/services/tabletransfer.js";

const main = async () => {
  process.stdout.write("Database and Express app initialized.\n");
  process.stdout.write("Autoimported modules: config, app, models, services\n");

  const r = repl.start("> ");
  r.context.config = config;
  r.context.app = app;
  r.context.models = {
    User,
    CountryAndState,
    PrimaryInterest,
    Warehouse,
    Branch,
    EventTable,
    Inventory,
    Language,
    Organisation,
    Password,
    Product,
    Role,
    Tenant,
    UnitOfMeasure,
    UserBranchMap,
    UserSetting,
    Users,
    CompanySize,
    Category,
    Supplier,
    SupplierCategory,
    BankDetails,
    Orders,
    MenuItem,
    MenuItemCategory,
    MenuItemInventory,
    FloorLayout,
    TableLayout,
    DiningOrder,
    Customer,
    MenuItemDiningOrder,
    Tax,
    OrderTax,
    Bills,
    BillItems,
    SplitBills,
    Vouchers,
    VoucherUsage,
    Payments,
    Receipts,
    KOT,
    KOTItems,
    TableTransfer,
  };
  r.context.services = {
    UserService,
    CountryAndStateService,
    PrimaryInterestService,
    WarehouseService,
    BranchService,
    EventTableService,
    InventoryService,
    LanguageService,
    OrganisationService,
    PasswordService,
    ProductService,
    RoleService,
    TenantService,
    UnitOfMeasureService,
    UserBranchMapService,
    UserSettingService,
    CompanySizeService,
    CategoryService,
    SupplierService,
    SupplierCategoryService,
    BankDetailsService,
    OrdersService,
    MenuItemService,
    MenuItemCategoryService,
    MenuItemInventoryService,
    FloorLayoutService,
    TableLayoutService,
    DiningOrderService,
    CustomerService,
    MenuItemDiningOrderService,
    TaxService,
    OrderTaxService,
    BillsService,
    BillItemsService,
    SplitBillsService,
    VouchersService,
    VoucherUsageService,
    PaymentsService,
    ReceiptsService,
    KOTService,
    KOTItemsService,
    TableTransferService,
  };

  r.on("exit", () => {
    process.exit();
  });

  r.setupHistory(".shell_history", () => {});
};

main();
