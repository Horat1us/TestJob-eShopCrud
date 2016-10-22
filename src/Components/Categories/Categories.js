/**
 * Created by horat1us on 21.10.16.
 */
"use strict";
import React, {Component} from "react";
import CategoriesList from "./CategoriesList";
import Modal from "react-modal";
import $ from "jquery";

export default React.createClass({
    getInitialState() {
        return this.state = {
            categories: [],
            modalIsOpen: false,
        };
    },

    componentDidMount() {
        this.updateCategories();
    },

    updateCategories() {
        $.ajax({
            dataType: 'json',
            url: '/api.php',
            method: 'POST',
            data: {
                path: "Categories/list"
            },
        })
            .done(categories => {
                this.setState({categories});
                this.props.onChange(categories);
            })
            .fail(error => {
                console.log(error.responseText);
                console.error(error);
            });
    },


    openForm() {
        this.setState({modalIsOpen: true, newCategoryParentId: 0});
    },

    closeModal() {
        this.setState({modalIsOpen: false});
    },

    handleModalCloseRequest() {
        this.closeModal();
    },

    handleSaveClicked() {
        if (!this.state.newCategoryName) {
            return;
        }
        $.ajax({
            url: '/api.php',
            dataType: 'json',
            data: {
                path: 'Categories/create',
                name: this.state.newCategoryName,
                parentId: this.state.newCategoryParentId,
            },
            method: "POST",
        })
            .done(result => {
                if (result.success !== true || !result.hasOwnProperty('category')) {
                    console.error("Wrong result", result);
                }

                let categories = this.state.categories;
                if (!result.category.parent_id) {
                    categories.push(result.category);
                } else {
                    let push = (categories) => {
                        categories.forEach(category => {
                            if (category.id == ~~result.category.parent_id) {
                                category.child.push(result.category);
                                return;
                            }
                            push(category.child);
                        })
                    };
                    push(categories);
                }

                this.props.onChange(categories);
                this.setState({modalIsOpen: false, categories});
            })
            .fail(error => console.log(error.responseText));
    },
    renderCategoriesOptions(categories, nesting) {
        return categories.map(category => {
            const child = this.renderCategoriesOptions(category.child, nesting + 1);
            child.unshift(
                <option value={category.id}>{"-".repeat(nesting)} {category.name}</option>
            );
            return child;
        });
    },
    handleParentChange(event)
    {
        this.setState({newCategoryParentId: event.target.value});
    },
    handleNameChange(event)
    {
        const value = event.target.value;
        this.setState({newCategoryName: value});
    },

    render() {
        const categoriesOptions = this.renderCategoriesOptions(this.state.categories, 0);
        const categoriesList = <CategoriesList categories={this.state.categories}
                                               onDelete={this.props.onDelete}/>;
        return (
            <div>
                <h4>
                    Categories
                    <button className="btn btn-outline-success btn-sm float-md-right" onClick={this.openForm}>
                        Add Category
                    </button>
                </h4>
                {categoriesList}
                <Modal
                    className="Modal__Bootstrap modal-dialog"
                    closeTimeoutMS={150}
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.handleModalCloseRequest}
                >
                    <form className="modal-content" onSubmit={this.handleSaveClicked}>
                        <div className="modal-header">
                            <button type="button" className="close" onClick={this.handleModalCloseRequest}>
                                <span aria-hidden="true">&times;</span>
                                <span className="sr-only">Close</span>
                            </button>
                            <h4 className="modal-title">Adding new category</h4>
                        </div>
                        <div className="modal-body">
                            <label>Category Name</label>
                            <input type="text" onChange={this.handleNameChange} className="form-control"
                                   placeholder="Category Name"/>
                            <label>Parent Category</label>
                            <select onChange={this.handleParentChange} className="form-control">
                                <option value="0">No parent</option>
                                {categoriesOptions}
                            </select>
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
                </Modal>
            </div>
        );
    }
});