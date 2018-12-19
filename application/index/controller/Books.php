<?php
/**
 * Created by PhpStorm.
 * User: zhangxiang
 * Date: 2018/11/29
 * Time: 3:50 PM
 */

namespace app\index\controller;


use app\model\Book;
use think\Db;

class Books extends Base
{
    public function index($id){
        $book = cache('book'.$id);
        if ($book == false){
            $book = Book::with(['author'=>['books'],'chapters'])->find($id);
            cache('book'.$id,$book);
        }
        $book->click = $book->click + 1;
        $book->isUpdate(true)->save();
        $tags = explode('|',$book->tag);
        $start = cache('book_start' . $id);
        if ($start == false) {
            $db = Db::query('SELECT id FROM chapter WHERE book_id = ' . $id . ' ORDER BY id LIMIT 1');
            $start = $db ? $db[0]['id'] : -1;
            cache('book_start' . $id, $start);
        }
        $this->assign([
            'book' => $book,
            'tags' => $tags,
            'start' => $start,
            'header_title' => $book->book_name,
            'title' => $book->book_name.'免费在线阅读',
            'desc' => $book->summary
        ]);
        return view($this->tpl);
    }
}