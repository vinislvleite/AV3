import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!usuario || !senha) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const response = await api.post("/funcionarios/login", {
        usuario: usuario.trim(),
        senha: senha.trim(),
      });

      const funcionario = response.data;
      localStorage.setItem("cargo", funcionario.nivelPermissao); 
      localStorage.setItem("usuario", funcionario.usuario);
      
      localStorage.setItem("userId", funcionario.id);

      alert(`Login realizado com sucesso! Bem-vindo(a) ${funcionario.nome}`);
      navigate("/gerenciarAeronaves");

    } catch (error) {
      console.error("Erro no login:", error);
      const msg = error.response?.data?.error || "Erro ao conectar com o servidor";
      alert(msg);
    }
  };

  return (
    <div className="container">
      <div className="left-side">
        <img className="logo-text" src="/Aerocode.png" alt="aerocode" />
      </div>

      <div className="right-side">
        <h2>Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <label>Usuário:</label>
          <input
            type="text"
            placeholder="Digite seu usuário"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />

          <label>Senha:</label>
          <input
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <button type="submit">Logar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;