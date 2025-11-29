const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    })
}

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
    const inv_id = req.params.invId; 
    const inventoryData = await invModel.getInventoryById(inv_id);
    if (!inventoryData || inventoryData.length === 0) {
        return next({ 
            status: 404, 
            message: 'Sorry, no vehicle information could be found.' 
        });
    }
    const vehicle = inventoryData[0]; 
    const detailHTML = await utilities.buildVehicleDetail(vehicle); 
    let nav = await utilities.getNav(); 
    res.render("inventory/vehicle-detail", {
        title: `${vehicle.inv_make} ${vehicle.inv_model}`, 
        nav,
        detailHTML,
    });
};

/* ***************************
 * Build vehicle management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
    let nav = await utilities.getNav();
    res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
    });
};

/* ***************************
 * Deliver add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
    classification_name: null 
    });
};

/* ***************************
 * Process new classification submission
 * ************************** */
invCont.addClassification = async function (req, res) {
    const { classification_name } = req.body;

    const classResult = await invModel.registerClassification(classification_name);

    let nav = await utilities.getNav();

    if (classResult) {
    req.flash(
        "notice",
        `The ${classification_name} classification was successfully added.`
    );
    res.status(201).render("inventory/management", {
        title: "Vehicle Management",
        nav,
        errors: null,
    });
    } else {
    req.flash("notice", "Sorry, the classification addition failed.");
    res.status(501).render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: null,
        classification_name, 
    });
    }
};

/* ***************************
 * Deliver add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList(); // Obtiene la lista desplegable
    
    res.render("inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classificationList,
        errors: null,
    });
};

/* ***************************
 * Process new inventory submission
 * ************************** */
invCont.addInventory = async function (req, res) {
    const {
    inv_make, inv_model, inv_year, inv_description, inv_image, 
    inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
    } = req.body;

    const invResult = await invModel.addInventory(
    inv_make, inv_model, inv_year, inv_description, inv_image, 
    inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
    );

    let nav = await utilities.getNav();

    if (invResult) {
    req.flash("notice", `The ${inv_make} ${inv_model} was successfully added to inventory.`);
    res.status(201).render("inventory/management", {
        title: "Vehicle Management",
        nav,
        errors: null,
    });
    } else {
    req.flash("notice", "Sorry, the vehicle addition failed.");
    let classificationList = await utilities.buildClassificationList(classification_id);
    res.status(501).render("inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classificationList,
        errors: null,
    });
    }
};

module.exports = invCont