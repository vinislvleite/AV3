import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/sidebar.css";

function SideBar() {
  const [active, setActive] = useState("aeronaves");
  const [nome, setNome] = useState("Usuário");
  const [cargo, setCargo] = useState(""); // Inicializa vazio

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("usuario");
    const cargoSalvo = localStorage.getItem("cargo");

    if (usuarioSalvo) setNome(usuarioSalvo);
    
    // MUDANÇA NECESSÁRIA 1: Normalizar para minúsculo
    // Isso garante que "Administrador" ou "ADMINISTRADOR" vire "administrador"
    // e bata com as chaves do objeto 'menus' abaixo.
    if (cargoSalvo) setCargo(cargoSalvo.toLowerCase());
  }, []);

  const menus = {
    // Chaves em minúsculo para bater com a normalização acima
    administrador: [
      { id: "aeronaves", nome: "Gerenciar Aeronaves", path: "/gerenciarAeronaves" },
      { id: "funcionarios", nome: "Gerenciar Funcionários", path: "/gerenciarFuncionarios" },
      { id: "pecas", nome: "Gerenciar Peças", path: "/gerenciarPecas" },
      { id: "testes", nome: "Gerenciar Testes", path: "/gerenciarTestes" },
    ],
    engenheiro: [
      { id: "aeronaves", nome: "Gerenciar Aeronaves", path: "/gerenciarAeronaves" },
      { id: "pecas", nome: "Gerenciar Peças", path: "/gerenciarPecas" },
      { id: "testes", nome: "Gerenciar Testes", path: "/gerenciarTestes" },
    ],
    operador: [
      { id: "aeronaves", nome: "Gerenciar Aeronaves", path: "/gerenciarAeronaves" },
      { id: "pecas", nome: "Visualizar Peças", path: "/gerenciarPecas" },
      { id: "testes", nome: "Visualizar Testes", path: "/gerenciarTestes" },
    ],
  };

  // Garante que se o cargo não existir, não quebra a tela
  const botoes = menus[cargo] || [];

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("gerenciarAeronaves")) setActive("aeronaves");
    else if (path.includes("gerenciarFuncionarios")) setActive("funcionarios");
    else if (path.includes("gerenciarPecas")) setActive("pecas");
    else if (path.includes("gerenciarTestes")) setActive("testes");
  }, [location]);

  const handleNavigation = (path, item) => {
    setActive(item);
    navigate(path);
  };

  // MUDANÇA NECESSÁRIA 2: Limpeza do Logout
  // Como agora usamos banco de dados, não precisamos salvar/restaurar
  // 'aeronaves_global' ou 'pecas_global' no localStorage. Só limpar a sessão.
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="sidebar">
      <div className="perfil">
        <img src="/perfil_icon.png" alt="Ícone perfil" className="icon-usuario" />
        <div className="perfil-info">
          <h3>{nome}</h3>
          {/* Exibe com a primeira letra maiúscula apenas visualmente */}
          <p>{cargo ? cargo.charAt(0).toUpperCase() + cargo.slice(1) : "..."}</p>
        </div>
        <img
          src="/sair_icon.png"
          alt="Sair ícone"
          className="logout-icon"
          onClick={handleLogout}
          style={{ cursor: "pointer" }}
        />
      </div>

      <div className="menu">
        {botoes.map((botao) => (
          <button
            key={botao.id}
            className={active === botao.id ? "active" : ""}
            onClick={() => handleNavigation(botao.path, botao.id)}
          >
            {botao.nome}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SideBar;