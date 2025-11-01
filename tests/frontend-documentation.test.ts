import { afterAll, beforeAll, expect, test, describe } from "vitest";
import { generate } from "../src/frontend/vue-vite/generate.js";
import { deleteFolderRecursive } from "./aux_frontend_tests/deletionFrontend.js";
import path from 'path';
import fs from 'fs';
import { ClassAbstraction, PackageAbstraction, PrimitiveTypeAbstraction, ProjectAbstraction, TypeScriptAttribute, vueModularArchProjectSettings } from "seon-lib-implementation";

describe('Frontend Documentation Generation', () => {
    const componentsPath = path.join(__dirname, 'frontend', 'src', 'components');
    const docsPath = path.join(componentsPath, 'docs');

    // Projeto de teste
    const project = new ProjectAbstraction('DocTest', 
        "Teste de documentação dos componentes", 
        vueModularArchProjectSettings, 
        [
            new PackageAbstraction('Usuario', [
                new ClassAbstraction('Usuario', [], 
                    [
                        new TypeScriptAttribute('nome', new PrimitiveTypeAbstraction('string')), 
                        new TypeScriptAttribute('idade', new PrimitiveTypeAbstraction('integer')),
                        new TypeScriptAttribute('ativo', new PrimitiveTypeAbstraction('boolean')), 
                    ]),
                ], 
            )
        ]
    );

    // Setup e cleanup
    beforeAll(() => {
        generate(project, __dirname);
    });

    afterAll(() => {
        deleteFolderRecursive(path.join(__dirname, 'frontend'));
    });

    // Testes de estrutura
    test('Should create components documentation folder', () => {
        expect(fs.existsSync(docsPath)).toBe(true);
        expect(fs.existsSync(path.join(docsPath, 'README.md'))).toBe(true);
    });

    // Testes de conteúdo dos componentes
    describe('Component Documentation', () => {
        const components = [
            { file: 'DataTable.vue', props: ['items', 'headers'], events: ['editar', 'excluir'] },
            { file: 'Card.vue', props: [], events: [] },
            { file: 'GenericTextInput.vue', props: ['type', 'placeholder', 'variant'], events: ['keyupEnter'] },
            { file: 'PButton.vue', props: ['variant'], events: [] },
            { file: 'TextInput.vue', props: ['type', 'placeholder', 'rules'], events: ['validationUpdate', 'keyupEnter'] }
        ];

        test.each(components)('$file should have JSDoc documentation', ({ file }) => {
            const content = fs.readFileSync(path.join(componentsPath, file), 'utf-8');
            expect(content).toContain('/**');
            expect(content).toContain('*/');
            expect(content).toMatch(/@description/);
        });

        test.each(components)('$file should document its props and events', ({ file, props, events }) => {
            const content = fs.readFileSync(path.join(componentsPath, file), 'utf-8');
            
            // Verifica documentação das props
            props.forEach(prop => {
                expect(content).toMatch(new RegExp(`@prop.*${prop}`));
            });

            // Verifica documentação dos eventos
            events.forEach(event => {
                expect(content).toMatch(new RegExp(`@emits.*${event}`));
            });
        });
    });

    // Testes do README.md
    describe('README Documentation', () => {
        let readmeContent: string;

        beforeAll(() => {
            readmeContent = fs.readFileSync(path.join(docsPath, 'README.md'), 'utf-8');
        });

        test('Should have main sections', () => {
            expect(readmeContent).toContain('# Documentação dos Componentes Vue');
            expect(readmeContent).toContain('## DataTable');
            expect(readmeContent).toContain('## Card');
            expect(readmeContent).toContain('## GenericTextInput');
            expect(readmeContent).toContain('## PButton');
            expect(readmeContent).toContain('## TextInput');
        });

        test('Should have prop documentation', () => {
            expect(readmeContent).toContain('### Props');
            expect(readmeContent).toMatch(/items.*Array/);
            expect(readmeContent).toMatch(/variant.*'default'.*'error'/);
            expect(readmeContent).toMatch(/type.*'text'.*'password'/);
        });

        test('Should have event documentation', () => {
            expect(readmeContent).toContain('### Eventos');
            expect(readmeContent).toMatch(/editar.*item selecionado/);
            expect(readmeContent).toMatch(/validationUpdate.*validação/);
            expect(readmeContent).toMatch(/keyupEnter.*Enter/);
        });

        test('Should have example usage', () => {
            expect(readmeContent).toContain('### Exemplo de Uso');
            expect(readmeContent).toContain('```vue');
            // Verifica se tem pelo menos um exemplo completo
            expect(readmeContent).toMatch(/```vue[\s\S]*?```/);
            // Verifica exemplos específicos de componentes
            expect(readmeContent).toContain('<DataTable');
            expect(readmeContent).toContain('<Card>');
            expect(readmeContent).toContain('<GenericTextInput');
            expect(readmeContent).toContain('<PButton');
            expect(readmeContent).toContain('<TextInput');
        });
    });
});