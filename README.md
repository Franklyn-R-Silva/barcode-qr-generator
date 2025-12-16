# 🎯 Gerador de QR Code & Códigos de Barras Pro

[![Wakatime](https://wakatime.com/badge/user/268de5b9-4dbd-4873-9ede-a165e5745754/project/9ef7b6c4-80ab-4866-be52-b446eedd73d3.svg)](https://wakatime.com/badge/user/268de5b9-4dbd-4873-9ede-a165e5745754/project/9ef7b6c4-80ab-4866-be52-b446eedd73d3)

Aplicação React moderna e profissional para geração de **QR Codes** e **Códigos de Barras** com mais de **25 formatos diferentes**, interface intuitiva, temas claro/escuro e recursos avançados de personalização.

**🌐 Veja o site em funcionamento**: [https://barcode-qr-generator.netlify.app/](https://barcode-qr-generator.netlify.app/)

---

## ✨ Funcionalidades Principais

### 📱 QR Codes

- 🎨 Personalização completa de cores (frente e fundo)
- 🔲 Estilos de módulos (Quadrados ou Pontos)
- 👁️ Estilos de olhos (Quadrados ou Redondos)
- 🖼️ Upload de logo com controle de opacidade
- 🛡️ 4 níveis de correção de erro (L, M, Q, H)
- 🎨 Templates prontos (Padrão, WhatsApp, Dark, Azul Tech)

### 📊 Códigos de Barras (NOVO!)

Suporte para mais de **25 formatos**:

#### Code Family

Code 39 • Code 93 • Code 128 (Auto, A, B, C)

#### GS1 & ITF

GS1-128 • ITF • ITF-14

#### EAN & ISBN

EAN-13 • EAN-8 • EAN-5 • EAN-2 • ISBN

#### UPC

UPC-A • UPC-E

#### Outros

MSI (10, 11, 1010, 1110) • Pharmacode • Codabar

### 🎯 Recursos Gerais

- 📥 Download em formato PNG de alta qualidade
- 📋 Copiar para área de transferência
- 🌓 Modo Claro/Escuro
- 📱 Design totalmente responsivo
- 🔗 Compartilhamento social (WhatsApp, Facebook)
- ✅ Validação automática por formato

---

## 🚀 Como Usar

### Instalação

```bash
# Clone o repositório
git clone https://github.com/Franklyn-R-Silva/https://github.com/Franklyn-R-Silva/barcode-qr-generator.git

# Entre no diretório
cd barcode-qr-generator

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm start
```

O aplicativo estará disponível em `http://localhost:3000`

### Uso Básico

#### Gerando um QR Code

1. Por padrão, o modo **QR Code** já está selecionado
2. Digite seu texto, URL ou dados no campo "Conteúdo"
3. Personalize cores, estilo e adicione logo (opcional)
4. Clique em "Baixar PNG" ou "Copiar Imagem"

#### Gerando um Código de Barras

1. Clique no botão **"Código de Barras"** no topo
2. Escolha o formato desejado (ex: EAN-13, Code 128)
3. Um valor de exemplo será preenchido automaticamente
4. Ajuste altura, largura e outras opções
5. Clique em "Baixar PNG" ou "Copiar Imagem"

---

## 🏗️ Arquitetura do Projeto

O projeto segue princípios de **Clean Architecture** e **Atomic Design**:

```
src/
├── components/
│   ├── layout/          # Estrutura da página
│   ├── common/          # Componentes reutilizáveis
│   └── generator/       # Lógica de geração
├── constants/           # Configurações centralizadas
└── hooks/               # Hooks customizados
```

📚 **Documentação completa**: Veja [ESTRUTURA-DO-PROJETO.md](./ESTRUTURA-DO-PROJETO.md)

---

## 💻 Tecnologias Utilizadas

- **React 18** - Biblioteca JavaScript para UI
- **react-qrcode-logo** - Geração de QR Codes com logo
- **react-barcode** - Geração de Códigos de Barras
- **JsBarcode** - Engine de códigos de barras
- **react-icons** - Biblioteca de ícones
- **CSS3 Variables** - Temas dinâmicos
- **Google Fonts (Outfit)** - Tipografia moderna

---

## 📚 Documentação

- 📖 [Guia de Uso Completo](./GUIA-DE-USO.md) - Tutorial detalhado
- 🏗️ [Estrutura do Projeto](./ESTRUTURA-DO-PROJETO.md) - Arquitetura e organização
- 🏛️ [Arquitetura](./ARCHITECTURE.md) - Detalhes técnicos
- 📋 [Changelog](./CHANGELOG.md) - Histórico de mudanças

---

## 📝 Scripts Disponíveis

```bash
npm start          # Inicia o servidor de desenvolvimento
npm run build      # Cria build de produção
npm test           # Executa testes
```

---

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Para contribuir:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

## 👨‍💻 Autor

**Franklyn Silva**

- 🌐 GitHub: [@Franklyn-R-Silva](https://github.com/Franklyn-R-Silva)
- 💼 LinkedIn: [Franklyn Roberto](https://www.linkedin.com/in/franklyn-roberto-dev/)

---

## ⭐ Apoie o Projeto

Se este projeto foi útil para você, considere:

- ⭐ Dar uma estrela no GitHub
- 🐛 Reportar bugs e sugerir melhorias
- 📢 Compartilhar com outros desenvolvedores

---

**Última atualização**: 15 de Dezembro de 2025  
**Versão**: 2.0.0 - Agora com suporte a Códigos de Barras!

## 📸 Preview

![Gerador de QR Code](foto.png)

---

## 🔗 Links Úteis

- [Create React App - Documentação](https://facebook.github.io/create-react-app/docs/getting-started)
- [Documentação do React](https://reactjs.org/)
- [JsBarcode Documentation](https://github.com/lindell/JsBarcode)
