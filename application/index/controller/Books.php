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
use app\service\ChapterService;

class Books extends Base
{
    protected $chapterService;
    protected function initialize()
    {
        $this->chapterService = new ChapterService();
    }

    public function index($id){
        $book = cache('book'.$id);
        if ($book == false){
            $book = Book::with(['author'=>['books']])->find($id);
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
            'title' => $book->book_name.'全文阅读'.'-'.$book->book_name.'最新章节'.'-'.$book->author->author_name,
            'desc' => $book->summary
        ]);
        return view($this->tpl);
    }

    public function chapterlist($book_id,$order){
        $data = $this->chapterService->getChapters(20,$order,[
            ['book_id','=',$book_id]
        ]);
        $book = cache('book'.$book_id);
        if ($book == false){
            $book = Book::with(['author'=>['books']])->find($book_id);
            cache('book'.$book_id,$book);
        }
        $this->assign([
            'chapters' => $data['chapters'],
            'count' => $data['count'],
            'book' => $book,
            'order' => $order,
            'header_title' => $book->book_name
        ]);
        return view();
    }

}