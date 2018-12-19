<?php
/**
 * Created by PhpStorm.
 * User: zhangxiang
 * Date: 2018/11/15
 * Time: 9:36 PM
 */

namespace app\service;

use app\model\Author;

class AuthorService
{
    public function getByName($name){
        return Author::where('author_name','=',$name)->find();
    }

    public function getAuthors($where = '1=1'){
        $authors = Author::where($where)->with('books')->paginate(5);
        foreach ($authors as &$author) {
            $author['count'] = count($author->books);
        }
        return [
            'authors' => $authors,
            'count' => $authors->count()
        ];
    }
}