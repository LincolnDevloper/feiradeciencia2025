/* ============================================
   QUIZ RPG - FUNCIONALIDADES PRINCIPAIS
   ============================================ */

/* --------- Pegando elementos das telas --------- */
const inicioTela = document.getElementById("inicioTela");
const telaNickname = document.getElementById("telaNickname");
const telaQuiz = document.getElementById("telaQuiz");
const resultadoTela = document.getElementById("resultadoTela");

const irParaNickname = document.getElementById("irParaNickname");
const voltaInicio = document.getElementById("voltaInicio");
const formularioNick = document.getElementById("formularioNick");

const textoQuestao = document.getElementById("textoQuestao");
const alternativasContainer = document.getElementById("alternativas");
const questaoAnterior = document.getElementById("questaoAnterior");
const questaoProxima = document.getElementById("questaoProxima");

const progressoBar = document.querySelector("#progresso .fill");
const questaoAtualSpan = document.getElementById("questaoAtual");
const questoesTotalSpan = document.getElementById("questoesTotal");

const scoreFinal = document.getElementById("scoreFinal");
const scoreMax = document.getElementById("scoreMax");
const listaLeaderboard = document.getElementById("listaLeaderboard");
const btnRestart = document.getElementById("btnRestart");

/* --------- Variáveis do sistema --------- */
let usuario = {
  nome: "",
  serie: "",
  turma: "",
};

let indiceQuestao = 0;
let questoes = [];
let respostas = [];
let score = 0;

/* --------- Questões do Quiz --------- */
questoes = [
  {
    pergunta: "O que a Fotografia 51 revelou?",
    alternativas: [
      "Estrutura do DNA",
      "Estrutura de protéinas",
      "Formação de cristais de sal",
      "Estrutura do RNA",
    ],
    correta: 0,
  },
  {
    pergunta: "Que problema marcou a carreira de Franklin?",
    alternativas: [
      "Falta de recursos financeiros",
      "Conflitos com universidades",
      "Machismo científico",
      "Baixo reconhecimento acadêmico na época",
    ],
    correta: 2,
  },
  {
    pergunta: "O que Franklin estudou no Birkbeck?",
    alternativas: [
      "Cristalização de sais",
      "Estrutura de vírus",
      "Estrutura de plantas",
      "Formação de minerais",
    ],
    correta: 1,
  },
  {
    pergunta: "Quem continuou os estudos dela?",
    alternativas: [
      "James Watson",
      "Maurice Wilkins",
      "Francis Crick",
      "Aaron Klug",
    ],
    correta: 3,
  },
  
];

// atualizar total
questoesTotalSpan.textContent = questoes.length;

/* ============================================
   FUNÇÕES DE TROCA DE TELAS
   ============================================ */
function trocarTela(tela) {
  document
    .querySelectorAll(".tela")
    .forEach((t) => t.classList.remove("ativa"));
  tela.classList.add("ativa");
}

/* ============================================
   TELA 1 → TELA NICKNAME
   ============================================ */
irParaNickname.addEventListener("click", () => {
  trocarTela(telaNickname);
});

/* voltar */
voltaInicio.addEventListener("click", () => {
  trocarTela(inicioTela);
});

/* ============================================
   FORM NICKNAME (validação + iniciar quiz)
   ============================================ */
formularioNick.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = document.getElementById("displayNome").value.trim();
  const serie = document.getElementById("serie").value;
  const turma = document.getElementById("turma").value;

  if (nome === "" || serie === "" || turma === "") {
    alert("Preencha todas as informações.");
    return;
  }

  usuario = { nome, serie, turma };

  iniciarQuiz();
});

/* ============================================
   INICIAR QUIZ
   ============================================ */
function iniciarQuiz() {
  indiceQuestao = 0;
  respostas = Array(questoes.length).fill(null);

  carregarQuestao();
  atualizarProgresso();

  trocarTela(telaQuiz);
}

/* ============================================
   CARREGAR QUESTÃO
   ============================================ */
function carregarQuestao() {
  const q = questoes[indiceQuestao];

  textoQuestao.textContent = q.pergunta;

  alternativasContainer.innerHTML = "";

  q.alternativas.forEach((alt, i) => {
    const span = document.createElement("span");
    span.classList.add("alternativa");
    span.textContent = alt;

    if (respostas[indiceQuestao] === i) {
      span.classList.add("selected");
    }

    span.addEventListener("click", () => selecionarResposta(i));

    alternativasContainer.appendChild(span);
  });

  questaoAtualSpan.textContent = indiceQuestao + 1;
}

/* ============================================
   SELECIONAR ALTERNATIVA
   ============================================ */
function selecionarResposta(indice) {
  respostas[indiceQuestao] = indice;

  document
    .querySelectorAll(".alternativa")
    .forEach((a) => a.classList.remove("selected"));

  document.querySelectorAll(".alternativa")[indice].classList.add("selected");
}

/* ============================================
   NAVEGAÇÃO ENTRE QUESTÕES
   ============================================ */
questaoProxima.addEventListener("click", () => {
  if (indiceQuestao < questoes.length - 1) {
    indiceQuestao++;
    carregarQuestao();
    atualizarProgresso();
  } else {
    finalizarQuiz();
  }
});

questaoAnterior.addEventListener("click", () => {
  if (indiceQuestao > 0) {
    indiceQuestao--;
    carregarQuestao();
    atualizarProgresso();
  }
});

/* ============================================
   ATUALIZAR PROGRESSO
   ============================================ */
function atualizarProgresso() {
  const porcentagem = ((indiceQuestao + 1) / questoes.length) * 100;
  progressoBar.style.width = `${porcentagem}%`;
}

/* ============================================
   FINALIZAR QUIZ
   ============================================ */
function finalizarQuiz() {
  score = 0;

  respostas.forEach((r, i) => {
    if (r === questoes[i].correta) score++;
  });

  scoreFinal.textContent = score;
  scoreMax.textContent = questoes.length;

  atualizarLeaderboard();

  trocarTela(resultadoTela);
}

/* ============================================
   LEADERBOARD (LOCALSTORAGE)
   ============================================ */
function atualizarLeaderboard() {
  let leaderboard = JSON.parse(localStorage.getItem("ranking")) || [];

  leaderboard.push({
    nome: usuario.nome,
    serie: usuario.serie,
    turma: usuario.turma,
    pontos: score,
  });

  leaderboard.sort((a, b) => b.pontos - a.pontos);

  localStorage.setItem("ranking", JSON.stringify(leaderboard));

  listaLeaderboard.innerHTML = "";
  leaderboard.slice(0, 10).forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.nome} (${item.serie}${item.turma}) — ${item.pontos} pts`;
    listaLeaderboard.appendChild(li);
  });
}

/* ============================================
   REINICIAR QUIZ
   ============================================ */
btnRestart.addEventListener("click", () => {
  trocarTela(inicioTela);
});
