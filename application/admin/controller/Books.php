<?php
/**
 * Created by PhpStorm.
 * User: zhangxiang
 * Date: 2018/11/15
 * Time: 8:42 PM
 */

namespace app\admin\controller;


use app\model\Tag2;
use app\service\AuthorService;
use app\service\BookService;
use app\service\TagService;
use think\Request;
use app\model\Book;
use think\facade\App;
use app\model\Tag;

class Books extends Base
{
    protected $bookService;
    protected $authorService;
    protected $tagService;

    protected function initialize()
    {
        $this->bookService = new BookService();
        $this->authorService = new AuthorService();
        $this->tagService = new TagService();
    }

    public function index()
    {
        $data = $this->bookService->getPagedBooksAdmin();
        $books = $data['books'];
        $count = $data['count'];
        foreach ($books as &$book) {
            $book['chapter_count'] = count($book->chapters);
        }
        $this->assign([
            'books' => $books,
            'count' => $count
        ]);
        return view();
    }

    public function create()
    {
        return view();
    }

    public function save(Request $request)
    {
        $book = new Book();
        $data = $request->param();
        $validate = new \app\admin\validate\Book();
        if ($validate->check($data)) {
            if ($this->bookService->getByName($data['book_name'])) {
                $this->error('书名已经存在');
            }

            //作者处理
            $author = $this->authorService->getByName($data['author']);
            if (is_null($author)) {//如果作者不存在
                $author = new \app\model\Author();
                $author->author_name = $data['author'];
                $author->save();
            }
            $book->author_id = $author->id;
            $result = $book->save($data);
            if ($result) {
                //标签处理
                if (!empty($data['tag'])) {
                    $tags = explode('|', $data['tag']); //拆分标签成数组
                    foreach ($tags as $tagname) {
                        $tag = $this->tagService->getByName($tagname);
                        if (is_null($tag) || empty($tag)) {
                            Tag::Create(['tag_name' => $tagname]); //如果数据库里没有该标签，则追加
                        }
                    }
                }
                if (!empty($request->file())) {
                    $dir = App::getRootPath() . '/public/static/upload/book/' . $book->id;
                    if (!file_exists($dir)) {
                        mkdir($dir, 0777, true);
                    }
                    $cover = $request->file('cover');
                    $cover->validate(['size' => 1024000, 'ext' => 'jpg,png,gif,jpeg'])
                        ->move($dir, 'cover.jpg');
                    //清理浏览器缓存
                    header("Last-Modified: " . gmdate("D, d M Y H:i:s") . "GMT");
                    header("Cache-Control: no-cache, must-revalidate");
                }
                $this->redirect('index/jump');
            } else {
                $this->error('添加失败');
            }

        } else {
            $this->error($validate->getError());
        }
    }

    public function edit($id)
    {
        $book = Book::with('author')->find($id);
        $this->assign('book', $book);
        return view();
    }

    public function update(Request $request)
    {
        $book = new Book();
        $data = $request->param();
        $validate = new \app\admin\validate\Book();
        if ($validate->check($data)) {
            //作者处理
            $author = $this->authorService->getByName($data['author']);
            if (is_null($author)) {//如果是新作者
                $author = new \app\model\Author();
                $author->author_name = $data['author'];
                $author->save();
            } else { //如果作者已经存在
                $data['author_id'] = $author->id;
            }
            $result = $book->isUpdate(true)->save($data);
            if ($result) {
                //标签处理
                if (!empty($data['tag'])) {
                    $tags = explode('|', $data['tag']); //拆分标签成数组
                    foreach ($tags as $tagname) {
                        $tag = $this->tagService->getByName($tagname);
                        if (is_null($tag) || empty($tag)) {
                            Tag::create(['tag_name' => $tagname]); //如果数据库里没有该标签，则追加
                        }
                    }
                }
                if (!empty($request->file())) {
                    $dir = App::getRootPath() . '/public/static/upload/book/' . $book->id;
                    if (!file_exists($dir)) {
                        mkdir($dir, 0777, true);
                    }
                    $cover = $request->file('cover');
                    $cover->validate(['size' => 1024000, 'ext' => 'jpg,png,gif,jpeg'])
                        ->move($dir, 'cover.jpg');
                    //清理浏览器缓存
                    header("Last-Modified: " . gmdate("D, d M Y H:i:s") . "GMT");
                    header("Cache-Control: no-cache, must-revalidate");
                }
                $this->redirect('index/jump');
            } else {
                $this->error('修改失败');
            }

        } else {
            $this->error($validate->getError());
        }
    }

    public function delete($id)
    {
        $book = Book::get($id);
        $chapters = $book->chapters;
        if (count($chapters) > 0) {
            return ['err' => 1, 'msg' => '该小说下含有章节，请先删除所有章节'];
        }
        $book->delete();
        return ['err' => 0, 'msg' => '删除成功'];
    }

    public function xiongzhang(){
        if ($this->request->isPost()){
            $urls = [];
            $start = input('start');
            $end = input('end');
            for ($i = $start;$i <= $end; $i++){
                array_push($urls,config('site.url').'/index/books/index/id/'.$i.'.html') ;
            }
            $result = xiongzhang_push($urls);
            $this->success($result);
        }
        return view();
    }

    public function search(){
        $keyword = input('book_name');
        $data = $this->bookService->getPagedBooksAdmin([['book_name','like','%'.$keyword.'%']]);
        $books = $data['books'];
        $count = $data['count'];
        foreach ($books as &$book) {
            $book['chapter_count'] = count($book->chapters);
        }
        $this->assign([
            'books' => $books,
            'count' => $count
        ]);
        return view('index');
    }
}