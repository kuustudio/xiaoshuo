<?php
/**
 * Created by PhpStorm.
 * User: zhangxiang
 * Date: 2018/11/14
 * Time: 5:09 PM
 */

namespace app\model;


use think\Model;

class Book extends Model
{
    protected $pk = 'id';
    protected $autoWriteTimestamp = 'datetime';

    public function author()
    {
        return $this->belongsTo('author');
    }

    public function chapters()
    {
        return $this->hasMany('chapter');
    }

    public function comments()
    {
        return $this->hasMany('comment');
    }

    public function setBooknameAttr($value)
    {
        return trim(strip_tags($value));
    }

    public function setSummaryAttr($value){
        return trim(strip_tags($value));
    }

}