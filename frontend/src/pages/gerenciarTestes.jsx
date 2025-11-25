import React, { useState, useEffect } from "react";
import "../styles/gerenciarTestes.css";

function GerenciarTestes() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [testes, setTestes] = useState(() => {
    const salvos = localStorage.getItem("testes_global");
    return salvos ? JSON.parse(salvos) : [];
  });

  const cargo = localStorage.getItem("cargo");

  const [novoTeste, setNovoTeste] = useState({
    id: "",
    nome: "",
    tipo: "elétrico",
    resultado: "aprovado",
  });

  useEffect(() => {
    localStorage.setItem("testes_global", JSON.stringify(testes));
  }, [testes]);

  const handleChange = (e) => {
    setNovoTeste({ ...novoTeste, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (cargo === "Operador") {
      alert("Acesso negado: operadores não podem criar testes.");
      setMostrarModal(false);
      return;
    }

    const idNumber = parseInt(novoTeste.id, 10);
    if (isNaN(idNumber) || idNumber <= 0) {
      alert("O ID deve ser um número positivo!");
      return;
    }

    if (testes.some((t) => t.id === idNumber)) {
      alert("Já existe um teste com esse ID!");
      return;
    }

    const novo = { ...novoTeste, id: idNumber };
    setTestes([...testes, novo]);
    setNovoTeste({ id: "", nome: "", tipo: "elétrico", resultado: "aprovado" });
    setMostrarModal(false);
  };

  const excluirTeste = (id) => {
    if (cargo === "Operador") {
      alert("Acesso negado: operadores não podem excluir testes.");
      return;
    }

    if (window.confirm("Tem certeza que deseja excluir este teste?")) {
      setTestes(testes.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="testes-container">
      <div className="testes-header">
        <h1 className="testes-titulo">Gerenciar Testes</h1>
        <div className="testes-acoes">
          {cargo !== "Operador" && (
            <button className="button-nova" onClick={() => setMostrarModal(true)}>
              Novo Teste
            </button>
          )}
        </div>
      </div>

      <div className="lista-testes">
        <h2 className="titulo-secao">Lista de Testes</h2>

        <div className="grade-testes">
          {testes.map((t) => (
            <div key={t.id} className="cartao-teste">
              <div className="cabecalho-teste">
                <h3 className="nome-teste">{t.nome}</h3>
                <span
                  className={`resultado-badge ${
                    t.resultado === "aprovado"
                      ? "resultado-aprovado"
                      : "resultado-reprovado"
                  }`}
                >
                  {t.resultado.toUpperCase()}
                </span>
              </div>

              <p><strong>ID:</strong> {t.id}</p>
              <p><strong>Tipo de Teste:</strong> {t.tipo}</p>

              <div className="acoes-teste">
                {cargo !== "Operador" && (
                  <button
                    className="button-excluir"
                    onClick={() => excluirTeste(t.id)}
                  >
                    Excluir
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Cadastrar Novo Teste</h2>
              <button
                className="fechar-button"
                onClick={() => setMostrarModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>ID</label>
                <input
                  type="number"
                  name="id"
                  value={novoTeste.id}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="Ex: 1"
                />
              </div>

              <div className="form-group">
                <label>Nome do Teste</label>
                <input
                  type="text"
                  name="nome"
                  value={novoTeste.nome}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Teste de pressão hidráulica"
                />
              </div>

              <div className="form-group">
                <label>Tipo de Teste</label>
                <select
                  name="tipo"
                  value={novoTeste.tipo}
                  onChange={handleChange}
                >
                  <option value="elétrico">Elétrico</option>
                  <option value="hidráulico">Hidráulico</option>
                  <option value="aerodinâmico">Aerodinâmico</option>
                </select>
              </div>

              <div className="form-group">
                <label>Resultado</label>
                <select
                  name="resultado"
                  value={novoTeste.resultado}
                  onChange={handleChange}
                >
                  <option value="aprovado">Aprovado</option>
                  <option value="reprovado">Reprovado</option>
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

export default GerenciarTestes;