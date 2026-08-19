<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BJFSurEmployee extends Model
{
    use HasFactory;

    protected $table = 'BJFSur_employees';

    protected $fillable = [
        // ข้อมูลพนักงานจาก Excel (24 ฟิลด์)
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

        // 10 ฟิลด์เพิ่มเติม
        'access_code', // 1. โค้ดสำหรับทำแบบสอบถาม
        'q1',          // 2. Rating Scale 1-3
        'q2',          // 3. Rating Scale 1-3
        'q3',          // 4. Rating Scale 1-3
        'q4',          // 5. Rating Scale 1-3
        'q5',          // 6. Rating Scale 1-3
        'q6',          // 7. Yes / No
        'q7',          // 8. Yes / No
        'q8',          // 9. Yes / No
        'q9',          // 10. คำถามปลายเปิด
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
