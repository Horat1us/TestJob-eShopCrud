/**
 * Created by horat1us on 22.10.16.
 */
"use strict";
import React, {Component} from "react";
import $ from "jquery";

export default React.createClass({
    getInitialState()
    {
        const {id, name, price, description, category} = this.props;
        return {id, name, price, description, category, deleted: false};
    },
    delete()
    {
        $.ajax({
            url: '/api.php',
            dataType: 'json',
            method: 'post',
            data: {
                path: 'Items/delete',
                itemId: this.state.id,
            }
        })
            .done(result => {
                if (result.success !== true) {
                    return console.error(result);
                }

                this.setState({deleted: true});
            })
            .fail(result => {
                console.error(result.responseText);
            });
        this.setState({deleted: true});
    },
    change()
    {
        const {id, name, price, description, category} = this.state,
            data = {
                id, name, price, description, category: category.id,
            };
        this.props.handleEdit(data, (item) => {
            return new Promise((resolve, reject) => {
                Object.assign(item, {
                    path: 'Items/modify',
                });
                $.ajax({
                    url: '/api.php',
                    method: 'post',
                    dataType: 'json',
                    data: item,
                })
                    .done(result => {
                        if (result.success !== true || !result.hasOwnProperty('item')) {
                            return console.error("Wrong response", result);
                        }
                        console.log(result);

                        this.setState(result.item);
                        resolve(result);
                    })
                    .fail(error => {
                        console.error(error.responseText);
                        reject(error);
                    });
            });
        });
    },

    render() {
        if (this.state.deleted) {
            return null;
        }
        return <tr>
            <td>{this.state.id}</td>
            <td>{this.state.name}</td>
            <td>{this.state.price}</td>
            <td>{this.state.category.name}</td>
            <td>{this.state.description}</td>
            <td>
                <button className="btn btn-outline-warning btn-sm" onClick={this.change}>Edit</button>
                <button className="btn btn-outline-danger btn-sm" onClick={this.delete}>Delete</button>
            </td>
        </tr>;
    }
});