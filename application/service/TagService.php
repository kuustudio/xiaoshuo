<?php
/**
 * Created by PhpStorm.
 * User: zhangxiang
 * Date: 2018/11/15
 * Time: 9:39 PM
 */

namespace app\service;

use app\model\Tag;
use app\model\Tag2;

class TagService
{
    public function getByName($tagname){
        return Tag::where('tag_name','=',$tagname)->find();
    }

    public function getByName2($tagname){
        return Tag2::where('tag_name','=',$tagname)->find();
    }
}