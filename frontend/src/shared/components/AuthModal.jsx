import { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { signup, login as loginRequest } from "../services/authService";
import "../styles/AuthModal.scss"

const AuthModal = ({ onClose }) => {
    const { login } = useAuth()

    const [signupData, setSignupData] = useState({ username: "", email: "", password: "" });
    const [loginData, setLoginData] = useState({ identifier: "", password: "" });
    const [signupError, setSignupError] = useState(null);
    const [loginError, setLoginError] = useState(null);
    const [signupLoading, setSignupLoading] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);

    const handleSignupSubmit = async (e) => {
        e.preventDefault()
        setSignupError(null)
        setSignupLoading(true);

        try {
            const result = await signup(
                signupData.username,
                signupData.email,
                signupData.password
            )

            login(result.data)

            onClose()
        } catch (err) {
            setSignupError(err.response?.data?.message || "Signup failed");
        } finally {
            setSignupLoading(false)
        }
    }

    const handleLoginSubmit = async (e) => {
        e.preventDefault()
        setLoginError(null)
        setLoginLoading(true)

        try {
            const result = await loginRequest(
                loginData.identifier,
                loginData.password,
            )

            login(result.data)
            onClose()

        } catch (err) {
            setLoginError(err.response?.data?.message || "Login failed");
        } finally {
            setLoginLoading(false)
        }
    }


    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
                <button className="auth-modal__close" onClick={onClose}>
                    <X size={18} />
                </button>

                <div className="auth-modal__panels">
                    <form className="auth-modal__panel" onSubmit={handleSignupSubmit}>
                        <h2 className="auth-modal__title">Sign up</h2>

                        <input
                            type="text"
                            placeholder="Username"
                            value={signupData.username}
                            onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={signupData.email}
                            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={signupData.password}
                            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        />

                        {signupError && <p className="auth-modal__error">{signupError}</p>}

                        <button type="submit" className="auth-modal__submit" disabled={signupLoading}>
                            {signupLoading ? "Creating account..." : "Sign up"}
                        </button>
                    </form>

                    <div className="auth-modal__divider" />

                    <form className="auth-modal__panel" onSubmit={handleLoginSubmit}>
                        <h2 className="auth-modal__title">Log in</h2>

                        <input
                            type="text"
                            placeholder="Username or email"
                            value={loginData.identifier}
                            onChange={(e) => setLoginData({ ...loginData, identifier: e.target.value })}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={loginData.password}
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        />

                        {loginError && <p className="auth-modal__error">{loginError}</p>}

                        <button type="submit" className="auth-modal__submit" disabled={loginLoading}>
                            {loginLoading ? "Logging in..." : "Log in"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;