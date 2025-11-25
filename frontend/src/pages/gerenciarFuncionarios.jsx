import React, { useState, useEffect } from "react";
import "../styles/gerenciarFuncionarios.css";

function GerenciarFuncionarios() {
  const [mostrarModal, setMostrarModal] = useState(false);

  const [funcionarios, setFuncionarios] = useState(() => {
    const salvos = localStorage.getItem("funcionarios_global");
    return salvos ? JSON.parse(salvos) : [];
  });

  const [novoFuncionario, setNovoFuncionario] = useState({
    nome: "",
    usuario: "",
    telefone: "",
    endereco: "",
    nivel: "Operador",
    senha: "",
  });

  useEffect(() => {
    localStorage.setItem("funcionarios_global", JSON.stringify(funcionarios));
  }, [funcionarios]);

  const handleChange = (e) => {
    setNovoFuncionario({ ...novoFuncionario, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const novo = {
      id: funcionarios.length + 1,
      ...novoFuncionario,
    };

    const novaLista = [...funcionarios, novo];
    setFuncionarios(novaLista);
    localStorage.setItem("funcionarios_global", JSON.stringify(novaLista));

    const novoLogin = {
      usuario: novoFuncionario.usuario.trim().toLowerCase(),
      senha: novoFuncionario.senha.trim(),
      cargo: novoFuncionario.nivel,
    };

    const usuariosExtra =
      JSON.parse(localStorage.getItem("usuariosExtra_global")) || [];
    usuariosExtra.push(novoLogin);
    localStorage.setItem("usuariosExtra_global", JSON.stringify(usuariosExtra));

    setNovoFuncionario({
      nome: "",
      usuario: "",
      telefone: "",
      endereco: "",
      nivel: "Operador",
      senha: "",
    });
    setMostrarModal(false);

    alert(`Funcionário criado!\nUsuário: ${novoLogin.usuario}`);
  };

  const excluirFuncionario = (id) => {
    setFuncionarios(funcionarios.filter((f) => f.id !== id));
  };

  return (
    <div className="funcionarios-container">
      <div className="funcionarios-header">
        <h1 className="funcionarios-titulo">Gerenciar Funcionários</h1>
        <button className="button-nova" onClick={() => setMostrarModal(true)}>
          Novo Funcionário
        </button>
      </div>

      <div className="funcionarios-lista">
        <h2 className="titulo-secao">Lista de Funcionários Cadastrados</h2>

        <div className="grade-funcionarios">
          {funcionarios.map((f) => (
            <div key={f.id} className="cartao-funcionario">
              <div className="info-funcionario">
                <h3>{f.nome}</h3>
                <p>
                  <strong>Usuário:</strong> {f.usuario || "(não definido)"}
                </p>
                <p>
                  <strong>Telefone:</strong> {f.telefone}
                </p>
                <p>
                  <strong>Endereço:</strong> {f.endereco}
                </p>
                <p>
                  <strong>Nível:</strong> {f.nivel}
                </p>
              </div>
              <div className="acoes-funcionario">
                <button
                  className="button-excluir"
                  onClick={() => excluirFuncionario(f.id)}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Cadastrar Funcionário</h2>
              <button
                className="fechar-button"
                onClick={() => setMostrarModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nome Completo</label>
                <input
                  type="text"
                  name="nome"
                  value={novoFuncionario.nome}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Usuário de Login</label>
                <input
                  type="text"
                  name="usuario"
                  placeholder="Escolha um nome de usuário"
                  value={novoFuncionario.usuario}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Senha de Acesso</label>
                <input
                  type="password"
                  name="senha"
                  placeholder="Crie uma senha"
                  value={novoFuncionario.senha}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Telefone</label>
                <input
                  type="text"
                  name="telefone"
                  value={novoFuncionario.telefone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Endereço</label>
                <input
                  type="text"
                  name="endereco"
                  value={novoFuncionario.endereco}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Nível de Acesso</label>
                <select
                  name="nivel"
                  value={novoFuncionario.nivel}
                  onChange={handleChange}
                >
                  <option value="Administrador">Administrador</option>
                  <option value="Engenheiro">Engenheiro</option>
                  <option value="Operador">Operador</option>
                </select>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="button-cancelar"
                  onClick={() => setMostrarModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="button-salvar">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GerenciarFuncionarios;