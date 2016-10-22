<?php
/**
 * Created by PhpStorm.
 * User: horat1us
 * Date: 21.10.16
 * Time: 13:24
 */

namespace eShopCrud\Models;


class Category extends Model
{
    protected static $tableName = 'categories';
    protected static $fields = ['idcategory', 'idparent_category', 'category_name'];
    public $idcategory;
    public $idparent_category;
    public $category_name;

    public function name()
    {
        return $this->category_name;
    }

    public function parent() :Category
    {
        return new Category($this->idparent_category);
    }

    public function id()
    {
        return $this->idcategory;
    }

}