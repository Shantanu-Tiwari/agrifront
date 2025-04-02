import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../AuthProvider/AuthContext";

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        const response = await login(email, password);

        if (response?.error) {
            setError("Invalid email or password. Please try again.");
        } else {
            navigate("/dashboard"); // Redirect on success
        }
    };

    return (
        <div className="bg-green-50 min-h-screen flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full border border-green-300">
                <h2 className="text-2xl font-semibold text-green-800 mb-4 text-center">Welcome Back!</h2>
                {error && <p className="text-red-600 text-center">{error}</p>}

                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition">
                        Login
                    </button>
                </form>

                <p className="mt-4 text-gray-600 text-center">
                    Don't have an account?
                    <a href="/signup" className="text-green-600 hover:underline"> Sign up</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
