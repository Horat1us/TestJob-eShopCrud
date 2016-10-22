<?php
/**
 * Created by PhpStorm.
 * User: horat1us
 * Date: 21.10.16
 * Time: 13:08
 */

namespace eShopCrud\Controllers;

use eShopCrud\Models\Category;

class Categories
{
    public function list()
    {
        $categories = Category::list();
        $categories = array_filter($categories, function (Category $category) use ($categories) {
            if ($category->idparent_category == 0) {
                return true;
            }
            $parent = null;
            /** @var Category $parentCategory */
            foreach ($categories as $parent) {
                if ($parent->id() === $category->idparent_category) {
                    break;
                }
            }
            $parent->childs[] = $category;
            return false;
        });

        $map = function (Category $category) use (&$map) {
            return [
                'id' => $category->id(),
                'name' => $category->name(),
                'parent_id' => $category->idparent_category,
                'child' => array_map($map, $category->childs ?? []),
            ];
        };

        return exit(json_encode(array_values(array_map($map, $categories))));
    }

    public function create()
    {
        $name = $_POST['name'];
        $parent_id = $_POST['parentId'] ?? 0;
        /** @var Category $category */
        $category = Category::create([
            'category_name' => $name,
            'idparent_category' => $parent_id
        ]);

        return exit(json_encode([
            'success' => true,
            'category' => [
                'id' => $category->id(),
                'name' => $category->name(),
                'parent_id' => $category->idparent_category,
                'child' => [],
            ]
        ]));
    }

    public function delete()
    {
        try {
            $category = new Category($_POST['categoryId']);
            $result = $category->delete();
            $data = [
                'success' => $result,
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
}