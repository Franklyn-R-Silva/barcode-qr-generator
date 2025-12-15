# 📚 Guia de Uso - Gerador de QR Code & Códigos de Barras

## 🚀 Início Rápido

### Gerando um QR Code

1. **Abra a aplicação** em http://localhost:3000
2. Por padrão, o modo **QR Code** já está selecionado
3. Digite seu texto, URL ou dados no campo "Conteúdo"
4. O QR Code é gerado em tempo real!

### Gerando um Código de Barras

1. Clique no botão **"Código de Barras"** no topo dos controles
2. Escolha o formato desejado nas categorias disponíveis
3. Um valor de exemplo será preenchido automaticamente
4. Personalize altura, largura e outras opções

---

## 🎨 Personalização de QR Code

### Templates Prontos
Use os templates pré-definidos para aplicar estilos rapidamente:
- **Padrão**: Preto e branco clássico
- **WhatsApp**: Verde característico do app
- **Dark**: Design para modo escuro
- **Azul Tech**: Estilo moderno e profissional

### Aparência

#### Tamanho
- Ajuste de 150px a 450px
- Recomendado: 280px para uso geral

#### Módulos
- **Quadrados**: Estilo tradicional e confiável
- **Pontos**: Design moderno e elegante

#### Olhos (cantos do QR Code)
- **Quadrados**: Clássico e formal
- **Redondos**: Moderno e friendly

#### Margem de Erro
Escolha o nível adequado ao seu uso:
- **Baixa (L)**: 7% de recuperação - Use para textos longos
- **Média (M)**: 15% de recuperação - Equilíbrio geral
- **Alta (Q)**: 25% de recuperação - Boa para logos pequenos
- **Máxima (H)**: 30% de recuperação - **Recomendado para logos**

### Cores
- **Frente**: Cor do código (padrão: preto)
- **Fundo**: Cor de fundo (padrão: branco)
- 💡 **Dica**: Mantenha bom contraste para leitura confiável

### Logo (Opcional)
1. Clique em "Carregar Logo"
2. Selecione uma imagem (PNG, JPG, etc.)
3. Ajuste a opacidade (0 = transparente, 1 = opaco)
4. Marque "Remover fundo atrás do logo" para melhor legibilidade

---

## 📊 Códigos de Barras

### Code Family

#### Code 39
- **Uso**: Industrial, logística
- **Caracteres**: A-Z, 0-9, alguns símbolos
- **Exemplo**: `EXAMPLE123`

#### Code 93
- **Uso**: Mais compacto que Code 39
- **Caracteres**: Similar ao Code 39
- **Exemplo**: `EXAMPLE123`

#### Code 128
- **Uso**: Mais versátil e denso
- **Variantes**:
  - **Auto**: Escolhe automaticamente a melhor opção
  - **A**: Maiúsculas e caracteres de controle
  - **B**: Maiúsculas, minúsculas e símbolos
  - **C**: Apenas números (mais compacto)
- **Exemplo**: `Example 1234`

### GS1 & ITF

#### GS1-128
- **Uso**: Logística, rastreamento de produtos
- **Formato**: 20 dígitos
- **Exemplo**: `00123456789012345675`

#### ITF (Interleaved 2 of 5)
- **Uso**: Embalagens, distribuição
- **Formato**: Número par de dígitos
- **Exemplo**: `1234567890`

#### ITF-14
- **Uso**: Embalagens de transporte
- **Formato**: 14 dígitos
- **Exemplo**: `12345678901231`

### EAN & ISBN

#### EAN-13
- **Uso**: Produtos de varejo (padrão europeu)
- **Formato**: 13 dígitos com checksum
- **Exemplo**: `5901234123457`

#### EAN-8
- **Uso**: Produtos pequenos
- **Formato**: 8 dígitos
- **Exemplo**: `96385074`

#### EAN-5 / EAN-2
- **Uso**: Suplementos (preço, edição)
- **Formato**: 5 ou 2 dígitos
- **Exemplos**: `12345` ou `12`

#### ISBN
- **Uso**: Livros (International Standard Book Number)
- **Formato**: 13 dígitos (formato EAN-13)
- **Exemplo**: `9781234567897`

### UPC

#### UPC-A
- **Uso**: Produtos de varejo (padrão americano)
- **Formato**: 12 dígitos
- **Exemplo**: `123456789999`

#### UPC-E
- **Uso**: Versão compacta do UPC-A
- **Formato**: 8 dígitos
- **Exemplo**: `01234565`

### Outros Formatos

#### MSI (e variantes)
- **Uso**: Inventário e armazéns
- **Variantes**: MSI, MSI10, MSI11, MSI1010, MSI1110
- **Exemplo**: `1234567890`

#### Pharmacode
- **Uso**: Indústria farmacêutica
- **Formato**: Números de 3 a 6 dígitos
- **Exemplo**: `1234`

#### Codabar
- **Uso**: Bibliotecas, bancos de sangue, logística
- **Formato**: Começa e termina com A, B, C ou D
- **Exemplo**: `A1234567890B`

---

## ⚙️ Controles Avançados para Códigos de Barras

### Altura
- Ajuste de 50px a 200px
- **Recomendado**: 100px para leitura ótima

### Largura da Barra
- Ajuste de 1px a 5px
- **Fino (1-2px)**: Para códigos densos
- **Médio (2-3px)**: Uso geral
- **Grosso (3-5px)**: Maior legibilidade

### Tamanho da Fonte
- Ajuste de 10px a 40px
- Controla o tamanho do número abaixo do código

### Exibir Valor
- Marque para mostrar o número abaixo do código
- Útil para conferência manual

---

## 💾 Exportação

### Download
1. Clique no botão **"Baixar PNG"**
2. A imagem será salva com nome único (timestamp)
3. Formato: PNG de alta qualidade

### Copiar para Área de Transferência
1. Clique em **"Copiar Imagem"**
2. Cole em qualquer aplicativo (Word, Photoshop, etc.)
3. 💡 **Dica**: Ideal para uso rápido sem salvar arquivo

---

## 🔄 Compartilhamento Social (apenas QR Code)

### WhatsApp
- Compartilha o texto via WhatsApp Web/App
- Abre nova aba com mensagem pré-preenchida

### Facebook
- Compartilha através do Facebook Share Dialog
- Útil para divulgação de URLs

---

## ⚠️ Dicas e Boas Práticas

### Para QR Codes

✅ **Faça**
- Use alto contraste (preto/branco é ideal)
- Escolha margem de erro alta (H) se usar logo
- Teste em vários leitores antes de imprimir
- Mantenha tamanho adequado ao uso (maior = mais confiável)

❌ **Evite**
- Cores muito próximas (baixo contraste)
- Logos muito grandes (>30% do QR)
- Fundos com padrões ou gradientes
- QR Codes muito pequenos para impressão

### Para Códigos de Barras

✅ **Faça**
- Use os valores de exemplo como referência
- Valide o formato antes de imprimir
- Teste com leitor de código de barras
- Mantenha fundo branco e barras pretas

❌ **Evite**
- Digitar valores aleatórios sem validação
- Usar cores diferentes de preto/branco (alguns leitores falham)
- Imprimir códigos muito pequenos
- Esticar ou distorcer a imagem

---

## 🐛 Solução de Problemas

### "Erro ao gerar código de barras"
- **Causa**: Valor inválido para o formato escolhido
- **Solução**: Use o valor de exemplo ou verifique o formato

### "QR Code não é lido"
- **Causa**: Contraste insuficiente ou logo muito grande
- **Solução**: Use preto/branco e reduza o logo

### "Imagem muito grande/pequena"
- **Causa**: Tamanho inadequado
- **Solução**: Ajuste nos controles de tamanho/altura

### "Não consigo copiar a imagem"
- **Causa**: Navegador não suporta Clipboard API
- **Solução**: Use o botão de Download

---

## 🎓 Casos de Uso

### E-commerce
- **EAN-13**: Produtos europeus
- **UPC-A**: Produtos americanos
- **QR Code**: Links para produto online

### Logística
- **Code 128**: Rastreamento interno
- **GS1-128**: Rastreamento internacional
- **ITF-14**: Caixas e paletes

### Marketing
- **QR Code**: Campanhas, cupons, links
- **Code 39**: Identificação de materiais

### Bibliotecas
- **Codabar**: Identificação de livros
- **ISBN**: Livros comerciais

### Eventos
- **QR Code**: Ingressos digitais, check-in
- **Code 128**: Credenciais impressas

---

## 📱 Leitura dos Códigos

### QR Codes
- Câmera do smartphone (maioria tem leitor nativo)
- Apps: Google Lens, QR Code Reader
- WhatsApp (via câmera)

### Códigos de Barras
- Apps de scanner (Barcode Scanner, Amazon Scanner)
- Leitores físicos (pistolas de varejo)
- Google Lens (alguns formatos)

---

## 💡 Próximos Recursos (Roadmap)

- [ ] Suporte a PDF417, Data Matrix, Aztec (2D)
- [ ] Histórico de códigos gerados
- [ ] Exportação em lote
- [ ] Templates customizáveis salvos
- [ ] API REST
- [ ] Modo de impressão otimizado

---

**Desenvolvido por Franklyn Silva** | [GitHub](https://github.com/Franklyn-R-Silva) | [LinkedIn](https://www.linkedin.com/in/franklyn-roberto-dev/)
