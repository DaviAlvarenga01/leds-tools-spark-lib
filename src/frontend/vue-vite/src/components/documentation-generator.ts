import { expandToString } from "../../../../util/template-string.js";

/**
 * Gera a documentação para um componente Vue
 * @param componentName Nome do componente
 * @param description Descrição do componente
 * @param props Lista de props do componente
 * @param events Lista de eventos do componente
 * @param example Exemplo de uso do componente
 */
export function generateComponentDoc(
    componentName: string,
    description: string,
    props: { name: string; type: string; description: string; optional?: boolean }[] = [],
    events: { name: string; description: string; params?: string }[] = [],
    example?: string
): string {
    return expandToString`
/**
 * @component ${componentName}
 * @description ${description}
 *
 * ${props.map(prop => `@prop {${prop.type}}${prop.optional ? '?' : ''} ${prop.name} - ${prop.description}`).join('\n * ')}
 * ${events.map(event => `@emits {${event.params || 'void'}} ${event.name} - ${event.description}`).join('\n * ')}
 * 
 * @example
 * ${example || `<${componentName}>\n *   <!-- Example usage here -->\n * </${componentName}>`}
 */`;
}

/**
 * Documentação padrão para os componentes principais
 */
export const componentDocs = {
    DataTable: {
        description: 'Componente de tabela de dados com funcionalidades de seleção, edição e exclusão',
        props: [
            {
                name: 'items',
                type: 'Array<DataTableItem>',
                description: 'Array de itens a serem exibidos na tabela'
            },
            {
                name: 'headers',
                type: 'Array<DataTableHeader>',
                description: 'Configuração das colunas da tabela',
                optional: true
            }
        ],
        events: [
            {
                name: 'editar',
                description: 'Emitido quando o botão editar é clicado',
                params: '(item: DataTableItem) => void'
            },
            {
                name: 'excluir',
                description: 'Emitido quando o botão excluir é clicado',
                params: '(items: DataTableItem[]) => void'
            }
        ],
        example: `<DataTable
 *   :items="[{id: 1, nome: 'Item 1'}, {id: 2, nome: 'Item 2'}]"
 *   :headers="[{title: 'ID', value: 'id'}, {title: 'Nome', value: 'nome'}]"
 *   @editar="handleEdit"
 *   @excluir="handleDelete"
 * />`
    },
    
    GenericTextInput: {
        description: 'Componente de entrada de texto com suporte a validação e diferentes variantes',
        props: [
            {
                name: 'type',
                type: "'text' | 'password'",
                description: 'Tipo do input',
                optional: true
            },
            {
                name: 'placeholder',
                type: 'string',
                description: 'Texto de placeholder',
                optional: true
            },
            {
                name: 'variant',
                type: "'error' | 'default'",
                description: 'Variante visual do input',
                optional: true
            }
        ],
        events: [
            {
                name: 'keyupEnter',
                description: 'Emitido quando a tecla Enter é pressionada'
            }
        ],
        example: `<GenericTextInput
 *   v-model="value"
 *   type="text"
 *   placeholder="Digite aqui..."
 *   @keyup-enter="handleEnter"
 * />`
    },
    
    Card: {
        description: 'Componente de card com estilo padrão e slot para conteúdo',
        example: `<Card>
 *   <h2>Título do Card</h2>
 *   <p>Conteúdo do card aqui</p>
 * </Card>`
    },
    
    PButton: {
        description: 'Componente de botão com diferentes variantes e estados',
        props: [
            {
                name: 'variant',
                type: "'default' | 'error'",
                description: 'Variante visual do botão',
                optional: true
            }
        ],
        example: `<PButton
 *   variant="default"
 *   @click="handleClick"
 * >
 *   Clique aqui
 * </PButton>`
    },
    
    TextInput: {
        description: 'Componente de entrada de texto com validação e mensagens de erro',
        props: [
            {
                name: 'type',
                type: "'text' | 'password'",
                description: 'Tipo do input',
                optional: true
            },
            {
                name: 'placeholder',
                type: 'string',
                description: 'Texto de placeholder',
                optional: true
            },
            {
                name: 'rules',
                type: 'ValidationResultFunction[]',
                description: 'Array de funções de validação',
                optional: true
            }
        ],
        events: [
            {
                name: 'validationUpdate',
                description: 'Emitido quando o estado de validação muda',
                params: '(valid: boolean) => void'
            },
            {
                name: 'keyupEnter',
                description: 'Emitido quando a tecla Enter é pressionada'
            }
        ],
        example: `<TextInput
 *   v-model="value"
 *   :rules="[required, minLength(3)]"
 *   @validation-update="handleValidation"
 * >
 *   Nome do usuário
 * </TextInput>`
    }
};