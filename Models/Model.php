<?php
/**
 * Created by PhpStorm.
 * User: horat1us
 * Date: 21.10.16
 * Time: 13:12
 */

namespace eShopCrud\Models;


abstract class Model
{

    protected static $connection;
    protected $changes = [];

    public function __construct($id = 0, $lazy = false)
    {
        // If you wanna put fields later (like using self::create)
        if ($lazy === true) {
            return;
        }

        list($tableName, $fields) = self::getInfo(get_called_class());
        $primaryKey = self::primaryIndex();

        $fields = implode(',', $fields);
        $sql = "SELECT {$fields} FROM {$tableName} WHERE {$primaryKey} = :id;";
        $sth = self::connection()->prepare($sql);

        $result = $sth->execute(['id' => (int)$id]);
        if (!$result) {
            throw new \Exception(self::connection()->errorInfo()[1]);
        }
        if (!$sth->rowCount()) {
            throw new NotFoundException(get_called_class(), $id);
        }

        $result = $sth->fetch(\PDO::FETCH_ASSOC);
        foreach ($result as $prop => $value) {
            $this->$prop = $value;
        }
    }

    private final static function getInfo($class) : array
    {
        $requiredFields = ['tableName', 'fields'];
        return array_map(function ($field) use ($class) {
            $value = $class::$$field ?? false;
            if ($value === false) {
                throw new \UnexpectedValueException("Class {$class} must have \${$field} property");
            }
            return $value;
        }, $requiredFields);
    }

    protected static function primaryIndex()
    {
        $self = get_called_class();
        if (property_exists($self, 'primaryIndex')) {
            return $self::primaryIndex;
        }
        $self = explode('\\', $self);
        return 'id' . strtolower(array_pop($self));
    }

    public final static function connection() : \PDO
    {
        return self::$connection ?: self::connect();
    }

    public final static function connect()
    {
        $config = self::config();

        $dbh = new \PDO(
            "mysql:host={$config['db']['host']};dbname={$config['db']['name']}",
            $config['db']['user'],
            $config['db']['pass']
        );
        $dbh->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        return self::$connection = $dbh;

    }

    public final static function config() :array
    {
        $configFile = SYSTEM . '/config.production.php';
        if (!file_exists($configFile)) {
            $configFile = str_replace('.production', '', $configFile);
        }
        return require($configFile);
    }

    public static function fields()
    {
        $model = get_called_class();
        return $model::$fields ?? [];
    }

    public static function requiredFields()
    {
        $model = get_called_class();
        if (property_exists($model, 'required')) {
            return $model::$required;
        }

        list(, $fields) = self::getInfo($model);

        return array_diff($fields, [self::primaryIndex()]);
    }

    public static function list(array $where = [])
    {
        $model = get_called_class();
        list($tableName, $fields) = self::getInfo($model);
        $whereString = self::buildWhere($where);
        $fieldsString = implode(',', $fields);
        $sql = "SELECT {$fieldsString} FROM {$tableName}{$whereString}";
        $result = self::connection()->prepare($sql);
        if (!$result->execute($where)) {
            throw new \Exception(self::connection()->errorInfo());
        }

        $list = [];
        $result->fetchAll(\PDO::FETCH_FUNC, function (...$values) use ($fields, &$list, $model) {
            $list[] = $modelInstance = new $model(0, true);
            for ($i = 0; $i < count($fields); $i++) {
                $modelInstance->{$fields[$i]} = $values[$i];
            }
            return $modelInstance;
        });

        return $list;
    }

    public final static function buildWhere(array $where = []) : string
    {
        if (!count($where)) {
            return '';
        }
        $whereString = '';
        foreach ($where as $name => $value) {
            $whereString = " {$name}=:{$name} AND";
        }
        $whereString = substr($whereString, 0, strlen($whereString) - 3);
        return " WHERE{$whereString}";
    }

    public static function create($values) : Model
    {
        if (($values['idparent_category'] ?? false) == 0) {
            unset($values['idparent_category']);
        }
        $model = get_called_class();
        list($tableName, $fields) = self::getInfo($model);

        $builtInsert = self::buildInsert($values);

        $sql = "INSERT INTO {$tableName} ({$builtInsert['fields']}) VALUES ({$builtInsert['values']})";
        $result = self::connection()->prepare($sql);
        $execute = $result->execute($values);


        /** @var Model $modelInstance */
        $modelInstance = new $model(0, true);
        $modelInstance->setId(self::connection()->lastInsertId());
        foreach ($fields as $field) {
            if (!isset($values[$field])) {
                continue;
            }
            $modelInstance->$field = $values[$field];
        }

        return $modelInstance;
    }

    public final static function buildInsert(array $values = []) : array
    {
        $fieldsResult = '';
        $valuesResult = '';
        foreach ($values as $key => $value) {
            $fieldsResult[] = "$key";
            $valuesResult[] = ":{$key}";
        }
        return [
            'fields' => implode(',', $fieldsResult),
            'values' => implode(',', $valuesResult),
        ];
    }

    protected function setId(int $id)
    {
        $this->{self::primaryIndex()} = $id;
    }

    public function set(string $name, $value):Model
    {
        if (isset(self::$fields) && !in_array($name, self::$fields)) {
            throw new \UnexpectedValueException("Wrong key: $name");
        }

        $this->changes[$name] = $value;

        return $this;
    }

    public function unset($name):Model
    {
        if (in_array($name, $this->changes)) {
            unset($this->changes[$name]);
        }

        return $this;
    }

    public function save() :bool
    {
        if (!count($this->changes)) {
            return true;
        }

        $where = [self::primaryIndex() => $this->getId()];
        $whereString = self::buildWhere($where);
        $data = [];
        foreach ($this->changes as $name => $value) {
            $data[] = "{$name}=:{$name}";
        }

        list($tableName) = self::getInfo(get_called_class());

        $data = implode(',', $data);
        $sql = "UPDATE {$tableName} SET {$data}{$whereString} LIMIT 1;";
        $result = self::connection()->prepare($sql);

        if (!$result->execute($this->changes + $where)) {
            throw new \Exception(self::connection()->errorInfo()[1]);
        }

        foreach ($this->changes as $field => $value) {
            $this->$field = $value;
        }

        $this->changes = [];
        return true;
    }

    public function getId()
    {
        return $this->{self::primaryIndex()};
    }

    public function delete(array $where = [], int $limit = 1) :bool
    {
        list($tableName) = self::getInfo(get_called_class());

        $where[self::primaryIndex()] = (int)$this->getId();
        $whereString = self::buildWhere($where);

        $sql = "DELETE FROM {$tableName}{$whereString} LIMIT {$limit};";
        $result = self::connection()->prepare($sql);
        $result->execute($where);
        $errorInfo = self::connection()->errorInfo();
        if ($errorInfo[1]) {
            throw new \Exception($errorInfo[$errorInfo]);
        }

        return true;
    }

    protected final function notFound($id = 0)
    {
        throw new NotFoundException(get_class($this), $id);
    }
}

class NotFoundException extends \Exception
{
    public $model;
    public $instanceId;

    public function __construct($className, int $instanceId, Exception $previous = null)
    {
        $this->model = $className;
        $this->instanceId = $instanceId;
        parent::__construct("Instance of {$className} (id {$instanceId}) not found", 0, $previous);
    }
}