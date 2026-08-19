<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class Admin extends Authenticatable
{
    protected $table = 'admins';

    // Disable default passwords & emails casts since AD credentials are not stored locally
    protected $fillable = [
        'employee_id',
        'role',
    ];

    public $timestamps = false;
}

