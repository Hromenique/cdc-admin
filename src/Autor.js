import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import BotaoSubmitCustomizado from './componentes/BotaoSubmitCustomizado';

class FormularioAutor extends Component {

    constructor() {
        super();

        this.state = {
           // lista: [],
            nome: '',
            email: '',
            senha: ''
        }

        this.enviaForm = this.enviaForm.bind(this);
        this.setNome = this.setNome.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setSenha = this.setSenha.bind(this);
    }

    setNome(evento) {
        this.setState({ nome: evento.target.value });
    }

    setEmail(evento) {
        this.setState({ email: evento.target.value });
    }

    setSenha(evento) {
        this.setState({ senha: evento.target.value });
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
            success: resposta => {
                console.log("enviado com sucesso");
                this.props.callbackAtualizaListagem(resposta);
                //this.setState({ lista: resposta })
            },
            error: resposta => console.log('erro')
        });
    }

    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
                    <InputCustomizado id="nome" type="text" name="nome" value={this.state.nome} onChange={this.setNome} label="Nome" />
                    <InputCustomizado id="email" type="email" name="email" value={this.state.email} onChange={this.setEmail} label="Email" />
                    <InputCustomizado id="senha" type="password" name="senha" value={this.state.senha} onChange={this.setSenha} label="Senha" />
                    <BotaoSubmitCustomizado label="Gravar" />
                </form>
            </div>
        )
    }
}

class TabelaAutores extends Component {

    constructor() {
        super();
        /*
        this.state = {
            lista: []
        }*/
    }

    /*
    componentDidMount() {
        $.ajax({
            url: "http://localhost:8080/api/autores",
            dataType: 'json',
            success: resposta => {
                console.log(resposta);
                this.setState({ lista: resposta });
            }
        });
    }*/

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
                console.log(resposta);
                this.setState({ lista: resposta });
            }).bind(this)
        });
    }

    atualizaListagem(novaLista){
        this.setState({lista: novaLista});
    }

    render() {
        return (
            <div>
                <FormularioAutor callbackAtualizaListagem={this.atualizaListagem}/>
                <TabelaAutores lista={this.state.lista} />
            </div>
        );
    }
}