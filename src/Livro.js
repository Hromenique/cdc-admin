import React, { Component } from 'react';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import InputCustomizado from './componentes/InputCustomizado';
import SelectCustomizado from './componentes/SelectCustomizado';
import BotaoSubmitCustomizado from './componentes/BotaoSubmitCustomizado';
import TratadorErrors from './TratadorErros'

class FormularioLivro extends Component {

    constructor() {
        super();

        this.state = {
            titulo: '',
            preco: '',
            autorId: ''
        }

        this.enviaForm = this.enviaForm.bind(this);
        this.setTitulo = this.setTitulo.bind(this);
        this.setPreco = this.setPreco.bind(this);
        this.setAutorId = this.setAutorId.bind(this);
    }

    setTitulo(evento) {
        this.setState({ titulo: evento.target.value });
    }

    setPreco(evento) {
        this.setState({ preco: evento.target.value });
    }

    setAutorId(evento) {
        this.setState({ autorId: evento.target.value });
    }

    enviaForm(evento) {
        evento.preventDefault();
        console.log("dados sendo enviados");

        $.ajax({
            url: 'http://localhost:8080/api/livros',
            contentType: 'application/json',
            dataType: 'json',
            type: 'post',
            data: JSON.stringify({ titulo: this.state.titulo, preco: this.state.preco, autorId: this.state.autorId }),
            success: function (novaListagem) {
                PubSub.publish('atualiza-lista-livros', novaListagem);
                this.setState({ titulo: '', preco: '', autorId: '' });
            }.bind(this),
            error: resposta => {
                if (resposta.status === 400) {
                    new TratadorErrors().publicaErros(resposta.responseJSON);
                }
            },
            beforeSend: () => PubSub.publish('limpa-erros', {})
        });
    }

    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
                    <InputCustomizado id="titulo" type="text" name="titulo" value={this.state.titulo} onChange={this.setTitulo} label="Título" />
                    <InputCustomizado id="preco" type="text" name="preco" value={this.state.preco} onChange={this.setPreco} label="Preço" />
                    <SelectCustomizado id="autorId" name="autorId" value={this.state.autorId} onChange={this.setAutorId} label="Autor" 
                        defaultValue="" defaultOption="Selecione autor" options={this.props.autores}/>
                    <BotaoSubmitCustomizado label="Gravar" />
                </form>
            </div>
        )
    }
}

class TabelaLivros extends Component {

    render() {
        return (
            <table className="pure-table">
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Preço</th>
                        <th>Autor</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.props.lista.map(livro => (
                            <tr key={`${livro.id}`}>
                                <td>{livro.titulo}</td>
                                <td>{livro.preco}</td>
                                <td>{livro.autor.nome}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        );
    }
}

export default class LivroBox extends Component {

    constructor() {
        super();
        this.state = { lista: [], autores: [] };
    }

    componentDidMount() {
        $.ajax({
            url: "http://localhost:8080/api/livros",
            dataType: 'json',
            success: (resposta => {
                this.setState({ lista: resposta });
            }).bind(this)
        });

        $.ajax({
            url: "http://localhost:8080/api/autores",
            dataType: 'json',
            success: (resposta => {
                let autores = resposta.map(autor => { return { optionValue: autor.id, optionLabel: autor.nome } });
                this.setState({ autores: autores });
            }).bind(this)
        });

        PubSub.subscribe('atualiza-lista-livros',
            function (topico, novaListagem) { this.setState({ lista: novaListagem }) }.bind(this));
    }

    render() {
        return (
            <div>
                <div className="header">
                    <h1>Cadastro de livros</h1>
                </div>
                <div className="content" id="content">
                    <FormularioLivro autores={this.state.autores}/>
                    <TabelaLivros lista={this.state.lista} />
                </div>
            </div>
        );
    }
}