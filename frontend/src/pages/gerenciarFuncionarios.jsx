import React, { useState, useEffect } from "react";
import api from "../services/api";
import "../styles/gerenciarFuncionarios.css";

function GerenciarFuncionarios() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [funcionarios, setFuncionarios] = useState([]);
  const [novoFuncionario, setNovoFuncionario] = useState({
    nome: "",
    usuario: "",
    telefone: "",
    endereco: "",
    nivelPermissao: "Operador",
    senha: "",
  });

  const carregarFuncionarios = async () => {
    try {
      const response = await api.get("/funcionarios");
      setFuncionarios(response.data);
    } catch (error) {
      console.error("Erro ao listar funcionários:", error);
    }
  };

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  const handleChange = (e) => {
    setNovoFuncionario({ ...novoFuncionario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/funcionarios", {
        nome: novoFuncionario.nome,
        usuario: novoFuncionario.usuario,
        senha: novoFuncionario.senha,
        telefone: novoFuncionario.telefone,
        endereco: novoFuncionario.endereco,
        // CORREÇÃO: Envia em MAIÚSCULO para corresponder ao Enum do Backend (ADMINISTRADOR)
        nivelPermissao: novoFuncionario.nivelPermissao.toUpperCase(), 
      });

      alert(`Funcionário ${novoFuncionario.usuario} criado com sucesso!`);
      setNovoFuncionario({
        nome: "",
        usuario: "",
        telefone: "",
        endereco: "",
        nivelPermissao: "Operador",
        senha: "",
      });
      setMostrarModal(false);
      carregarFuncionarios();
    } catch (error) {
      alert("Erro ao cadastrar: " + (error.response?.data?.error || error.message));
    }
  };

  const excluirFuncionario = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este funcionário?")) {
      try {
        await api.delete(`/funcionarios/${id}`);
        alert("Funcionário removido!");
        carregarFuncionarios();
      } catch (error) {
        console.error(error);
        alert("Erro ao excluir funcionário.");
      }
    }
  };

  // NOVA FUNÇÃO: Formata 'ADMINISTRADOR' para 'Administrador'
  const formatarNivel = (nivel) => {
    if (!nivel) return "";
    const lower = nivel.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
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
        <h2 className="titulo-secao">Lista de Funcionários</h2>

        <div className="grade-funcionarios">
          {funcionarios.map((f) => (
            <div key={f.id} className="cartao-funcionario">
              <div className="info-funcionario">
                <h3>{f.nome}</h3>
                <p><strong>Usuário:</strong> {f.usuario}</p>
                <p><strong>Telefone:</strong> {f.telefone}</p>
                {/* APLICAÇÃO DA FUNÇÃO AQUI: */}
                <p><strong>Nível:</strong> {formatarNivel(f.nivelPermissao)}</p>
              </div>
              <div className="acoes-funcionario">
                  <button className="button-excluir" onClick={() => excluirFuncionario(f.id)}>
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
              <button className="fechar-button" onClick={() => setMostrarModal(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nome Completo</label>
                <input type="text" name="nome" value={novoFuncionario.nome} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Usuário</label>
                <input type="text" name="usuario" value={novoFuncionario.usuario} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Senha</label>
                <input type="password" name="senha" value={novoFuncionario.senha} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Telefone</label>
                <input type="text" name="telefone" value={novoFuncionario.telefone} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Endereço</label>
                <input type="text" name="endereco" value={novoFuncionario.endereco} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Nível</label>
                <select name="nivelPermissao" value={novoFuncionario.nivelPermissao} onChange={handleChange}>
                  <option value="Administrador">Administrador</option>
                  <option value="Engenheiro">Engenheiro</option>
                  <option value="Operador">Operador</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="button" className="button-cancelar" onClick={() => setMostrarModal(false)}>Cancelar</button>
                <button type="submit" className="button-salvar">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GerenciarFuncionarios;