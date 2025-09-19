import fs from 'fs';

class GerenciadorClientes{
	
	constructor(){}

	// Métodos de Clientes
	
	cadastrarCliente(nome, cpf, telefone, email){
		const banco = this.#lerBanco();

		if(!this.#validarNome(nome)){
			console.log("Nome inválido.");
			return;
		}

		if(!this.#validarCPF(cpf)){
			console.log("CPF inválido. Use o formato XXX.XXX.XXX-XX");
			return;
		}

		if(!this.#validarTelefone(telefone)){
			console.log("Telefone inválido. Use o formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX");
			return;
		}

		if(!this.#validarEmail(email)){
			console.log("E-mail inválido.");
			return;
		}

		if(banco.clientes.find(c => c.cpf === cpf)){
			console.log("Esse CPF já está sendo utilizado.");
			return;
		}

		const novoCliente = new Cliente(nome, cpf, telefone, email);
		banco.clientes.push(novoCliente);

		this.#salvarBanco(banco);
	
		console.log(`Cliente ${novoCliente.getNome()} cadastrado com sucesso.`);
	}

	buscarCliente(cpf){
		const banco = this.#lerBanco();

		if(!this.#validarCPF(cpf)){
			console.log("CPF inválido. Use o formato XXX.XXX.XXX-XX");
			return;
		}

		const cliente = banco.clientes.find(c => c.cpf === cpf);

		if(!cliente){
			console.log("Cliente não encontrado.");
			return;
		}
		
		return new Cliente(cliente.nome, cliente.cpf, cliente.telefone, cliente.email);
	}

	editarCliente(cpf, contato, novoContato){

		if(!this.#validarCPF(cpf)){
			console.log("CPF inválido. Use o formato XXX.XXX.XXX-XX");
			return;
		}

		const banco = this.#lerBanco();
		const cliente = this.buscarCliente(cpf);

		if(!cliente){
			console.log("Cliente não encontrado.");
			return;
		}

		const indiceCliente = banco.clientes.findIndex(c => c.cpf === cliente.cpf);

		if(contato === 'telefone'){

			if(!this.#validarTelefone(novoContato)){
				console.log("Telefone inválido. Use o formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX");
				return;
			}

			const telefoneAntigo = cliente.getTelefone();
			cliente.setTelefone(novoContato);
			console.log(`Telefone de ${cliente.getNome()} trocado de ${telefoneAntigo} para ${novoContato}.`);

		}
		
		else if(contato === 'email'){

			if(!this.#validarEmail(novoContato)){
				console.log("E-mail inválido.");
				return;
			}

			const emailAntigo = cliente.getEmail();
			cliente.setEmail(novoContato);
			console.log(`E-mail de ${cliente.getNome()} trocado de ${emailAntigo} para ${novoContato}.`);

		}

		else{
			console.log("Contato inválido. Use 'telefone' ou 'email'.");
			return;
		}

		banco.clientes[indiceCliente] = cliente;
		this.#salvarBanco(banco);
		
	}

	deletarCliente(cpf){
		const banco = this.#lerBanco();

		if(!this.#validarCPF(cpf)){
			console.log("CPF inválido. Use o formato XXX.XXX.XXX-XX");
			return;
		}

		const cliente = this.buscarCliente(cpf);

		if(!cliente){
			console.log("Cliente não encontrado.");
			return;
		}

		banco.clientes.splice(banco.clientes.indexOf(cliente), 1);
		this.#salvarBanco(banco);

		console.log(`Cliente ${cliente.getNome()} apagado com sucesso.`);

		this.#salvarBanco(banco);
	}

	// Métodos de produtos

	registrarProduto(nome, id, quantidade, preco){
		const banco = this.#lerBanco();

		if(!this.#validarNome(nome)){
			console.log("Nome inválido.");
			return;
		}

		if(!this.#validarIdProduto(id)){
			console.log("ID inválido. Deve ter entre 1 e 6 caracteres.");
			return;
		}

		if(banco.produtos.find(p => p.id === id)){
			console.log("Produto já cadastrado.");
			return;
		}

		if(quantidade < 0){
			console.log("Quantidade inválida. Deve ser maior ou igual a zero.");
			return;
		}

		if(preco <= 0){
			console.log("Preço inválido. Deve ser maior que zero.");
			return;
		}

		const novoProduto = new Produto(nome, id, quantidade, preco);
		banco.produtos.push(novoProduto);
		this.#salvarBanco(banco);

		console.log(`Produto ${novoProduto.getNome()} cadastrado com sucesso.`);
	}

	buscarProduto(id){
		const banco = this.#lerBanco();

		if(!this.#validarIdProduto(id)){
			console.log("ID inválido. Deve ter entre 1 e 6 caracteres.");
			return;
		}

		const produto = banco.produtos.find(p => p.id === id);

		if(produto === undefined){
			console.log("Produto não encontrado.");
			return
		}
		
		return produto;
	}

	deletarProduto(id){
		const banco = this.#lerBanco();

		if(!this.#validarIdProduto(id)){
			console.log("ID inválido. Deve ter entre 1 e 6 caracteres.");
			return;
		}

		const produto = this.buscarProduto(id);
		banco.produtos.splice(this.produtos.indexOf(produto), 1);
		this.#salvarBanco(banco);
		
		console.log(`Produto ${produto.getNome()} apagado com sucesso.`);
	}

	// Métodos privados

	#lerBanco(){
		const dados = fs.readFileSync('dados.json', 'utf-8');
		return JSON.parse(dados);
	}

	#salvarBanco(banco){
		fs.writeFileSync('dados.json', JSON.stringify(banco, null, 2));
	}

	#validarNome(nome){
		// Ter pelo menos um caractere
		return nome.length > 0;
	}

	#validarCPF(cpf){
		// Formato esperado: XXX.XXX.XXX-XX
		const regexCPF = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
		return regexCPF.test(cpf);
	}

	#validarTelefone(telefone){
		// Formato esperado: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
		const regexTelefone = /^\(\d{2}\) \d{4,5}-\d{4}$/;
		return regexTelefone.test(telefone);
	}

	#validarEmail(email){
		// Formato básico de e-mail
		const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return regexEmail.test(email);
	}

	#validarIdProduto(id){
		// Deve ter entre 1 e 6 caracteres
		return 0 < id.length <= 6;
	}

}

class Cliente{
	constructor(nome, cpf, telefone, email){
		this.nome = nome;
		this.cpf = cpf;
		this.telefone = telefone;
		this.email = email;
		this.carrinho = new Array();
	}

	toJSON(){
		return {
			nome: this.nome,
			cpf: this.cpf,
			telefone: this.telefone,
			email: this.email,
			carrinho: this.carrinho
		};
	}

	// Getters

	getNome(){
		return this.nome;
	}

	getCPF(){
		return this.cpf;
	}

	getTelefone(){
		return this.telefone;
	}

	getEmail(){
		return this.email;
	}

	getCarrinho(){
		return this.carrinho;
	}

	// Setters

	setNome(nome){
        this.nome = nome;
    }

    setCPF(cpf){
        this.cpf = cpf;
    }

    setTelefone(telefone){
        this.telefone = telefone;
    }

    setEmail(email){
        this.email = email;
    }

	setCarrinho(carrinho){
		this.carrinho = carrinho;
	}
}

class Produto{
	constructor(nome, id, quantidade, preco){
		this.nome = nome;
		this.id = id;
		this.quantidade = quantidade;
		this.preco = preco;
	}

	// Getters

	getNome(){
		return this.nome;
	}

	getId(){
		return this.id;
	}
	
	getQuantidade(){
		return this.quantidade;
	}

	getPreco(){
		return this.preco;
	}

	// Setters

	setNome(nome){
		this.nome = nome;
	}

	setId(id){
		this.id = id;
	}

	setQuantidade(quantidade){
		this.quantidade = quantidade;
	}

	setPreco(preco){
		this.preco = preco;
	}
}

const gerenciador = new GerenciadorClientes();

gerenciador.cadastrarCliente("João Silva", "123.456.789-01", "(11) 91234-5678", "joaosilva@gmail.com");
console.log(gerenciador.buscarCliente("123.456.789-01"));
gerenciador.editarCliente("123.456.789-01", "telefone", "(11) 99876-5432");
console.log(gerenciador.buscarCliente("123.456.789-01"));
gerenciador.deletarCliente("123.456.789-01");