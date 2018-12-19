<?php
namespace app\index\controller;

use app\model\Banner;
use app\service\BookService;

class Index extends Base
{
    protected $bookService;
    protected function initialize()
    {
        parent::initialize();
        $this->bookService = new BookService();
    }

    public function index()
    {
        $banners = cache('homepage_banners');
        if (!$banners){
            $banners = Banner::all();
            cache('homepage_banners',$banners);
        }
        $right_lunbo = cache('homepage_right_lunbo');
        if (!$right_lunbo){
            $right_lunbo = $this->bookService->getBooks(6);
            cache('homepage_right_lunbo',$right_lunbo);
        }

        $hot_pc = cache('homepage_hot_pc');
        if (!$hot_pc){
            $hot_pc = $this->bookService->getBooks(12,'click');
            cache('homepage_hot_pc',$hot_pc);
        }
        $hot_mobile = cache('homepage_hot_mobile ');
        if (!$hot_mobile){
            $hot_mobile = $this->bookService->getBooks(6,'click');
            cache('homepage_hot_mobile',$hot_mobile);
        }
        $newest_pc = cache('homepage_newest_pc');
        if (!$newest_pc){
            $newest_pc = $this->bookService->getBooks(12);
            cache('homepage_newest_pc',$newest_pc);
        }
        $newest_mobile = cache('homepage_newest_mobile');
        if (!$newest_mobile){
            $newest_mobile = $this->bookService->getBooks(6);
            cache('homepage_newest_mobile',$newest_mobile);
        }
        $right_top = cache('homepage_right_top');
        if (!$right_top){
            $right_top = $this->bookService->getRandBooks(4);
            cache('homepage_right_top',$right_top);
        }
        $right_bottom = cache('homgpage_right_bottom');
        if (!$right_bottom){
            $right_bottom = $this->bookService->getRandBooks(4);
            cache('homgpage_right_bottom',$right_bottom);
        }

        $this->assign([
            'banners' => $banners,
            'right_lunbo' => $right_lunbo,
            'right_top' => $right_top,
            'right_bottom' => $right_bottom
        ]);
        if (isMobile()){
            $this->assign([
                'hot' => $hot_mobile,
                'newest' => $newest_mobile
            ]);
        }else{
            $this->assign([
                'hot' => $hot_pc,
                'newest' => $newest_pc,
            ]);
        }
        return view($this->tpl);
    }

    public function search($keyword){
        $books = cache('searchresult');
        if (!$books){
            $books = $this->bookService->searchByName($keyword);
            cache('searchresult',$books);
        }
        $this->assign([
            'books' => $books,
            'header_title' =>'搜索：'. $keyword,
            'count' => count($books)
        ]);
        return view($this->tpl);
    }

    public function bookshelf(){
        $this->assign([
            'header_title' => '我的书架',
            'title' => '书架'
        ]);
        return view($this->tpl);
    }
}
