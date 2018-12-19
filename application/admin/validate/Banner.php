<?php
/**
 * Created by PhpStorm.
 * User: zhangxiang
 * Date: 2018/11/18
 * Time: 4:25 PM
 */

namespace app\admin\validate;


use think\Validate;

class Banner extends Validate
{
    protected $rule = [
        'title' => 'require',
        'book_id' => 'require',
    ];

    protected $message = [
        'title' => '标题必须',
        'book_id' => '漫画id必须',
    ];
}