let Ajv = require("ajv");
const logger = require("./winston");
const ValidationError = require("./model/validation-error");
const AppError = require("./model/application-error");

let ajv = new Ajv({allErrors: true});

const { ElixirValidator, isChildTermOf, isValidTerm} = require('elixir-jsonschema-validator');

const validator = new ElixirValidator([
  new isChildTermOf(null, "https://www.ebi.ac.uk/ols/api/search?q="),
  new isValidTerm(null, "https://www.ebi.ac.uk/ols/api/search?q=")
]);

function convertToValidationErrors(ajvErrorObjects) {
  let localErrors = [];
  ajvErrorObjects.forEach( (errorObject) => {
    let tempValError = new ValidationError(errorObject);
    let index = localErrors.findIndex(valError => (valError.dataPath === tempValError.dataPath));

    if(index !== -1) {
      localErrors[index].errors.push(tempValError.errors[0]);
    } else {
      localErrors.push(tempValError);
    }
  });
  return localErrors;
}

// function runValidation(inputSchema, inputObject) {
//   logger.log("silly", "Running validation...");
//   return new Promise((resolve, reject) => {
//     var validate = ajv.compile(inputSchema);
//     Promise.resolve(validate(inputObject))
//     .then((data) => {
//         if (validate.errors) {
//           logger.log("debug", ajv.errorsText(validate.errors, {dataVar: inputObject.alias}));
//           resolve(convertToValidationErrors(validate.errors));
//         } else {
//           resolve([]);
//         }
//       }
//     ).catch((err, errors) => {
//       if (!(err instanceof Ajv.ValidationError)) {
//         logger.log("error", "An error ocurred while running the validation.");
//         reject(new AppError("An error ocurred while running the validation."));
//       } else {
//         logger.log("debug", ajv.errorsText(err.errors, {dataVar: inputObject.alias}));
//         resolve(convertToValidationErrors(err.errors));
//       }
//     });
//   });
// }

function runValidation(inputSchema, inputObject) {
  logger.log("silly", "Running validation...");

  return new Promise((resolve, reject) => {

    validator.validate(inputSchema, inputObject)
    .then((validationResult) => {
      if (validationResult.length == 0) {
        logger.log("info", "NO ERRORS!!!");
        resolve([]);
      } else {
        logger.log("info", "ERRORS!!! " + validationResult.length);
        let ajvErrors = [];
        validationResult.forEach(validationError => {
          ajvErrors.push(validationError);
        });

        resolve(convertToValidationErrors(ajvErrors));
      }
    }).catch( (error) => {
        if (error.errors) {
          //temporary way to assume the errors is elixir's AppError
          reject(new AppError(error.errors));
        } else {
          logger.log("error", "An error ocurred while running the validation. Error : " + JSON.stringify(error));
          reject(new AppError("An error ocurred while running the validation."));
        }
    });
  });
}

module.exports = runValidation;