import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "../styles/gerenciarAeronaves.css";

function GerenciarAeronaves() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [aeronaves, setAeronaves] = useState(() => {
    const salvas = localStorage.getItem("aeronaves_global");
    return salvas ? JSON.parse(salvas) : [];
  });

  useEffect(() => {
    localStorage.setItem("aeronaves_global", JSON.stringify(aeronaves));
  }, [aeronaves]);

  const normalizar = (texto) =>
    texto
      ? texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
      : "operador";

  const cargo = normalizar(localStorage.getItem("cargo") || "operador");

  const [formData, setFormData] = useState({
    id: "",
    modelo: "",
    tipo: "COMERCIAL",
    capacidade: "",
    alcance: "",
  });

  const handleAddAircraft = (newAircraft) => {
    const idNumber = parseInt(newAircraft.id, 10);
    if (isNaN(idNumber) || idNumber <= 0) {
      alert("O ID deve ser um número positivo!");
      return;
    }
    if (aeronaves.some((a) => a.id === idNumber)) {
      alert("Já existe uma aeronave com esse ID!");
      return;
    }

    const novaAeronave = {
      ...newAircraft,
      id: idNumber,
      capacidade: parseInt(newAircraft.capacidade, 10),
      alcance: parseInt(newAircraft.alcance, 10),
    };

    setAeronaves([...aeronaves, novaAeronave]);
    setShowModal(false);
    setFormData({
      id: "",
      modelo: "",
      tipo: "COMERCIAL",
      capacidade: "",
      alcance: "",
    });
  };

  const handleDeleteAircraft = (id) => {
    if (cargo === "operador") {
      alert("Apenas administradores e engenheiros podem excluir aeronaves!");
      return;
    }
    if (window.confirm("Tem certeza que deseja excluir esta aeronave?")) {
      setAeronaves(aeronaves.filter((a) => a.id !== id));
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddAircraft(formData);
  };

  const gerarRelatorio = async (aeronave) => {
    const pecas = JSON.parse(localStorage.getItem("pecas")) || [];
    const etapas = JSON.parse(localStorage.getItem("etapas")) || [];
    const testes = JSON.parse(localStorage.getItem("testes")) || [];
    const dataAtual = new Date().toLocaleDateString("pt-BR");

    let texto = `Relatório da Aeronave\n\n`;
    texto += `Informações da aeronave:\n`;
    texto += `• Código: ${aeronave.id || "N/A"}\n`;
    texto += `• Modelo: ${aeronave.modelo || "N/A"}\n`;
    texto += `• Tipo: ${aeronave.tipo || "N/A"}\n`;
    texto += `• Capacidade: ${aeronave.capacidade || "N/A"} passageiros\n`;
    texto += `• Alcance: ${aeronave.alcance || "N/A"} km\n\n`;

    texto += `Peças usadas:\n`;
    if (pecas.length > 0) {
      pecas.forEach((p, i) => {
        texto += `${i + 1}. ${p.nome} | Tipo: ${p.tipo} | Fornecedor: ${p.fornecedor} | Status: ${p.status}\n`;
      });
    } else {
      texto += `Nenhuma peça registrada\n`;
    }

    texto += `\nEtapas de produção da aeronave:\n`;
    if (etapas.length > 0) {
      etapas.forEach((e, i) => {
        texto += `${i + 1}. ${e.nome || "Etapa"} | Prazo: ${e.prazo || "N/A"} | Status: ${e.status || "N/A"}\n`;
      });
    } else {
      texto += `Nenhuma etapa registrada\n`;
    }

    texto += `\nResultado dos testes:\n`;
    if (testes.length > 0) {
      testes.forEach((t, i) => {
        texto += `${i + 1}. ${t.tipo} | Resultado: ${t.resultado}\n`;
      });
    } else {
      texto += `Nenhum teste registrado\n`;
    }

    texto += `\nData de emissão: ${dataAtual}`;

    const doc = new jsPDF();
    let posicaoTexto = 55;

    try {
      const img = new Image();
      img.src = "/AerocodePreto.png";
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      const pageWidth = doc.internal.pageSize.getWidth();
      const proporcao = img.height / img.width;
      const imgWidth = 50;
      const imgHeight = imgWidth * proporcao;
      const x = (pageWidth - imgWidth) / 2;
      doc.addImage(img, "PNG", x, 10, imgWidth, imgHeight);
      posicaoTexto = 10 + imgHeight + 15;
    } catch {
      console.warn("Logo não carregado.");
    }

    doc.setFontSize(16);
    doc.text("Relatório da Aeronave", 105, posicaoTexto, { align: "center" });
    doc.setFontSize(12);
    const linhas = doc.splitTextToSize(texto, 180);
    doc.text(linhas, 10, posicaoTexto + 15, { maxWidth: 180, lineHeightFactor: 1.5 });
    doc.save(`Relatorio_Aeronave_${aeronave.id || "N/A"}.pdf`);
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
          {aeronaves.map((a) => (
            <div key={a.id} className="cartao-aeronave">
              <div className="cabecalho-aeronave">
                <h3 className="nome-aeronave">{a.modelo}</h3>
                <span
                  className={`tipo-aeronave ${
                    a.tipo === "MILITAR" ? "tipo-militar" : "tipo-comercial"
                  }`}
                >
                  {a.tipo}
                </span>
              </div>
              <p><strong>ID:</strong> {a.id}</p>
              <p><strong>Capacidade:</strong> {a.capacidade} passageiros</p>
              <p><strong>Alcance:</strong> {a.alcance} km</p>

              <div className="acoes-aeronave">
                {podeEditar && (
                  <button className="button-excluir" onClick={() => handleDeleteAircraft(a.id)}>
                    Excluir
                  </button>
                )}
                <button
                  className="button-nova"
                  style={{ marginLeft: "10px" }}
                  onClick={() => gerarRelatorio(a)}
                >
                  Gerar Relatório
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

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>ID</label>
                <input
                  type="number"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="Ex: 4"
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
                  placeholder="Ex: Boeing 737 MAX"
                />
              </div>

              <div className="form-group">
                <label>Tipo</label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                >
                  <option value="COMERCIAL">Comercial</option>
                  <option value="MILITAR">Militar</option>
                </select>
              </div>

              <div className="form-group">
                <label>Capacidade (passageiros)</label>
                <input
                  type="number"
                  name="capacidade"
                  value={formData.capacidade}
                  onChange={handleChange}
                  required
                  min="1"
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
                  min="1"
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