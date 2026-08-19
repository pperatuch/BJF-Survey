<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BJFSurEmployee;
use Illuminate\Support\Str;

class ImportBJFEmployeesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jsonPath = storage_path('employees.json');

        if (!file_exists($jsonPath)) {
            $this->command->error("JSON data file not found at: {$jsonPath}");
            return;
        }

        $employees = json_decode(file_get_contents($jsonPath), true);
        if (!$employees) {
            $this->command->error("Failed to decode JSON data.");
            return;
        }

        $count = 0;
        $chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charLen = strlen($chars);

        foreach ($employees as $cells) {
            $empNo = $cells['A'] ?? null;
            if (!$empNo) continue;

            // Generate unique 4-character random access code (digits + uppercase letters)
            do {
                $code = '';
                for ($i = 0; $i < 4; $i++) {
                    $code .= $chars[random_int(0, $charLen - 1)];
                }
            } while (isset($usedCodes[$code]));
            $usedCodes[$code] = true;


            BJFSurEmployee::updateOrCreate(
                ['emp_no' => $empNo],
                [
                    'pin_no'               => $cells['B'] ?? null,
                    'emp_title_en'         => $cells['C'] ?? null,
                    'emp_name_en'          => $cells['D'] ?? null,
                    'emp_title_th'         => $cells['E'] ?? null,
                    'emp_name_th'          => $cells['F'] ?? null,
                    'emp_initial'          => $cells['G'] ?? null,
                    'company_code'         => $cells['H'] ?? null,
                    'division_name'        => $cells['I'] ?? null,
                    'department_name'      => $cells['J'] ?? null,
                    'section_name'         => $cells['K'] ?? null,
                    'bb_sub'               => $cells['L'] ?? null,
                    'emp_group_name'       => $cells['M'] ?? null,
                    'position_title_en'    => $cells['N'] ?? null,
                    'date_joined_year'     => $cells['O'] ?? null,
                    'date_joined_month'    => $cells['P'] ?? null,
                    'employee_status_name' => $cells['Q'] ?? null,
                    'merit_grade_2025'     => $cells['R'] ?? null,
                    'merit_grade_2024'     => $cells['S'] ?? null,
                    'merit_grade_2023'     => $cells['T'] ?? null,
                    'age'                  => $cells['U'] ?? null,
                    'yos'                  => $cells['V'] ?? null,
                    'yos_current_pb'       => $cells['W'] ?? null,
                    'direct_boss_name'     => $cells['X'] ?? null,
                    'access_code'          => $code,
                ]
            );

            $count++;
        }

        $this->command->info("Successfully imported {$count} employees into BJFSur_employees table with generated access codes.");
    }
}

