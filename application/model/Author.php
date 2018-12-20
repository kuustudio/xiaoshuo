<?php
/**
 * Created by PhpStorm.
 * User: zhangxiang
 * Date: 2018/11/14
 * Time: 5:07 PM
 */

namespace app\model;


use think\Model;

class Author extends Model
{
    protected $pk='id';
    protected $autoWriteTimestamp = 'datetime';

    public function books(){
        return $this->hasMany('book');
    }

    public function setAuthorNameAttr($value){
        return trim(strip_tags($value));
    }
}