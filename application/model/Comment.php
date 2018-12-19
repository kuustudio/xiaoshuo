<?php
/**
 * Created by PhpStorm.
 * User: zhangxiang
 * Date: 2018/11/29
 * Time: 5:02 PM
 */

namespace app\model;


use think\Model;

class Comment extends Model
{
    protected $pk='id';
    protected $autoWriteTimestamp = 'datetime';

    public function book(){
        return $this->belongsTo('book');
    }
}