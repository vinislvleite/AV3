import React, { useState, useEffect } from "react";
import "../styles/gerenciarPecas.css";

function GerenciarPecas() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalStatus, setMostrarModalStatus] = useState(false);

  const [pecas, setPecas] = useState(() => {
    const salvas = localStorage.getItem("pecas_global");
    return salvas ? JSON.parse(salvas) : [];
  });

  const [novaPeca, setNovaPeca] = useState({
    id: "",
    nome: "",
    tipo: "NACIONAL",
    fornecedor: "",
    status: "em producao",
  });

  const [pecaSelecionada, setPecaSelecionada] = useState("");
  const [novoStatus, setNovoStatus] = useState("em producao");

  useEffect(() => {
    localStorage.setItem("pecas_global", JSON.stringify(pecas));
  }, [pecas]);

  const handleChange = (e) => {
    setNovaPeca({ ...novaPeca, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const idNumber = parseInt(novaPeca.id, 10);
    if (isNaN(idNumber) || idNumber <= 0) {
      alert("O ID deve ser um número positivo!");
      return;
    }

    if (pecas.some((p) => p.id === idNumber)) {
      alert("Já existe uma peça com esse ID!");
      return;
    }

    const nova = {
      ...novaPeca,
      id: idNumber,
    };

    setPecas([...pecas, nova]);
    setNovaPeca({
      id: "",
      nome: "",
      tipo: "NACIONAL",
      fornecedor: "",
      status: "em producao",
    });
    setMostrarModal(false);
  };

  const excluirPeca = (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta peça?")) {
      setPecas(pecas.filter((p) => p.id !== id));
    }
  };

  const atualizarStatus = () => {
    if (!pecaSelecionada) {
      alert("Selecione uma peça para atualizar o status.");
      return;
    }

    setPecas((prev) =>
      prev.map((p) =>
        p.id === parseInt(pecaSelecionada)
          ? { ...p, status: novoStatus }
          : p
      )
    );

    setMostrarModalStatus(false);
    setPecaSelecionada("");
    setNovoStatus("em producao");
  };

  const formatarStatus = (status) => {
    switch (status) {
      case "em producao":
        return "Em produção";
      case "em transporte":
        return "Em transporte";
      case "pronta para uso":
        return "Pronta para uso";
      default:
        return status;
    }
  };

  return (
    <div className="pecas-container">
      <div className="pecas-header">
        <h1 className="pecas-titulo">Gerenciar Peças</h1>
        <div className="pecas-acoes">
          <button className="button-nova" onClick={() => setMostrarModal(true)}>
            Nova Peça
          </button>
          <button
            className="button-status"
            onClick={() => setMostrarModalStatus(true)}
          >
            Atualizar Status
          </button>
        </div>
      </div>

      <div className="lista-pecas">
        <h2 className="titulo-secao">Lista de Peças</h2>

        <div className="grade-pecas">
          {pecas.map((p) => (
            <div key={p.id} className="cartao-peca">
              <div className="cabecalho-peca">
                <h3 className="nome-peca">{p.nome}</h3>
                <span
                  className={`tipo-peca ${
                    p.tipo === "IMPORTADA"
                      ? "tipo-importada"
                      : "tipo-nacional"
                  }`}
                >
                  {p.tipo}
                </span>
              </div>

              <p><strong>ID:</strong> {p.id}</p>
              <p><strong>Fornecedor:</strong> {p.fornecedor || "Não informado"}</p>
              <p><strong>Status:</strong> {formatarStatus(p.status)}</p>

              <div className="acoes-peca">
                <button
                  className="button-excluir"
                  onClick={() => excluirPeca(p.id)}
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
              <h2 className="modal-title">Cadastrar Nova Peça</h2>
              <button className="fechar-button" onClick={() => setMostrarModal(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>ID</label>
                <input
                  type="number"
                  name="id"
                  value={novaPeca.id}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="Ex: 4"
                />
              </div>

              <div className="form-group">
                <label>Nome da Peça</label>
                <input
                  type="text"
                  name="nome"
                  value={novaPeca.nome}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Asa"
                />
              </div>

              <div className="form-group">
                <label>Fornecedor</label>
                <input
                  type="text"
                  name="fornecedor"
                  value={novaPeca.fornecedor}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Embraer, MIG..."
                />
              </div>

              <div className="form-group">
                <label>Tipo</label>
                <select
                  name="tipo"
                  value={novaPeca.tipo}
                  onChange={handleChange}
                >
                  <option value="NACIONAL">Nacional</option>
                  <option value="IMPORTADA">Importada</option>
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

      {mostrarModalStatus && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Atualizar Status da Peça</h2>
              <button
                className="fechar-button"
                onClick={() => setMostrarModalStatus(false)}
              >
                ×
              </button>
            </div>

            <div className="form-group">
              <label>Selecione a Peça</label>
              <select
                value={pecaSelecionada}
                onChange={(e) => setPecaSelecionada(e.target.value)}
              >
                <option value="">Selecione</option>
                {pecas.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome} (ID: {p.id})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Novo Status</label>
              <select
                value={novoStatus}
                onChange={(e) => setNovoStatus(e.target.value)}
              >
                <option value="em producao">Em produção</option>
                <option value="em transporte">Em transporte</option>
                <option value="pronta para uso">Pronta para uso</option>
              </select>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="button-cancelar"
                onClick={() => setMostrarModalStatus(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="button-salvar"
                onClick={atualizarStatus}
              >
                Atualizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GerenciarPecas;