/**
 * Frontend Code Generation Tests
 * 
 * Comprehensive test suite for validating the Vue.js frontend code generation.
 * Tests the complete generation process including folder structure, file creation,
 * and content validation for all generated components, stores, views, and configurations.
 * 
 * @module tests/frontend
 * @requires vitest
 * @requires seon-lib-implementation
 * 
 * Test Coverage:
 * - Directory structure creation
 * - File existence validation
 * - Content verification for all generated files
 * - Asset files (logos, favicons)
 * - Source files (components, stores, views, etc.)
 * 
 * @author Spark Lib Team
 */

import { afterAll, beforeAll, expect, test} from "vitest";
import {generate} from "../src/frontend/vue-vite/generate.js";
import { checkIsDir, checkFileContent, checkIsFile  } from "./aux_frontend_tests/checkers.js";
import { deleteFolderRecursive } from "./aux_frontend_tests/deletionFrontend.js";
import path from 'path';
import { ClassAbstraction, PackageAbstraction, PrimitiveTypeAbstraction, ProjectAbstraction, TypeScriptAttribute, vueModularArchProjectSettings } from "seon-lib-implementation";
import { frontendFiles } from "./aux_frontend_tests/frontendDatas.js";
import { srcApiFiles } from "./aux_frontend_tests/srcExpectedFiles/apiDatas.js";
import { allFolderList, srcAssetsPath, frontEndPath, publicPath
    } from "./aux_frontend_tests/foldersDatas.js";
import { srcComponentsFiles } from "./aux_frontend_tests/srcExpectedFiles/componentsDatas.js";
import { srcLayoutsFiles } from "./aux_frontend_tests/srcExpectedFiles/layoutsDatas.js";
import { srcModulesFiles } from "./aux_frontend_tests/srcExpectedFiles/modulesDatas.js";
import { srcPluginsFiles } from "./aux_frontend_tests/srcExpectedFiles/pluginsDatas.js";
import { srcRootFiles } from "./aux_frontend_tests/srcExpectedFiles/rootDatas.js";
import { srcRoutesFiles } from "./aux_frontend_tests/srcExpectedFiles/routesDatas.js";
import { srcStoresFiles } from "./aux_frontend_tests/srcExpectedFiles/storesDatas.js";
import { srcTypesFiles } from "./aux_frontend_tests/srcExpectedFiles/typesDatas.js";
import { srcUtilsFiles } from "./aux_frontend_tests/srcExpectedFiles/utilsDatas.js";
import { srcViewsFiles } from "./aux_frontend_tests/srcExpectedFiles/viewsDatas.js";


/**
 * Test Project Abstraction
 * 
 * Mock SEON ProjectAbstraction used for testing frontend generation.
 * Contains two test entities with different attribute types to validate
 * the generator's ability to handle various data types.
 * 
 * Structure:
 * - Entidade1: nome (string), numero (integer)
 * - Entidade2: nome (string), verificacao (boolean)
 * 
 * @type {ProjectAbstraction}
 */


let project: ProjectAbstraction = new ProjectAbstraction('Test', "Testes dos geradores do frontend", vueModularArchProjectSettings, 
    [
        new PackageAbstraction('Entidade1', [
            new ClassAbstraction('Entidade1', [], 
                [
                    new TypeScriptAttribute('nome', new PrimitiveTypeAbstraction('string')), 
                    new TypeScriptAttribute('numero', new PrimitiveTypeAbstraction('integer')), 
                ]),
            ], 
        ),
        new PackageAbstraction('Entidade2', [
            new ClassAbstraction('Entidade2', [], 
                [
                    new TypeScriptAttribute('nome', new PrimitiveTypeAbstraction('string')), 
                    new TypeScriptAttribute('verificacao', new PrimitiveTypeAbstraction('boolean')), 
                ]),
            ], 
        )
    ]
);


/**
 * Path to the PNG logo file in assets
 * @constant {string}
 */
const logoPngFile = path.join(srcAssetsPath, 'logo.png')

/**
 * Path to the SVG logo file in assets
 * @constant {string}
 */
const logoSvgFile = path.join(srcAssetsPath, 'logo.svg')

/**
 * Path to the favicon file in public directory
 * @constant {string}
 */
const faviconFile = path.join(publicPath, 'favicon.png')


/**
 * Test Setup Hook
 * 
 * Executes before all tests to generate the frontend project structure.
 * Creates all directories, files, and assets needed for testing.
 * 
 * @function beforeAll
 */
beforeAll(() => {
    generate(project, __dirname);
});


/**
 * Test Cleanup Hook
 * 
 * Executes after all tests to clean up generated files and directories.
 * Removes the 'frontend' folder and all its contents to avoid cluttering
 * the test directory.
 * 
 * @function afterAll
 
afterAll(() => {
    deleteFolderRecursive(path.join(__dirname, 'frontend'));
});
*/


/**
 * Test Suite: Directory Structure Validation
 * 
 * Validates that all required directories are created during generation.
 * Uses parameterized tests to check each folder in the expected structure.
 * 
 * @test
 * @param {string} dirPath - Path to the directory to validate
 */
test.each(allFolderList)(`Test existence of folder %s`, (dirPath) => {
    expect(() => checkIsDir(dirPath)).not.toThrow();
});


/**
 * Test Suite: Asset Files Validation
 * 
 * Validates the existence of non-textual asset files (images, icons).
 * These files are checked for existence only, not content validation.
 * 
 * Tested Files:
 * - logo.png (PNG format)
 * - logo.svg (SVG format)
 * - favicon.png (Favicon)
 * 
 * @test
 * @param {string} fileName - Path to the asset file to validate
 */
test.each([
    [logoPngFile], [ logoSvgFile], [faviconFile] 
])(`Test existence of %s `, (fileName) => { // non textual files, content will not be checked as a string
    expect(() => checkIsFile(fileName)).not.toThrow();
});


/**
 * Array of frontend root files with their expected content
 * Populated by iterating through frontendFiles dictionary
 * 
 * @type {Array<[string, string]>}
 */
let eachFrontEndFileContent: [string, string][] = [];

for (const key in frontendFiles) {
    eachFrontEndFileContent.push([path.join(frontEndPath, key), frontendFiles[key]])
}

/**
 * Test Suite: Frontend Root Files Content Validation
 * 
 * Validates both existence and content of frontend root files such as
 * package.json, vite.config.ts, tsconfig.json, etc.
 * 
 * @test
 * @param {string} filePath - Path to the file to validate
 * @param {string} file - Expected content of the file
 */
test.each(eachFrontEndFileContent)(`Test generated file in %s`, (filePath, file) => {
    expect(() => checkFileContent(filePath, file)).not.toThrow();
});


/**
 * Merged dictionary containing all expected source files
 * 
 * Combines all src subdirectories' expected files into a single object:
 * - API files (axios configuration, services)
 * - Components (reusable Vue components)
 * - Layouts (page layouts)
 * - Modules (domain modules)
 * - Plugins (Vue plugins)
 * - Root files (App.vue, main.ts)
 * - Routes (routing configuration)
 * - Stores (Pinia stores)
 * - Types (TypeScript type definitions)
 * - Utils (utility functions)
 * - Views (page components)
 * 
 * @type {Object.<string, string>}
 */
const allSrcFiles: { [key: string] : string } = { 
    ...srcApiFiles, ...srcComponentsFiles, ...srcLayoutsFiles, 
    ...srcModulesFiles, ...srcPluginsFiles, ...srcRootFiles, ...srcRoutesFiles,
    ...srcStoresFiles, ...srcTypesFiles, ...srcUtilsFiles, ...srcViewsFiles
}

for (let i in allFolderList) {
    console.log(i, allFolderList[i])
}

/**
 * Array of source files with their expected content
 * Populated by iterating through allSrcFiles dictionary
 * 
 * @type {Array<[string, string]>}
 */
let eachSrcFileContent: [string, string][] = [];

for (const key in allSrcFiles) {
    eachSrcFileContent.push([key, allSrcFiles[key]])
}

/**
 * Test Suite: Source Files Content Validation
 * 
 * Validates both existence and content of all generated source files
 * in the src directory and its subdirectories. This is the most comprehensive
 * test, checking components, stores, views, types, utilities, and more.
 * 
 * @test
 * @param {string} filePath - Path to the source file to validate
 * @param {string} file - Expected content of the file
 */
test.each(eachSrcFileContent)(`Test generated file in %s`, (filePath, file) => {
    expect(() => checkFileContent(filePath, file)).not.toThrow();
});