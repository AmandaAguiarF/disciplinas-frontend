document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:3000/api'; // Atualize para sua API
    const userModal = document.getElementById('userModal');
    const userForm = document.getElementById('userForm');
    const addUserBtn = document.getElementById('addUserBtn');
    const modalTitle = document.getElementById('modalTitle');
    let editUserId = null;

    // Função para carregar usuários
    const loadUsers = async () => {
        const response = await fetch(`${apiUrl}/users`);
        const users = await response.json();
        const tableBody = document.querySelector('#usersTable tbody');
        tableBody.innerHTML = '';

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.profile}</td>
                <td>
                    <button class="editUserBtn" data-id="${user._id}">Editar</button>
                    <button class="deleteUserBtn" data-id="${user._id}">Deletar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Adicionar eventos de edição e deleção
        document.querySelectorAll('.editUserBtn').forEach(button => {
            button.addEventListener('click', (e) => openEditUserModal(e.target.dataset.id));
        });

        document.querySelectorAll('.deleteUserBtn').forEach(button => {
            button.addEventListener('click', (e) => deleteUser(e.target.dataset.id));
        });
    };

    // Função para adicionar usuário
    const addUser = async (user) => {
        await fetch(`${apiUrl}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        loadUsers();
    };

    // Função para atualizar usuário
    const updateUser = async (id, user) => {
        await fetch(`${apiUrl}/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        loadUsers();
    };

    // Função para deletar usuário
    const deleteUser = async (id) => {
        await fetch(`${apiUrl}/users/${id}`, {
            method: 'DELETE'
        });
        loadUsers();
    };

    // Abrir modal para editar usuário
    const openEditUserModal = async (id) => {
        editUserId = id;
        modalTitle.innerText = 'Editar Usuário';

        // Buscar os dados do usuário para preencher o modal
        const response = await fetch(`${apiUrl}/users/${id}`);
        const user = await response.json();

        document.getElementById('name').value = user.name;
        document.getElementById('profile').value = user.profile;
        document.getElementById('password').value = ''; // Não exibir senha

        userModal.style.display = 'block';
    };

    // Abrir modal para adicionar novo usuário
    const openAddUserModal = () => {
        editUserId = null;
        modalTitle.innerText = 'Adicionar Usuário';
        userForm.reset();
        userModal.style.display = 'block';
    };

    // Fechar modal ao clicar no "x"
    document.querySelector('.close').addEventListener('click', () => {
        userModal.style.display = 'none';
    });

    // Fechar modal ao clicar fora dele
    window.addEventListener('click', (event) => {
        if (event.target === userModal) {
            userModal.style.display = 'none';
        }
    });

    // Submissão do formulário
    userForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userData = {
            name: document.getElementById('name').value,
            profile: document.getElementById('profile').value,
            password: document.getElementById('password').value
        };

        if (editUserId) {
            await updateUser(editUserId, userData);
        } else {
            await addUser(userData);
        }

        userModal.style.display = 'none';
        loadUsers();
    });

    // Inicializando o carregamento de usuários e eventos
    addUserBtn.addEventListener('click', openAddUserModal);
    loadUsers();
});
