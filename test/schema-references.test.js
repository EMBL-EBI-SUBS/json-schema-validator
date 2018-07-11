const fs = require("fs");
const protoValidate = require("../src/validator-prototype");

test("Base schema and definitions schema test WITH erros", () => {
    let baseSchema = fs.readFileSync("examples/schemas/references/base-sample-schema.json");
    let jsonBaseSchema = JSON.parse(baseSchema);

    let definitionsSchema = fs.readFileSync("examples/schemas/references/definitions-schema.json");
    let jsonDefinitionsSchema = JSON.parse(definitionsSchema);

    let errors = protoValidate(
        [jsonBaseSchema, jsonDefinitionsSchema], 
        jsonBaseSchema.$id, 
        {
            alias: "abc",
            taxonId: 9606,
            releaseDate: "2000-01-01",
            sampleRelationships: [{
                accession: "def123",
                relationshipNature: ""
            }]
        });

    expect(errors).toBeDefined();
    expect(errors[0].schemaPath).toBe("definitions-schema.json#/definitions/sampleRelationships/items/properties/relationshipNature/enum");
});

test("Base schema and definitions schema test WITHOUT errors", () => {
    let baseSchema = fs.readFileSync("examples/schemas/references/base-sample-schema.json");
    let jsonBaseSchema = JSON.parse(baseSchema);

    let definitionsSchema = fs.readFileSync("examples/schemas/references/definitions-schema.json");
    let jsonDefinitionsSchema = JSON.parse(definitionsSchema);

    let errors = protoValidate(
        [jsonBaseSchema, jsonDefinitionsSchema], 
        jsonBaseSchema.$id, 
        {
            alias: "abc",
            taxonId: 9606,
            releaseDate: "2000-01-01",
            sampleRelationships: [{
                accession: "def123",
                relationshipNature: "derived from"
            }]
        });

    expect(errors).toBeNull();
});

test("ML schema -> base schema -> definitions schema test", () => {
    let mlSchema = fs.readFileSync("examples/schemas/references/ml-sample-schema.json");
    let jsonMLSchema = JSON.parse(mlSchema);

    let baseSchema = fs.readFileSync("examples/schemas/references/base-sample-schema.json");
    let jsonBaseSchema = JSON.parse(baseSchema);

    let definitionsSchema = fs.readFileSync("examples/schemas/references/definitions-schema.json");
    let jsonDefinitionsSchema = JSON.parse(definitionsSchema);

    let errors = protoValidate(
        [jsonMLSchema, jsonBaseSchema, jsonDefinitionsSchema], 
        jsonMLSchema.$id, 
        {
            alias: "abc",
            taxonId: 9606,
            releaseDate: "2000-01-01",
            attributes: {
                Organism: [{value: "Homo sapiens"}],
                "Organism part": [{}]
            }
        });

    expect(errors[0].schemaPath).toBe("definitions-schema.json#/definitions/attributes_structure/items/required");
});