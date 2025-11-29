// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const validate = require('../utilities/inventory-validation');

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build vehicle detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build Inventory Management view
router.get("/", utilities.handleErrors(invController.buildManagement));

// Route to deliver add classification view (GET)
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

// Route to process the new classification (POST)
router.post(
    "/add-classification",
    validate.classificationRules(),
    validate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
);

// Route to deliver add new inventory view (GET)
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

// Route to process the new inventory item (POST)
router.post(
    "/add-inventory",
    validate.inventoryRules(),
    validate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
);

module.exports = router;