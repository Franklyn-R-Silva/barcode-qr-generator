// src/App.refactored.jsx
// EXEMPLO DE COMO O App.jsx DEVE FICAR APÓS MIGRAÇÃO

import React from "react";
import "./styles/globals.css";

// Contexts (Providers)
import {
  ThemeProvider,
  useTheme,
  GeneratorProvider,
  NotificationProvider,
  useNotification,
} from "./contexts";

// Layout Components
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

// Feature Components
import GeneratorArea from "./features/generator/components/GeneratorArea";
import HistoryPanel from "./features/history/components/HistoryPanel";

// Common Components
import Toast from "./components/common/Toast";

/**
 * App Principal - Apenas estrutura e providers
 * Toda lógica foi movida para contexts/hooks/services
 */
function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <GeneratorProvider>
          <AppContent />
        </GeneratorProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

/**
 * Conteúdo Principal da Aplicação
 * Usa hooks dos contexts para acessar estado global
 */
function AppContent() {
  const { theme } = useTheme();
  const { notification, hideNotification } = useNotification();

  return (
    <div className={`app-container ${theme}`}>
      {/* Sistema de Notificação Global */}
      {notification && (
        <Toast
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />
      )}

      {/* Painel de Histórico (Portal no nível raiz) */}
      <HistoryPanel />

      {/* Layout */}
      <Header />

      {/* Área Principal do Gerador */}
      <main className="main-content">
        <GeneratorArea />
      </main>

      <Footer />
    </div>
  );
}

export default App;

/**
 * COMPARAÇÃO:
 *
 * ANTES (App.jsx antigo):
 * - 150+ linhas
 * - Estado local complexo (theme, notification, config)
 * - Funções de lógica de negócio inline
 * - useEffect para localStorage
 * - Prop drilling (passar props por múltiplos níveis)
 *
 * DEPOIS (App.jsx novo):
 * - 50 linhas
 * - Sem estado local (tudo em contexts)
 * - Sem lógica de negócio (tudo em services)
 * - Sem useEffect manual (hooks cuidam disso)
 * - Sem prop drilling (contexts disponíveis em qualquer lugar)
 *
 * BENEFÍCIOS:
 * ✅ Código mais limpo e legível
 * ✅ Fácil manutenção
 * ✅ Melhor separação de responsabilidades
 * ✅ Componentes reutilizáveis
 * ✅ Testável
 */
