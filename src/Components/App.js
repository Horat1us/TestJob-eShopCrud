/**
 * Created by horat1us on 22.10.16.
 */
"use strict";
import React, {Component} from "react";
import Categories from "./Categories/Categories";
import Items from "./Items/Items";

export default React.createClass({
    getInitialState() {
        return {categories: [], items: []}
    },

    handleCategoriesUpdate(categories) {
        this.setState({categories});
    },
    handleItemsUpdate(items) {
        this.setState({items});
    },
    handleCategoryDelete(idCategory)
    {
        this.setState({
            items: this.state.items.filter(item => ~~item.category.id !== ~~idCategory),
        });
    },

    render() {
        return (
            <div className="row">
                <div className="col-md-4" id="categories-place">
                    <Categories onChange={this.handleCategoriesUpdate} onDelete={this.handleCategoryDelete}/>
                </div>
                <div className="col-md-8" id="items-place">
                    <Items categories={this.state.categories} items={this.state.items}
                           onChange={this.handleItemsUpdate}/>
                </div>
            </div>
        );
    }
});