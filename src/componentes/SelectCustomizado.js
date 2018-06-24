
import React, { Component } from 'react';
import PubSub from 'pubsub-js';

export default class SelectCustomizado extends Component {

    constructor() {
        super();
        this.state = { msgErro: '' };
    }

    componentDidMount() {
        PubSub.subscribe('erro-validacao', function (topico, erro) {
            if (erro.field === this.props.name) {
                this.setState({ msgErro: erro.defaultMessage });
            }
        }.bind(this));

        PubSub.subscribe("limpa-erros", function (topico) {
            this.setState({ msgErro: '' });
        }.bind(this));
    }

    render() {
        return (
            <div className="pure-control-group">
                <label htmlFor={this.props.id}>{this.props.label}</label>
                <select name={this.props.nome} id={this.props.id} value={this.props.value} onChange={this.props.onChange}>
                    <option value={this.props.defaultValue}>{this.props.defaultOption}</option>
                    {
                        this.props.options.map(option => <option key={option.optionValue} value={option.optionValue}>{option.optionLabel}</option>)
                    }
                </select>
                <span className="erro">{this.state.msgErro}</span>
            </div>
        );
    }

}