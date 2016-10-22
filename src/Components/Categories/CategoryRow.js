/**
 * Created by horat1us on 21.10.16.
 */
"use strict";
import React, {Component} from "react";
import CategoriesList from "./CategoriesList";
import $ from "jquery";

export default React.createClass({
    getInitialState() {
        const {id, name, child} = this.props;
        return this.state = {id, name, child, deleted: false};
    },
    delete(event) {
        event.preventDefault();

        $.ajax({
            'url': '/api.php',
            'dataType': 'json',
            'data': {
                path: "Categories/delete",
                categoryId: this.state.id
            },
            'method': 'post'
        })
            .done(result => {
                if (result.success !== true) {
                    return console.error("Wrong result", result);
                }

                this.setState({
                    deleted: true
                });
                this.props.onDelete(~~this.state.id);
                const onDelete = (childNodes) => {
                    childNodes.forEach(child => {
                        this.props.onDelete(~~child.id);
                        onDelete(child.child);
                    });
                };
                onDelete(this.state.child);
            })
            .fail(error => console.error(error.responseText));

    },
    render() {
        if (this.state.deleted) {
            return null;
        }
        let {child:categories}= this.state;
        const categoriesList = categories.length ?
            <CategoriesList categories={categories} onDelete={this.props.onDelete}/> : "";
        return (
            <li>
                {"-".repeat(this.state.nest)} {this.state.name}
                <a href="#" onClick={this.delete}>
                    <span aria-hidden="true">&times;</span>
                    <span className="sr-only">Delete</span>
                </a>
                {categoriesList}
            </li>
        );
    }
});