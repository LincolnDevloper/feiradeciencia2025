const persona = document.getElementById("personagem");
//persona.innerHTML = '<img src="assets/image/rosalind-blinking.png">'
// imagens
const normal = "assets/image/rosalind-dialogue-sprite.png"
const blink = "assets/image/rosalind-blinking.png";

// coloca a imagem normal primeiro
persona.innerHTML = `<img src="${normal}">`;

// animação de piscar
function piscar() {
    // muda para imagem de piscar
    persona.innerHTML = `<img src="${blink}">`;

    // depois de 150 ms volta ao normal
    setTimeout(() => {
        persona.innerHTML = `<img src="${normal}">`;
    }, 150);
}

// executa o piscar em intervalos ALEATÓRIOS (fica mais natural)
setInterval(piscar, 2000 + Math.random() * 3000);