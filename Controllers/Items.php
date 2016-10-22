<?php
/**
 * Created by PhpStorm.
 * User: horat1us
 * Date: 22.10.16
 * Time: 00:11
 */

namespace eShopCrud\Controllers;


use eShopCrud\Models\Item;

class Items
{
    public function list()
    {
        $items = Item::list();

        return exit(json_encode(array_map(function (Item $item) {
            return $item->asArray();
        }, $items)));
    }

    public function delete()
    {
        try {
            $item = new Item($_POST['itemId']);

            $result = $item->delete();
            $data = [
                'success' => $result,
                'item' => $item->asArray(),
            ];
        } catch (\Exception $ex) {
            $data = [
                'success' => false,
                'type' => get_class($ex),
                'error' => $ex->getMessage(),
            ];
        }

        exit(json_encode($data));
    }

    public function modify()
    {
        try {
            $item = new Item($_POST['itemId']);

            foreach (Item::fields() as $field) {
                if (isset($_POST[$field])) {
                    $item->set($field, $_POST[$field]);
                }
            }

            $data = ['success' => $item->save(), 'item' => $item->asArray()];
        } catch (\Exception $ex) {
            $data = ['success' => false,
                'type' => get_class($ex),
                'error' => $ex->getMessage(),];
        }

        exit(json_encode($data));
    }

    public function create()
    {
        $required = Item::requiredFields();
        $data = [];
        foreach (Item::requiredFields() as $field) {
            if (!array_key_exists($field, $_POST)) {
                $field = htmlspecialchars($field);
                exit(json_encode(['success' => false, 'error' => "Field {$field} must be not empty"]));
            }
            $data[$field] = $_POST[$field];
        }

        /** @var Item $item */
        $item = Item::create($data);

        return exit(json_encode([
            'success' => true,
            'item' => $item->asArray(),
        ]));
    }
}