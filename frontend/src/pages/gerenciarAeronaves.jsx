import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import api from "../services/api"; // Importe a API
import "../styles/gerenciarAeronaves.css";

function GerenciarAeronaves() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [aeronaves, setAeronaves] = useState([]); // Array vazio inicial

  // Normalização do cargo para verificar permissões
  const normalizar = (texto) =>
    texto
      ? texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
      : "operador";

  const cargo = normalizar(localStorage.getItem("cargo") || "operador");

  const [formData, setFormData] = useState({
    codigo: "", // Backend usa 'codigo'
    modelo: "",
    tipo: "COMERCIAL", // Backend espera "COMERCIAL" ou "MILITAR" (seus enums)
    capacidade: "",
    alcance: "",
  });

  // --- FUNÇÃO PARA BUSCAR (GET) ---
  const carregarAeronaves = async () => {
    try {
      const response = await api.get("/aeronaves");
      setAeronaves(response.data);
    } catch (error) {
      console.error("Erro ao buscar aeronaves:", error);
      // Não damos alert aqui para não ficar chato toda vez que carrega a página
    }
  };

  // Carrega assim que a tela abre
  useEffect(() => {
    carregarAeronaves();
  }, []);

  // --- FUNÇÃO PARA SALVAR (POST) ---
  const handleAddAircraft = async (e) => {
    e.preventDefault();

    // Validações básicas
    if (!formData.codigo || !formData.modelo) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      await api.post("/aeronaves", {
        codigo: formData.codigo,
        modelo: formData.modelo,
        tipo: formData.tipo, 
        // Conversão para números, pois o Prisma define Int
        capacidade: Number(formData.capacidade),
        alcance: Number(formData.alcance),
        cliente: "Cliente Padrão", // Se não tiver no form, mandamos fixo
        dataEntrega: new Date().toISOString() // Data atual
      });

      alert("Aeronave cadastrada com sucesso!");
      setShowModal(false);
      setFormData({ codigo: "", modelo: "", tipo: "COMERCIAL", capacidade: "", alcance: "" });
      carregarAeronaves(); // Atualiza a lista na tela
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.error || "Erro ao cadastrar aeronave";
      alert(msg);
    }
  };

  // --- FUNÇÃO PARA EXCLUIR (DELETE) ---
  const handleDeleteAircraft = async (codigo) => {
    if (cargo === "operador") {
      alert("Apenas administradores e engenheiros podem excluir aeronaves!");
      return;
    }
    
    if (window.confirm(`Tem certeza que deseja excluir a aeronave ${codigo}?`)) {
      try {
        await api.delete(`/aeronaves/${codigo}`);
        alert("Aeronave removida!");
        carregarAeronaves();
      } catch (error) {
        console.error(error);
        alert("Erro ao excluir. Verifique se existem peças ou etapas vinculadas.");
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const gerarRelatorio = (aeronave) => {
    // Mantive a lógica simples, mas idealmente buscaria os dados completos do backend
    alert(`Gerar PDF para ${aeronave.modelo} (Funcionalidade em manutenção para usar o novo banco)`);
  };

  const podeEditar =
    cargo === "administrador" ||
    cargo === "adm" ||
    cargo === "engenheiro";

  return (
    <div className="aeronaves-container">
      <div className="aeronaves-header">
        <h1 className="aeronaves-titulo">Gerenciar Aeronaves</h1>
        <div className="aeronaves-acoes">
          {podeEditar && (
            <button className="button-nova" onClick={() => setShowModal(true)}>
              Nova Aeronave
            </button>
          )}
          <button className="button-etapas" onClick={() => navigate("/etapasProducao")}>
            Etapas de Produção
          </button>
        </div>
      </div>

      <div className="lista-aeronaves">
        <h2 className="titulo-secao">Lista de Aeronaves Cadastradas</h2>
        <div className="grade-aeronaves">
          {aeronaves.length === 0 ? <p>Nenhuma aeronave encontrada.</p> : null}
          
          {aeronaves.map((a) => (
            <div key={a.codigo} className="cartao-aeronave">
              <div className="cabecalho-aeronave">
                <h3 className="nome-aeronave">{a.modelo}</h3>
                <span className={`tipo-aeronave ${a.tipo === "MILITAR" ? "tipo-militar" : "tipo-comercial"}`}>
                  {a.tipo}
                </span>
              </div>
              <p><strong>Código:</strong> {a.codigo}</p>
              <p><strong>Capacidade:</strong> {a.capacidade} passageiros</p>
              <p><strong>Alcance:</strong> {a.alcance} km</p>

              <div className="acoes-aeronave">
                {podeEditar && (
                  <button className="button-excluir" onClick={() => handleDeleteAircraft(a.codigo)}>
                    Excluir
                  </button>
                )}
                <button className="button-nova" style={{ marginLeft: "10px" }} onClick={() => gerarRelatorio(a)}>
                  Relatório
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && podeEditar && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Cadastrar Nova Aeronave</h2>
              <button className="fechar-button" onClick={() => setShowModal(false)}>×</button>
            </div>

            <form onSubmit={handleAddAircraft}>
              {/* Note que mudamos de ID para Código */}
              <div className="form-group">
                <label>Código (ID)</label>
                <input
                  type="text"
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleChange}
                  required
                  placeholder="Ex: 10"
                />
              </div>

              <div className="form-group">
                <label>Modelo</label>
                <input
                  type="text"
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Boeing 737"
                />
              </div>

              <div className="form-group">
                <label>Tipo</label>
                <select name="tipo" value={formData.tipo} onChange={handleChange}>
                  <option value="COMERCIAL">Comercial</option>
                  <option value="MILITAR">Militar</option>
                </select>
              </div>

              <div className="form-group">
                <label>Capacidade</label>
                <input
                  type="number"
                  name="capacidade"
                  value={formData.capacidade}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Alcance (km)</label>
                <input
                  type="number"
                  name="alcance"
                  value={formData.alcance}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" className="button-cancelar" onClick={() => setShowModal(false)}>
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

export default GerenciarAeronaves;