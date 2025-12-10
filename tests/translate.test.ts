import { beforeAll, expect, test } from "vitest"
import { translate as translate_generate } from "../src/generate.js"
import SEON from "seon-lib-implementation"
import { Attribute, Configuration, LocalEntity, Model, Module } from "module-doc-lib"

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
let project: SEON.ProjectAbstraction

beforeAll(async () => {
    localEntity1.attributes.push(lC1Attr1, lC1Attr2)

    localEntity2.attributes.push(lC2Attr1, lC2Attr2)

    module.elements.push(localEntity1, localEntity2)

    model.abstractElements.push(module)

    configuration.$container = model

    project = translate_generate(model)
})

test('Object Translate Test: Name', async () => {

    expect(project.getProjectName()).toBe("Test")
})

test('Object Translate Test: Objects', async () => {

    const clsList: SEON.ClassAbstraction[] = []

    for (const pack of project.getCoresPackages()) {
        pack.getPackageLevelClasses().forEach(p => {
            clsList.push(p)
        })
    }

    const cls1 = clsList[0]
    expect(cls1.getName()).toBe("Entidade1")

    const attrListCls1 = cls1.getAttributes()
    const attr1Cls1 = attrListCls1[0]
    expect(attr1Cls1.getName()).toBe("nome")
    expect(attr1Cls1.getType().getName()).toBe("string")

    const attr2Cls1 = attrListCls1[1]
    expect(attr2Cls1.getName()).toBe("numero")
    expect(attr2Cls1.getType().getName()).toBe("integer")

    const cls2 = clsList[1]
    expect(cls2.getName()).toBe("Entidade2")

    const attrListCls2 = cls2.getAttributes()
    const attr1Cls2 = attrListCls2[0]
    expect(attr1Cls2.getName()).toBe("nome")
    expect(attr1Cls2.getType().getName()).toBe("string")

    const attr2Cls2 = attrListCls2[1]
    expect(attr2Cls2.getName()).toBe("verificacao")
    expect(attr2Cls2.getType().getName()).toBe("boolean")

})