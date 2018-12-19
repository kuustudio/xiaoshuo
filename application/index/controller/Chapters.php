<?php
/**
 * Created by PhpStorm.
 * User: zhangxiang
 * Date: 2018/12/2
 * Time: 9:46 PM
 */

namespace app\index\controller;

use app\model\Chapter;
use think\Db;
use think\facade\App;

class Chapters extends Base
{
    public function index($id){
        $chapter = Chapter::with(['book'=>['author']])->cache('chapter' . $id)->find($id);
        $book_id = $chapter->book_id;
        $chapters = cache('mulu'.$book_id);
        if (!$chapters){
            $chapters = Chapter::where('book_id','=',$book_id)->select();
            cache('mulu'.$book_id,$chapters);
        }
        $prev = cache('chapter_prev'.$id);
        if (!$prev){
            $prev = Db::query(
                'select * from chapter where book_id='.$book_id.' and id<' . $id . ' order by id desc limit 1');
            cache('chapter_prev'.$id,$prev);
        }
        $next = cache('chapter_next'.$id);
        if (!$next){
            $next = Db::query(
                'select * from chapter where book_id='.$book_id.' and id>' . $id . ' order by id limit 1');
            cache('chapter_next'.$id,$next);
        }

        if (count($prev) > 0) {
            $this->assign('prev', $prev[0]);
        } else {
            $this->assign('prev', 'null');
        }
        if (count($next) > 0) {
            $this->assign('next', $next[0]);
        } else {
            $this->assign('next', 'null');
        }
        $content = '';
        if ($chapter->book->src == 'zhuishu'){
            $arr = file(App::getRootPath().'public/static/upload/book/'.$book_id.'/'.$id.'.txt');
            foreach ($arr as $a) {
                $content = $content.$a.'<br>';
            }
        }else{
            $content = file_get_contents(App::getRootPath().'public/static/upload/book/'.$book_id.'/'.$id.'.txt');
        }
        $this->assign([
            'chapter' => $chapter,
            'chapters' => $chapters,
            'content' => $content,
            'header_title' => $chapter->book->book_name,
            'title' => $chapter->book->book_name.$chapter->chapter_name.'在线阅读',
        ]);

        return view($this->tpl);
    }
}