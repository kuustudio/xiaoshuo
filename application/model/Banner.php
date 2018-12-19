<?php
/**
 * Created by PhpStorm.
 * User: zhangxiang
 * Date: 2018/11/14
 * Time: 5:09 PM
 */

namespace app\model;


use think\Model;

class Banner extends Model
{
    protected $pk='id';
    protected $autoWriteTimestamp = 'datetime';

    public function book(){
        return $this->hasOne('book','id','book_id');
    }
}