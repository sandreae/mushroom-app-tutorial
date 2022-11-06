import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

import './styles.css';

import { App, InitWasm } from './components';
import { KeyPairProvider } from './KeyPairContext';
import { DocumentStoreProvider } from './DocumentIdContext';
import { Router } from './Router';

const Root: React.FC = () => {
  return (
    <InitWasm>
      <BrowserRouter>
        <KeyPairProvider>
          <DocumentStoreProvider>
            <App>
              <Router />
            </App>
          </DocumentStoreProvider>
        </KeyPairProvider>
      </BrowserRouter>
    </InitWasm>
  );
};

const elem = document.createElement('div');
document.body.appendChild(elem);

const root = createRoot(elem);
root.render(<Root />);
