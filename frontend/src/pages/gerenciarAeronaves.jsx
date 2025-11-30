import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import api from "../services/api";
import "../styles/gerenciarAeronaves.css";

function GerenciarAeronaves() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [aeronaves, setAeronaves] = useState([]);

  const normalizar = (texto) =>
    texto
      ? texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
      : "operador";

  const cargo = normalizar(localStorage.getItem("cargo") || "operador");

  const [formData, setFormData] = useState({
    codigo: "",
    modelo: "",
    tipo: "COMERCIAL",
    capacidade: "",
    alcance: "",
    cliente: "",
  });

  const carregarAeronaves = async () => {
    try {
      const response = await api.get("/aeronaves");
      setAeronaves(response.data);
    } catch (error) {
      console.error("Erro ao buscar aeronaves:", error);
    }
  };

  useEffect(() => {
    carregarAeronaves();
  }, []);

  const handleAddAircraft = async (e) => {
    e.preventDefault();

    if (!formData.codigo || !formData.modelo || !formData.cliente) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      await api.post("/aeronaves", {
        codigo: formData.codigo,
        modelo: formData.modelo,
        tipo: formData.tipo,
        capacidade: Number(formData.capacidade),
        alcance: Number(formData.alcance),
        cliente: formData.cliente,
        dataEntrega: new Date().toISOString(),
      });

      alert("Aeronave cadastrada com sucesso!");
      setShowModal(false);

      setFormData({
        codigo: "",
        modelo: "",
        tipo: "COMERCIAL",
        capacidade: "",
        alcance: "",
        cliente: "",
      });

      carregarAeronaves();
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.error || "Erro ao cadastrar aeronave";
      alert(msg);
    }
  };

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

  const formatarTexto = (texto) => {
    if (!texto) return "";
    return texto
      .toString()
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const gerarRelatorio = async (aeronave) => {
    try {
        const response = await api.get(`/aeronaves/${aeronave.codigo}/relatorio`);
        const dados = response.data; 

        const doc = new jsPDF();
        
        const primaryColor = [3, 28, 48]; 
        const secondaryColor = [80, 80, 80]; 
        const lineColor = [200, 200, 200]; 

        // CABEÇALHO PADRÃO
        doc.setFillColor(...primaryColor);
        doc.rect(0, 0, 210, 35, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18); // Título Principal
        doc.text("RELATÓRIO DA AERONAVE", 105, 18, { align: "center" });
        
        doc.setFontSize(12); // Subtítulo (Modelo)
        doc.setFont("helvetica", "normal");
        doc.text(dados.modelo.toUpperCase(), 105, 26, { align: "center" });

        // Dados de Emissão
        doc.setFontSize(9);
        doc.text(`Emissão: ${new Date().toLocaleDateString("pt-BR")}`, 195, 30, { align: "right" });
        doc.text(`ID: #${dados.codigo}`, 15, 30, { align: "left" });

        let y = 50;
        const fontSizeTitulo = 12;
        const fontSizeCorpo = 10;
        const espacoTitulo = 8;
        const espacoLinha = 6;

        // --- 1. FICHA TÉCNICA ---
        doc.setTextColor(...primaryColor);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(fontSizeTitulo);
        doc.text("Ficha Técnica", 15, y);
        
        y += 2;
        doc.setDrawColor(...lineColor);
        doc.setLineWidth(0.5);
        doc.line(15, y, 195, y);
        y += espacoTitulo;

        // Coluna 1
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(fontSizeCorpo);
        
        doc.setFont("helvetica", "bold"); doc.text("Cliente:", 15, y);
        doc.setFont("helvetica", "normal"); doc.text(dados.cliente, 35, y);
        
        doc.setFont("helvetica", "bold"); doc.text("Tipo:", 15, y + espacoLinha);
        doc.setFont("helvetica", "normal"); doc.text(formatarTexto(dados.tipo), 35, y + espacoLinha);

        // Coluna 2
        doc.setFont("helvetica", "bold"); doc.text("Capacidade:", 110, y);
        doc.setFont("helvetica", "normal"); doc.text(`${dados.capacidade} passageiros`, 140, y);

        doc.setFont("helvetica", "bold"); doc.text("Alcance:", 110, y + espacoLinha);
        doc.setFont("helvetica", "normal"); doc.text(`${dados.alcance} km`, 140, y + espacoLinha);

        y += 20;

        // --- 2. PEÇAS ---
        doc.setTextColor(...primaryColor);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(fontSizeTitulo);
        doc.text("Componentes e Peças", 15, y);
        
        y += 2;
        doc.setDrawColor(...lineColor);
        doc.line(15, y, 195, y);
        y += espacoTitulo;

        doc.setFontSize(fontSizeCorpo);
        doc.setTextColor(0, 0, 0);

        if (dados.pecas && dados.pecas.length > 0) {
            dados.pecas.forEach((peca, index) => {
                if (index % 2 !== 0) {
                    doc.setFillColor(245, 245, 245);
                    doc.rect(15, y - 4, 180, espacoLinha, "F");
                }
                
                doc.setFont("helvetica", "bold");
                doc.text(`• ${peca.nome}`, 18, y);
                
                doc.setFont("helvetica", "normal");
                doc.setTextColor(...secondaryColor);
                // Ajuste de espaçamento horizontal para não sobrepor
                doc.text(`|  Forn: ${peca.fornecedor}`, 85, y);
                doc.text(`|  Status: ${formatarTexto(peca.status)}`, 140, y);
                doc.setTextColor(0, 0, 0);
                
                y += espacoLinha;
            });
        } else {
            doc.setFont("helvetica", "italic");
            doc.setTextColor(...secondaryColor);
            doc.text("Nenhuma peça registrada.", 18, y);
            y += espacoLinha;
        }

        y += 10;

        // --- 3. ETAPAS DE PRODUÇÃO ---
        doc.setTextColor(...primaryColor);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(fontSizeTitulo);
        doc.text("Cronograma de Produção", 15, y);
        
        y += 2;
        doc.setDrawColor(...lineColor);
        doc.line(15, y, 195, y);
        y += espacoTitulo;

        if (dados.etapas && dados.etapas.length > 0) {
            dados.etapas.forEach((etapa) => {
                const statusMap = { 0: "Pendente", 1: "Em Andamento", 2: "Finalizada" };
                const statusLabel = statusMap[etapa.status] || "Pendente";
                const dataPrazo = new Date(etapa.prazoConclusao).toLocaleDateString('pt-BR');

                doc.setFont("helvetica", "bold");
                doc.setTextColor(0, 0, 0);
                doc.text(etapa.nome, 18, y);

                doc.setFont("helvetica", "normal");
                doc.setTextColor(...secondaryColor);
                doc.text(`Prazo: ${dataPrazo}`, 120, y);
                
                // Status Colorido
                if(etapa.status === 2) doc.setTextColor(0, 128, 0); // Verde
                else if(etapa.status === 1) doc.setTextColor(200, 150, 0); // Laranja
                else doc.setTextColor(150, 0, 0); // Vermelho
                
                // Ajuste: Status Formatado (Primeira maiúscula) e alinhado
                doc.text(statusLabel, 170, y);
                
                y += espacoLinha;
            });
        } else {
            doc.setFont("helvetica", "italic");
            doc.setTextColor(...secondaryColor);
            doc.text("Nenhuma etapa registrada.", 18, y);
            y += espacoLinha;
        }

        y += 10;

        // --- 4. TESTES ---
        doc.setTextColor(...primaryColor);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(fontSizeTitulo);
        doc.text("Resultados de Testes", 15, y);
        
        y += 2;
        doc.setDrawColor(...lineColor);
        doc.line(15, y, 195, y);
        y += espacoTitulo;

        if (dados.testes && dados.testes.length > 0) {
            dados.testes.forEach((teste) => {
                doc.setFont("helvetica", "normal");
                doc.setTextColor(0, 0, 0);
                doc.text(`• ${teste.nome || formatarTexto(teste.tipo)}`, 18, y);

                const isAprovado = teste.resultado === "APROVADO";
                doc.setTextColor(isAprovado ? 0 : 200, isAprovado ? 128 : 0, 0);
                doc.setFont("helvetica", "bold");
                
                // Ajuste: Resultado Formatado (Aprovado/Reprovado)
                doc.text(formatarTexto(teste.resultado), 170, y);
                
                // Linha pontilhada
                doc.setDrawColor(220, 220, 220);
                doc.setLineDash([1, 1], 0);
                doc.line(90, y, 168, y);
                doc.setLineDash([]); 

                y += espacoLinha;
            });
        } else {
            doc.setFont("helvetica", "italic");
            doc.setTextColor(...secondaryColor);
            doc.text("Nenhum teste registrado.", 18, y);
        }

        // RODAPÉ
        const pageHeight = doc.internal.pageSize.height;
        doc.setFillColor(...primaryColor);
        doc.rect(0, pageHeight - 12, 210, 12, "F");
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text("Aerocode Systems © 2025 - Documento Confidencial", 105, pageHeight - 5, { align: "center" });

        doc.save(`Relatorio_Aeronave_${dados.codigo}.pdf`);

    } catch (error) {
        console.error("Erro ao gerar PDF:", error);
        alert("Falha ao gerar relatório.");
    }
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
              <p><strong>Cliente:</strong> {a.cliente}</p>

              <div className="acoes-aeronave">
                {podeEditar && (
                  <button className="button-excluir" onClick={() => handleDeleteAircraft(a.codigo)}>
                    Excluir
                  </button>
                )}
                <button 
                  className="button-nova" 
                  style={{ marginLeft: "10px" }} 
                  onClick={() => gerarRelatorio(a)}
                >
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
                />
              </div>

              <div className="form-group">
                <label>Cliente</label>
                <input
                  type="text"
                  name="cliente"
                  value={formData.cliente}
                  onChange={handleChange}
                  required
                  placeholder="Ex: LATAM, FAB, Azul..."
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