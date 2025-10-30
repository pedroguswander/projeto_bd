import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from './pages/Home';
import InserirUsuario from './components/InserirUsuario';

import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from "react-router-dom";
import { createBrowserRouter, RouterProvider }  from "react-router-dom"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <div>Página não encontrada</div>,
  },
  {
    path: '/inserir-usuario',
    element: <InserirUsuario onClose={() => {}} />,
    errorElement: <div>Página não encontrada</div>,
  },
]);

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <QueryClientProvider client={queryClient}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </QueryClientProvider>
);

reportWebVitals();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
