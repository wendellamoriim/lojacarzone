import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './AdminLogin.css';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await signIn(email.trim().toLowerCase(), password.trim());
    if (error) {
      console.error('Erro ao fazer login:', error);
      const errorMsg = error.message || '';
      
      if (errorMsg.includes('Email not confirmed') || errorMsg.includes('Email not verified')) {
        setError('Este e-mail ainda não foi confirmado! Por favor, ative a opção "Confirmar e-mail" no painel do Supabase para este usuário ou desative a confirmação de e-mail nas configurações de Autenticação do Supabase.');
      } else if (errorMsg.includes('Invalid login credentials')) {
        setError('E-mail ou senha incorretos. Verifique se as credenciais estão certas e se o usuário está ativo.');
      } else if (error.status === 400) {
        // Se for outro erro 400, pode ser e-mail não confirmado ou credenciais
        setError('Falha na autenticação. Verifique se o e-mail foi confirmado e se a senha está correta.');
      } else {
        setError(`Falha de conexão: ${errorMsg || 'Erro ao conectar ao servidor de autenticação.'}`);
      }
    } else {
      navigate('/garagemcz/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="admin-login-page">
      {/* Fundo animado */}
      <div className="login-bg-grid" />
      <div className="login-glow-top" />
      <div className="login-glow-bottom" />

      <div className="login-card">
        {/* Logo */}
        <div className="login-logo-area" style={{ display: 'flex', alignItems: 'center', marginBottom: '28px', justifyContent: 'center' }}>
          <img src="/logo.png" alt="CarZone Logo" style={{ height: '36px', width: 'auto', marginRight: '16px' }} />
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: '16px', display: 'flex', alignItems: 'center', height: '24px' }}>
            <p className="login-subtitle" style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, lineHeight: 1 }}>Painel Administrativo</p>
          </div>
        </div>

        <h2 className="login-title">Bem-vindo de volta</h2>
        <p className="login-desc">Faça login para acessar o controle total do catálogo</p>

        <form onSubmit={handleLogin} className="login-form">
          <div className="login-field">
            <label>E-mail do administrador</label>
            <input
              type="email"
              placeholder="admin@carzone.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
            />
          </div>

          <div className="login-field">
            <label>Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <><span className="btn-spinner" /> Entrando...</>
            ) : (
              'Entrar no Painel'
            )}
          </button>
        </form>

        <p className="login-footer-note">
          Acesso restrito ao administrador da loja.
        </p>
      </div>
    </div>
  );
}
