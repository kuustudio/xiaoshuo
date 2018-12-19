<?php
/**
 * Created by PhpStorm.
 * User: zhangxiang
 * Date: 2018/11/18
 * Time: 5:33 PM
 */

namespace app\service;

use app\model\Chapter;
class ChapterService
{
    public function getChapters($where = '1=1'){
        $chapters = Chapter::where($where);
        $pages = $chapters->order('id','desc')->paginate(5);
        return [
            'chapters' => $pages,
            'count' => $chapters->count(),
        ];
    }

    public function findByName($chapter_name){
        return Chapter::where('chapter_name','=',$chapter_name)->find();
    }
}