# 🔄 Guia de Migração - Nova Arquitetura

## 📋 Checklist de Migração

- [x] ✅ Contexts criados (Theme, Generator, Notification)
- [x] ✅ Services implementados (Storage, History, Export)
- [x] ✅ Design Patterns aplicados (Singleton, Factory, Strategy)
- [x] ✅ Custom Hooks criados (useHistory, useExport, etc)
- [x] ✅ Utils organizados (formatters, validators, helpers)
- [x] ✅ Estilos consolidados (variables.css, globals.css)
- [ ] 🔄 Migrar componentes para nova estrutura
- [ ] 🔄 Refatorar App.jsx com novos contexts
- [ ] 🔄 Atualizar imports nos componentes existentes

---

## 🚀 Como Migrar o App.jsx

### **Antes (Código Antigo)**

```javascript
function App() {
  const [theme, setTheme] = useState("light");
  const [notification, setNotification] = useState(null);
  const [config, setConfig] = useState({...});

  const toggleTheme = () => setTheme(prev => prev === "light" ? "dark" : "light");
  const showToast = (msg) => setNotification(msg);
  const updateConfig = (field, value) => setConfig(prev => ({...prev, [field]: value}));

  return (
    <div className={`app-container ${theme}`}>
      <Header theme={theme} toggleTheme={toggleTheme} />
      {/* resto do código */}
    </div>
  );
}
```

### **Depois (Código Novo)**

```javascript
import { ThemeProvider } from "./contexts/ThemeContext";
import { GeneratorProvider } from "./contexts/GeneratorContext";
import { NotificationProvider } from "./contexts/NotificationContext";

function App() {
  return (
    <ThemeProvider>
      <GeneratorProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </GeneratorProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const { theme } = useTheme();

  return (
    <div className={`app-container ${theme}`}>
      <Header />
      <MainContent />
      <Footer />
    </div>
  );
}
```

---

## 🔧 Como Refatorar Componentes

### **1. Componente Header**

**Antes:**

```javascript
const Header = ({ theme, toggleTheme, children }) => {
  return (
    <header>
      <button onClick={toggleTheme}>Toggle Theme</button>
      {children}
    </header>
  );
};
```

**Depois:**

```javascript
import { useTheme } from "../../contexts/ThemeContext";

const Header = ({ children }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="main-header">
      <button onClick={toggleTheme}>{theme === "light" ? "🌙" : "☀️"}</button>
      {children}
    </header>
  );
};
```

### **2. Componente HistoryPanel**

**Antes:**

```javascript
const HistoryPanel = ({ onLoadConfig, showToast }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("qrcode_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const addToHistory = (config) => {
    const newHistory = [config, ...history].slice(0, 20);
    setHistory(newHistory);
    localStorage.setItem("qrcode_history", JSON.stringify(newHistory));
  };

  // resto do código...
};
```

**Depois:**

```javascript
import { useHistory } from "../../hooks/useHistory";
import { useNotification } from "../../contexts/NotificationContext";
import { useGenerator } from "../../contexts/GeneratorContext";

const HistoryPanel = () => {
  const { history, addToHistory, removeFromHistory, clearHistory } =
    useHistory();
  const { showSuccess } = useNotification();
  const { loadConfig } = useGenerator();

  const handleLoadItem = (item) => {
    loadConfig(item.config);
    showSuccess("✅ Configuração carregada");
  };

  // resto do código simplificado...
};
```

### **3. Componente ExportOptions**

**Antes:**

```javascript
const ExportOptions = ({ canvasRef, config }) => {
  const handleExport = async (format) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    switch (format) {
      case "PNG":
        // lógica complexa de exportação PNG
        break;
      case "PDF":
        // lógica complexa de exportação PDF
        break;
      // etc...
    }
  };
};
```

**Depois:**

```javascript
import { useExport } from "../../hooks/useExport";
import { useNotification } from "../../contexts/NotificationContext";

const ExportOptions = ({ canvasRef, config }) => {
  const { exportImage, exporting } = useExport();
  const { showSuccess, showError } = useNotification();

  const handleExport = async (format) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const result = await exportImage(format, canvas, {
      transparent: config.transparent,
      bgColor: config.bgColor,
      filename: config.text || "qrcode",
    });

    if (result.success) {
      showSuccess(`✅ ${format} exportado com sucesso`);
    } else {
      showError(`❌ Erro ao exportar ${format}`);
    }
  };

  return (
    <div>
      <button onClick={() => handleExport("PNG")} disabled={exporting}>
        Exportar PNG
      </button>
      {/* outros botões */}
    </div>
  );
};
```

---

## 🎯 Exemplos de Uso dos Novos Hooks

### **useHistory**

```javascript
const {
  history, // Array de itens
  loading, // Estado de carregamento
  statistics, // { total, qrCodes, barcodes, lastGenerated }
  addToHistory, // Adicionar item
  removeFromHistory, // Remover item
  clearHistory, // Limpar tudo
  filterByType, // Filtrar por tipo
  exportHistory, // Exportar como JSON
  importHistory, // Importar de JSON
  reload, // Recarregar do localStorage
} = useHistory();

// Adicionar ao histórico
addToHistory(config);

// Remover item específico
removeFromHistory(itemId);

// Filtrar apenas QR Codes
const qrCodes = filterByType("qrcode");

// Exportar histórico
const jsonUrl = exportHistory();
downloadFile(jsonUrl, "history.json");
```

### **useExport**

```javascript
const {
  exporting, // Estado: está exportando?
  lastExport, // Última exportação { format, timestamp, success }
  exportImage, // Exportar único formato
  exportMultipleFormats, // Exportar múltiplos formatos
  getAvailableFormats, // Listar formatos disponíveis
  isFormatSupported, // Verificar suporte
  getFormatsInfo, // Info detalhada dos formatos
} = useExport();

// Exportar PNG com transparência
await exportImage("PNG", canvas, {
  transparent: true,
  bgColor: "#ffffff",
});

// Exportar múltiplos formatos
const results = await exportMultipleFormats(
  ["PNG", "WEBP", "PDF"],
  canvas,
  options
);

// Verificar formatos disponíveis
const formats = getAvailableFormats(); // ['PNG', 'WEBP', 'SVG', 'PDF']
```

### **useClipboard**

```javascript
const { copied, copy, reset } = useClipboard();

const handleCopy = async () => {
  const success = await copy(text);
  if (success) {
    console.log("Texto copiado!");
  }
};

// 'copied' muda para true por 2 segundos automaticamente
```

### **useDebounce**

```javascript
const [searchTerm, setSearchTerm] = useState("");
const debouncedSearch = useDebounce(searchTerm, 500);

useEffect(() => {
  // Executa apenas após 500ms sem mudanças
  if (debouncedSearch) {
    performSearch(debouncedSearch);
  }
}, [debouncedSearch]);
```

---

## 📦 Exemplos de Uso dos Services

### **LocalStorageService**

```javascript
import localStorageService from "./services/storage/localStorageService";

// Salvar dados
localStorageService.setItem("user", { name: "João", age: 25 });

// Obter dados
const user = localStorageService.getItem("user", null);

// Verificar existência
if (localStorageService.hasItem("user")) {
  console.log("Usuário existe");
}

// Obter tamanho do storage
const size = localStorageService.getSize(); // bytes

// Limpar tudo
localStorageService.clear();
```

### **HistoryService**

```javascript
import historyService from "./services/storage/historyService";

// Obter histórico
const history = historyService.getHistory();

// Adicionar item
const newItem = historyService.addToHistory(config);

// Obter estatísticas
const stats = historyService.getStatistics();
// { total: 15, qrCodes: 10, barcodes: 5, lastGenerated: "..." }

// Filtrar por tipo
const qrCodes = historyService.filterByType("qrcode");

// Exportar/Importar
const jsonUrl = historyService.exportHistory();
historyService.importHistory(jsonString);
```

### **ExportFactory**

```javascript
import exportFactory from "./services/export/ExportFactory";

// Exportar
const result = await exportFactory.export("PNG", canvas, options);

// Verificar formato suportado
if (exportFactory.isFormatSupported("JPEG")) {
  console.log("JPEG é suportado");
}

// Adicionar nova estratégia
exportFactory.registerStrategy("TIFF", new TIFFExportStrategy());

// Listar formatos
const formats = exportFactory.getAvailableFormats();
// ['PNG', 'WEBP', 'SVG', 'PDF']
```

---

## 🎨 Usando os Novos Estilos

### **Importar no index.js ou App.jsx**

```javascript
import "./styles/globals.css";
```

### **Usar Variáveis CSS**

```css
.my-component {
  background: var(--bg-primary);
  color: var(--text-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
}

.my-button {
  background: var(--primary);
  color: white;
}

.my-button:hover {
  background: var(--primary-dark);
}
```

### **Usar Classes Utilitárias**

```jsx
<div className="flex items-center justify-between gap-md">
  <h1 className="text-2xl font-bold">Título</h1>
  <button className="btn-primary">Ação</button>
</div>

<div className="grid grid-cols-3 gap-lg p-lg">
  <div className="fade-in">Item 1</div>
  <div className="slide-up">Item 2</div>
  <div className="slide-left">Item 3</div>
</div>
```

---

## ✅ Benefícios Imediatos

### **1. Menos Código Boilerplate**

- ❌ Antes: 50 linhas para gerenciar histórico
- ✅ Depois: 3 linhas com `useHistory()`

### **2. Código Mais Limpo**

- ❌ Antes: Lógica misturada com UI
- ✅ Depois: UI pura, lógica nos hooks/services

### **3. Reutilização Máxima**

- ❌ Antes: Duplicar código em cada componente
- ✅ Depois: Usar hooks em qualquer lugar

### **4. Manutenção Simplificada**

- ❌ Antes: Mudar algo → atualizar N componentes
- ✅ Depois: Mudar em 1 lugar → todos se beneficiam

### **5. Testabilidade**

- ❌ Antes: Difícil testar componentes grandes
- ✅ Depois: Testar services/hooks isoladamente

---

## 🎯 Próximos Passos

1. **Migrar componentes gradualmente** para a nova estrutura
2. **Substituir lógica duplicada** pelos novos hooks
3. **Usar ExportFactory** no lugar de lógica inline
4. **Adicionar novos contexts** conforme necessário
5. **Implementar testes** para services e hooks
6. **Documentar componentes** com comentários JSDoc

---

## 💡 Dicas

- ✅ Sempre use hooks no topo dos componentes
- ✅ Prefira Context API para estado global
- ✅ Use Services para lógica de negócio complexa
- ✅ Mantenha componentes pequenos e focados
- ✅ Reutilize utils em vez de duplicar funções
- ✅ Siga o padrão de nomenclatura consistente

---

## 📚 Recursos

- [Documentação Completa](./NOVA-ARQUITETURA.md)
- [Estrutura do Projeto](./ESTRUTURA-DO-PROJETO.md)
- [Guia de Uso](./GUIA-DE-USO.md)
