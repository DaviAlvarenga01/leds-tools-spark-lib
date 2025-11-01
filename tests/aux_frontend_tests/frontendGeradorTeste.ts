import { generate } from "../../src/frontend/vue-vite/generate.js";
import { ClassAbstraction, PackageAbstraction, PrimitiveTypeAbstraction, ProjectAbstraction, TypeScriptAttribute, vueModularArchProjectSettings } from "seon-lib-implementation";
import path from "path";
import { fileURLToPath } from "url";

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

// Resolve __dirname (works in both CommonJS and ESM runtimes)
const __filenameLocal = typeof __filename !== 'undefined' ? __filename : fileURLToPath(import.meta.url as string);
const __dirnameLocal = typeof __dirname !== 'undefined' ? __dirname : path.dirname(__filenameLocal);

// Dispara a geração do frontend para a pasta deste arquivo de teste
generate(project, __dirnameLocal);