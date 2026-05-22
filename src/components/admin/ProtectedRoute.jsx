import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function ProtectedRoute({ children }) {
  const { session } = useAuth();

  // Aguarda verificação inicial da sessão
  if (session === undefined) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#080a0f',
        color: '#fff',
        fontSize: '1rem',
        gap: '12px'
      }}>
        <div className="spinner-small" /> Verificando acesso...
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/garagemcz/login" replace />;
  }

  return children;
}
