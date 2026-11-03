import { APP_CONFIG } from '../utils/constants';

export const AuthLayout = ({ children }) => {
  return (
    <div className="siska-auth-wrapper">
      <div className="siska-auth-card">
        <div className="siska-auth-brand">
          <div className="siska-auth-icon">🎓</div>
          <h1>{APP_CONFIG.NAME}</h1>
          <p>{APP_CONFIG.FULL_NAME}</p>
        </div>
        <div className="siska-auth-body">{children}</div>
      </div>
    </div>
  );
};

