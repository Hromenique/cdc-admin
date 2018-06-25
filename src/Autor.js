import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import BotaoSubmitCustomizado from './componentes/BotaoSubmitCustomizado';
import PubSub from 'pubsub-js';
import TratadorErrors from './TratadorErros';

class FormularioAutor extends Component {

    constructor() {
        super();

        this.state = {
            nome: '',
            email: '',
            senha: ''
        }

        this.enviaForm = this.enviaForm.bind(this);        
    }

    salvaAlteracao(nomeInput, evento){
        this.setState({[nomeInput] : evento.target.value});
    }    

    enviaForm(evento) {
        evento.preventDefault();
        console.log("dados sendo enviados");

        $.ajax({
            url: "http://localhost:8080/api/autores",
            contentType: 'application/json',
            dataType: 'json',
            type: 'post',
            data: JSON.stringify({ nome: this.state.nome, email: this.state.email, senha: this.state.senha }),
            success: function (novaListagem) {
                PubSub.publish('atualiza-lista-autores', novaListagem);
                this.setState({ nome: '', email: '', senha: '' });
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
                    <InputCustomizado id="nome" type="text" name="nome" value={this.state.nome} onChange={this.salvaAlteracao.bind(this, 'nome')} label="Nome" />
                    <InputCustomizado id="email" type="email" name="email" value={this.state.email} onChange={this.salvaAlteracao.bind(this, 'email')} label="Email" />
                    <InputCustomizado id="senha" type="password" name="senha" value={this.state.senha} onChange={this.salvaAlteracao.bind(this, 'senha')} label="Senha" />
                    <BotaoSubmitCustomizado label="Gravar" />
                </form>
            </div>
        )
    }
}

class TabelaAutores extends Component {

    render() {
        return (
            <table className="pure-table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>email</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.props.lista.map(autor => (
                            <tr key={`${autor.id}`}>
                                <td>{autor.nome}</td>
                                <td>{autor.email}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        );
    }

}

export default class AutorBox extends Component {

    constructor() {
        super();
        this.state = { lista: [] };
        this.atualizaListagem = this.atualizaListagem.bind(this);
    }

    componentDidMount() {
        $.ajax({
            url: "http://localhost:8080/api/autores",
            dataType: 'json',
            success: (resposta => {
                this.setState({ lista: resposta });
            }).bind(this)
        });

        PubSub.subscribe('atualiza-lista-autores',
            function (topico, novaListagem) { this.setState({ lista: novaListagem }) }.bind(this));
    }

    atualizaListagem(novaLista) {
        this.setState({ lista: novaLista });
    }

    render() {
        return (
            <div>
                <div className="header">
                    <h1>Cadastro de autores</h1>
                </div>
                <div className="content" id="content">
                    <FormularioAutor />
                    <TabelaAutores lista={this.state.lista} />
                </div>
            </div>
        );
    }
}