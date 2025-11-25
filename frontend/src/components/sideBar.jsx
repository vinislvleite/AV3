import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/sidebar.css";

function SideBar() {
  const [active, setActive] = useState("aeronaves");
  const [nome, setNome] = useState("Usuário");
  const [cargo, setCargo] = useState("Desconhecido");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("usuario");
    const cargoSalvo = localStorage.getItem("cargo");
    if (usuarioSalvo) setNome(usuarioSalvo);
    if (cargoSalvo) setCargo(cargoSalvo);
  }, []);

  const menus = {
    Administrador: [
      { id: "aeronaves", nome: "Gerenciar Aeronaves", path: "/gerenciarAeronaves" },
      { id: "funcionarios", nome: "Gerenciar Funcionários", path: "/gerenciarFuncionarios" },
      { id: "pecas", nome: "Gerenciar Peças", path: "/gerenciarPecas" },
      { id: "testes", nome: "Gerenciar Testes", path: "/gerenciarTestes" },
    ],
    Engenheiro: [
      { id: "aeronaves", nome: "Gerenciar Aeronaves", path: "/gerenciarAeronaves" },
      { id: "pecas", nome: "Gerenciar Peças", path: "/gerenciarPecas" },
      { id: "testes", nome: "Gerenciar Testes", path: "/gerenciarTestes" },
    ],
    Operador: [
      { id: "aeronaves", nome: "Gerenciar Aeronaves", path: "/gerenciarAeronaves" },
      { id: "pecas", nome: "Visualizar Peças", path: "/gerenciarPecas" },
      { id: "testes", nome: "Visualizar Testes", path: "/gerenciarTestes" },
    ],
  };

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

  const handleLogout = () => {
    const dadosGlobais = {
      aeronaves: localStorage.getItem("aeronaves_global"),
      pecas: localStorage.getItem("pecas_global"),
      etapas: localStorage.getItem("etapas_global"),
      funcionarios: localStorage.getItem("funcionarios_global"),
      testes: localStorage.getItem("testes_global"),
      usuariosExtra: localStorage.getItem("usuariosExtra_global"),
    };

    localStorage.clear();

    if (dadosGlobais.aeronaves)
      localStorage.setItem("aeronaves_global", dadosGlobais.aeronaves);
    if (dadosGlobais.pecas)
      localStorage.setItem("pecas_global", dadosGlobais.pecas);
    if (dadosGlobais.etapas)
      localStorage.setItem("etapas_global", dadosGlobais.etapas);
    if (dadosGlobais.funcionarios)
      localStorage.setItem("funcionarios_global", dadosGlobais.funcionarios);
    if (dadosGlobais.testes)
      localStorage.setItem("testes_global", dadosGlobais.testes);
    if (dadosGlobais.usuariosExtra)
      localStorage.setItem("usuariosExtra_global", dadosGlobais.usuariosExtra);

    navigate("/");
  };

  return (
    <div className="sidebar">
      <div className="perfil">
        <img src="/perfil_icon.png" alt="Ícone perfil" className="icon-usuario" />
        <div className="perfil-info">
          <h3>{nome}</h3>
          <p>{cargo}</p>
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