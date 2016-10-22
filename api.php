<?php
namespace eShopCrud;
define("SYSTEM", __DIR__);

/**
 * @param int $code
 */
function error(int $code)
{
    switch ($code) {
        case 403:
            http_response_code(403);
            exit("Method not allowed");
        case 404:
            http_response_code(404);
            exit("Path not found");
        default:
            http_response_code(500);
            exit("Unknown error");
    }
}

/**
 * @param mixed $result
 */
function result($result)
{
    exit(json_encode($result));
}

/**
 * @param string $class The fully-qualified class name.
 * @return void
 */
spl_autoload_register(function ($class) {

    // project-specific namespace prefix
    $prefix = 'eShopCrud\\';

    // base directory for the namespace prefix
    $base_dir = __DIR__ . '/';

    // does the class use the namespace prefix?
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        // no, move to the next registered autoloader
        return;
    }

    // get the relative class name
    $relative_class = substr($class, $len);

    // replace the namespace prefix with the base directory, replace namespace
    // separators with directory separators in the relative class name, append
    // with .php
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';

    // if the file exists, require it
    if (file_exists($file)) {
        require $file;
    }
});

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isset($_POST['path'])) {
    error(403);
}

$path = explode('/', $_POST['path']);
if (sizeof($path) < 2) {
    error(404);
}

list($controller, $method) = $path;
$args = $path[2] ?? [];
$controller = "eShopCrud\\Controllers\\{$controller}";

$controllerInstance = new $controller();
$controllerInstance->{$method}($args);