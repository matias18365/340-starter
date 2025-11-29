const utilities = require('.')
const { body, validationResult } = require("express-validator")

const validate = {}

/* **********************************
 * Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
    return [
    // classification_name is required and cannot be empty
    body("classification_name")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Classification Name is required.")
      .matches(/^[a-zA-Z]+$/) // Requisito: Solo caracteres alfabéticos, sin espacios o especiales.
        .withMessage("Classification Name must contain only alphabetic characters (a-z).")
        .custom(async (classification_name) => {
        // Opcional: Podrías añadir una regla para asegurar que no exista ya en la DB.
        // Por ahora, solo nos enfocamos en el formato.
        return true
        }),
    ]
}

/* **********************************
 * Check data and return errors or continue to registration
 * ********************************* */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
        errors,
        title: "Add New Classification",
        nav,
      // Sticky Form: Pasa el valor ingresado de vuelta a la vista
      classification_name, // Si hay un error, el valor se mantiene 'pegajoso'
    })
    return
    }
    next()
}

/* **********************************
 * Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    // classification_id (Requisito: debe ser un entero válido)
    body("classification_id")
      .trim()
      .isInt({ min: 1 })
      .withMessage("Please select a classification from the list."),

    // inv_make (Requisito: Requerido, debe ser alfanumérico)
    body("inv_make")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Make must be at least 3 characters.")
      .isAlphanumeric()
      .withMessage("Make must contain only letters and numbers."),

    // inv_model (Requisito: Requerido, debe ser alfanumérico)
    body("inv_model")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Model must be at least 3 characters.")
      .isAlphanumeric()
      .withMessage("Model must contain only letters and numbers."),

    // inv_description (Requisito: Requerido)
    body("inv_description")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Description must be at least 10 characters."),

    // inv_image & inv_thumbnail (Requisito: Requerido, debe ser una ruta de archivo válida)
    body("inv_image")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Image path is required.")
      .matches(/^\/images\/vehicles\/[^/]+\.(jpg|jpeg|png)$/i) // Patrón de ruta de imagen (ej: /images/vehicles/file.png)
      .withMessage("Image path is invalid (e.g., /images/vehicles/car.jpg)."),

    body("inv_thumbnail")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Thumbnail path is required.")
      .matches(/^\/images\/vehicles\/[^/]+-tn\.(jpg|jpeg|png)$/i) // Patrón de ruta de miniatura (ej: /images/vehicles/file-tn.png)
      .withMessage("Thumbnail path is invalid (e.g., /images/vehicles/car-tn.jpg)."),
      
    // inv_price (Requisito: Requerido, solo números, puede ser decimal)
    body("inv_price")
      .trim()
      .isFloat({ min: 0 })
      .withMessage("Price must be a valid positive number."),

    // inv_year (Requisito: Requerido, 4 dígitos)
    body("inv_year")
      .trim()
      .isLength({ min: 4, max: 4 })
      .withMessage("Year must be a 4-digit number.")
      .isInt({ min: 1886, max: new Date().getFullYear() + 1 }) // El primer coche fue en 1886
      .withMessage("Year is invalid."),

    // inv_miles (Requisito: Requerido, solo dígitos, sin comas)
    body("inv_miles")
      .trim()
      .isInt({ min: 0 })
      .withMessage("Mileage must be digits only and cannot be negative."),

    // inv_color (Requisito: Requerido)
    body("inv_color")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Color is required.")
      .isAlphanumeric()
      .withMessage("Color must contain only letters and numbers."),
  ];
};

/* **********************************
 * Check inventory data and return errors or continue 
 * ********************************* */
validate.checkInventoryData = async (req, res, next) => {
  const { 
    classification_id, inv_make, inv_model, inv_description, inv_image, 
    inv_thumbnail, inv_price, inv_year, inv_miles, inv_color 
  } = req.body;
  
  let classificationList = await utilities.buildClassificationList(classification_id); // Pasa classification_id para el sticky form
  let errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Vehicle",
      nav,
      classificationList: classificationList, // Requisito: Sticky Forms para la lista
      // Requisito: Sticky Forms para todos los campos
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    });
    return;
  }
  next();
};

module.exports = validate