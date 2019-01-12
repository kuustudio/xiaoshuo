<?php
/**
 * Created by PhpStorm.
 * User: zhangxiang
 * Date: 2018/11/15
 * Time: 8:13 PM
 */

namespace app\index\controller;

use app\model\Tag;
use app\service\BookService;
use think\Db;
use think\Request;

class Tags extends Base
{
    protected $bookService;
    protected function initialize()
    {
        parent::initialize();
        $this->bookService = new BookService();
    }

    public function index(Request $request){
        $tag = $request->param('tag');
        $map[] = ['id','>',0];
        if (!is_null($tag) && !empty($tag)){
            $map[] = ['tag','like','%'.$tag.'%'];
        }
        $end = $request->param('end');
        if (!is_null($end) && !empty($end)){
            $map[] = ['end','=',$end];
        }
        $order = is_null($request->param('order'))?'last_time':$request->param('order');
        $num = 28;
        if (isMobile()){
            $num = 9;
        }
        $books = $this->bookService->getPagedBooks($map,$order,$num);
        $tags = cache('tags');
        if (!$tags){
            $tags = Tag::all();
            cache('tags',$tags);
        }
        foreach ($tags as &$item){
            if ($item->tag_name == $tag){
                $item->active = 1;
            }else{
                $item->active = 0;
            }
        }
        $this->assign([
            'tags' => $tags,
            'books' => $books,
            'order' => $order,
            'end' => $end,
        ]);
        if (isMobile()){
            if (!empty($tag)){
                $this->assign('header_title',$tag);
            }else{
                $this->assign('header_title','分类');
            }
        }
        return view($this->tpl);
    }

    public function taglist(){
        $tags = cache('taglist_tags');
        if (!$tags){
            $tags = Tag::all();
            foreach ($tags as &$tag) {
                $tag['count'] = Db::query("SELECT COUNT(id) as count FROM book WHERE tag LIKE '%"
                    .$tag->tag_name."%'")[0]['count'];
            }
            cache('taglist_tags',$tags);
        }
        $all_count = cache('book_all_count');
        if (!$all_count){
            $all_count = Db::query('SELECT COUNT(id) as count FROM book ')[0]['count'];
            cache('book_all_count',$all_count);
        }
        $end_count = cache('book_end_count');
        if (!$end_count){
            $end_count = Db::query("SELECT COUNT(id) as count FROM book WHERE `end` = 1")[0]['count'];
            cache('book_end_count',$end_count);
        }
        $this->assign([
            'tags' => $tags,
            'all_count' => $all_count,
            'end_count' => $end_count,
            'header_title' => '分类',
        ]);
        return view();
    }
}