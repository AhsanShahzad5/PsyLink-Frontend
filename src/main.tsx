import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './AppRoutes'
//recoil
import {  RecoilRoot} from 'recoil';



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RecoilRoot>
      <Router>
        <AppRoutes />
      </Router>
    </RecoilRoot>
  </StrictMode>,
)
