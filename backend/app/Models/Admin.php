<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    protected $table = 'admins';

    public $timestamps = false;

    protected $fillable = [
        'employee_id',
        'role',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];
}
