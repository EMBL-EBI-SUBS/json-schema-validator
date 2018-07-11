const fs = require("fs");
const protoValidate = require("../src/validation/validator-prototype");

test("Base schema and definitions schema test WITH erros", () => {
    let baseSchema = fs.readFileSync("examples/schemas/references/base-sample-schema.json");
    let jsonBaseSchema = JSON.parse(baseSchema);

    let definitionsSchema = fs.readFileSync("examples/schemas/references/definitions-schema.json");
    let jsonDefinitionsSchema = JSON.parse(definitionsSchema);

    let errors = protoValidate(
        [jsonBaseSchema, jsonDefinitionsSchema], 
        {
            alias: "abc",
            taxonId: 9606,
            releaseDate: "2000-01-01",
            sampleRelationships: [{
                accession: "def123",
                relationshipNature: ""
            }]
        },
        jsonBaseSchema.$id
    );

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
        {
            alias: "abc",
            taxonId: 9606,
            releaseDate: "2000-01-01",
            sampleRelationships: [{
                accession: "def123",
                relationshipNature: "derived from"
            }]
        },
        jsonBaseSchema.$id
    );

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
        {
            alias: "abc",
            taxonId: 9606,
            releaseDate: "2000-01-01",
            attributes: {
                Organism: [{value: "Homo sapiens"}],
                "Organism part": [{}]
            }
        },
        jsonMLSchema.$id
    );

    expect(errors[0].schemaPath).toBe("definitions-schema.json#/definitions/attributes_structure/items/required");
});