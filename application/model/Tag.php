<?php
/**
 * Created by PhpStorm.
 * User: zhangxiang
 * Date: 2018/11/14
 * Time: 5:17 PM
 */

namespace app\model;


use think\Model;

class Tag extends Model
{
    protected $pk='id';
    protected $autoWriteTimestamp = 'datetime';
}