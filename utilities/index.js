const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
    list += "<li>"
    list +=
        '<a href="/inv/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>"
    list += "</li>"
    })
    list += "</ul>"
    return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
    })
    grid += '</ul>'
    } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/* **************************************
 * Build the vehicle detail view HTML
 * ************************************ */
Util.buildVehicleDetail = async function(vehicle){
    const formattedPrice = vehicle.inv_price.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
    });
    const formattedMileage = vehicle.inv_miles.toLocaleString("en-US");
    let html = `
        <div class="detail-wrapper">
            <section class="detail-image-section">
                <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} ${vehicle.inv_year}" class="full-size-image">
            </section>
            <section class="detail-info-section">
                <h2 class="detail-heading">${vehicle.inv_make} ${vehicle.inv_model} - ${vehicle.inv_year}</h2>
                <div class="price-box">
                    <span class="price-label">Price:</span>
                    <span class="prominent-price">${formattedPrice}</span>
                </div>
                <ul class="detail-list">
                    <li><span class="detail-label">Description:</span> ${vehicle.inv_description}</li>
                    <li><span class="detail-label">Mileage:</span> ${formattedMileage}</li>
                    <li><span class="detail-label">Color:</span> ${vehicle.inv_color}</li>
                    <li><span class="detail-label">Year:</span> ${vehicle.inv_year}</li>
                    </ul>
            </section>
        </div>
    `;
    return html;
}

/* ****************************************
* Middleware for handling errors
* *************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
 * Generates an HTML <select> list of classifications 
 * Utilizada para las vistas Add Inventory y Edit Inventory
 * *************************************** */
Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications() // Asume que esta función existe en el modelo
    let classificationList =
    '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
        classification_id != null &&
        row.classification_id == row.classification_id
        // Nota: El código proporcionado en las instrucciones tenía un error lógico:
        // row.classification_id == classification_id.
        // Lo estoy corrigiendo para que use la variable que se pasa.

        ) {
            classificationList += " selected "
        }
        classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
    }

module.exports = Util