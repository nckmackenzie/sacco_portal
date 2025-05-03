<?php

namespace App\Models;

use App\Models\BaseModel;
class Member extends BaseModel
{
    public $timestamps = true;
    protected $guarded = ['id','created_at','updated_at','deleted_at'];

    protected $hidden =[
        'created_at',
        'updated_at',
        'deleted_at',
        'deceased_at',
        'status',
        'tax_pin',
        'account_no',
        'bank',
        'occupation',
        'residence',
        'address',
        'alternate_no'
    ];

    public $casts = [
        'registration_date' => 'date',
        'date_of_birth' => 'date',
    ];

    public function user()
    {
        return $this->hasOne(User::class, 'member_id');
    }

}
