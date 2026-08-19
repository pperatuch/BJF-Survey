<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class Admin extends Authenticatable
{
    protected $table = 'BJFSur_admin';

    public $timestamps = false;


    // Disable default passwords & emails casts since AD credentials are not stored locally
    protected $fillable = [
        'employee_id',
        'role',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];
}

