import React, { useState, useEffect } from "react";
import api from "../services/api";
import "../styles/etapasProducao.css";

function EtapasProducao() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarAssociarModal, setMostrarAssociarModal] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState("todas");

  const [etapas, setEtapas] = useState([]);
  const [funcionariosDisponiveis, setFuncionariosDisponiveis] = useState([]);
  const [aeronavesDisponiveis, setAeronavesDisponiveis] = useState([]);
  const [listaFuncionariosCompleta, setListaFuncionariosCompleta] = useState([]);

  const normalizar = (t) => t ? t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
  const tipoUsuario = normalizar(localStorage.getItem("cargo") || "operador");
  
  const podeEditar = tipoUsuario === "administrador" || tipoUsuario === "engenheiro";

  const [dadosFormulario, setDadosFormulario] = useState({
    nome: "",
    status: "pendente",
    prazo: "",
    aeronave: "",
    funcionarios: [],
  });

  const carregarTudo = async () => {
    try {
      const [resAero, resFunc] = await Promise.all([
        api.get("/aeronaves"),
        api.get("/funcionarios")
      ]);
      
      setAeronavesDisponiveis(resAero.data);
      setListaFuncionariosCompleta(resFunc.data);
      setFuncionariosDisponiveis(resFunc.data.map(f => f.nome));
      const promisesEtapas = resAero.data.map(a => api.get(`/etapas/aeronave/${a.codigo}`));
      const responsesEtapas = await Promise.all(promisesEtapas);
      
      const todasEtapas = responsesEtapas.flatMap(r => r.data).map(e => ({
        id: e.id,
        nome: e.nome,
        status: e.status === 0 ? "pendente" : e.status === 1 ? "em-andamento" : "finalizada",
        prazo: new Date(e.prazoConclusao).toISOString().split('T')[0],
        aeronave: String(e.aeronaveId),
        funcionarios: e.funcionarios
        ? e.funcionarios.map(f => f.funcionario.nome)
        : []
      }));

      setEtapas(todasEtapas);

    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  useEffect(() => {
    carregarTudo();
  }, []);

const adicionarEtapa = async (dados) => {
    try {
      // 1. Converter Nomes para IDs (igual fizemos no associar)
      const idsFuncionarios = dados.funcionarios
        .map(nome => {
          const func = listaFuncionariosCompleta.find(f => f.nome === nome);
          return func ? func.id : null;
        })
        .filter(id => id !== null);

      // 2. Enviar tudo para o Backend (incluindo o array funcionariosIds)
      await api.post("/etapas", {
        nome: dados.nome,
        prazoConclusao: dados.prazo,
        aeronaveCodigo: dados.aeronave,
        funcionariosIds: idsFuncionarios // <--- O SEGREDO ESTÁ AQUI
      });
      
      alert("Etapa criada com funcionários vinculados!");
      setMostrarModal(false);
      setDadosFormulario({ nome: "", status: "pendente", prazo: "", aeronave: "", funcionarios: [] });
      
      // Recarrega a tela para aparecer os nomes
      carregarTudo();
    } catch (error) {
      console.error(error);
      alert("Erro ao criar etapa: " + (error.response?.data?.error || "Erro desconhecido"));
    }
  };

  const atualizarStatus = async (id, novoStatusString) => {
    let action = "";
    if (novoStatusString === "em-andamento") action = "iniciar";
    if (novoStatusString === "finalizada") action = "finalizar";

    if (!action) return;

    try {
      await api.patch(`/etapas/${id}/${action}`);
      carregarTudo();
    } catch (error) {
      alert("Erro ao atualizar status.");
    }
  };

const excluirEtapa = async (id) => {
    if (!podeEditar) return alert("Acesso negado.");
    
    if (window.confirm("Tem certeza que deseja excluir esta etapa?")) {
      try {
        // Chamada real para o endpoint DELETE do Backend: /api/etapas/:id
        await api.delete(`/etapas/${id}`);
        
        alert("Etapa excluída com sucesso!");
        carregarTudo(); // Recarrega a lista para remover a etapa excluída da tela
      } catch (error) {
        console.error("Erro ao excluir etapa:", error);
        // Captura o erro do servidor (se a etapa não for encontrada, etc.)
        const msg = error.response?.data?.error || "Erro ao excluir etapa. Verifique as dependências ou o servidor.";
        alert(msg);
      }
    }
  };

  const [etapaSelecionada, setEtapaSelecionada] = useState("");
  const [funcionariosSelecionados, setFuncionariosSelecionados] = useState([]);

const handleAssociarFuncionario = async () => {
    if (!podeEditar) return alert("Acesso negado.");
    if (!etapaSelecionada) return alert("Selecione uma etapa!");
    if (funcionariosSelecionados.length === 0) return alert("Selecione pelo menos um funcionário!");

    console.log("--- INICIANDO ASSOCIAÇÃO ---");
    console.log("Etapa Selecionada (ID):", etapaSelecionada);
    console.log("Nomes Selecionados:", funcionariosSelecionados);
    console.log("Lista Completa de Funcionários (para buscar ID):", listaFuncionariosCompleta);

    try {
      // 1. Converter os nomes selecionados (Front) para IDs (Back)
      const idsParaEnviar = funcionariosSelecionados
        .map(nome => {
          // O .trim() ajuda a evitar erros se tiver espaço sobrando no nome
          const func = listaFuncionariosCompleta.find(f => f.nome === nome);
          
          if (!func) {
             console.error(`ERRO: Não encontrei o ID para o nome: "${nome}"`);
             return null;
          }
          return Number(func.id); // Garante que é número
        })
        .filter(id => id !== null);

      console.log("IDs convertidos que serão enviados:", idsParaEnviar);

      if (idsParaEnviar.length === 0) {
        return alert("Erro: Nenhum ID de funcionário foi encontrado. Verifique os nomes.");
      }

      // 2. Enviar para o Backend
      console.log("Enviando POST para:", `/etapas/${etapaSelecionada}/associar`);
      const payload = { funcionariosIds: idsParaEnviar };
      console.log("Body enviado:", payload);

      await api.post(`/etapas/${etapaSelecionada}/associar`, payload);

      console.log("SUCESSO: Resposta do servidor recebida!");
      alert("Funcionário(s) associado(s) com sucesso!");
      
      setMostrarAssociarModal(false);
      setEtapaSelecionada("");
      setFuncionariosSelecionados([]);
      carregarTudo();

    } catch (error) {
      console.error("ERRO NA REQUISIÇÃO:", error);
      // Aqui vamos tentar mostrar o erro exato que o backend mandou
      const msgErroBack = error.response?.data?.error;
      const msgDetalhe = error.response?.data?.details;
      
      console.log("Mensagem do Back:", msgErroBack);
      
      alert(`Falha ao associar:\n${msgErroBack || error.message}\n${msgDetalhe || ''}`);
    }
  };

  const handleChange = (e) => {
    setDadosFormulario({
      ...dadosFormulario,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const etapaEmAndamento = etapas.find(
      (etapa) =>
        String(etapa.aeronave) === String(dadosFormulario.aeronave) &&
        etapa.status !== "finalizada"
    );
    
    adicionarEtapa(dadosFormulario);
  };

  const getStatusTexto = (status) => {
    const mapaStatus = {
      pendente: "Pendente",
      "em-andamento": "Em andamento",
      finalizada: "Finalizada",
    };
    return mapaStatus[status] || status;
  };

  const etapasFiltradas =
    filtroStatus === "todas"
      ? etapas
      : etapas.filter((etapa) => etapa.status === filtroStatus);

  return (
    <div className="etapas-container">
      <div className="etapas-header">
        <h1 className="etapas-titulo">Etapas de Produção</h1>
        <div className="etapas-acoes">
          {podeEditar && (
            <button className="button-nova" onClick={() => setMostrarModal(true)}>
              Nova Etapa
            </button>
          )}
          {podeEditar && (
            <button
              className="button-status"
              onClick={() => setMostrarAssociarModal(true)}
            >
              Associar Funcionário
            </button>
          )}
        </div>
      </div>

      <div className="filtros-container">
        <div className="grupo-filtro">
          <label>Filtrar por status:</label>
          <select
            className="filtro-select"
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
          >
            <option value="todas">Todas as etapas</option>
            <option value="pendente">Pendentes</option>
            <option value="em-andamento">Em andamento</option>
            <option value="finalizada">Finalizadas</option>
          </select>
        </div>
      </div>

      <div className="lista-etapas">
        <h2 className="titulo-secao">Lista de Etapas de Produção</h2>
        <div className="grade-etapas">
          {etapasFiltradas.map((etapa) => (
            <div key={etapa.id} className="cartao-etapa">
              <div className="cabecalho-etapa">
                <h3 className="nome-etapa">{etapa.nome}</h3>
                <span className={`status-etapa status-${etapa.status}`}>
                  {getStatusTexto(etapa.status)}
                </span>
              </div>
              <p>
                <strong>Prazo:</strong> {etapa.prazo}
              </p>
              <p>
                <strong>Aeronave:</strong>{" "}
                {aeronavesDisponiveis.find(
                  (a) => String(a.codigo) === String(etapa.aeronave)
                )?.modelo || "—"}
              </p>
              <div className="funcionarios-etapa">
                <div className="titulo-funcionarios">Funcionários alocados:</div>
                <div className="lista-funcionarios">
                  {etapa.funcionarios.map((funcionario, index) => (
                    <span key={index} className="badge-funcionario">
                      {funcionario}
                    </span>
                  ))}
                </div>
              </div>

              <div className="acoes-etapa">
                {etapa.status === "pendente" && (
                  <button
                    className="button-acao iniciar"
                    onClick={() => atualizarStatus(etapa.id, "em-andamento")}
                  >
                    Iniciar
                  </button>
                )}
                {etapa.status === "em-andamento" && (
                  <button
                    className="button-acao finalizar"
                    onClick={() => atualizarStatus(etapa.id, "finalizada")}
                  >
                    Finalizar
                  </button>
                )}
                {podeEditar && (
                  <button
                    className="button-acao excluir"
                    onClick={() => excluirEtapa(etapa.id)}
                  >
                    Excluir
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {mostrarModal && podeEditar && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Cadastrar Nova Etapa</h2>
              <button
                className="fechar-button"
                onClick={() => setMostrarModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nome da Etapa</label>
                <input
                  type="text"
                  name="nome"
                  value={dadosFormulario.nome}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Prazo de Conclusão</label>
                <input
                  type="date"
                  name="prazo"
                  value={dadosFormulario.prazo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Aeronave</label>
                <select
                  name="aeronave"
                  value={dadosFormulario.aeronave}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione</option>
                  {aeronavesDisponiveis.map((aeronave) => (
                    <option key={aeronave.codigo} value={aeronave.codigo}>
                      {aeronave.modelo}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Funcionários</label>
                <select
                  name="funcionarios"
                  multiple
                  value={dadosFormulario.funcionarios}
                  onChange={(e) => {
                    const selecionados = Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    );
                    setDadosFormulario({
                      ...dadosFormulario,
                      funcionarios: [...new Set(selecionados)],
                    });
                  }}
                  style={{ height: "120px" }}
                >
                  {funcionariosDisponiveis.map((funcionario, idx) => (
                    <option key={idx} value={funcionario}>
                      {funcionario}
                    </option>
                  ))}
                </select>
                <small>Segure Ctrl para selecionar múltiplos funcionários</small>
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

      {mostrarAssociarModal && podeEditar && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">Associar Funcionário a Etapa</h2>
                <button
                  className="fechar-button"
                  onClick={() => setMostrarAssociarModal(false)}
                >
                  ×
                </button>
              </div>
              <div className="form-group">
                <label>Selecione a Etapa</label>
                <select
                  value={etapaSelecionada}
                  onChange={(e) => setEtapaSelecionada(e.target.value)}
                >
                  <option value="">Selecione</option>
                  {etapas.map((etapa) => (
                    <option key={etapa.id} value={etapa.id}>
                      {etapa.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Funcionários</label>
                <select
                  multiple
                  value={funcionariosSelecionados}
                  onChange={(e) => {
                    const selecionados = Array.from(
                      e.target.selectedOptions,
                      (opt) => opt.value
                    );
                    setFuncionariosSelecionados([...new Set(selecionados)]);
                  }}
                  style={{ height: "120px" }}
                >
                  {funcionariosDisponiveis.map((f, idx) => (
                    <option key={idx} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
                <small>Segure Ctrl para selecionar vários</small>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="button-cancelar"
                  onClick={() => setMostrarAssociarModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="button-salvar"
                  onClick={handleAssociarFuncionario}
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

export default EtapasProducao;