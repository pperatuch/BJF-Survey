<?php

namespace App\Http\Controllers;

use App\Models\BJFSurEmployee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SurveyResponseController extends Controller
{
    /**
     * Get paginated survey responses with search and filters
     */
    public function index(Request $request)
    {
        $query = BJFSurEmployee::query();

        // Search by emp_no, emp_name_th, emp_name_en, emp_initial
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('emp_no', 'like', "%{$search}%")
                  ->orWhere('emp_name_th', 'like', "%{$search}%")
                  ->orWhere('emp_title_th', 'like', "%{$search}%")
                  ->orWhere('emp_name_en', 'like', "%{$search}%")
                  ->orWhere('emp_initial', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('position_title_en', 'like', "%{$search}%")
                  ->orWhere('division_name', 'like', "%{$search}%")
                  ->orWhere('department_name', 'like', "%{$search}%")
                  ->orWhere('section_name', 'like', "%{$search}%")
                  ->orWhere('bb_sub', 'like', "%{$search}%");
            });
        }

        // Filter by section_name
        if ($section = $request->input('section')) {
            if ($section !== 'all') {
                $query->where('section_name', $section);
            }
        }

        // Filter by response status (all / responded / pending)
        if ($status = $request->input('status')) {
            if ($status === 'responded') {
                $query->whereNotNull('submitted_at');
            } elseif ($status === 'pending') {
                $query->whereNull('submitted_at');
            }
        }

        // Filter by Date Range (submitted_at)
        if ($startDate = $request->input('start_date')) {
            $query->whereDate('submitted_at', '>=', $startDate);
        }
        if ($endDate = $request->input('end_date')) {
            $query->whereDate('submitted_at', '<=', $endDate);
        }
        $perPage = (int) $request->input('per_page', 20);

        $perPage = min(max($perPage, 5), 500);

        // Sort: dynamic column sorting
        $sortField = $request->input('sort_field');
        $sortDir = strtolower($request->input('sort_dir', 'asc')) === 'desc' ? 'desc' : 'asc';

        $allowedSorts = [
            'emp_no' => 'emp_no',
            'name' => 'emp_name_th',
            'emp_initial' => 'emp_initial',
            'email' => 'email',
            'position' => 'position_title_en',
            'division_name' => 'division_name',
            'department_name' => 'department_name',
            'section' => 'section_name',
            'bb_sub' => 'bb_sub',
            'access_code' => 'access_code',
            'status' => 'submitted_at',
            'submitted_at' => 'submitted_at',
            'q1' => 'q1',
            'q2' => 'q2',
            'q3' => 'q3',
            'q4' => 'q4',
            'q5' => 'q5',
            'q6' => 'q6',
            'q7' => 'q7',
            'q8' => 'q8',
            'q9' => 'q9',
        ];

        if ($sortField && isset($allowedSorts[$sortField])) {
            $orderCol = $allowedSorts[$sortField];
            $orderDir = $sortDir;
        } else {
            $orderCol = ($status === 'responded') ? 'submitted_at' : 'emp_no';
            $orderDir = ($status === 'responded') ? 'desc' : 'asc';
        }



        // Select required columns only
        $responses = $query->select([
            'id',
            'emp_no',
            'emp_title_th',
            'emp_name_th',
            'emp_initial',
            'email',
            'position_title_en',
            'division_name',
            'department_name',
            'section_name',
            'bb_sub',
            'access_code',
            'q1',
            'q1_comment',
            'q2',
            'q2_comment',
            'q3',
            'q3_comment',
            'q4',
            'q4_comment',
            'q5',
            'q5_comment',
            'q6',
            'q6_comment',
            'q7',
            'q7_comment',
            'q8',
            'q8_comment',
            'q9',
            'submitted_at',
        ])
            ->orderBy($orderCol, $orderDir)
            ->paginate($perPage);

        return response()->json($responses);
    }

    /**
     * Get summary metrics for overview dashboard
     */
    public function summary()
    {
        $totalEmployees = BJFSurEmployee::count();
        $respondedCount = BJFSurEmployee::whereNotNull('submitted_at')->count();
        $pendingCount = $totalEmployees - $respondedCount;
        $responseRate = $totalEmployees > 0 ? round(($respondedCount / $totalEmployees) * 100, 1) : 0;

        // Calculate averages for Q1-Q5
        $qAverages = BJFSurEmployee::whereNotNull('submitted_at')
            ->selectRaw('
                AVG(CAST(q1 AS FLOAT)) as avg_q1,
                AVG(CAST(q2 AS FLOAT)) as avg_q2,
                AVG(CAST(q3 AS FLOAT)) as avg_q3,
                AVG(CAST(q4 AS FLOAT)) as avg_q4,
                AVG(CAST(q5 AS FLOAT)) as avg_q5
            ')
            ->first();

        // Get distinct sections for filter dropdown
        $sections = BJFSurEmployee::whereNotNull('section_name')
            ->where('section_name', '!=', '')
            ->distinct()
            ->orderBy('section_name')
            ->pluck('section_name');

        return response()->json([
            'total' => $totalEmployees,
            'responded' => $respondedCount,
            'pending' => $pendingCount,
            'response_rate' => $responseRate,
            'averages' => [
                'q1' => $qAverages->avg_q1 ? round($qAverages->avg_q1, 2) : 0,
                'q2' => $qAverages->avg_q2 ? round($qAverages->avg_q2, 2) : 0,
                'q3' => $qAverages->avg_q3 ? round($qAverages->avg_q3, 2) : 0,
                'q4' => $qAverages->avg_q4 ? round($qAverages->avg_q4, 2) : 0,
                'q5' => $qAverages->avg_q5 ? round($qAverages->avg_q5, 2) : 0,
            ],
            'sections' => $sections,
        ]);
    }

    /**
     * Export all survey responses to Excel (XML format compatible with Excel)
     */
    public function exportExcel(Request $request)
    {
        $query = BJFSurEmployee::query();

        if ($section = $request->input('section')) {
            if ($section !== 'all') {
                $query->where('section_name', $section);
            }
        }

        if ($status = $request->input('status')) {
            if ($status === 'responded') {
                $query->whereNotNull('submitted_at');
            } elseif ($status === 'pending') {
                $query->whereNull('submitted_at');
            }
        }

        $employees = $query->orderBy('emp_no', 'asc')->get();

        $filename = 'BJF_Survey_Responses_' . date('Ymd_His') . '.xls';

        $output = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $output .= '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" ';
        $output .= 'xmlns:o="urn:schemas-microsoft-com:office:office" ';
        $output .= 'xmlns:x="urn:schemas-microsoft-com:office:excel" ';
        $output .= 'xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">' . "\n";
        $output .= '  <Styles>' . "\n";
        $output .= '    <Style ss:ID="Header"><Font ss:Bold="1" ss:Color="#FFFFFF"/><Interior ss:Color="#0B3C5D" ss:Pattern="Solid"/></Style>' . "\n";
        $output .= '    <Style ss:ID="Center"><Alignment ss:Horizontal="Center"/></Style>' . "\n";
        $output .= '  </Styles>' . "\n";
        $output .= '  <Worksheet ss:Name="Survey Responses">' . "\n";
        $output .= '    <Table>' . "\n";

        // Header for Survey Responses Export
        $headers = [
            'รหัสพนักงาน',
            'ชื่อ-นามสกุล (ไทย)',
            'ชื่อเล่น',
            'Email',
            'ตำแหน่ง',
            'Division Name',
            'Department Name',
            'Section Name',
            'BB Sub',
            'Access Code',
            'สถานะการตอบ',
            'วันเวลาที่ตอบ',
            'Q1: เมื่อเกิดปัญหาในการทำงาน พนักงานสามารถให้ข้อมูลข้อเท็จจริงได้อย่างเปิดเผย',
            'Q1 Comment',
            'Q2: หน่วยงานต่างๆ ให้ความร่วมมือในการให้ข้อมูลครบถ้วนและถูกต้อง เมื่อมีการตรวจสอบหรือสอบถามข้อเท็จจริง',
            'Q2 Comment',
            'Q3: เมื่อเกิดข้อผิดพลาด หัวหน้างานมุ่งเน้นการแก้ปัญหา มากกว่าการหาคนผิด',
            'Q3 Comment',
            'Q4: ข้อผิดพลาดที่เกิดขึ้นได้รับการแก้ไขที่สาเหตุที่แท้จริง',
            'Q4 Comment',
            'Q5: หากฉันพบความเสี่ยงหรือการปฏิบัติที่ไม่ถูกต้อง ฉันกล้าที่จะรายงาน',
            'Q5 Comment',
            'Q6: ฉันมั่นใจว่าการให้ข้อมูลตามข้อเท็จจริงจะไม่ส่งผลกระทบในทางลบต่อตัวฉัน',
            'Q6 Comment',
            'Q7: หัวหน้างานของฉันสนับสนุนให้พนักงานรายงานปัญหาตามความเป็นจริง',
            'Q7 Comment',
            'Q8: ฉันมีความเชื่อมั่นในตัวหัวหน้างานโดยตรง',
            'Q8 Comment',
            'Q9: ข้อเสนอแนะ (ท่านคิดว่า องค์กรควรปรับปรุงเรื่องใดมากที่สุด เพื่อสร้างวัฒนธรรมการทำงานที่โปร่งใสและเปิดเผยข้อมูล)',
        ];

        $output .= '      <Row ss:StyleID="Header">' . "\n";
        foreach ($headers as $h) {
            $output .= '        <Cell><Data ss:Type="String">' . htmlspecialchars($h, ENT_QUOTES, 'UTF-8') . '</Data></Cell>' . "\n";
        }
        $output .= '      </Row>' . "\n";

        // Rows
        foreach ($employees as $emp) {
            $fullName = trim(($emp->emp_title_th ?? '') . ' ' . ($emp->emp_name_th ?? ''));
            $statusText = $emp->submitted_at ? 'ตอบแล้ว' : 'ยังไม่ตอบ';
            $submittedAt = $emp->submitted_at ? $emp->submitted_at->format('Y-m-d H:i:s') : '-';

            $output .= '      <Row>' . "\n";
            $output .= '        <Cell ss:StyleID="Center"><Data ss:Type="String">' . htmlspecialchars($emp->emp_no ?? '', ENT_QUOTES, 'UTF-8') . '</Data></Cell>' . "\n";
            $output .= '        <Cell><Data ss:Type="String">' . htmlspecialchars($fullName ?: ($emp->emp_name_en ?? ''), ENT_QUOTES, 'UTF-8') . '</Data></Cell>' . "\n";
            $output .= '        <Cell ss:StyleID="Center"><Data ss:Type="String">' . htmlspecialchars($emp->emp_initial ?? '', ENT_QUOTES, 'UTF-8') . '</Data></Cell>' . "\n";
            $output .= '        <Cell><Data ss:Type="String">' . htmlspecialchars($emp->email ?? '', ENT_QUOTES, 'UTF-8') . '</Data></Cell>' . "\n";
            $output .= '        <Cell><Data ss:Type="String">' . htmlspecialchars($emp->position_title_en ?? '', ENT_QUOTES, 'UTF-8') . '</Data></Cell>' . "\n";
            $output .= '        <Cell><Data ss:Type="String">' . htmlspecialchars($emp->division_name ?? '', ENT_QUOTES, 'UTF-8') . '</Data></Cell>' . "\n";
            $output .= '        <Cell><Data ss:Type="String">' . htmlspecialchars($emp->department_name ?? '', ENT_QUOTES, 'UTF-8') . '</Data></Cell>' . "\n";
            $output .= '        <Cell><Data ss:Type="String">' . htmlspecialchars($emp->section_name ?? '', ENT_QUOTES, 'UTF-8') . '</Data></Cell>' . "\n";
            $output .= '        <Cell ss:StyleID="Center"><Data ss:Type="String">' . htmlspecialchars($emp->bb_sub ?? '', ENT_QUOTES, 'UTF-8') . '</Data></Cell>' . "\n";
            $output .= '        <Cell ss:StyleID="Center"><Data ss:Type="String">' . htmlspecialchars($emp->access_code ?? '', ENT_QUOTES, 'UTF-8') . '</Data></Cell>' . "\n";
            $output .= '        <Cell ss:StyleID="Center"><Data ss:Type="String">' . $statusText . '</Data></Cell>' . "\n";
            $output .= '        <Cell ss:StyleID="Center"><Data ss:Type="String">' . $submittedAt . '</Data></Cell>' . "\n";
            $output .= '        <Cell ss:StyleID="Center"><Data ss:Type="String">' . ($emp->q1 ?? '-') . '</Data></Cell>' . "\n";
            $output .= '        <Cell><Data ss:Type="String">' . htmlspecialchars($emp->q1_comment ?? '', ENT_QUOTES, 'UTF-8') . '</Data></Cell>' . "\n";
            $output .= '        <Cell ss:StyleID="Center"><Data ss:Type="String">' . ($emp->q2 ?? '-') . '</Data></Cell>' . "\n";
            $output .= '        <Cell><Data ss:Type="String">' . htmlspecialchars($emp->q2_comment ?? '', ENT_QUOTES, 'UTF-8') . '</Data></Cell>' . "\n";
            $output .= '        <Cell ss:StyleID="Center"><Data ss:Type="String">' . ($emp->q3 ?? '-') . '</Data></Cell>' . "\n";
            $output .= '        <Cell><Data ss:Type="String">' . htmlspecialchars($emp->q3_comment ?? '', ENT_QUOTES, 'UTF-8') . '</Data></Cell>' . "\n";
            $output .= '        <Cell ss:StyleID="Center"><Data ss:Type="String">' . ($emp->q4 ?? '-') . '</Data></Cell>' . "\n";
            $output .= '        <Cell><Data ss:Type="String">' . htmlspecialchars($emp->q4_comment ?? '', ENT_QUOTES, 'UTF-8') . '</Data></Cell>' . "\n";
            $output .= '        <Cell ss:StyleID="Center"><Data ss:Type="String">' . ($emp->q5 ?? '-') . '</Data></Cell>' . "\n";
            $output .= '        <Cell><Data ss:Type="String">' . htmlspecialchars($emp->q5_comment ?? '', ENT_QUOTES, 'UTF-8') . '</Data></Cell>' . "\n";
            $output .= '        <Cell ss:StyleID="Center"><Data ss:Type="String">' . ($emp->q6 ?? '-') . '</Data></Cell>' . "\n";
            $output .= '        <Cell><Data ss:Type="String">' . htmlspecialchars($emp->q6_comment ?? '', ENT_QUOTES, 'UTF-8') . '</Data></Cell>' . "\n";
            $output .= '        <Cell ss:StyleID="Center"><Data ss:Type="String">' . ($emp->q7 ?? '-') . '</Data></Cell>' . "\n";
            $output .= '        <Cell><Data ss:Type="String">' . htmlspecialchars($emp->q7_comment ?? '', ENT_QUOTES, 'UTF-8') . '</Data></Cell>' . "\n";
            $output .= '        <Cell ss:StyleID="Center"><Data ss:Type="String">' . ($emp->q8 ?? '-') . '</Data></Cell>' . "\n";
            $output .= '        <Cell><Data ss:Type="String">' . htmlspecialchars($emp->q8_comment ?? '', ENT_QUOTES, 'UTF-8') . '</Data></Cell>' . "\n";
            $output .= '        <Cell><Data ss:Type="String">' . htmlspecialchars($emp->q9 ?? '', ENT_QUOTES, 'UTF-8') . '</Data></Cell>' . "\n";
            $output .= '      </Row>' . "\n";
        }

        $output .= '    </Table>' . "\n";
        $output .= '  </Worksheet>' . "\n";
        $output .= '</Workbook>';

        return response($output, 200, [
            'Content-Type' => 'application/vnd.ms-excel; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    /**
     * Export employee survey access codes list (emp_no, name_th, nickname, access_code)
     */
    public function exportAccessCodes(Request $request)
    {
        $query = BJFSurEmployee::query();

        if ($section = $request->input('section')) {
            if ($section !== 'all') {
                $query->where('section_name', $section);
            }
        }

        $employees = $query->orderBy('emp_no', 'asc')->get();
        $filename = 'BJF_Survey_AccessCodes_' . date('Ymd_His') . '.xls';

        $output = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $output .= '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" ';
        $output .= 'xmlns:o="urn:schemas-microsoft-com:office:office" ';
        $output .= 'xmlns:x="urn:schemas-microsoft-com:office:excel" ';
        $output .= 'xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">' . "\n";
        $output .= '  <Styles>' . "\n";
        $output .= '    <Style ss:ID="Header"><Font ss:Bold="1" ss:Color="#FFFFFF"/><Interior ss:Color="#00A651" ss:Pattern="Solid"/></Style>' . "\n";
        $output .= '    <Style ss:ID="Center"><Alignment ss:Horizontal="Center"/></Style>' . "\n";
        $output .= '    <Style ss:ID="Code"><Font ss:Bold="1" ss:Color="#0B3C5D"/><Alignment ss:Horizontal="Center"/><Interior ss:Color="#FFFBEB" ss:Pattern="Solid"/></Style>' . "\n";
        $output .= '  </Styles>' . "\n";
        $output .= '  <Worksheet ss:Name="Access Codes">' . "\n";
        $output .= '    <Table>' . "\n";

        // Header
        $headers = [
            'ลำดับ',
            'รหัสพนักงาน (Emp No)',
            'ชื่อ-นามสกุล (ไทย)',
            'ชื่อเล่น',
            'ตำแหน่ง',
            'แผนก',
            'Survey Access Code',
        ];

        $output .= '      <Row ss:StyleID="Header">' . "\n";
        foreach ($headers as $h) {
            $output .= '        <Cell><Data ss:Type="String">' . htmlspecialchars($h, ENT_QUOTES, 'UTF-8') . '</Data></Cell>' . "\n";
        }
        $output .= '      </Row>' . "\n";

        // Rows
        foreach ($employees as $idx => $emp) {
            $fullName = trim(($emp->emp_title_th ?? '') . ' ' . ($emp->emp_name_th ?? ''));

            $output .= '      <Row>' . "\n";
            $output .= '        <Cell ss:StyleID="Center"><Data ss:Type="Number">' . ($idx + 1) . '</Data></Cell>' . "\n";
            $output .= '        <Cell ss:StyleID="Center"><Data ss:Type="String">' . htmlspecialchars($emp->emp_no ?? '', ENT_QUOTES, 'UTF-8') . '</Data></Cell>' . "\n";
            $output .= '        <Cell><Data ss:Type="String">' . htmlspecialchars($fullName ?: ($emp->emp_name_en ?? ''), ENT_QUOTES, 'UTF-8') . '</Data></Cell>' . "\n";
            $output .= '        <Cell ss:StyleID="Center"><Data ss:Type="String">' . htmlspecialchars($emp->emp_initial ?? '-', ENT_QUOTES, 'UTF-8') . '</Data></Cell>' . "\n";
            $output .= '        <Cell><Data ss:Type="String">' . htmlspecialchars($emp->position_title_en ?? '-', ENT_QUOTES, 'UTF-8') . '</Data></Cell>' . "\n";
            $output .= '        <Cell><Data ss:Type="String">' . htmlspecialchars($emp->section_name ?? '-', ENT_QUOTES, 'UTF-8') . '</Data></Cell>' . "\n";
            $output .= '        <Cell ss:StyleID="Code"><Data ss:Type="String">' . htmlspecialchars($emp->access_code ?? '', ENT_QUOTES, 'UTF-8') . '</Data></Cell>' . "\n";
            $output .= '      </Row>' . "\n";
        }

        $output .= '    </Table>' . "\n";
        $output .= '  </Worksheet>' . "\n";
        $output .= '</Workbook>';


        return response($output, 200, [
            'Content-Type' => 'application/vnd.ms-excel; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }
}

