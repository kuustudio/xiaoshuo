<?php
/**
 * Created by PhpStorm.
 * User: zhangxiang
 * Date: 2018/11/15
 * Time: 8:43 PM
 */

namespace app\service;

use app\model\Book;
use think\Db;

class BookService
{
    public function getPagedBooksAdmin($where = '1=1'){
        $data = Book::where($where);
        $books = $data->with('author,chapters')->order('id','desc')
            ->paginate(5);
        return [
            'books' => $books,
            'count' => $data->count()
        ];
    }

    public function getPagedBooks($where,$order,$num){
        $data = Book::where($where);
        $books = $data->with('author')->order($order,'desc')
            ->paginate($num,false,[
                'type'     => 'util\Page',
                'var_page' => 'page',
            ]);
        return $books;
    }

    public function getBooks($num,$order = 'id'){
        return Book::with('author')->order($order,'desc')->limit($num)->select();
    }

    public function getBooksByTime($num,$order,$time){
        return Book::with('author')->where('create_time','>=',$time)
            ->order($order,'desc')->limit($num)->select();
    }

    public function getRandBooks($num){
        return Db::query("SELECT ad1.id,book_name,summary,click FROM book AS ad1 JOIN 
(SELECT ROUND(RAND() * ((SELECT MAX(id) FROM book)-(SELECT MIN(id) FROM book))+(SELECT MIN(id) FROM book)) AS id)
 AS t2 WHERE ad1.id >= t2.id ORDER BY ad1.id LIMIT " . $num);
    }

    public function getByName($name)
    {
        return Book::where('book_name', '=', $name)->find();
    }

    public function searchByName($name){
        return Book::with('author')
            ->where('book_name','like','%'.$name.'%')->limit(50)->select();
    }

    public function getLastChapter($id){
        return Book::get($id)->last_chapter;
    }
}