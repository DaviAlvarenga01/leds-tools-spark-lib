import { beforeAll, expect, test } from "vitest"
import { Attribute, Configuration, LocalEntity, Model, Module } from "../src/backend/models/model.js"
import {generate} from "../src/backend/generators/django.js"

let configuration: Configuration = {
    $type: "Configuration",
    $container: null!,
    name: 'Test',
    description: 'Testes dos geradores do frontend'
}
let model: Model = {
    $type: 'Model',
    abstractElements: [],
    configuration: configuration
}
let module: Module = { $type: 'Module', $container: model, elements: [], name: 'Test'}
let localEntity1: LocalEntity = {
    $type: 'LocalEntity',
    $container: module,
    name: 'Entidade1',
    attributes: [],
    enumentityatributes: [],
    functions: [],
    is_abstract: false,
    relations: []
}
let lC1Attr1: Attribute = {
    $type: 'Attribute',
    $container: localEntity1,
    name: 'nome',
    type: 'string',
    blank: false,
    unique: false
}
let lC1Attr2: Attribute = {
    $type: 'Attribute',
    $container: localEntity1,
    name: 'numero',
    type: 'integer',
    blank: false,
    unique: false
}
let localEntity2: LocalEntity = {
    $type: 'LocalEntity',
    $container: module,
    name: 'Entidade2',
    attributes: [],
    enumentityatributes: [],
    functions: [],
    is_abstract: false,
    relations: []
}
let lC2Attr1: Attribute = {
    $type: 'Attribute',
    $container: localEntity2,
    name: 'nome',
    type: 'string',
    blank: false,
    unique: false
}
let lC2Attr2: Attribute = {
    $type: 'Attribute',
    $container: localEntity2,
    name: 'verificacao',
    type: 'boolean',
    blank: false,
    unique: false
}

beforeAll(async () => {
    localEntity1.attributes.push(lC1Attr1, lC1Attr2)

    localEntity2.attributes.push(lC2Attr1, lC2Attr2)

    module.elements.push(localEntity1, localEntity2)

    model.abstractElements.push(module)

    configuration.$container = model

    generate(model, __dirname)

})

test('Object Translate Test: Name', async () => {

    expect(model.configuration?.name).toBe("Test")
})