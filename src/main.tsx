import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './AppRoutes'
//recoil
import {  RecoilRoot} from 'recoil';

import { Provider } from 'react-redux';
import store from './store';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RecoilRoot>
      <Provider store={store}>
      <Router>
        <AppRoutes />
      </Router>
      </Provider>
    </RecoilRoot>
  </StrictMode>,
)
