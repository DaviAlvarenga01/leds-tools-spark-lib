import { expect, describe, test, beforeAll, afterAll } from 'vitest';
import { generate } from "../src/frontend/vue-vite/generate.js";
import { deleteFolderRecursive } from "./aux_frontend_tests/deletionFrontend.js";
import path from 'path';
import fs from 'fs';
import { 
    ProjectAbstraction,
    vueModularArchProjectSettings,
    PackageAbstraction,
    ClassAbstraction,
    TypeScriptAttribute,
    PrimitiveTypeAbstraction
} from "seon-lib-implementation";

describe('Frontend Documentation Tests', () => {
    const testDir = path.join(__dirname, 'test-frontend-docs');
    const componentsDir = path.join(testDir, 'frontend', 'src', 'components');
    
    // Projeto de teste básico
    const project = new ProjectAbstraction(
        'TestDocs',
        "Teste de documentação dos componentes",
        vueModularArchProjectSettings,
        [
            new PackageAbstraction('TestEntity', [
                new ClassAbstraction('TestEntity', [], [
                    new TypeScriptAttribute('name', new PrimitiveTypeAbstraction('string')),
                    new TypeScriptAttribute('active', new PrimitiveTypeAbstraction('boolean'))
                ])
            ])
        ]
    );

    // Configuração inicial
    beforeAll(() => {
        // Limpa diretório de teste se existir
        if (fs.existsSync(testDir)) {
            deleteFolderRecursive(testDir);
        }
        // Cria diretório de teste
        fs.mkdirSync(testDir, { recursive: true });
        // Gera os componentes
        generate(project, testDir);
    });

    // Limpa após os testes
    afterAll(() => {
        if (fs.existsSync(testDir)) {
            deleteFolderRecursive(testDir);
        }
    });

    // Testa a existência dos arquivos de documentação
    test('Should create docs folder and README.md', () => {
        const docsFolder = path.join(componentsDir, 'docs');
        const readmePath = path.join(docsFolder, 'README.md');
        
        expect(fs.existsSync(docsFolder)).toBe(true);
        expect(fs.existsSync(readmePath)).toBe(true);
    });

    // Testa o conteúdo da documentação dos componentes
    test('Components should have JSDoc documentation', () => {
        const components = [
            'DataTable.vue',
            'Card.vue',
            'GenericTextInput.vue',
            'PButton.vue',
            'TextInput.vue'
        ];

        components.forEach(component => {
            const componentPath = path.join(componentsDir, component);
            expect(fs.existsSync(componentPath)).toBe(true);

            const content = fs.readFileSync(componentPath, 'utf-8');
            // Verifica se tem documentação JSDoc
            expect(content).toContain('/**');
            expect(content).toContain('*/');
            // Verifica se tem descrição
            expect(content).toMatch(/@description/);
        });
    });

    // Testa a documentação específica de cada componente
    describe('Component-specific documentation', () => {
        test('DataTable documentation should include props and events', () => {
            const content = fs.readFileSync(
                path.join(componentsDir, 'DataTable.vue'),
                'utf-8'
            );
            expect(content).toMatch(/@prop.*items/);
            expect(content).toMatch(/@prop.*headers/);
            expect(content).toMatch(/@emits.*editar/);
            expect(content).toMatch(/@emits.*excluir/);
        });

        test('GenericTextInput documentation should include props and events', () => {
            const content = fs.readFileSync(
                path.join(componentsDir, 'GenericTextInput.vue'),
                'utf-8'
            );
            expect(content).toMatch(/@prop.*type/);
            expect(content).toMatch(/@prop.*placeholder/);
            expect(content).toMatch(/@prop.*variant/);
            expect(content).toMatch(/@emits.*keyupEnter/);
        });

        test('Card documentation should include slot information', () => {
            const content = fs.readFileSync(
                path.join(componentsDir, 'Card.vue'),
                'utf-8'
            );
            expect(content).toMatch(/@slot.*default/);
        });
    });

    // Testa o conteúdo do README.md principal
    test('README.md should include component documentation', () => {
        const readmePath = path.join(componentsDir, 'docs', 'README.md');
        const content = fs.readFileSync(readmePath, 'utf-8');

        // Verifica seções principais
        expect(content).toContain('# Documentação dos Componentes Vue');
        expect(content).toContain('## DataTable');
        expect(content).toContain('## Card');
        expect(content).toContain('## GenericTextInput');
        expect(content).toContain('## PButton');
        expect(content).toContain('## TextInput');

        // Verifica exemplos de código
        expect(content).toContain('```vue');
        expect(content).toContain('### Props');
        expect(content).toContain('### Eventos');
        expect(content).toContain('### Exemplo de Uso');
    });
});