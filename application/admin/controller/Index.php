<?php
/**
 * Created by PhpStorm.
 * User: zhangxiang
 * Date: 2018/11/12
 * Time: 3:17 PM
 */
namespace app\admin\controller;

use think\facade\Config;
use think\Request;

class Index extends Base
{
    public function index(){
        return view();
    }

    public function welcome(Request $request){
        if ($request->isPost()){
            Config::set('site.site_name',$request->param('site_name'));
            Config::set('site.site_name',$request->param('site_name'));
            Config::set('site.url',$request->param('url'));
            Config::set('site.admin',$request->param('admin'));
            if (!empty($request->param('password'))){
                Config::set('site.password',$request->param('password'));
            }
            $this->success('修改成功');
        }
        $site_name = config('site.site_name');
        $url = config('site.url');
        $admin = config('site.admin');
        $password = config('site.password');
        $this->assign([
            'site_name' => $site_name,
            'url' => $url,
            'admin' => $admin,
            'password' => $password
        ]);
        return view();
    }

    public function jump(){
        return view();
    }

    public function login(Request $request){
        if ($request->isPost()){
            $username = $request->param('username');
            $password = $request->param('password');
            if ($username != config('site.admin')){
                $this->error('用户名不正确');
            }
            if ($password != config('site.password')){
                $this->error('密码不正确');
            }
            session('admin',$username);
            $this->success('登录成功',url('index'),'',1);
        }
        return view();
    }

    public function clearcache(){
        clearcache();
        $this->success('缓存清理成功','/admin','',1);
    }
}