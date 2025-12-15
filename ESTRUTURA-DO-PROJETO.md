# 📁 Estrutura Final do Projeto

## 🌳 Árvore de Diretórios

```
Gerador-de-QRCode-com-ReactJS/
│
├── 📄 package.json                    # Dependências e scripts
├── 📄 netlify.toml                    # Configuração de deploy
├── 📄 README.md                       # Documentação principal
├── 📄 ARCHITECTURE.md                 # Documentação da arquitetura
├── 📄 CHANGELOG.md                    # Registro de mudanças
├── 📄 GUIA-DE-USO.md                  # Manual do usuário
│
├── 📁 public/                         # Arquivos públicos
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
│
└── 📁 src/                            # Código-fonte
    ├── 📄 index.js                    # Ponto de entrada
    ├── 📄 index.css                   # Reset CSS global
    ├── 📄 App.jsx                     # Componente raiz
    ├── 📄 App.css                     # Estilos globais e temas
    │
    ├── 📁 components/                 # Componentes React
    │   │
    │   ├── 📁 layout/                 # ✨ Componentes de estrutura
    │   │   ├── Header.jsx             # Cabeçalho com tema
    │   │   ├── Header.css
    │   │   ├── Footer.jsx             # Rodapé com links
    │   │   └── Footer.css
    │   │
    │   ├── 📁 common/                 # ✨ Componentes reutilizáveis
    │   │   ├── Toast.jsx              # Notificações
    │   │   └── Toast.css
    │   │
    │   └── 📁 generator/              # ✨ Geração de códigos
    │       ├── QRCodePreview.jsx      # Visualização QR Code
    │       ├── BarcodePreview.jsx     # Visualização Barcode
    │       ├── Controls.jsx           # Painel de controles
    │       ├── Controls.css
    │       └── GeneratorArea.css      # Estilos compartilhados
    │
    ├── 📁 constants/                  # ✨ Configurações centralizadas
    │   ├── generatorTypes.js          # Tipos: QR/Barcode
    │   └── barcodeTypes.js            # Formatos de barcode
    │
    └── 📁 hooks/                      # Hooks customizados
        └── useQRCode.js               # Lógica de geração/export
```

## 📊 Organização por Responsabilidade

### 🎨 Layout (`components/layout/`)
**Propósito**: Componentes estruturais que aparecem em todas as páginas

- **Header**: Branding + alternador de tema
- **Footer**: Informações do desenvolvedor + links sociais

**Por que separar?**
- Facilita manutenção
- Reutilizável em múltiplas páginas
- Mudanças isoladas não afetam outros componentes

### 🔧 Common (`components/common/`)
**Propósito**: Componentes genéricos reutilizáveis

- **Toast**: Sistema de notificações

**Por que separar?**
- Pode ser usado em qualquer parte da aplicação
- Facilita criar biblioteca de componentes
- Mantém código DRY (Don't Repeat Yourself)

### 🎯 Generator (`components/generator/`)
**Propósito**: Lógica específica de geração de códigos

- **QRCodePreview**: Renderiza e exporta QR Codes
- **BarcodePreview**: Renderiza e exporta Barcodes
- **Controls**: Painel de configuração unificado

**Por que separar?**
- Agrupa funcionalidades relacionadas
- Facilita adição de novos tipos
- Mantém lógica de negócio isolada

### 📦 Constants (`constants/`)
**Propósito**: Valores fixos e configurações

- **generatorTypes**: Define tipos disponíveis
- **barcodeTypes**: Lista todos os formatos + exemplos

**Por que separar?**
- Single Source of Truth
- Facilita mudanças em um único lugar
- Previne typos e inconsistências

### 🪝 Hooks (`hooks/`)
**Propósito**: Lógica reutilizável com estado React

- **useGenerator**: Download, cópia, conversão SVG→Canvas

**Por que separar?**
- Reutilização de lógica
- Testes mais fáceis
- Separação de concerns

## 🔄 Fluxo de Dados

```
┌─────────────────────────────────────────────────────┐
│                      App.jsx                        │
│  • Estado centralizado (config)                     │
│  • Gerencia tema                                    │
│  • Funções de atualização                          │
└─────────────────────────────────────────────────────┘
                          │
         ┌────────────────┼────────────────┐
         │                                 │
         ▼                                 ▼
┌──────────────────┐           ┌──────────────────────┐
│  QRCodePreview   │           │     Controls         │
│  ou              │           │  • Inputs            │
│  BarcodePreview  │◄──────────│  • Selects           │
│                  │  config   │  • Sliders           │
│  • Renderização  │           │  • Upload            │
│  • Download      │           └──────────────────────┘
│  • Cópia         │                     │
└──────────────────┘                     │
         │                               │
         │         ┌─────────────────────┘
         ▼         ▼
┌──────────────────────────────────────────┐
│           Toast (notificações)           │
└──────────────────────────────────────────┘
```

## 📝 Padrões Aplicados

### 1. **Atomic Design**
```
Átomos    → Toast, Botões
Moléculas → Controls, Headers
Organismos→ QRCodePreview
Templates → App.jsx
```

### 2. **Single Responsibility Principle (SRP)**
Cada componente tem UMA responsabilidade clara:
- Header: Apenas UI do topo
- QRCodePreview: Apenas renderizar QR
- Controls: Apenas inputs de configuração

### 3. **Don't Repeat Yourself (DRY)**
- Constantes centralizadas
- Hook compartilhado
- Estilos em variáveis CSS

### 4. **Separation of Concerns**
- UI (componentes)
- Lógica (hooks)
- Dados (constants)
- Estilos (CSS modules)

## 🎯 Convenções de Nomenclatura

### Arquivos
- **PascalCase**: Componentes React (`QRCodePreview.jsx`)
- **camelCase**: Utilitários e hooks (`useGenerator.js`)
- **kebab-case**: CSS (`generator-area.css`)
- **SCREAMING_SNAKE**: Constantes (`BARCODE_FORMATS`)

### Pastas
- **lowercase**: Sempre minúsculas (`components/`, `hooks/`)
- **Descritivas**: Nome indica o conteúdo

### Variáveis
- **camelCase**: Variáveis locais (`updateConfig`)
- **PascalCase**: Componentes (`QRCodePreview`)
- **UPPER_CASE**: Constantes exportadas (`GENERATOR_TYPES`)

## 🚀 Próximos Passos para Escalabilidade

### 1. Context API
Para evitar prop drilling:
```
src/
└── contexts/
    ├── ThemeContext.js
    └── GeneratorContext.js
```

### 2. Utils/Helpers
Para funções auxiliares:
```
src/
└── utils/
    ├── validators.js     # Validação de formatos
    ├── converters.js     # SVG→Canvas, etc
    └── exporters.js      # Download, cópia
```

### 3. Services
Para lógica de negócio complexa:
```
src/
└── services/
    ├── qrcodeService.js
    └── barcodeService.js
```

### 4. Testes
```
src/
└── __tests__/
    ├── components/
    ├── hooks/
    └── utils/
```

## 📚 Referências

- **React Docs**: https://react.dev/
- **Atomic Design**: https://bradfrost.com/blog/post/atomic-web-design/
- **Clean Code**: Robert C. Martin

---

**✨ Estrutura criada em**: 15 de Dezembro de 2025  
**👨‍💻 Por**: Franklyn Silva
