import { BrowserRouter } from "react-router-dom";
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppProvider } from './context/AppContext.jsx'
import { LanguageSelectionProvider } from './context/LanguageSelectionContext.jsx'

// Fix: passive event listener warning from third-party libraries (antd, framer-motion)
const originalAddEventListener = EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = function (type, listener, options) {
  if (type === 'touchstart' || type === 'touchmove' || type === 'wheel' || type === 'mousewheel') {
    if (options === undefined || options === false) {
      options = { passive: true };
    } else if (typeof options === 'object' && options.passive === undefined) {
      options = { ...options, passive: true };
    }
  }
  return originalAddEventListener.call(this, type, listener, options);
};

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppProvider>
      <LanguageSelectionProvider>
        <App />
      </LanguageSelectionProvider>
    </AppProvider>
  </BrowserRouter>,
)
