# Correção do Widget Trustvox - Avaliações de Produto

## Problema Identificado

O widget de avaliações estava mostrando as avaliações gerais da loja ao invés
das avaliações específicas do produto. Isso acontecia devido a conflitos entre o
script global (para estrelas nas listagens) e o script específico do produto.

## Correções Implementadas

### 1. Script do Produto Melhorado

**Arquivo:** `/sections/Product/TrustvoxReviews.tsx`

**Principais mudanças:**

- Adicionado delay de 200ms para garantir que a página carregou completamente
- Limpeza completa da configuração anterior (`delete window._trustvox`)
- Validação do ID do produto antes de configurar
- Logs detalhados para debug
- Remoção de scripts anteriores para evitar conflitos

### 2. Separação dos Scripts

**Arquivo:** `/routes/_app.tsx`

**Mudanças:**

- Adicionado comentário claro que o script global é APENAS para estrelas nas
  listagens
- Adicionada flag `window.trustvoxShelfOnly = true` para evitar conflitos

### 3. Validação de IDs

**Melhorias na detecção do ID do produto:**

- Prioridade: `productId` manual → `RefId` → `sku` → `productID`
- Validação se o ID tem pelo menos 3 caracteres
- Logs detalhados mostrando todos os IDs disponíveis

## Como Testar

### 1. Verificar no Console do Navegador

Ao acessar uma página de produto, você deve ver logs como:

```
TrustvoxReviews - IDs disponíveis: {productId: null, refId: "12345", sku: "ABC123", ...}
Trustvox: Configurando para produto específico: 12345
Script Trustvox carregado. Configuração final: [["_storeId", "125156"], ["_productId", "12345"], ...]
```

### 2. Verificar o Widget

- O widget deve carregar com "Carregando avaliações..." inicialmente
- Depois deve mostrar as avaliações específicas do produto
- Se não houver avaliações para o produto, deve mostrar uma mensagem apropriada

### 3. Verificar Diferentes Produtos

Teste com produtos que você sabe que têm avaliações na Trustvox para confirmar
que está funcionando.

## Estrutura dos IDs de Produto

A Trustvox recomenda usar o **RefId** como identificador principal. A ordem de
prioridade é:

1. **RefId** (recomendado pela Trustvox)
2. **SKU**
3. **ProductID**

## Troubleshooting

### Se ainda mostrar avaliações da loja:

1. **Verificar o ID do produto:**
   - Abrir o console do navegador
   - Procurar pelos logs "TrustvoxReviews - IDs disponíveis"
   - Confirmar se há um ID válido sendo usado

2. **Verificar se o produto tem avaliações:**
   - Nem todos os produtos têm avaliações na Trustvox
   - Teste com produtos que você sabe que têm avaliações

3. **Limpar cache:**
   - Fazer hard refresh (Ctrl+F5)
   - Limpar cache do navegador

### Se o widget não carregar:

1. **Verificar erros no console**
2. **Confirmar se o storeId está correto:** `125156`
3. **Verificar se não há bloqueadores de script**

## Arquivos Modificados

- `/sections/Product/TrustvoxReviews.tsx` - Widget principal de avaliações
- `/sections/Product/TrustvoxWidget.tsx` - Widget alternativo
- `/routes/_app.tsx` - Script global para estrelas nas listagens
- `/docs/trustvox-fix-product-reviews.md` - Esta documentação

## Configuração Atual

- **Store ID:** 125156
- **Script de Produto:** `//static.trustvox.com.br/sincero/sincero.js`
- **Script de Estrelas:** `//rate.trustvox.com.br/widget.js`
- **Widget ID:** `_trustvox_widget`

A implementação agora segue exatamente a documentação oficial da Trustvox e deve
mostrar as avaliações corretas para cada produto específico.
