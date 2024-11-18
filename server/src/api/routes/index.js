import { Router } from "express";
import swaggerUI from "swagger-ui-express";

import { authenticateWithToken } from "../middlewares/auth.js";
import { handle404, handleError } from "../middlewares/errors.js";
import authRouter from "./auth.js";
import countryAndStateRouter from "./countryandstate.js";
import primaryInterestRouter from "./primaryinterest.js";
import warehouseRouter from "./warehouse.js";
import branchRouter from "./branch.js";
import eventTableRouter from "./eventtable.js";
import inventoryRouter from "./inventory.js";
import languageRouter from "./language.js";
import organisationRouter from "./organisation.js";
import passwordRouter from "./password.js";
import productRouter from "./product.js";
import roleRouter from "./role.js";
import tenantRouter from "./tenant.js";
import unitOfMeasureRouter from "./unitofmeasure.js";
import userBranchMapRouter from "./userbranchmap.js";
import userSettingRouter from "./usersetting.js";
import companySizeRouter from "./companysize.js";
import categoryRouter from "./category.js";
import supplierRouter from "./supplier.js";
import supplierCategoryRouter from "./suppliercategory.js";
import bankDetailsRouter from "./bankdetails.js";
import ordersRouter from "./orders.js";
import menuItemRouter from "./menuitems.js";
import menuItemCategoryRouter from "./menuitemcategory.js";
import menuItemInventoryRouter from "./menuiteminventory.js";
import floorLayoutRouter from "./floorlayout.js";
import tableLayoutRouter from "./tablelayout.js";
import menuItemDiningOrder from "./menuitemdiningorder.js";
import customerRouter from "./customer.js";
import menuItemDiningOrderRouter from "./menuitemdiningorder.js";
import diningOrderRouter from "./diningorders.js";
import taxRouter from "./tax.js";
import orderTaxRouter from "./ordertax.js";
import billsRouter from "./bills.js";
import billItemsRouter from "./billitems.js";
import splitBillsRouter from "./splitbills.js";
import vouchersRouter from "./vouchers.js";
import voucherUsageRouter from "./voucherusage.js";
import paymentsRouter from "./payments.js";
import receiptsRouter from "./receipts.js";
import kOTRouter from "./kot.js";
import kOTItemsRouter from "./kotitems.js";
import tableTransferRouter from "./tabletransfer.js";
import urls from "../urls.js";
import spec from "../openapi.js";

const router = Router();

// Swagger API docs
const swaggerSpecPath = `${urls.swagger.path}/${urls.swagger.spec}`;
const swaggerUIOptions = {
  swaggerOptions: {
    url: swaggerSpecPath,
  },
};
router.get(swaggerSpecPath, (req, res) => res.json(spec));
router.use(
  urls.swagger.path,
  swaggerUI.serve,
  swaggerUI.setup(null, swaggerUIOptions)
);

// Authentication
router.use(authenticateWithToken);
router.use(urls.apiPrefix + urls.auth.path, authRouter);

// CRUD API
router.use(urls.apiPrefix + urls.countryAndState.path, countryAndStateRouter);
router.use(urls.apiPrefix + urls.primaryInterest.path, primaryInterestRouter);
router.use(urls.apiPrefix + urls.warehouse.path, warehouseRouter);
router.use(urls.apiPrefix + urls.branch.path, branchRouter);
router.use(urls.apiPrefix + urls.eventTable.path, eventTableRouter);
router.use(urls.apiPrefix + urls.inventory.path, inventoryRouter);
router.use(urls.apiPrefix + urls.language.path, languageRouter);
router.use(urls.apiPrefix + urls.organisation.path, organisationRouter);
router.use(urls.apiPrefix + urls.password.path, passwordRouter);
router.use(urls.apiPrefix + urls.product.path, productRouter);
router.use(urls.apiPrefix + urls.role.path, roleRouter);
router.use(urls.apiPrefix + urls.tenant.path, tenantRouter);
router.use(urls.apiPrefix + urls.unitOfMeasure.path, unitOfMeasureRouter);
router.use(urls.apiPrefix + urls.userBranchMap.path, userBranchMapRouter);
router.use(urls.apiPrefix + urls.userSetting.path, userSettingRouter);
router.use(urls.apiPrefix + urls.companySize.path, companySizeRouter);
router.use(urls.apiPrefix + urls.category.path, categoryRouter);
router.use(urls.apiPrefix + urls.supplier.path, supplierRouter);
router.use(urls.apiPrefix + urls.supplierCategory.path, supplierCategoryRouter);
router.use(urls.apiPrefix + urls.bankDetails.path, bankDetailsRouter);
router.use(urls.apiPrefix + urls.orders.path, ordersRouter);
router.use(urls.apiPrefix + urls.menuItem.path, menuItemRouter);
router.use(urls.apiPrefix + urls.menuItemCategory.path, menuItemCategoryRouter);
router.use(urls.apiPrefix + urls.tax.path, taxRouter);
router.use(urls.apiPrefix + urls.orderTax.path, orderTaxRouter);
router.use(urls.apiPrefix + urls.bills.path, billsRouter);
router.use(urls.apiPrefix + urls.billItems.path, billItemsRouter);
router.use(urls.apiPrefix + urls.splitBills.path, splitBillsRouter);
router.use(urls.apiPrefix + urls.vouchers.path, vouchersRouter);
router.use(urls.apiPrefix + urls.voucherUsage.path, voucherUsageRouter);
router.use(urls.apiPrefix + urls.payments.path, paymentsRouter);
router.use(urls.apiPrefix + urls.receipts.path, receiptsRouter);
router.use(urls.apiPrefix + urls.kOT.path, kOTRouter);
router.use(urls.apiPrefix + urls.kOTItems.path, kOTItemsRouter);
router.use(urls.apiPrefix + urls.tableTransfer.path, tableTransferRouter);
router.use(
  urls.apiPrefix + urls.menuItemInventory.path,
  menuItemInventoryRouter
);
router.use(urls.apiPrefix + urls.floorLayout.path, floorLayoutRouter);
router.use(urls.apiPrefix + urls.tableLayout.path, tableLayoutRouter);
router.use(urls.apiPrefix + urls.diningOrder.path, diningOrderRouter);
router.use(urls.apiPrefix + urls.customer.path, customerRouter);
router.use(
  urls.apiPrefix + urls.menuItemDiningOrder.path,
  menuItemDiningOrderRouter
);

// Redirect browsers from index to API docs
router.get("/", (req, res, next) => {
  if (req.accepts("text/html")) {
    res.redirect(urls.swagger.path);
  } else {
    next();
  }
});

// Error handlers
router.use(handle404);
router.use(handleError);

export default router;
