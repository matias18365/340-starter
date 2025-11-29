const utilities = require("../utilities/")
const baseController = {}

/* ****************************************
* Build the home view
* *************************************** */
baseController.buildHome = async function(req, res){
    const nav = await utilities.getNav()
    res.render("index", {title: "Home", nav})
}

/* ****************************************
* Build intentional 500 error route
* *************************************** */
baseController.triggerError = async function (req, res, next) {
    throw new Error('This is an intentional 500 error for testing purposes.')
}

module.exports = baseController;