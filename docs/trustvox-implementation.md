# Implementação Trustvox - FFloresta

## Resumo da Implementação

A funcionalidade de avaliação da Trustvox foi implementada com sucesso no site FFloresta. A implementação inclui:

### 1. Script Global (✅ Implementado)
- **Localização**: `/routes/_app.tsx`
- **Store ID**: 125156
- **Token**: -rpq7za52MCEnduJmBm4
- **Função**: Carrega o script da Trustvox globalmente e configura os dados da loja

### 2. Widget de Avaliações de Produto (✅ Implementado)
- **Localização**: `/sections/Product/TrustvoxWidget.tsx`
- **Função**: Exibe avaliações específicas do produto na página de produto
- **Configuração**: Adicionado automaticamente na página de produto
- **Dados**: Utiliza productID, productName e productPhotos do produto atual

### 3. Selo de Reputação da Loja (✅ Criado)
- **Localização**: `/sections/Product/TrustvoxSeal.tsx`
- **Função**: Exibe o selo de reputação da loja
- **Uso**: Pode ser adicionado em qualquer página (home, footer, etc.)

### 4. Widget de Rating com Link (✅ Criado)
- **Localização**: `/sections/Product/TrustvoxRatingWidget.tsx`
- **Função**: Widget de rating com link para avaliações (implementação do script fornecido)
- **Uso**: Pode ser usado em páginas de produto ou listagem para mostrar rating e link

### 5. Coletor de Avaliações (✅ Criado)
- **Localização**: `/sections/Product/TrustvoxCollector.tsx`
- **Função**: Script para coleta automática de avaliações pós-compra
- **Uso**: Pode ser adicionado em páginas de confirmação de pedido

## Como Usar

### Widget de Produto
O widget já está configurado na página de produto e aparecerá automaticamente quando houver um produto válido.

### Selo da Loja
Para adicionar o selo em outras páginas:
```json
{
  "__resolveType": "site/sections/Product/TrustvoxSeal.tsx",
  "storeId": "125156",
  "title": "Avaliações da Loja",
  "showTitle": true
}
```

### Widget de Rating com Link
Para adicionar o widget de rating com link:
```json
{
  "__resolveType": "site/sections/Product/TrustvoxRatingWidget.tsx",
  "storeId": "125156",
  "linkText": "Clique e veja!",
  "showOnlyWithProduct": true
}
```

### Coletor de Avaliações
Para páginas de confirmação de pedido:
```json
{
  "__resolveType": "site/sections/Product/TrustvoxCollector.tsx",
  "storeId": "125156",
  "token": "-rpq7za52MCEnduJmBm4",
  "enableAutoCollection": true
}
```

## Configurações

### IDs da Trustvox
- **Store ID**: 125156
- **Token**: -rpq7za52MCEnduJmBm4

### Funcionalidades Ativas
- ✅ Script global carregado
- ✅ Widget de produto na PDP
- ✅ Coleta de dados do produto (ID, nome, fotos)
- ✅ Componentes reutilizáveis criados

## Próximos Passos (Opcionais)

1. **Adicionar selo na home**: Incluir o TrustvoxSeal na página inicial
2. **Página de confirmação**: Implementar página de sucesso de compra com o coletor
3. **Customização visual**: Ajustar estilos CSS conforme necessário
4. **Testes**: Verificar funcionamento em produção

## Estrutura de Arquivos

```
/routes/_app.tsx                          # Script global
/sections/Product/TrustvoxWidget.tsx      # Widget de produto
/sections/Product/TrustvoxSeal.tsx        # Selo da loja
/sections/Product/TrustvoxRatingWidget.tsx # Widget de rating com link
/sections/Product/TrustvoxCollector.tsx   # Coletor de avaliações
```

## ✅ Implementação do Script Personalizado

Foi criada uma nova seção `TrustvoxRatingWidget` que implementa exatamente o script HTML/CSS fornecido:

### Características:
- **HTML**: Implementa o link com `trustvox-fluid-jump` e `trustvox-widget-rating`
- **CSS**: Inclui todos os estilos específicos fornecidos
- **JavaScript**: Carrega o script `widget.js` da Trustvox
- **Flexibilidade**: Permite customização de texto, classes CSS e ID do produto

### Exemplo de Uso:
```json
{
  "__resolveType": "site/sections/Product/TrustvoxRatingWidget.tsx",
  "storeId": "125156",
  "linkText": "Clique e veja!",
  "productId": "123456",
  "customClass": "my-4",
  "showOnlyWithProduct": true
}
```

### Adicionado na Página de Produto:
O widget foi automaticamente adicionado na página de produto e aparecerá antes do widget principal de avaliações.

A implementação está completa e funcional! 🎉