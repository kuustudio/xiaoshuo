<?php
/**
 * Created by PhpStorm.
 * User: zhangxiang
 * Date: 2018/12/13
 * Time: 11:00 PM
 */

namespace app\model;


use think\Model;

class Tag2 extends Model
{
    protected $pk='id';
    protected $autoWriteTimestamp = 'datetime';

    public function setTagName2Attr($value){
        return trim(strip_tags($value));
    }
}