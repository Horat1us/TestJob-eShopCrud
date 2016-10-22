/**
 * Created by horat1us on 21.10.16.
 */
"use strict";
import React, {Component} from "react";
import Modal from "react-modal";

export default React.createClass({
    getInitialState()
    {
        return Object.assign({}, this.props);
    },

    handleModalCloseRequest()
    {
        this.props.handleModalCloseRequest();
    },
    handleSaveClicked()
    {
        if (!this.state.category || !this.state.name || !this.state.price) {
            return;
        }
        const item = {
            itemId: this.props.id,
            idcategory: this.state.category,
            price: this.state.price,
            item_name: this.state.name,
            item_description: this.state.description,
        };
        this.props.handleSave(item);
    },
    componentWillReceiveProps(nextProps)
    {
        const {name, category, id, price, description} = nextProps;
        this.setState(nextProps);
    },

    renderOptions(categories, nesting = 0) {
        return categories.map(category => {
            const child = this.renderOptions(category.child, nesting + 1);

            child.unshift(
                <option value={category.id}>{"-".repeat(nesting)} {category.name}</option>
            );
            return child;
        });
    },
    handleName(event){
        this.state.name = event.target.value;
    },
    handleCategory(event){
        this.state.category = event.target.value;
    },
    handleDescription(event) {
        this.state.description = event.target.value;
    },
    handlePrice(event) {
        this.state.price = event.target.value;
    },

    render() {
        const title = this.props.id ? "Editing item" : "Adding new item";
        return (
            <Modal
                className="Modal__Bootstrap modal-dialog"
                closeTimeoutMS={150}
                isOpen={this.props.isOpen}
                onRequestClose={this.handleModalCloseRequest}
            >
                <form className="modal-content" onSubmit={this.handleSaveClicked}>
                    <div className="modal-header">
                        <button type="button" className="close" onClick={this.handleModalCloseRequest}>
                            <span aria-hidden="true">&times;</span>
                            <span className="sr-only">Close</span>
                        </button>
                        <h4 className="modal-title">{title}</h4>
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-md-4">
                                <label>Name</label>
                                <input defaultValue={this.props.name} onChange={this.handleName}
                                       className="form-control"/>
                            </div>
                            <div className="col-md-4">
                                <label>Category</label>
                                <select onChange={this.handleCategory} className="form-control"
                                        defaultValue={this.props.category}>
                                    <option value="0">Select category</option>
                                    {this.renderOptions(this.props.categories) }
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label>Price</label>
                                <input type="number" step="0.01" onChange={this.handlePrice} className="form-control"
                                       defaultValue={this.props.price}/>
                            </div>
                        </div>
                        <label>Description</label>
                        <textarea className="form-control" onChange={this.handleDescription}
                                  defaultValue={this.props.description}/>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline-warning"
                                onClick={this.handleModalCloseRequest}>
                            Close
                        </button>
                        <button type="button" className="btn btn-outline-success" onClick={this.handleSaveClicked}>
                            Save
                        </button>
                    </div>
                </form>
            </Modal>);
    }
});
