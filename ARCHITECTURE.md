# 🎯 Gerador de QR Code & Códigos de Barras Pro

Aplicação React moderna e profissional para geração de **QR Codes** e **Códigos de Barras** com interface intuitiva e recursos avançados de personalização.

## ✨ Funcionalidades

### QR Code

- 🎨 **Personalização completa** de cores (frente e fundo)
- 🔲 **Estilos de módulos**: Quadrados ou Pontos
- 👁️ **Estilos de olhos**: Quadrados ou Redondos
- 🖼️ **Upload de logo** com controle de opacidade
- 🛡️ **4 níveis de correção de erro** (L, M, Q, H)
- 🎨 **Templates prontos** (Padrão, WhatsApp, Dark, Azul Tech)

### Códigos de Barras

Suporte para mais de **25 formatos** diferentes:

#### Code Family

- Code 39, Code 93
- Code 128 (Auto, A, B, C)

#### GS1 & ITF

- GS1-128
- ITF (Interleaved 2 of 5)
- ITF-14

#### EAN & ISBN

- EAN-13, EAN-8, EAN-5, EAN-2
- ISBN

#### UPC

- UPC-A, UPC-E

#### Outros Formatos

- MSI (10, 11, 1010, 1110)
- Pharmacode
- Codabar

### Recursos Gerais

- 📥 **Download** em formato PNG
- 📋 **Copiar para área de transferência**
- 🌓 **Modo Claro/Escuro**
- 📱 **Design Responsivo**
- 🔗 **Compartilhamento social** (WhatsApp, Facebook)

## 🏗️ Arquitetura do Projeto

```
src/
├── components/
│   ├── layout/              # Componentes de layout
│   │   ├── Header.jsx
│   │   ├── Header.css
│   │   ├── Footer.jsx
│   │   └── Footer.css
│   ├── common/              # Componentes reutilizáveis
│   │   ├── Toast.jsx
│   │   └── Toast.css
│   └── generator/           # Componentes de geração
│       ├── QRCodePreview.jsx
│       ├── BarcodePreview.jsx
│       ├── Controls.jsx
│       ├── Controls.css
│       └── GeneratorArea.css
├── constants/               # Constantes e configurações
│   ├── generatorTypes.js    # Tipos de geradores
│   └── barcodeTypes.js      # Formatos de códigos de barras
├── hooks/                   # Hooks customizados
│   └── useQRCode.js         # Hook para manipulação de geradores
├── App.jsx                  # Componente principal
├── App.css                  # Estilos globais
├── index.js                 # Ponto de entrada
└── index.css                # Reset CSS
```

## 🚀 Tecnologias Utilizadas

- **React 18** - Biblioteca JavaScript para UI
- **react-qrcode-logo** - Geração de QR Codes
- **react-barcode** - Geração de Códigos de Barras
- **react-icons** - Biblioteca de ícones
- **CSS3** - Estilização moderna com variáveis CSS
- **Google Fonts (Outfit)** - Tipografia moderna

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/Franklyn-R-Silva/Gerador-de-QRCode-com-ReactJS.git

# Entre no diretório
cd Gerador-de-QRCode-com-ReactJS

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm start
```

O aplicativo estará disponível em `http://localhost:3000`

## 🎨 Padrões de Código

### Estrutura de Componentes

- **Layout**: Componentes de estrutura da página (Header, Footer)
- **Common**: Componentes reutilizáveis (Toast, Modal, etc.)
- **Generator**: Componentes específicos de geração de códigos

### Gerenciamento de Estado

- Estado centralizado no `App.jsx`
- Props drilling para comunicação entre componentes
- Hooks customizados para lógica reutilizável

### Estilos

- Variáveis CSS para temas (claro/escuro)
- Arquivos CSS co-localizados com componentes
- Design system consistente

## 📝 Scripts Disponíveis

```bash
npm start          # Inicia o servidor de desenvolvimento
npm run build      # Cria build de produção
npm test           # Executa testes
```

## 🌐 Deploy

O projeto está configurado para deploy automático no **Netlify**.

```bash
npm run build
# Os arquivos estarão na pasta build/
```

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Sinta-se à vontade para:

1. Fazer um Fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abrir um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

**Franklyn Silva**

- GitHub: [@Franklyn-R-Silva](https://github.com/Franklyn-R-Silva)
- LinkedIn: [Franklyn Roberto](https://www.linkedin.com/in/franklyn-roberto-dev/)

---

⭐ Se este projeto te ajudou, considere dar uma estrela!
