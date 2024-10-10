document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:3000/api'; // Atualize para o URL correto da sua API
    const disciplinaModal = document.getElementById('disciplinaModal');
    const disciplinaForm = document.getElementById('disciplinaForm');
    const addDisciplinaBtn = document.getElementById('addDisciplinaBtn');
    const modalTitleDisciplina = document.getElementById('modalTitleDisciplina');
    let editDisciplinaId = null;

    // Função para carregar disciplinaes
    const loadDisciplinas = async () => {
        const response = await fetch(`${apiUrl}/disciplinas`);
        const disciplinas = await response.json();
        const tableBody = document.querySelector('#disciplinasTable tbody');
        tableBody.innerHTML = '';

        disciplinas.forEach(disciplina => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${disciplina.nome}</td>
                <td>${disciplina.cargaHoraria}</td>
                <td>${disciplina.responsavel ? disciplina.responsavel.name : 'N/A'}</td>
                <td>
                    <button class="editDisciplinaBtn" data-id="${disciplina._id}">Editar</button>
                    <button class="deleteDisciplinaBtn" data-id="${disciplina._id}">Deletar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Adicionar eventos de edição e deleção
        document.querySelectorAll('.editDisciplinaBtn').forEach(button => {
            button.addEventListener('click', (e) => openEditDisciplinaModal(e.target.dataset.id));
        });

        document.querySelectorAll('.deleteDisciplinaBtn').forEach(button => {
            button.addEventListener('click', (e) => deleteDisciplina(e.target.dataset.id));
        });
    };

    // Função para adicionar disciplina
    const addDisciplina = async (disciplina) => {
        await fetch(`${apiUrl}/disciplinas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(disciplina)
        });
        loadDisciplinas();
    };

    // Função para atualizar disciplina
    const updateDisciplina = async (id, disciplina) => {
        await fetch(`${apiUrl}/disciplinas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(disciplina)
        });
        loadDisciplinas();
    };

    // Função para deletar disciplina
    const deleteDisciplina = async (id) => {
        await fetch(`${apiUrl}/disciplinas/${id}`, {
            method: 'DELETE'
        });
        loadDisciplinas();
    };

    // Abrir modal para editar disciplina
    const openEditDisciplinaModal = async (id) => {
        editDisciplinaId = id;
        modalTitleDisciplina.innerText = 'Editar Disciplina';

        // Buscar os dados da disciplina para preencher o modal
        const response = await fetch(`${apiUrl}/disciplinas/${id}`);
        if (response.status === 404) {
            console.error('Disciplina não encontrada');
            return;
        }
        const disciplina = await response.json();

        document.getElementById('nomeDisciplina').value = disciplina.nome;
        document.getElementById('cargaHoraria').value = disciplina.cargaHoraria;
        await loadUsers(disciplina.responsible ? disciplina.responsible._id : null);

        disciplinaModal.style.display = 'block';
    };

    // Abrir modal para adicionar nova disciplina
    const openAddDisciplinaModal = async () => {
        editDisciplinaId = null;
        modalTitleDisciplina.innerText = 'Adicionar Disciplina';
        disciplinaForm.reset();
        await loadUsers(); // Carrega os usuários sem pré-selecionar nenhum
        disciplinaModal.style.display = 'block';
    };

    // Carregar usuários para o select de responsável
    const loadUsers = async (selectedUserId = null) => {
        const response = await fetch(`${apiUrl}/users`);
        const users = await response.json();
        const select = document.getElementById('responsavel');
        select.innerHTML = ''; // Limpa o select

        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user._id;
            option.text = user.name;
            if (user._id === selectedUserId) {
                option.selected = true;
            }
            select.appendChild(option);
        });
    };

    // Fechar modal ao clicar no "x"
    document.querySelector('.close').addEventListener('click', () => {
        disciplinaModal.style.display = 'none';
    });

    // Fechar modal ao clicar fora dele
    window.addEventListener('click', (event) => {
        if (event.target === disciplinaModal) {
            disciplinaModal.style.display = 'none';
        }
    });

    // Submissão do formulário
    disciplinaForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const disciplinaData = {
            nome: document.getElementById('nome').value,
            cargaHoraria: document.getElementById('cargaHoraria').value,
            responsavel : document.getElementById('responsavel').value
        };

        if (editDisciplinaId) {
            await updateDisciplina(editDisciplinaId, disciplinaData);
        } else {
            await addDisciplina(disciplinaData);
        }

        disciplinaModal.style.display = 'none';
        loadDisciplinas();
    });

    // Inicializando o carregamento de disciplinaes e eventos
    addDisciplinaBtn.addEventListener('click', openAddDisciplinaModal);
    loadDisciplinas();
});
