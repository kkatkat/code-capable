import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { UserProvider } from './UserProvider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <UserProvider>
        <App />
    </UserProvider>
)
