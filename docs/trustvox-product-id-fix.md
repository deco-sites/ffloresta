# Correção do ID do Produto para Trustvox

## Problema Identificado

O script da Trustvox estava enviando o **RefId** (57597) em vez do **ID do produto da VTEX** (8472) para a Trustvox. Isso causava problemas na identificação correta dos produtos e suas avaliações.

## Exemplo do Produto Analisado

**URL:** https://sites-ffloresta--c2n493.decocdn.com/serra-tico-tico-gst-75-710w-220v-1-lamina-de-serra-bosch/p

**Estrutura dos IDs:**
- **RefId**: "57597" (era usado anteriormente)
- **productID**: "1700" (ID do SKU)
- **inProductGroupWithID**: "8472" (ID do produto na VTEX - **CORRETO para Trustvox**)

## Alterações Realizadas

### 1. TrustvoxReviews.tsx
**Arquivo:** `/sections/Product/TrustvoxReviews.tsx`

**Antes:**
```typescript
const refId = finalProduct?.additionalProperty?.find(prop => prop.name === "RefId")?.value;
const finalProductId = productId || refId || finalProduct?.sku || finalProduct?.productID || "";
```

**Depois:**
```typescript
const refId = finalProduct?.additionalProperty?.find(prop => prop.name === "RefId")?.value;
const vtexProductId = finalProduct?.inProductGroupWithID; // ID do produto na VTEX
const finalProductId = productId || vtexProductId || refId || finalProduct?.sku || finalProduct?.productID || "";
```

### 2. TrustvoxWidget.tsx
**Arquivo:** `/sections/Product/TrustvoxWidget.tsx`

**Antes:**
```typescript
const refId = product?.additionalProperty?.find(prop => prop.name === "RefId")?.value;
const productId = refId || product?.sku || product?.productID || "";
```

**Depois:**
```typescript
const refId = product?.additionalProperty?.find(prop => prop.name === "RefId")?.value;
const vtexProductId = product?.inProductGroupWithID; // ID do produto na VTEX
const productId = vtexProductId || refId || product?.sku || product?.productID || "";
```

### 3. TrustvoxStars.tsx
**Arquivo:** `/sections/Product/TrustvoxStars.tsx`

**Antes:**
```typescript
const refId = product?.additionalProperty?.find(prop => prop.name === "RefId")?.value;
const finalProductId = productId || refId || product?.sku || product?.productID || "";
```

**Depois:**
```typescript
const refId = product?.additionalProperty?.find(prop => prop.name === "RefId")?.value;
const vtexProductId = product?.inProductGroupWithID; // ID do produto na VTEX
const finalProductId = productId || vtexProductId || refId || product?.sku || product?.productID || "";
```

### 4. TrustvoxRatingWidget.tsx
**Arquivo:** `/sections/Product/TrustvoxRatingWidget.tsx`

**Antes:**
```typescript
const refId = finalProduct?.additionalProperty?.find(prop => prop.name === "RefId")?.value;
const finalProductId = productId || refId || finalProduct?.sku || finalProduct?.productID || "";
```

**Depois:**
```typescript
const refId = finalProduct?.additionalProperty?.find(prop => prop.name === "RefId")?.value;
const vtexProductId = finalProduct?.inProductGroupWithID; // ID do produto na VTEX
const finalProductId = productId || vtexProductId || refId || finalProduct?.sku || finalProduct?.productID || "";
```

## Nova Ordem de Prioridade dos IDs

1. **productId** (manual, se fornecido)
2. **vtexProductId** (inProductGroupWithID - **NOVO e PRIORITÁRIO**)
3. **refId** (RefId - fallback)
4. **sku** (SKU do produto)
5. **productID** (ID do SKU)

## Resultado

Agora o script da Trustvox está enviando o ID correto do produto da VTEX (8472) em vez do RefId (57597), garantindo que:

1. ✅ As avaliações sejam associadas corretamente aos produtos
2. ✅ O widget de avaliações funcione adequadamente
3. ✅ As estrelas apareçam nos produtos corretos
4. ✅ A integração com a Trustvox seja mais robusta

## Logs de Debug

Os logs agora mostram todos os IDs disponíveis para facilitar o debug:

```javascript
console.log('TrustvoxReviews - IDs disponíveis:', {
  productId,
  refId,
  vtexProductId, // NOVO
  sku: finalProduct?.sku,
  productID: finalProduct?.productID,
  finalProductId,
  productName: finalProduct?.name
});
```

## Teste

Para testar, acesse qualquer página de produto e verifique no console do navegador se o ID correto está sendo enviado para a Trustvox.

**Exemplo de teste:**
https://sites-ffloresta--c2n493.decocdn.com/serra-tico-tico-gst-75-710w-220v-1-lamina-de-serra-bosch/p

O ID enviado agora deve ser **8472** (inProductGroupWithID) em vez de **57597** (RefId).