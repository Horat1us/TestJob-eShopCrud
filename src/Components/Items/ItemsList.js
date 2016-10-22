/**
 * Created by horat1us on 22.10.16.
 */
"use strict";
import React, {Component} from "react";
import ItemRow from "./ItemRow";

export default React.createClass({

    render() {
        const rows = this.props.items.map(item => {
            return <ItemRow key={item.id} {...item} handleEdit={this.props.onEdit}/>;
        });
        return (
            <table className="table table-bordered table-hover table-striped">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th/>
                </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </table>
        );
    }
});