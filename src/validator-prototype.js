let Ajv = require("ajv");

function protoValidate(schemas, rootSchemaId, entity) {
    let ajv = new Ajv({schemas: schemas, allErrors: true});
    let validate;
    try {
        validate = ajv.getSchema(rootSchemaId);
        validate(entity);
    } catch(err) {
        console.log(err);
        
        throw new Error("Could not find schema for id: " + rootSchemaId);
    }
    return validate.errors;
}

module.exports = protoValidate;

// let schema = {
//     "$id": "http://example.com/schemas/schema.json",
//     "type": "object",
//     "properties": {
//         "foo": { "$ref": "defs.json#/definitions/int" },
//         "bar": { "$ref": "defs.json#/definitions/str" }
//     },
//     "required": ["foo"]
//   };
  
// let defsSchema = {
    // "$id": "http://example.com/schemas/defs.json",
    // "definitions": {
    //     "int": { "type": "integer" },
    //     "str": { "type": "string" }
//     }
// };

// var ajv = new Ajv({schemas: [schema, defsSchema], allErrors: true});
// var validate = ajv.getSchema('http://example.com/schemas/schema.json');

// validate({
    
//     "bar": 8
// });
// console.log(validate.errors);
