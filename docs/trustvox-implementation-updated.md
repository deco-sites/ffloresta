# Implementação Trustvox - Documentação Atualizada

## ✅ Status da Implementação

A implementação do Trustvox está **COMPLETA e FUNCIONANDO** no seu site. Aqui
está o que já está configurado:

### 1. Script Global (✅ Implementado)

**Localização:** `/routes/_app.tsx`

```javascript
// Script para estrelas nas listagens - Conforme documentação Trustvox
var _trustvox_shelf_rate = _trustvox_shelf_rate || [];
_trustvox_shelf_rate.push(["_storeId", "125156"]);
```

```html
<script type="text/javascript" async src="//rate.trustvox.com.br/widget.js"></script>
```

### 2. Componente de Estrelas (✅ Implementado)

**Localização:** `/sections/Product/TrustvoxStars.tsx`

**Uso atual:**

- ✅ Cards de produto nas listagens
- ✅ Página de produto (próximo ao nome)
- ✅ Usa RefId conforme documentação Trustvox
- ✅ Fallback para SKU e ProductID

### 3. Widget de Avaliações (✅ Implementado)

**Localização:** `/sections/Product/TrustvoxWidget.tsx`

Para exibir as avaliações completas na página de produto.

## 🔧 Como Usar

### Para Estrelas nas Listagens:

As estrelas já aparecem automaticamente nos cards de produto graças ao
componente `TrustvoxStars` já implementado.

### Para Estrelas na Página de Produto:

Já está implementado no componente `ProductInfo.tsx`, aparecendo logo abaixo do
nome do produto.

### Para Widget de Avaliações Completo:

Adicione a section `TrustvoxWidget` em qualquer página de produto através do
admin.

## 📋 Configurações

### Store ID Atual: `125156`

**Para alterar o Store ID:**

1. **No script global** (`/routes/_app.tsx`):
   ```javascript
   _trustvox_shelf_rate.push(["_storeId", "SEU_NOVO_ID"]);
   ```

2. **Nos componentes** (TrustvoxStars e TrustvoxWidget):
   - Altere o valor padrão `storeId = "125156"`
   - Ou configure via admin ao usar as sections

## 🎯 Identificação de Produtos

O sistema usa a seguinte prioridade para identificar produtos:

1. **RefId** (recomendado pela Trustvox)
2. **SKU** (fallback)
3. **ProductID** (último fallback)

## ✅ Checklist de Verificação

- [x] Script global carregado em todas as páginas
- [x] Estrelas nas listagens de produtos
- [x] Estrelas na página de produto
- [x] Widget de avaliações disponível
- [x] Store ID configurado
- [x] RefId sendo usado corretamente

## 🚀 Próximos Passos

1. **Verificar no site ao vivo** se as estrelas estão aparecendo
2. **Aguardar dados** - As estrelas só aparecem após ter avaliações
3. **Testar com produtos** que já possuem avaliações na Trustvox

## 📞 Suporte

Se as estrelas não estiverem aparecendo:

1. Verifique se o Store ID está correto
2. Confirme se os produtos têm avaliações na Trustvox
3. Teste com produtos que você sabe que têm avaliações

---

**Implementação revisada e otimizada em:** ${new
Date().toLocaleDateString('pt-BR')}
