# Documentação dos Componentes Vue

Este diretório contém a documentação detalhada de todos os componentes Vue gerados pelo Spark.

## DataTable
Um componente de tabela de dados com funcionalidades de seleção, edição e exclusão.

### Props
- `items` (Array<DataTableItem>): Array de itens a serem exibidos na tabela
- `headers` (Array<DataTableHeader>): Configuração opcional das colunas da tabela

### Eventos
- `editar`: Emitido quando o botão editar é clicado com o item selecionado
- `excluir`: Emitido quando o botão excluir é clicado com os itens selecionados

### Exemplo de Uso
```vue
<DataTable 
  :items="[{id: 1, nome: 'Item 1'}, {id: 2, nome: 'Item 2'}]"
  :headers="[{title: 'ID', value: 'id'}, {title: 'Nome', value: 'nome'}]"
  @editar="handleEdit"
  @excluir="handleDelete"
/>
```

## Card
Um componente de container que fornece um estilo consistente com borda, sombra e padding.

### Exemplo de Uso
```vue
<Card>
  <h2>Título do Card</h2>
  <p>Conteúdo do card aqui...</p>
</Card>
```

## GenericTextInput
Componente de entrada de texto com suporte a validação e diferentes variantes.

### Props
- `type` ('text' | 'password'): Tipo do input (opcional)
- `placeholder` (string): Texto de placeholder (opcional)
- `variant` ('error' | 'default'): Variante visual do input (opcional)

### Eventos
- `keyupEnter`: Emitido quando a tecla Enter é pressionada

### Exemplo de Uso
```vue
<GenericTextInput
  v-model="value"
  type="text"
  placeholder="Digite aqui..."
  @keyup-enter="handleEnter"
/>
```

## PButton
Componente de botão com diferentes variantes e estados.

### Props
- `variant` ('default' | 'error'): Variante visual do botão (opcional)

### Exemplo de Uso
```vue
<PButton
  variant="default"
  @click="handleClick"
>
  Clique aqui
</PButton>
```

## TextInput
Componente de entrada de texto com validação e mensagens de erro.

### Props
- `type` ('text' | 'password'): Tipo do input (opcional)
- `placeholder` (string): Texto de placeholder (opcional)
- `rules` (ValidationResultFunction[]): Array de funções de validação (opcional)

### Eventos
- `validationUpdate`: Emitido quando o estado de validação muda
- `keyupEnter`: Emitido quando a tecla Enter é pressionada

### Exemplo de Uso
```vue
<TextInput
  v-model="value"
  :rules="[required, minLength(3)]"
  @validation-update="handleValidation"
>
  Nome do usuário
</TextInput>
```