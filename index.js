fetch("http://localhost:3333/users")
  .then(resposta => resposta.json())
  .then(dados => {
    carregarUsuarios(dados); // passa dados para a função
    console.log(dados)
  });

async function carregarUsuarios() {
  try {
    const resposta = await fetch("http://localhost:3333/users");
    const data = await resposta.json();

    const tbody = document.getElementById("tabela-body");
    tbody.innerHTML = ""; // limpa antes de renderizar

    data.forEach(user => {
      const tr = document.createElement("tr");
      tr.setAttribute('data-id', user.id); // Adiciona o id como atributo na linha
      tr.innerHTML = `
        <td>${user.nome}</td>
        <td>${user.sobrenome}</td>
        <td>${user.idade}</td>
        <td>${user.estado}</td>
        <td>${user.cidade}</td>
        <td>${user.profissao}</td>
        <td>
          <button class="editar" onclick="editar(this)">Editar</button>
          <button class="deletar" onclick="deletar(this)">Deletar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Erro ao carregar usuários:", err);
  }
}


// chama a função ao carregar a página
carregarUsuarios();

// Adiciona evento ao botão Novo Usuario
document.querySelector('.botao').onclick = salvarUsuario;

function salvarUsuario() {
  // Cria o formulário de novo usuário
  const form = document.createElement('form');
  form.innerHTML = `
    <label>Nome: <input name="nome" required /></label><br>
    <label>Sobrenome: <input name="sobrenome" required /></label><br>
    <label>Idade: <input name="idade" type="number" required /></label><br>
    <label>Estado: <input name="estado" required /></label><br>
    <label>Cidade: <input name="cidade" required /></label><br>
    <label>Profissão: <input name="profissao" required /></label><br>
    <button type="submit">Salvar</button>
    <button type="button" id="cancelar">Cancelar</button>
  `;
  form.style.position = 'fixed';
  form.style.top = '50%';
  form.style.left = '50%';
  form.style.transform = 'translate(-50%, -50%)';
  form.style.background = '#fff';
  form.style.padding = '2rem';
  form.style.zIndex = '1000';
  form.style.border = '1px solid #1976d2';
  document.body.appendChild(form);

  // Fecha o formulário
  form.querySelector('#cancelar').onclick = () => {
    document.body.removeChild(form);
  };

  // Envia os dados do novo usuário
  form.onsubmit = async (e) => {
    e.preventDefault();
    const dados = Object.fromEntries(new FormData(form));
    try {
      await fetch('http://localhost:3333/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
      document.body.removeChild(form);
      carregarUsuarios();
    } catch (err) {
      alert('Erro ao salvar usuário');
    }
  };
}


function deletar(botao) {
  const tr = botao.closest('tr');
  const id = tr.getAttribute('data-id');
  if (confirm('Tem certeza que deseja deletar este usuário?')) {
    fetch(`http://localhost:3333/users/${id}`, {
      method: 'DELETE'
    })
    .then(() => carregarUsuarios())
    .catch(() => alert('Erro ao deletar usuário'));
  }
}

function editar(botao) {
  const tr = botao.closest('tr');
  const id = tr.getAttribute('data-id');
  const tds = tr.querySelectorAll('td');
  // Obtém os dados do usuário da linha
  const usuario = {
    nome: tds[0].textContent,
    sobrenome: tds[1].textContent,
    idade: tds[2].textContent,
    estado: tds[3].textContent,
    cidade: tds[4].textContent,
    profissao: tds[5].textContent
  };

  // Cria o formulário de edição
  const form = document.createElement('form');
  form.innerHTML = `
    <label>Nome: <input name="nome" value="${usuario.nome}" /></label><br>
    <label>Sobrenome: <input name="sobrenome" value="${usuario.sobrenome}" /></label><br>
    <label>Idade: <input name="idade" value="${usuario.idade}" type="number" /></label><br>
    <label>Estado: <input name="estado" value="${usuario.estado}" /></label><br>
    <label>Cidade: <input name="cidade" value="${usuario.cidade}" /></label><br>
    <label>Profissão: <input name="profissao" value="${usuario.profissao}" /></label><br>
    <button type="submit">Salvar</button>
    <button type="button" id="cancelar">Cancelar</button>
  `;
  form.style.position = 'fixed';
  form.style.top = '50%';
  form.style.left = '50%';
  form.style.transform = 'translate(-50%, -50%)';
  form.style.background = '#fff';
  form.style.padding = '2rem';
  form.style.zIndex = '1000';
  form.style.border = '1px solid #1976d2';
  document.body.appendChild(form);

  // Fecha o formulário
  form.querySelector('#cancelar').onclick = () => {
    document.body.removeChild(form);
  };

  // Envia os dados editados
  form.onsubmit = async (e) => {
    e.preventDefault();
    const dadosEditados = Object.fromEntries(new FormData(form));
    try {
      await fetch(`http://localhost:3333/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosEditados)
      });
      document.body.removeChild(form);
      carregarUsuarios();
    } catch (err) {
      alert('Erro ao editar usuário');
    }
  };
}

