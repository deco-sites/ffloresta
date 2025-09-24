# Implementação de Vídeos em Produtos - SearchResult

Este documento explica como implementar e usar vídeos nos produtos exibidos no componente SearchResult, seguindo o mesmo padrão do componente Carousel.

## 🎯 Funcionalidades Implementadas

### ✅ Suporte a Vídeos no ProductCard
- Vídeo principal (frontVideo) - exibido por padrão
- Vídeo de hover (backVideo) - exibido ao passar o mouse
- Fallback para imagens quando vídeos não estão disponíveis
- Autoplay, muted, loop e playsInline automáticos
- Responsivo para mobile e desktop

### ✅ Compatibilidade
- Mantém total compatibilidade com produtos que usam apenas imagens
- Suporte a múltiplas convenções de nomenclatura
- Validação de conteúdo com mensagens de erro amigáveis

## 🔧 Como Configurar Vídeos nos Produtos

### Método 1: Via Propriedades Adicionais (Recomendado)

Adicione vídeos ao produto através do campo `additionalProperty`:

```json
{
  "@type": "Product",
  "name": "Produto Exemplo",
  "image": [...],
  "additionalProperty": [
    {
      "@type": "PropertyValue",
      "name": "frontVideo",
      "value": "https://exemplo.com/video-frontal.mp4"
    },
    {
      "@type": "PropertyValue", 
      "name": "backVideo",
      "value": "https://exemplo.com/video-hover.mp4"
    }
  ]
}
```

### Método 2: Via Admin da deco.cx

1. Acesse o produto no admin
2. Vá para "Propriedades Adicionais"
3. Adicione uma nova propriedade:
   - **Nome**: `frontVideo` (para vídeo principal)
   - **Valor**: URL do vídeo MP4
4. Para vídeo de hover:
   - **Nome**: `backVideo`
   - **Valor**: URL do vídeo MP4

### Nomes de Propriedades Suportados

O sistema reconhece automaticamente estas convenções:

**Para vídeo principal:**
- `frontVideo`
- `video_front`
- `videofrontal`
- `video`
- `mainvideo`
- `primaryvideo`

**Para vídeo de hover:**
- `backVideo`
- `video_back`
- `videotraseiro`
- `hoverVideo`
- `secondaryVideo`

## 📁 Formatos de Vídeo Suportados

- **MP4** (recomendado) - melhor compatibilidade
- **WebM** - boa compressão
- **OGV** - fallback para navegadores antigos

## 🎨 Comportamento Visual

### Desktop
- Vídeo principal reproduz automaticamente
- Vídeo de hover aparece ao passar o mouse
- Transição suave entre vídeos/imagens

### Mobile
- Apenas vídeo principal é reproduzido
- Vídeo de hover não é exibido (economia de dados)
- Touch otimizado

## 🔍 Exemplo de Uso

### Produto com Vídeo e Imagem de Fallback
```json
{
  "@type": "Product",
  "name": "Tênis Esportivo",
  "image": [
    {
      "@type": "ImageObject",
      "url": "https://exemplo.com/tenis-frente.jpg",
      "alternateName": "Tênis Esportivo - Frente"
    },
    {
      "@type": "ImageObject", 
      "url": "https://exemplo.com/tenis-lado.jpg",
      "alternateName": "Tênis Esportivo - Lado"
    }
  ],
  "additionalProperty": [
    {
      "@type": "PropertyValue",
      "name": "frontVideo",
      "value": "https://exemplo.com/tenis-360.mp4"
    }
  ]
}
```

## 🚀 Testando a Implementação

1. Use a seção `ProductVideoExample` para testar
2. Configure um produto com vídeos
3. Verifique o comportamento no SearchResult
4. Teste em diferentes dispositivos

## 🛠️ Arquivos Modificados

- `/components/product/ProductCard/ProductCardImage.tsx` - Lógica de vídeos
- `/components/product/ProductCard/ProductCard.tsx` - Extração de vídeos
- `/sections/Product/ProductVideoExample.tsx` - Seção de exemplo

## 📋 Checklist de Implementação

- [x] Suporte a vídeos no ProductCardImage
- [x] Extração de vídeos das propriedades do produto
- [x] Fallback para imagens quando vídeos não disponíveis
- [x] Comportamento responsivo
- [x] Autoplay com muted
- [x] Transições suaves
- [x] Documentação completa
- [x] Seção de exemplo

## 🔧 Troubleshooting

### Vídeo não aparece
1. Verifique se a URL do vídeo está acessível
2. Confirme o nome da propriedade (`frontVideo` ou `backVideo`)
3. Verifique se o formato é MP4

### Performance
1. Use vídeos otimizados (máx 2MB)
2. Configure `preload="metadata"` para vídeos de hover
3. Considere usar CDN para vídeos

### Compatibilidade
1. Sempre forneça imagem de fallback
2. Teste em diferentes navegadores
3. Verifique comportamento em conexões lentas

## 📞 Suporte

Para dúvidas ou problemas, consulte:
- Documentação da deco.cx
- Exemplos na seção ProductVideoExample
- Logs do navegador para debugging