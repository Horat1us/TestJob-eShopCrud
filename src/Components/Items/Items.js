/**
 * Created by horat1us on 21.10.16.
 */
"use strict";
import React, {Component} from "react";
import ItemsList from "./ItemsList";
import $ from "jquery";
import ItemEditModal from "./ItemEditModal";

export default React.createClass({
    getInitialState()
    {
        return Object.assign(this.getInitialModal(), {items: []});
    },

    getInitialModal(modalIsOpen = false)
    {
        return {
            modalIsOpen: modalIsOpen,
            name: "",
            description: "",
            price: "",
            category: 0,
            saveCallback: (item) => {
                Object.assign(item, {
                    path: 'Items/create',
                });
                return new Promise((resolve, reject) => {
                    $.ajax({
                        url: "/api.php",
                        method: 'post',
                        dataType: 'json',
                        data: item,
                    })
                        .done(result => {
                            if (result.success !== true) {
                                return console.error("Wrong response", result.responseText);
                            }

                            let items = this.props.items;
                            items.push(result.item);
                            this.props.onChange(items);
                            resolve(result);
                        })
                        .fail(error => {
                            console.error(error);
                            reject(error);
                        });
                });
            },
        };
    },
    componentDidMount()
    {
        $.ajax({
            url: '/api.php',
            method: 'post',
            dataType: 'json',
            data: {path: 'Items/list'},
        })
            .done(items => {
                this.props.onChange(items);
            })
            /* Bad practice */
            .fail(error => console.error(error.responseText));
    },
    handleModalCloseRequest()
    {
        this.setState({modalIsOpen: false});
    },
    handleSave(item)
    {
        this.state.saveCallback(item)
            .then(() => this.handleModalCloseRequest())
            .catch(error => {
                console.error(error);
            })

    },
    handleAddClick()
    {
        this.setState(this.getInitialModal(true));
    },
    handleEditClick(item, callback)
    {
        Object.assign(item, {
            saveCallback: callback,
            modalIsOpen: true,
        });
        this.setState(item);
    },

    render() {
        const itemEditModal = <ItemEditModal isOpen={this.state.modalIsOpen} {...this.state}
                                             handleModalCloseRequest={this.handleModalCloseRequest}
                                             handleSave={this.handleSave}
                                             categories={this.props.categories}
        />;

        return (
            <div>
                <h4>
                    Items
                    <button className="btn btn-outline-success btn-sm float-md-right" onClick={this.handleAddClick}>Add
                        Item
                    </button>
                </h4>
                <ItemsList items={this.props.items} onEdit={this.handleEditClick}/>
                {itemEditModal}
            </div>
        );
    }
});