// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import App from './App.tsx';
// import './index.css';

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>
// );
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import AppComponent from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppComponent />
    </BrowserRouter>
  </React.StrictMode>
)

// // src/App.tsx
// import { Routes, Route } from 'react-router-dom'
// import { AlertProvider } from './contexts/AlertContext'
// import { NewsProvider } from './contexts/NewsContext'
// import { AlertsPage } from './components/alerts/AlertsPage'
// import { NewsWidget } from './components/news/NewsWidget'

// function App() {
//   return (
//     <AlertProvider>
//       <NewsProvider>
//         <div className="min-h-screen bg-gray-50 dark:bg-navy-900">
//           <Routes>
//             <Route path="/" element={<div>Home Page</div>} />
//             <Route path="/alerts" element={<AlertsPage />} />
//           </Routes>
//         </div>
//       </NewsProvider>
//     </AlertProvider>
//   )
// }

// export default App