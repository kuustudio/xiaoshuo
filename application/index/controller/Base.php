<?php
/**
 * Created by PhpStorm.
 * User: zhangxiang
 * Date: 2018/12/7
 * Time: 10:06 PM
 */

namespace app\index\controller;

use think\App;
use think\Controller;

class Base extends Controller
{
    protected $tpl;
    public function __construct(App $app = null)
    {
        parent::__construct($app);
        if (isMobile()){
            $this->tpl = 'm'.$this->request->action();
        }else{
            $this->tpl = $this->request->action();
        }
        $this->assign([
            'url' => config('site.url'),
            'site_name' => config('site.site_name')
        ]);
    }
}