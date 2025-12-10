/**
 * Code Generator Entry Module
 * 
 * This module serves as the main entry point for code generation,
 * translating abstract models into concrete project implementations.
 * It handles the conversion of domain models to SEON abstractions
 * and initiates the project generation process.
 * 
 * Features:
 * - Model to SEON translation
 * - Project structure generation
 * - Package organization
 * - Entity and attribute mapping
 */

import SEON from "seon-lib-implementation"
import { ProjectGenerator } from "./ProjectGenerator.js"
import { isAttribute, isLocalEntity, isModule, Model } from "./backend/models/model.js"

/**
 * Main generation function
 * 
 * Initiates the code generation process by translating the input model
 * and delegating the actual generation to ProjectGenerator.
 * 
 * @param model - Source model containing project structure and entities
 * @param target_folder - Destination directory for generated code
 */
export function generate(model: Model, target_folder: string): void {
    const project = new ProjectGenerator(translate(model))

    project.generate(target_folder)
}

/**
 * Model to SEON translator
 * 
 * Converts the domain model into a SEON project abstraction,
 * organizing entities into packages and mapping attributes
 * to TypeScript types.
 * 
 * Process:
 * 1. Extract project metadata
 * 2. Process modules and entities
 * 3. Map attributes to TypeScript
 * 4. Create package hierarchy
 * 
 * @param model - Source model to translate
 * @returns {SEON.ProjectAbstraction} SEON project representation
 */
export function translate(model: Model): SEON.ProjectAbstraction {
    const softwareName = model.configuration?.name ?? ""
    const softwareDescription = model.configuration?.description ?? ""    
    
    const packagesList: SEON.PackageAbstraction[] = []

    for (const absElem of model.abstractElements) {
        if (isModule(absElem)) {
            for (const elem of absElem.elements) {
                if (isLocalEntity(elem)) {
                    const listAttr: SEON.TypeScriptAttribute[] = []

                    for (const attr of elem.attributes) {
                        if (isAttribute(attr)) {
                            listAttr.push(new SEON.TypeScriptAttribute(attr.name, new SEON.PrimitiveTypeAbstraction(attr.type.toString())))
                        }
                    }

                    const cls = new SEON.ClassAbstraction(elem.name, [], listAttr)

                    packagesList.push(new SEON.PackageAbstraction(elem.name, [cls], []))
                }
            }
        }
    }

    return new SEON.ProjectAbstraction(softwareName, softwareDescription, SEON.vueModularArchProjectSettings, packagesList)
}