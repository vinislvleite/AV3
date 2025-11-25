import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const padroes = [
      { usuario: "admin", senha: "123", cargo: "Administrador" },
      { usuario: "engenheiro", senha: "123", cargo: "Engenheiro" },
      { usuario: "operador", senha: "123", cargo: "Operador" },
    ];

    const cadastrados =
      JSON.parse(localStorage.getItem("usuariosExtra_global")) || [];

    setUsuarios([...padroes, ...cadastrados]);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!usuario || !senha) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const user = usuarios.find(
      (u) =>
        u.usuario.trim().toLowerCase() === usuario.trim().toLowerCase() &&
        u.senha.trim() === senha.trim()
    );

    if (user) {
      localStorage.setItem("cargo", user.cargo);
      localStorage.setItem("usuario", user.usuario);
      navigate("/gerenciarAeronaves");
    } else {
      alert("Usuário ou senha inválidos!");
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