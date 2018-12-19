<?php
/**
 * Created by PhpStorm.
 * User: zhangxiang
 * Date: 2018/11/17
 * Time: 5:33 PM
 */

namespace app\admin\controller;

use app\model\Author;
use think\Request;

class Authors extends Base
{
    protected $authorService;

    public function initialize()
    {
        $this->authorService = new \app\service\AuthorService();
    }

    public function index(){
        $data = $this->authorService->getAuthors();
        $this->assign([
            'authors' => $data['authors'],
            'count' => $data['count']
        ]);
        return view();
    }

    public function edit($id)
    {
        $author = Author::get($id);
        $this->assign('author',$author);
        return view();
    }

    public function update(Request $request, $id)
    {
        $result = Author::update($request->param());
        if ($result){
            $this->redirect('index/jump');
        }else{
            $this->error('编辑失败');
        }
    }

    public function delete($id)
    {
        $author = Author::get($id);
        $books = $author->books;
        if (count($books) > 0){
            return ['err' => '1','msg' => '该作者名下还有作品，请先删除所有作品'];
        }
        $author->delete();
        return ['err' => '0','msg' => '删除成功'];
    }
}