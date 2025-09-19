# Implementação do Widget Clicável da Trustvox

## ✅ Implementação Concluída

Foi criada uma nova seção `TrustvoxClickableRating` que implementa exatamente o script HTML/CSS fornecido pelo suporte da Trustvox.

### 📁 Arquivo Criado
**Localização:** `/sections/Product/TrustvoxClickableRating.tsx`

### 🔧 O que foi implementado

1. **HTML exato conforme fornecido:**
   ```html
   <a class="trustvox-fluid-jump trustvox-widget-rating" href="#trustvox-reviews" title="Pergunte e veja opiniões de quem já comprou">
       <div class="trustvox-shelf-container" data-trustvox-product-code-js="[ID_DO_PRODUTO]" data-trustvox-should-skip-filter="true" data-trustvox-display-rate-schema="false"></div>
       <span class="rating-click-here">Clique e veja!</span>
   </a>
   ```

2. **CSS exato conforme fornecido:**
   ```css
   .trustvox-widget-rating .ts-shelf-container,
   .trustvox-widget-rating .trustvox-shelf-container {display: inline-block;}
   .trustvox-widget-rating span.rating-click-here {
     top: -3px;
     display: inline-block;
     position: relative;
     color: #DAA81D;
   }
   .trustvox-widget-rating:hover span.rating-click-here {text-decoration: underline;}
   ```

3. **Script conforme item 2.2 da documentação Trustvox:**
   - Inicializa `_trustvox_shelf_rate`
   - Configura o `storeId`
   - Carrega o script `//rate.trustvox.com.br/widget.js`

### 📍 Onde está sendo usado

A seção foi adicionada à **página de produto** (`/.deco/blocks/pages-productpage-ce4850591828.json`) logo após o `ProductDetails`, antes das avaliações completas.

### 🎯 Funcionalidades

- **ID do produto automático:** Usa o ID correto do produto da VTEX
- **Link clicável:** Quando clicado, rola para a seção de avaliações (`#trustvox-reviews`)
- **Estrelas dinâmicas:** Mostra as estrelas de avaliação do produto específico
- **Texto customizável:** O texto "Clique e veja!" pode ser alterado via admin

### 🧪 Como testar

1. **Acesse qualquer página de produto** do seu site
2. **Procure pelo widget clicável** logo abaixo dos detalhes do produto
3. **Verifique se as estrelas aparecem** (pode levar alguns segundos para carregar)
4. **Clique no link** para verificar se rola para as avaliações
5. **Abra o console do navegador** (F12) para ver os logs de debug

### 🔍 Debug

Para verificar se está funcionando:

1. **Console do navegador:**
   ```javascript
   console.log(window._trustvox_shelf_rate); // Deve mostrar o array com storeId
   ```

2. **Elementos no DOM:**
   - Procure por elementos com classe `trustvox-shelf-container`
   - Verifique se o atributo `data-trustvox-product-code-js` tem o ID correto do produto

3. **Scripts carregados:**
   - Verifique se há um script com src `rate.trustvox.com.br/widget.js`

### ⚙️ Configurações

No admin da deco, você pode configurar:

- **Store ID:** ID da sua loja na Trustvox (padrão: 125156)
- **Texto do link:** Texto que aparece ao lado das estrelas (padrão: "Clique e veja!")
- **Classe CSS:** Classes CSS customizadas para estilização
- **ID do produto:** Caso queira forçar um ID específico

### 🔗 Integração com outras seções

Esta seção funciona em conjunto com:

- **TrustvoxReviews:** Seção completa de avaliações (onde o link aponta)
- **TrustvoxStars:** Estrelas nos cards de produto
- **Script global:** Configurado no `_app.tsx`

### 📋 Próximos passos

1. **Teste em produtos com avaliações** para confirmar que as estrelas aparecem
2. **Ajuste o estilo** se necessário via classes CSS customizadas
3. **Monitore o console** para verificar se não há erros
4. **Entre em contato com o suporte da Trustvox** se as estrelas não aparecerem após alguns minutos

### 🆘 Solução de problemas

**Se as estrelas não aparecem:**
1. Verifique se o produto tem avaliações na Trustvox
2. Confirme se o ID do produto está correto no console
3. Verifique se o script `widget.js` foi carregado
4. Aguarde alguns minutos (a Trustvox pode ter cache)

**Se o link não funciona:**
1. Verifique se existe uma seção com ID `trustvox-reviews` na página
2. Ajuste o href se necessário

A implementação está **completa e seguindo exatamente** as especificações fornecidas pelo suporte da Trustvox!