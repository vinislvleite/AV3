import React, { useState, useEffect } from "react";
import api from "../services/api";
import "../styles/gerenciarTestes.css";

function GerenciarTestes() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [testes, setTestes] = useState([]);
  const [aeronaves, setAeronaves] = useState([]); 
  
  const cargo = localStorage.getItem("cargo") || "";
  const podeEditar = cargo.toUpperCase() !== "OPERADOR";

  const [novoTeste, setNovoTeste] = useState({
    aeronaveCodigo: "", 
    nome: "",
    tipo: "ELETRICO", 
    resultado: "APROVADO", 
  });

  const carregarTestes = async () => {
    try {
      const [resTestes, resAero] = await Promise.all([
        api.get("/testes"), 
        api.get("/aeronaves")
      ]);
      setTestes(resTestes.data);
      setAeronaves(resAero.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    carregarTestes();
  }, []);

  const handleChange = (e) => {
    const value = (e.target.name === 'tipo' || e.target.name === 'resultado') 
                    ? e.target.value.toUpperCase()
                    : e.target.value;
    
    setNovoTeste({ ...novoTeste, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!podeEditar) {
      alert("Acesso negado: operadores não podem criar testes.");
      setMostrarModal(false);
      return;
    }
    
    if (!novoTeste.aeronaveCodigo) {
        alert("Selecione a aeronave!");
        return;
    }

    if (!novoTeste.nome.trim()) {
        alert("O nome do teste é obrigatório!");
        return;
    }

    try {
      await api.post("/testes", novoTeste); 
      
      alert("Teste cadastrado com sucesso!");
      setMostrarModal(false);
      
      setNovoTeste({ aeronaveCodigo: "", nome: "", tipo: "ELETRICO", resultado: "APROVADO" });
      carregarTestes();
      
    } catch (error) {
      const msg = error.response?.data?.error || "Erro ao cadastrar teste.";
      alert("Erro ao cadastrar: " + msg);
    }
  };

  const excluirTeste = async (id) => {
    if (!podeEditar) {
      alert("Acesso negado: operadores não podem excluir testes.");
      return;
    }

    if (window.confirm("Tem certeza que deseja excluir este teste?")) {
      try {
        await api.delete(`/testes/${id}`);
        alert("Teste excluído!");
        carregarTestes();
      } catch (error) {
        const msg = error.response?.data?.error || "Erro ao excluir teste.";
        alert(msg);
      }
    }
  };

  const formatarResultado = (resultado) => {
      const mapa = {
          "APROVADO": "Aprovado",
          "REPROVADO": "Reprovado"
      };
      return mapa[resultado] || resultado;
  };

  const formatarTipoTeste = (tipo) => {
      const mapa = {
          "ELETRICO": "Elétrico",
          "HIDRAULICO": "Hidráulico",
          "AERODINAMICO": "Aerodinâmico"
      };
      return mapa[tipo] || tipo;
  };
  
  const getModeloAeronave = (aeronaveId) => {
    return aeronaves.find(a => a.codigo === aeronaveId)?.modelo || 'N/A';
  }
  
  return (
    <div className="testes-container">
      <div className="testes-header">
        <h1 className="testes-titulo">Gerenciar Testes</h1>
        <div className="testes-acoes">
          {podeEditar && (
            <button className="button-nova" onClick={() => setMostrarModal(true)}>
              Novo Teste
            </button>
          )}
        </div>
      </div>

      <div className="lista-testes">
        <h2 className="titulo-secao">Lista de Testes</h2>

        <div className="grade-testes">
          {testes.length === 0 ? <p>Nenhum teste encontrado. Cadastre um novo.</p> : null}
          {testes.map((t) => (
            <div key={t.id} className="cartao-teste">
              <div className="cabecalho-teste">
                <h3 className="nome-teste">{t.nome}</h3>
                <span
                  className={`resultado-badge ${
                    t.resultado === "APROVADO"
                      ? "resultado-aprovado"
                      : "resultado-reprovado"
                  }`}
                >
                  {formatarResultado(t.resultado)}
                </span>
              </div>

              <p><strong>Aeronave:</strong> {getModeloAeronave(t.aeronaveId)}</p>
              <p><strong>Tipo de Teste:</strong> {formatarTipoTeste(t.tipo)}</p>
              <p><strong>ID: {t.id}</strong></p>

              <div className="acoes-teste">
                {podeEditar && (
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
                <label>Aeronave</label>
                <select
                  name="aeronaveCodigo"
                  value={novoTeste.aeronaveCodigo}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione...</option>
                  {aeronaves.map(a => (
                    <option key={a.codigo} value={a.codigo}>{a.modelo} (Cód: {a.codigo})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Nome do Teste</label>
                <input
                  type="text"
                  name="nome"
                  value={novoTeste.nome}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Teste de Pressão Hidráulica"
                />
              </div>

              <div className="form-group">
                <label>Tipo de Teste</label>
                <select
                  name="tipo"
                  value={novoTeste.tipo}
                  onChange={handleChange}
                >
                  <option value="ELETRICO">Elétrico</option>
                  <option value="HIDRAULICO">Hidráulico</option>
                  <option value="AERODINAMICO">Aerodinâmico</option>
                </select>
              </div>

              <div className="form-group">
                <label>Resultado</label>
                <select
                  name="resultado"
                  value={novoTeste.resultado}
                  onChange={handleChange}
                >
                  <option value="APROVADO">Aprovado</option>
                  <option value="REPROVADO">Reprovado</option>
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