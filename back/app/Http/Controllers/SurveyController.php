<?php

namespace App\Http\Controllers;

use App\Models\BJFSurEmployee;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SurveyController extends Controller
{
    /**
     * Verify individual access code
     */
    public function verifyCode(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'กรุณากรอกรหัสประจำตัว (Individual Code)',
            ], 422);
        }

        $code = trim($request->input('code'));

        $employee = BJFSurEmployee::where('access_code', $code)->first();

        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'ไม่พบรหัสประจำตัวนี้ในระบบ กรุณาตรวจสอบอีกครั้ง',
            ], 404);
        }

        if ($employee->submitted_at !== null) {
            return response()->json([
                'success' => false,
                'message' => 'รหัสนี้ได้ทำแบบสอบถามและส่งคำตอบเรียบร้อยแล้ว',
                'already_submitted' => true,
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => 'ตรวจสอบรหัสถูกต้อง',
            'data' => [
                'access_code' => $employee->access_code,
            ],
        ]);
    }

    /**
     * Submit survey responses
     */
    public function submit(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string',
            'q1' => 'required|integer|in:1,2,3',
            'q1_comment' => 'nullable|string',
            'q2' => 'required|integer|in:1,2,3',
            'q2_comment' => 'nullable|string',
            'q3' => 'required|integer|in:1,2,3',
            'q3_comment' => 'nullable|string',
            'q4' => 'required|integer|in:1,2,3',
            'q4_comment' => 'nullable|string',
            'q5' => 'required|integer|in:1,2,3',
            'q5_comment' => 'nullable|string',
            'q6' => 'required|string|in:ใช่,ไม่ใช่,Yes,No,1,0',
            'q6_comment' => 'nullable|string',
            'q7' => 'required|string|in:ใช่,ไม่ใช่,Yes,No,1,0',
            'q7_comment' => 'nullable|string',
            'q8' => 'required|string|in:ใช่,ไม่ใช่,Yes,No,1,0',
            'q8_comment' => 'nullable|string',
            'q9' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'กรุณาตอบคำถามให้ครบทุกข้อ',
                'errors' => $validator->errors(),
            ], 422);
        }

        $code = trim($request->input('code'));
        $employee = BJFSurEmployee::where('access_code', $code)->first();

        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'ไม่พบข้อมูลผู้ตอบในระบบ',
            ], 404);
        }

        if ($employee->submitted_at !== null) {
            return response()->json([
                'success' => false,
                'message' => 'ท่านได้ทำการส่งแบบสอบถามเรียบร้อยแล้ว ไม่สามารถส่งซ้ำได้',
            ], 400);
        }

        // Standardize Yes/No format (e.g. 'ใช่' / 'ไม่ใช่')
        $formatYesNo = function ($val) {
            if ($val === '1' || $val === 1 || $val === 'Yes' || $val === 'ใช่') return 'ใช่';
            return 'ไม่ใช่';
        };

        $employee->update([
            'q1' => $request->input('q1'),
            'q1_comment' => $request->input('q1_comment') ?? null,
            'q2' => $request->input('q2'),
            'q2_comment' => $request->input('q2_comment') ?? null,
            'q3' => $request->input('q3'),
            'q3_comment' => $request->input('q3_comment') ?? null,
            'q4' => $request->input('q4'),
            'q4_comment' => $request->input('q4_comment') ?? null,
            'q5' => $request->input('q5'),
            'q5_comment' => $request->input('q5_comment') ?? null,
            'q6' => $formatYesNo($request->input('q6')),
            'q6_comment' => $request->input('q6_comment') ?? null,
            'q7' => $formatYesNo($request->input('q7')),
            'q7_comment' => $request->input('q7_comment') ?? null,
            'q8' => $formatYesNo($request->input('q8')),
            'q8_comment' => $request->input('q8_comment') ?? null,
            'q9' => $request->input('q9') ?? null,
            'submitted_at' => Carbon::now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'บันทึกคำตอบเรียบร้อยแล้ว ขอบคุณสำหรับการทำแบบสำรวจ',
        ]);
    }
}
