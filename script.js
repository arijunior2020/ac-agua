// Preço por garrafão
const precoGarrafao = 3.50;

// Taxas de entrega por bairro
const taxas = {
    "Metropole": 1.00,
    "Araturi": 5.00,
    "Jurema": 6.00,
    "Arianopoli": 5.00
};

// Função para salvar o pedido no Local Storage
function salvarPedidoNoLocalStorage() {
    const quantidade = parseInt(document.getElementById('quantidade').value) || 0;
    const bairro = document.getElementById('bairro').value;
    const taxaEntrega = taxas[bairro] || 0;
    const total = (quantidade * precoGarrafao) + (quantidade > 0 ? taxaEntrega : 0);

    const pedido = {
        quantidade,
        bairro,
        taxaEntrega: quantidade > 0 ? taxaEntrega : 0,
        total
    };

    localStorage.setItem('pedido', JSON.stringify(pedido));
}

// Função para carregar o pedido do Local Storage
function carregarPedidoDoLocalStorage() {
    const pedido = JSON.parse(localStorage.getItem('pedido'));
    if (pedido) {
        document.getElementById('quantidade').value = pedido.quantidade;
        document.getElementById('bairro').value = pedido.bairro;
        document.getElementById('carrinhoTotal').textContent = pedido.total.toFixed(2);
        atualizarCarrinho();
    } else {
        // Se não houver pedido no Local Storage, mostra o carrinho vazio
        document.getElementById('carrinhoTotal').textContent = '0,00';
    }
}

// Função para abrir o modal do carrinho e exibir os detalhes do pedido
function abrirCarrinho() {
    const pedido = JSON.parse(localStorage.getItem('pedido')) || { quantidade: 0, total: 0, taxaEntrega: 0 };
    const quantidade = pedido.quantidade;
    const taxaEntrega = pedido.taxaEntrega;
    const total = pedido.total;

    // Detalhamento do carrinho
    const detalheCarrinho = `Garrafão de Água (${quantidade} x R$${precoGarrafao.toFixed(2)})` + 
        (quantidade > 0 ? ` + Taxa de Entrega: R$${taxaEntrega.toFixed(2)}` : "");
    document.getElementById('detalheCarrinho').textContent = detalheCarrinho;
    document.getElementById('totalCarrinho').textContent = total.toFixed(2);

    // Exibir o modal do carrinho
    const carrinhoModal = new bootstrap.Modal(document.getElementById('carrinhoModal'));
    carrinhoModal.show();
}


// Abrir o modal de finalização do pedido
function abrirModalFinalizacao() {
    const quantidade = parseInt(document.getElementById('quantidade').value) || 0;

    if (quantidade > 0) {
        atualizarCarrinho();
        new bootstrap.Modal(document.getElementById('pedidoModal')).show();
        
        // Esconder alerta caso a quantidade seja válida
        document.getElementById('alertaQuantidade').classList.add('d-none');
    } else {
        // Exibir alerta caso a quantidade seja inválida
        document.getElementById('alertaQuantidade').classList.remove('d-none');
    }
}

// Atualizar o valor total do carrinho e do pedido
function atualizarCarrinho() {
    const quantidade = parseInt(document.getElementById('quantidade').value) || 0;
    const bairro = document.getElementById('bairro').value;
    const taxaEntrega = taxas[bairro] || 0;
    const total = (quantidade * precoGarrafao) + (quantidade > 0 ? taxaEntrega : 0);

    document.getElementById('carrinhoTotal').textContent = total.toFixed(2);
    document.getElementById('totalPedido').textContent = total.toFixed(2);

    const detalhe = `Garrafão de Água (${quantidade} x R$${precoGarrafao.toFixed(2)})` + (quantidade > 0 ? ` + Taxa de Entrega: R$${taxaEntrega.toFixed(2)}` : "");
    document.getElementById('detalhePedido').textContent = detalhe;

    salvarPedidoNoLocalStorage();
}

// Função para remover o item do carrinho
function removerItemCarrinho() {
    // Remover o pedido do Local Storage
    localStorage.removeItem('pedido');
    
    // Resetar os valores no modal do carrinho e na interface
    document.getElementById('detalheCarrinho').textContent = 'Carrinho está vazio.';
    document.getElementById('totalCarrinho').textContent = '0,00';
    document.getElementById('carrinhoTotal').textContent = '0,00';

    // Fechar o modal do carrinho
    const carrinhoModal = bootstrap.Modal.getInstance(document.getElementById('carrinhoModal'));
    carrinhoModal.hide();
}

// Adiciona um event listener ao link do carrinho para abrir o modal ao clicar
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('carrinhoLink').addEventListener('click', abrirCarrinho);
});

// Exibir campo de troco
function toggleTroco() {
    const pagamento = document.getElementById('pagamento').value;
    const trocoField = document.getElementById('trocoField');
    trocoField.style.display = (pagamento === "Dinheiro") ? "block" : "none";
    calcularTroco();
}

// Calcular o troco e atualizar no modal
function calcularTroco() {
    const totalPedido = parseFloat(document.getElementById('totalPedido').textContent);
    const trocoPara = parseFloat(document.getElementById('troco').value) || 0;
    const trocoFinal = trocoPara - totalPedido;

    const trocoFinalText = trocoFinal >= 0 ? `Troco: R$${trocoFinal.toFixed(2)}` : "Valor insuficiente para o troco";
    document.getElementById('trocoFinal').textContent = trocoFinalText;
}

// Função para abrir o modal de finalização do pedido a partir do carrinho
function finalizarPedidoDoCarrinho() {
    const carrinhoModal = bootstrap.Modal.getInstance(document.getElementById('carrinhoModal'));
    carrinhoModal.hide();
    abrirModalFinalizacao();
}

// Função para exibir um alerta com uma mensagem personalizada
function exibirAlerta(mensagem) {
    const alertaErro = document.getElementById('alertaErro');
    alertaErro.textContent = mensagem;
    alertaErro.classList.remove('d-none'); // Exibe o alerta
    setTimeout(() => alertaErro.classList.add('d-none'), 5000); // Oculta o alerta após 3 segundos
}

// Função para validar campos obrigatórios antes de finalizar o pedido
function validarEFinalizarPedido() {
    const nome = document.getElementById('nome').value.trim();
    const endereco = document.getElementById('endereco').value.trim();
    const formaPagamento = document.getElementById('pagamento').value;
    const trocoPara = parseFloat(document.getElementById('troco').value) || 0;
    const totalPedido = parseFloat(document.getElementById('totalPedido').textContent);

    if (!nome) {
        exibirAlerta("Por favor, insira seu nome.");
        return;
    }
    if (!endereco) {
        exibirAlerta("Por favor, insira seu endereço.");
        return;
    }

    if (formaPagamento === "Dinheiro" && trocoPara < totalPedido) {
        exibirAlerta("O valor do troco deve ser maior ou igual ao total do pedido.");
        return;
    }

    finalizarPedido();
}

// Função para finalizar o pedido e enviar os dados para o WhatsApp
function finalizarPedido() {
    // Carregar o pedido do Local Storage
    const pedido = JSON.parse(localStorage.getItem('pedido'));
    if (!pedido) {
        alert("Não há itens no carrinho!");
        return; // Saia da função se não houver pedido
    }

    const nome = document.getElementById('nome').value;
    const endereco = document.getElementById('endereco').value;
    const bairro = pedido.bairro; // Use o bairro do pedido
    const formaPagamento = document.getElementById('pagamento').value;
    const trocoPara = document.getElementById('troco').value || "N/A";
    const totalPedido = pedido.total.toFixed(2); // Use o total do pedido
    const chavePix = "sua_chave_pix_aqui"; // Adicione a chave Pix aqui

    let mensagem = `*Novo Pedido*\n`;
    mensagem += `Nome: ${nome}\n`;
    mensagem += `Endereço: ${endereco}\n`;
    mensagem += `Bairro: ${bairro}\n`;
    mensagem += `Forma de Pagamento: ${formaPagamento}\n`;
    if (formaPagamento === "Dinheiro") {
        mensagem += `Troco para: R$${trocoPara}\n`;
        mensagem += `Troco de R$${(trocoPara - totalPedido).toFixed(2)}\n`;
    } else if (formaPagamento === "Pix") {
        mensagem += `Chave Pix: ${chavePix}\n`;
    }
    mensagem += `Total do Pedido: R$${totalPedido}\n`;

    const encodedMensagem = encodeURIComponent(mensagem);
    const numeroWhatsApp = "5585987764006"; // Coloque o número do WhatsApp no formato internacional
    const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodedMensagem}`;

    window.open(linkWhatsApp, '_blank');

    const pedidoModal = bootstrap.Modal.getInstance(document.getElementById('pedidoModal'));
    if (pedidoModal) {
        pedidoModal.hide();
    }

    localStorage.removeItem('pedido');
}

// Carregar pedido ao iniciar a página
window.onload = carregarPedidoDoLocalStorage;
