<?php
/**
 * Created by PhpStorm.
 * User: zhangxiang
 * Date: 2018/12/13
 * Time: 9:36 PM
 */

namespace app\admin\controller;

use app\model\Book;
use app\service\AuthorService;
use app\service\BookService;
use app\service\TagService;
use app\model\Tag;
use app\model\Tag2;
use think\Exception;
use think\facade\App;
use app\model\Chapter;

class Juhe extends Base
{
    protected $bookService;
    protected $authorService;
    protected $tagService;

    protected function initialize()
    {
        $this->bookService = new BookService();
        $this->authorService = new AuthorService();
        $this->tagService = new TagService();
        set_time_limit(-1);
    }

    public function getcates()
    {
        $json = json_decode(http('https://novel.juhe.im/categories'), true);
        //halt($json);
        foreach ($json['female'] as $item) { //遍历女性分类
            $cate_name = $item['name'];
            $this->getlist($cate_name, 'female');
        }
    }

    public function getlist($cate, $gender)
    {
        $json = json_decode(http('http://api.zhuishushenqi.com/book/by-categories?gender=' . $gender .
            '&type=hot&major=' . $cate . '&minor=&start=0&limit=100'), true);
        //halt($json);
        foreach ($json['books'] as $book) {
            $this->getbook($book['_id'], $gender);
        }
    }

    private function getbook($id, $gender)
    {
        try {
            $json = json_decode(http('http://api.zhuishushenqi.com/book/' . $id), true);
            //halt($json);
            $data = array();
            $data['book_name'] = $json['title'];
            $data['author'] = $json['author'];
            $data['tag'] = $json['minorCate'];
            $data['summary'] = $json['longIntro'];
            $data['cover_url'] = str_replace('/agent/', '', urldecode($json['cover']));
            $data['last_chapter'] = $json['lastChapter'];
            $data['tag2'] = implode('|', $json['tags']);
            $book_id = $this->savebook($data, $gender);
            if ($book_id != -1){
                $this->getchapters($id, $book_id);
            }
        } finally {

        }

    }

    private function getchapters($id, $book_id)
    {
        try{
            $json = json_decode(http('http://api.zhuishushenqi.com/mix-toc/' . $id), true);
            //halt($json);
            foreach ($json['mixToc']['chapters'] as $item) {
                $chapter = Chapter::where('chapter_name', '=', $item['title'])->find();
                if (!$chapter) { //不存在同名章节
                    $content =  $this->getcontent($item['link']);
                    $chapter = new Chapter();
                    $chapter->chapter_name = $item['title'];
                    $chapter->book_id = $book_id;
                    $result = $chapter->save();
                    if ($result) {
                        $dir = App::getRootPath() . '/public/static/upload/book/' . $book_id;
                        if (!file_exists($dir)) {
                            mkdir($dir, 0777, true);
                        }
                        $file = fopen($dir . '/' . $chapter->id . '.txt', 'w');
                        fwrite($file, $content); //保存TXT文件
                    }
                }
            }
        }catch (Exception $e){
            echo $e->getMessage() ;
        }finally{

        }

    }

    private function getcontent($url)
    {
        try{
            $link = urlencode($url);
            $json = json_decode(http('http://chapter2.zhuishushenqi.com/chapter/' . $link), true);
            return $json['chapter']['body'];
        }catch (Exception $e){
            halt($e->getMessage());
        }

    }

    private function savebook($data, $gender)
    {
        $book = $this->bookService->getByName($data['book_name']);
        if ($book) { //已经有该书
            if ($book->end == 1 || $book->src != 'zhuishu'){ //且完结
                return -1;
            }
            return $book->id;
        } else {
            $book = new Book();
            $author = $this->authorService->getByName($data['author']);
            if (is_null($author)) {//如果作者不存在
                $author = new \app\model\Author();
                $author->author_name = $data['author'];
                $author->save();
            }
            $book->author_id = $author->id;
            $book->end = 1;
            $book->click = 0;
            $book->gender = $gender;
            $book->src = 'zhuishu';
            $book->save($data);
            if (!empty($data['tag2'])) {
                $tags = explode('|', $data['tag2']); //拆分标签成数组
                foreach ($tags as $tagname) {
                    $tag2 = $this->tagService->getByName2($tagname);
                    if (is_null($tag2) || empty($tag2)) {
                        Tag2::Create(['tag_name' => $tagname]); //如果数据库里没有该标签，则追加
                    }
                }
            }
            if (!empty($data['tag'])) {
                $tag = $this->tagService->getByName($data['tag']);
                if (is_null($tag) || empty($tag)) {
                    Tag::Create(['tag_name' => $data['tag']]); //如果数据库里没有该标签，则追加
                }
            }
            $dir = App::getRootPath() . '/public/static/upload/book/' . $book->id;
            if (!file_exists($dir)) {
                mkdir($dir, 0777, true);
            }
            $img_name = $dir . '/cover.jpg';
            $content = @file_get_contents($data['cover_url']);
            file_put_contents($img_name, $content);
            return $book->id;
        }
    }
}