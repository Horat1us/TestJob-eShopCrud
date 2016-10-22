<?php
/**
 * Created by PhpStorm.
 * User: horat1us
 * Date: 21.10.16
 * Time: 23:57
 */

namespace eShopCrud\Models;


class Item extends Model
{
    protected static $tableName = 'items';
    protected static $fields = ['iditem', 'idcategory', 'item_name', 'item_description', 'price',];
    protected static $required = ['idcategory', 'item_name', 'price',];
    public $iditem;
    public $idcategory;
    public $item_name;
    public $item_description;
    public $price;
    protected $category;

    public function asArray()
    {
        return [
            'id' => $this->getId(),
            'name' => $this->name(),
            'description' => $this->description(),
            'price' => $this->price(),
            'category' => [
                'id' => $this->category()->id(),
                'name' => $this->category()->name(),
            ],
        ];
    }

    public function name() : string
    {
        return $this->item_name;
    }

    public function description() :string
    {
        return $this->item_description ?? '';
    }

    public function price()
    {
        return $this->price;
    }

    public function category() : Category
    {
        return $this->category ?: $this->category = new Category($this->idcategory);
    }
}