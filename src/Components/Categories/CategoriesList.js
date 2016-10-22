/**
 * Created by horat1us on 21.10.16.
 */
import React, {Component} from "react";
import CategoryRow from "./CategoryRow";

export default React.createClass({
    render() {
        const categories = this.props.categories.map(category => {
            return <CategoryRow key={category.id} {...category} onDelete={this.props.onDelete}/>
        });
        return <ul>{categories}</ul>;
    },
});