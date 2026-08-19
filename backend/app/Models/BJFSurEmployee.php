<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BJFSurEmployee extends Model
{
    protected $table = 'BJFSur_employees';

    protected $fillable = [
        'emp_no',
        'pin_no',
        'emp_title_en',
        'emp_name_en',
        'emp_title_th',
        'emp_name_th',
        'emp_initial',
        'company_code',
        'division_name',
        'department_name',
        'section_name',
        'bb_sub',
        'emp_group_name',
        'position_title_en',
        'date_joined_year',
        'date_joined_month',
        'employee_status_name',
        'merit_grade_2025',
        'merit_grade_2024',
        'merit_grade_2023',
        'age',
        'yos',
        'yos_current_pb',
        'direct_boss_name',
        'access_code',
        'q1',
        'q2',
        'q3',
        'q4',
        'q5',
        'q6',
        'q7',
        'q8',
        'q9',
        'submitted_at',
    ];

    protected $casts = [
        'q1' => 'integer',
        'q2' => 'integer',
        'q3' => 'integer',
        'q4' => 'integer',
        'q5' => 'integer',
        'submitted_at' => 'datetime',
    ];
}
