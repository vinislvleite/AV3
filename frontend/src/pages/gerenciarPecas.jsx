import React, { useState, useEffect } from "react";
import api from "../services/api"; // Conexão com Back
import "../styles/gerenciarPecas.css";

function GerenciarPecas() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalStatus, setMostrarModalStatus] = useState(false);

  // Estados do Banco
  const [pecas, setPecas] = useState([]);
  const [aeronaves, setAeronaves] = useState([]);

  // Estados do Formulário
  const [novaPeca, setNovaPeca] = useState({
    nome: "",
    tipo: "NACIONAL",
    fornecedor: "",
    status: "em producao",
    aeronaveCodigo: "" // Obrigatório para o banco
  });

  const [pecaSelecionada, setPecaSelecionada] = useState("");
  const [novoStatus, setNovoStatus] = useState("em producao");

  // 1. CARREGAR DADOS (GET)
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [resPecas, resAero] = await Promise.all([
          api.get("/pecas"),
          api.get("/aeronaves")
        ]);
        setPecas(resPecas.data);
        setAeronaves(resAero.data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };
    carregarDados();
  }, []);

  const handleChange = (e) => {
    setNovaPeca({ ...novaPeca, [e.target.name]: e.target.value });
  };

  // 2. CADASTRAR (POST)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!novaPeca.aeronaveCodigo) {
      alert("Selecione uma aeronave para vincular a peça!");
      return;
    }

    try {
      await api.post("/pecas", {
        nome: novaPeca.nome,
        tipo: novaPeca.tipo,
        fornecedor: novaPeca.fornecedor,
        status: novaPeca.status,
        aeronaveCodigo: novaPeca.aeronaveCodigo
      });

      alert("Peça cadastrada com sucesso!");
      setMostrarModal(false);
      
      // Recarrega lista
      const res = await api.get("/pecas");
      setPecas(res.data);

      // Reseta form
      setNovaPeca({ 
        nome: "", 
        tipo: "NACIONAL", 
        fornecedor: "", 
        status: "em producao", 
        aeronaveCodigo: "" 
      });

    } catch (error) {
      alert("Erro ao cadastrar peça: " + (error.response?.data?.error || "Erro desconhecido"));
    }
  };

  // 3. EXCLUIR (DELETE)
  // Nota: Seu backend atual não tem rota DELETE para peças no controller que fiz. 
  // Se precisar, descomente abaixo e adicione no backend.
  const excluirPeca = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta peça?")) {
      // await api.delete(`/pecas/${id}`); 
      // setPecas(pecas.filter((p) => p.id !== id));
      alert("Funcionalidade de exclusão pendente no servidor.");
    }
  };

  // 4. ATUALIZAR STATUS (PATCH)
  const atualizarStatus = async () => {
    if (!pecaSelecionada) {
      alert("Selecione uma peça para atualizar o status.");
      return;
    }

    try {
      await api.patch(`/pecas/${pecaSelecionada}/status`, { status: novoStatus });
      
      alert("Status atualizado!");
      setMostrarModalStatus(false);
      setPecaSelecionada("");
      setNovoStatus("em producao");

      // Recarrega lista
      const res = await api.get("/pecas");
      setPecas(res.data);
    } catch (error) {
      alert("Erro ao atualizar status.");
    }
  };

  const formatarStatus = (status) => {
    const mapa = {
      "em producao": "Em produção",
      "em transporte": "Em transporte",
      "pronta para uso": "Pronta para uso"
    };
    return mapa[status] || status;
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
                <span className={`tipo-peca ${p.tipo === "IMPORTADA" ? "tipo-importada" : "tipo-nacional"}`}>
                  {p.tipo}
                </span>
              </div>

              <p><strong>ID:</strong> {p.id}</p>
              <p><strong>Fornecedor:</strong> {p.fornecedor || "Não informado"}</p>
              <p><strong>Status:</strong> {formatarStatus(p.status)}</p>
              <p><strong>Aeronave:</strong> {p.aeronave ? p.aeronave.modelo : "N/A"}</p>

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
              
              {/* CAMPO NOVO: AERONAVE (Obrigatório para o Back) */}
              <div className="form-group">
                <label>Vincular Aeronave</label>
                <select 
                  name="aeronaveCodigo" 
                  value={novaPeca.aeronaveCodigo} 
                  onChange={handleChange} 
                  required
                >
                  <option value="">Selecione...</option>
                  {aeronaves.map(a => (
                    <option key={a.codigo} value={a.codigo}>{a.modelo}</option>
                  ))}
                </select>
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
                  placeholder="Ex: Embraer..."
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