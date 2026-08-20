import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import api from '../lib/api';
import XLSX from 'xlsx-js-style';
import {

  Search,
  CheckCircle2,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  LogOut,
  RefreshCw,
  TrendingUp,
  FileSpreadsheet,
  Building2,
  X,
  Calendar,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ArrowLeftRight,
} from 'lucide-react';



interface EmployeeResponse {
  id: number;
  emp_no: string;
  emp_title_th: string | null;
  emp_name_th: string | null;
  emp_initial: string | null;
  position_title_en: string | null;
  division_name: string | null;
  department_name: string | null;
  section_name: string | null;
  bb_sub: string | null;
  email: string | null;
  access_code: string | null;
  q1: number | null;
  q2: number | null;
  q3: number | null;
  q4: number | null;
  q5: number | null;
  q6: string | null;
  q7: string | null;
  q8: string | null;
  q9: string | null;
  submitted_at: string | null;
}

interface SummaryData {
  total: number;
  responded: number;
  pending: number;
  response_rate: number;
  averages: {
    q1: number;
    q2: number;
    q3: number;
    q4: number;
    q5: number;
  };
  sections: string[];
}

export default function SurveyResponsesPage() {
  const { user, logout } = useAuthStore();

  // Tab State: 'SUMMARY' หรือ 'RESPONSES'
  const [activeTab, setActiveTab] = useState<'SUMMARY' | 'RESPONSES'>('SUMMARY');

  const [data, setData] = useState<EmployeeResponse[]>([]);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedSection, setSelectedSection] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [perPage, setPerPage] = useState(350);

  // Sorting State: 3 states (desc -> asc -> none)
  const [sortField, setSortField] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc' | ''>('');

  const tableScrollRef = useRef<HTMLDivElement>(null);
  const scrollTable = (direction: 'left' | 'right') => {
    if (tableScrollRef.current) {
      const scrollAmount = 450;
      tableScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };


  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch summary
  const fetchSummary = async () => {
    try {
      const res = await api.get('/survey/responses/summary');
      setSummary(res.data);
    } catch (err) {
      console.error('Failed to fetch summary:', err);
    }
  };

  // Fetch paginated data
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/survey/responses', {
        params: {
          search: debouncedSearch,
          section: selectedSection,
          status: activeTab === 'RESPONSES' ? 'responded' : selectedStatus,
          start_date: activeTab === 'RESPONSES' && startDate ? startDate : undefined,
          end_date: activeTab === 'RESPONSES' && endDate ? endDate : undefined,
          sort_field: sortField,
          sort_dir: sortDir,
          page: currentPage,
          per_page: perPage,
        },
      });

      setData(res.data.data || []);
      setTotalPages(res.data.last_page || 1);
      setTotalRecords(res.data.total || 0);
    } catch (err) {
      console.error('Failed to fetch responses:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  useEffect(() => {
    fetchData();
  }, [debouncedSearch, selectedSection, selectedStatus, startDate, endDate, sortField, sortDir, currentPage, perPage, activeTab]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      if (sortDir === 'desc') {
        setSortDir('asc');
      } else if (sortDir === 'asc') {
        setSortField('');
        setSortDir('');
      } else {
        setSortDir('desc');
      }
    } else {
      setSortField(field);
      setSortDir('desc');
    }
    setCurrentPage(1);
  };

  const renderSortHeader = (
    field: string,
    label: string,
    widthClass = '',
    align: 'left' | 'center' | 'right' = 'left',
    bgClass = 'bg-[#F0F4F8]',
    extraClass = '',
    truncate = false
  ) => {
    const isSorted = sortField === field;
    return (
      <th
        key={field}
        onClick={() => handleSort(field)}
        className={`py-3 px-3 text-[10.5px] font-bold tracking-tight ${bgClass} ${widthClass} border-b-2 border-[#0B3C5D]/10 cursor-pointer hover:bg-slate-200/80 transition-colors select-none ${extraClass}`}
      >
        <div className={`flex items-center gap-1.5 ${align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start'}`}>
          <span className={`${truncate ? 'truncate' : 'whitespace-normal leading-snug break-words'}`}>{label}</span>
          <div className="shrink-0 flex items-center" title="กดครั้งที่ 1: มากไปน้อย, ครั้งที่ 2: น้อยไปมาก, ครั้งที่ 3: ยกเลิกการเรียง">
            {isSorted ? (
              sortDir === 'desc' ? (
                <ArrowDown className="w-3.5 h-3.5 text-[#0B3C5D] font-bold stroke-[2.5]" />
              ) : (
                <ArrowUp className="w-3.5 h-3.5 text-[#0B3C5D] font-bold stroke-[2.5]" />
              )
            ) : (
              <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-60 hover:opacity-100" />
            )}
          </div>
        </div>
      </th>
    );
  };


  const handleRefresh = () => {
    setRefreshing(true);
    fetchSummary();
    fetchData();
  };

  const handleExport = async () => {
    try {
      // Fetch all records for export (up to 500 records)
      const res = await api.get('/survey/responses', {
        params: {
          section: selectedSection !== 'all' ? selectedSection : undefined,
          status: activeTab === 'RESPONSES' ? 'responded' : (selectedStatus !== 'all' ? selectedStatus : undefined),
          start_date: activeTab === 'RESPONSES' && startDate ? startDate : undefined,
          end_date: activeTab === 'RESPONSES' && endDate ? endDate : undefined,
          sort_field: sortField || undefined,
          sort_dir: sortDir || undefined,
          per_page: 500,
        },
      });

      const list: EmployeeResponse[] = res.data.data || [];

      // Headers definition
      const headers = [
        'รหัสพนักงาน',
        'ชื่อ-นามสกุล (ไทย)',
        'ชื่อเล่น',
        'ตำแหน่ง',
        'แผนก',
        'Access Code',
        'สถานะการตอบ',
        'วันเวลาที่ตอบ',
        'Q1: เมื่อเกิดปัญหาในการทำงาน พนักงานสามารถให้ข้อมูลข้อเท็จจริงได้อย่างเปิดเผย',
        'Q2: หน่วยงานต่างๆ ให้ความร่วมมือในการให้ข้อมูลครบถ้วนและถูกต้อง เมื่อมีการตรวจสอบหรือสอบถามข้อเท็จจริง',
        'Q3: เมื่อเกิดข้อผิดพลาด หัวหน้างานมุ่งเน้นการแก้ปัญหา มากกว่าการหาคนผิด',
        'Q4: ข้อผิดพลาดที่เกิดขึ้นได้รับการแก้ไขที่สาเหตุที่แท้จริง',
        'Q5: หากฉันพบความเสี่ยงหรือการปฏิบัติที่ไม่ถูกต้อง ฉันกล้าที่จะรายงาน',
        'Q6: ฉันมั่นใจว่าการให้ข้อมูลตามข้อเท็จจริงจะไม่ส่งผลกระทบในทางลบต่อตัวฉัน',
        'Q7: หัวหน้างานของฉันสนับสนุนให้พนักงานรายงานปัญหาตามความเป็นจริง',
        'Q8: ฉันมีความเชื่อมั่นในตัวหัวหน้างานโดยตรง',
        'Q9: ข้อเสนอแนะ (ท่านคิดว่า องค์กรควรปรับปรุงเรื่องใดมากที่สุด เพื่อสร้างวัฒนธรรมการทำงานที่โปร่งใสและเปิดเผยข้อมูล)',
      ];

      // Build data matrix [ [header1, ...], [row1_1, ...], ... ]
      const dataMatrix: any[][] = [headers];

      list.forEach((emp) => {
        const fullName = trimFullName(emp.emp_title_th, emp.emp_name_th) || emp.emp_name_th || '-';
        dataMatrix.push([
          emp.emp_no || '',
          fullName,
          emp.emp_initial || '',
          emp.position_title_en || '',
          emp.section_name || '',
          emp.access_code || '',
          emp.submitted_at ? 'ตอบแล้ว' : 'ยังไม่ตอบ',
          emp.submitted_at ? formatDateTime(emp.submitted_at) : '-',
          emp.q1 ?? '-',
          emp.q2 ?? '-',
          emp.q3 ?? '-',
          emp.q4 ?? '-',
          emp.q5 ?? '-',
          emp.q6 ?? '-',
          emp.q7 ?? '-',
          emp.q8 ?? '-',
          emp.q9 ?? '-',
        ]);
      });

      const worksheet = XLSX.utils.aoa_to_sheet(dataMatrix);

      // Border styles
      const thinBorder = {
        top: { style: 'thin', color: { rgb: 'D3D3D3' } },
        bottom: { style: 'thin', color: { rgb: 'D3D3D3' } },
        left: { style: 'thin', color: { rgb: 'D3D3D3' } },
        right: { style: 'thin', color: { rgb: 'D3D3D3' } },
      };

      // Header style
      const headerStyle = {
        font: { name: 'Sarabun', sz: 11, bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '0B3C5D' } },
        alignment: { vertical: 'center', horizontal: 'center', wrapText: true },
        border: {
          top: { style: 'medium', color: { rgb: '0B3C5D' } },
          bottom: { style: 'medium', color: { rgb: '0B3C5D' } },
          left: { style: 'thin', color: { rgb: '1E5F8A' } },
          right: { style: 'thin', color: { rgb: '1E5F8A' } },
        },
      };

      // Apply cell styles across entire worksheet
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:Q1');
      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
          if (!worksheet[cellRef]) continue;

          if (R === 0) {
            worksheet[cellRef].s = headerStyle;
          } else {
            // Row data styles
            const isEven = R % 2 === 0;
            const bgColor = isEven ? 'F8FAFC' : 'FFFFFF';
            const isCenterCol = [0, 2, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].includes(C);

            worksheet[cellRef].s = {
              font: { name: 'Sarabun', sz: 10, color: { rgb: '1E293B' } },
              fill: { fgColor: { rgb: bgColor } },
              alignment: {
                vertical: 'center',
                horizontal: isCenterCol ? 'center' : 'left',
                wrapText: C === 16, // wrap for Q9 open-ended suggestions
              },
              border: thinBorder,
            };

            // Custom styling for Access Code column (amber accent)
            if (C === 5) {
              worksheet[cellRef].s.font = { name: 'Consolas', sz: 10, bold: true, color: { rgb: 'B45309' } };
              worksheet[cellRef].s.fill = { fgColor: { rgb: 'FEF3C7' } };
            }

            // Custom styling for status column
            if (C === 6) {
              const val = worksheet[cellRef].v;
              if (val === 'ตอบแล้ว') {
                worksheet[cellRef].s.font = { name: 'Sarabun', sz: 10, bold: true, color: { rgb: '15803D' } };
                worksheet[cellRef].s.fill = { fgColor: { rgb: 'DCFCE7' } };
              } else {
                worksheet[cellRef].s.font = { name: 'Sarabun', sz: 10, color: { rgb: '64748B' } };
              }
            }
          }
        }
      }

      // Set column widths & row heights
      worksheet['!cols'] = [
        { wch: 14 }, // รหัสพนักงาน
        { wch: 26 }, // ชื่อ-นามสกุล
        { wch: 10 }, // ชื่อเล่น
        { wch: 25 }, // ตำแหน่ง
        { wch: 18 }, // แผนก
        { wch: 15 }, // Access Code
        { wch: 14 }, // สถานะ
        { wch: 20 }, // วันเวลาที่ตอบ
        { wch: 32 }, // Q1
        { wch: 34 }, // Q2
        { wch: 32 }, // Q3
        { wch: 30 }, // Q4
        { wch: 32 }, // Q5
        { wch: 32 }, // Q6
        { wch: 32 }, // Q7
        { wch: 28 }, // Q8
        { wch: 55 }, // Q9
      ];

      worksheet['!rows'] = [{ hpt: 38 }]; // Header height

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Survey Responses');

      const dateStr = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(workbook, `BJF_Survey_Responses_${dateStr}.xlsx`);
    } catch (err) {
      console.error('Export error:', err);
      alert('ไม่สามารถส่งออกข้อมูลเป็น Excel ได้');
    }
  };

  const handleExportAccessCodes = async () => {
    try {
      const res = await api.get('/survey/responses', {
        params: {
          section: selectedSection !== 'all' ? selectedSection : undefined,
          per_page: 500,
        },
      });

      const list: EmployeeResponse[] = res.data.data || [];

      const headers = [
        'รหัสพนักงาน (emp_no)',
        'ชื่อ-นามสกุลภาษาไทย',
        'ชื่อเล่น (emp_initial)',
        'ตำแหน่ง',
        'แผนก',
        'Access Code (สำหรับเข้าทำแบบสอบถาม)',
      ];

      const dataMatrix: any[][] = [headers];

      list.forEach((emp) => {
        const fullName = trimFullName(emp.emp_title_th, emp.emp_name_th) || emp.emp_name_th || '-';
        dataMatrix.push([
          emp.emp_no || '',
          fullName,
          emp.emp_initial || '',
          emp.position_title_en || '',
          emp.section_name || '',
          emp.access_code || '',
        ]);
      });

      const worksheet = XLSX.utils.aoa_to_sheet(dataMatrix);

      const thinBorder = {
        top: { style: 'thin', color: { rgb: 'D3D3D3' } },
        bottom: { style: 'thin', color: { rgb: 'D3D3D3' } },
        left: { style: 'thin', color: { rgb: 'D3D3D3' } },
        right: { style: 'thin', color: { rgb: 'D3D3D3' } },
      };

      const headerStyle = {
        font: { name: 'Sarabun', sz: 11, bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: 'D97706' } }, // Amber header for Access Codes
        alignment: { vertical: 'center', horizontal: 'center', wrapText: true },
        border: {
          top: { style: 'medium', color: { rgb: 'B45309' } },
          bottom: { style: 'medium', color: { rgb: 'B45309' } },
          left: { style: 'thin', color: { rgb: 'F59E0B' } },
          right: { style: 'thin', color: { rgb: 'F59E0B' } },
        },
      };

      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:F1');
      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
          if (!worksheet[cellRef]) continue;

          if (R === 0) {
            worksheet[cellRef].s = headerStyle;
          } else {
            const isEven = R % 2 === 0;
            const bgColor = isEven ? 'FFFDF5' : 'FFFFFF';
            const isCenterCol = [0, 2, 5].includes(C);

            worksheet[cellRef].s = {
              font: { name: 'Sarabun', sz: 10, color: { rgb: '1E293B' } },
              fill: { fgColor: { rgb: bgColor } },
              alignment: {
                vertical: 'center',
                horizontal: isCenterCol ? 'center' : 'left',
              },
              border: thinBorder,
            };

            // Highlight Access Code Column prominently
            if (C === 5) {
              worksheet[cellRef].s.font = { name: 'Consolas', sz: 12, bold: true, color: { rgb: 'B45309' } };
              worksheet[cellRef].s.fill = { fgColor: { rgb: 'FEF3C7' } };
            }
          }
        }
      }

      worksheet['!cols'] = [
        { wch: 22 }, // รหัสพนักงาน
        { wch: 28 }, // ชื่อ-นามสกุล
        { wch: 18 }, // ชื่อเล่น
        { wch: 26 }, // ตำแหน่ง
        { wch: 20 }, // แผนก
        { wch: 36 }, // Access Code
      ];

      worksheet['!rows'] = [{ hpt: 30 }];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Access Codes');

      const dateStr = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(workbook, `BJF_Employee_Access_Codes_${dateStr}.xlsx`);
    } catch (err) {
      console.error('Export Access Codes error:', err);
      alert('ไม่สามารถส่งออกรหัส Access Code ได้');
    }
  };


  const trimFullName = (title: string | null, name: string | null) => {
    return ((title ? title + ' ' : '') + (name || '')).trim();
  };


  const renderRating = (score: number | null) => {
    if (score === null || score === undefined) {
      return <span className="text-slate-300 font-mono text-xs">-</span>;
    }
    const config = {
      1: { bg: 'bg-rose-50 border-rose-200 text-rose-700', label: '1 (ไม่เคย)' },
      2: { bg: 'bg-amber-50 border-amber-200 text-amber-700', label: '2 (บางครั้ง)' },
      3: { bg: 'bg-emerald-50 border-emerald-200 text-emerald-700', label: '3 (เป็นประจำ)' },
    }[score] || { bg: 'bg-slate-100 border-slate-200 text-slate-700', label: String(score) };
    return (
      <span title={config.label} className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-[11px] font-bold border ${config.bg} shadow-2xs`}>
        {score}
      </span>
    );
  };

  const renderYesNo = (val: string | null) => {
    if (!val) return <span className="text-slate-300 font-mono text-xs">-</span>;
    const isYes = val.toLowerCase() === 'yes' || val === 'ใช่';
    return (
      <span className={`inline-flex items-center justify-center px-1.5 py-0.5 min-w-[28px] rounded text-[10px] font-bold ${isYes ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
        {isYes ? 'Yes' : 'No'}
      </span>
    );
  };

  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('th-TH', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] text-slate-800 flex flex-col font-sans">
      <header className="bg-[#0B3C5D] text-white shadow-md sticky top-0 z-30">
        <div className="max-w-[1700px] w-full mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 px-3 py-1.5 rounded-lg flex items-center space-x-2 backdrop-blur-xs border border-white/15">
              <span className="font-extrabold tracking-wider text-emerald-400 text-sm">BJC</span>
              <span className="text-white/40">|</span>
              <span className="font-semibold text-xs tracking-wide uppercase">SURVEY</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-medium text-white">{user?.name || 'Administrator'}</div>
              <div className="text-[11px] text-emerald-300/80">{user?.position || user?.role || 'Admin'} • BJF</div>
            </div>
            <button onClick={() => logout()} title="ออกจากระบบ" className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1700px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="bg-white rounded-2xl shadow-xs border border-gray-200/70 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="inline-flex items-center justify-center p-2 rounded-xl bg-blue-50 text-blue-700">
                <Building2 className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold text-[#0B3C5D]">แบบสะท้อนความคิดเห็น (BJF Survey)</h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">ผลการตอบแบบสำรวจความโปร่งใสและวัฒนธรรมองค์กรของพนักงาน BJF ทั้งหมด</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/60 border border-blue-100 rounded-2xl px-5 py-3 flex items-center space-x-3 text-[#0B3C5D] shadow-xs">
              <div className="p-2.5 bg-[#0B3C5D] rounded-xl text-white shadow-xs"><Users className="w-5 h-5" /></div>
              <div>
                <div className="text-[10px] font-bold tracking-widest uppercase opacity-70">Total Responses</div>
                <div className="text-xl font-black text-slate-900 leading-none mt-0.5">
                  {summary ? summary.responded : '-'}
                  <span className="text-xs text-slate-400 font-normal ml-1.5">/ {summary?.total || '-'} คน</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 border-b border-gray-200">
          <button onClick={() => { setActiveTab('SUMMARY'); setSelectedStatus('all'); setCurrentPage(1); }} className={`px-5 py-2.5 text-xs font-bold tracking-wider transition-all rounded-t-xl border border-b-0 cursor-pointer ${activeTab === 'SUMMARY' ? 'bg-white text-[#0B3C5D] border-gray-200 shadow-xs' : 'bg-transparent text-gray-400 border-transparent hover:text-gray-600'}`}>
            SUMMARY (ภาพรวม)
          </button>
          <button onClick={() => { setActiveTab('RESPONSES'); setSelectedStatus('all'); setCurrentPage(1); }} className={`px-5 py-2.5 text-xs font-bold tracking-wider transition-all rounded-t-xl border border-b-0 cursor-pointer ${activeTab === 'RESPONSES' ? 'bg-white text-[#0B3C5D] border-gray-200 shadow-xs' : 'bg-transparent text-gray-400 border-transparent hover:text-gray-600'}`}>
            RESPONSES (รายคน)
          </button>
        </div>

        {summary && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 border border-gray-200/70 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-500">พนักงานทั้งหมด</div>
                <div className="text-2xl font-black text-slate-800 mt-0.5">{summary.total}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"><Users className="w-5 h-5" /></div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200/70 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-500">ตอบแล้ว</div>
                <div className="text-2xl font-black text-emerald-600 mt-0.5">{summary.responded}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600"><CheckCircle2 className="w-5 h-5" /></div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200/70 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-500">ยังไม่ตอบ</div>
                <div className="text-2xl font-black text-amber-600 mt-0.5">{summary.pending}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600"><Clock className="w-5 h-5" /></div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200/70 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-500">อัตราการตอบ</div>
                <div className="text-2xl font-black text-blue-600 mt-0.5">{summary.response_rate}%</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><TrendingUp className="w-5 h-5" /></div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-4 border border-gray-200/70 shadow-xs space-y-3 lg:space-y-0 lg:flex lg:items-center lg:justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="ค้นหารหัส, ชื่อ, ตำแหน่ง..." className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
            <select value={selectedSection} onChange={(e) => { setSelectedSection(e.target.value); setCurrentPage(1); }} className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 cursor-pointer">
              <option value="all">ทุกแผนก</option>
              {summary?.sections.map((sec) => <option key={sec} value={sec}>{sec}</option>)}
            </select>
            {activeTab === 'SUMMARY' && (
              <select value={selectedStatus} onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }} className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 cursor-pointer">
                <option value="all">สถานะ:ทั้งหมด</option>
                <option value="responded">ตอบแล้ว</option>
                <option value="pending">ยังไม่ตอบ</option>
              </select>
            )}
            {activeTab === 'RESPONSES' && (
              <div className="flex items-center space-x-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }} className="bg-transparent text-slate-700 focus:outline-none text-[11px]" />
                <span className="text-slate-300">-</span>
                <input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }} className="bg-transparent text-slate-700 focus:outline-none text-[11px]" />
              </div>
            )}
            {sortField && (
            <button onClick={() => { setSortField(''); setSortDir(''); setCurrentPage(1); }} className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-blue-50 text-[#0B3C5D] border border-blue-200 rounded-xl text-xs font-semibold cursor-pointer">
                <span>รีเซ็ตการเรียง</span>
                <X className="w-3 h-3" />
              </button>
            )}
            <button onClick={handleRefresh} disabled={refreshing} className="p-2 text-slate-500 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors" title="รีเฟรชข้อมูล">
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>

            {/* Quick Horizontal Scroll Nav at the Top */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-2xs">
              <button
                onClick={() => scrollTable('left')}
                className="p-1.5 rounded-lg bg-white text-slate-700 hover:bg-blue-50 hover:text-[#0B3C5D] transition-colors cursor-pointer border border-slate-200/60 shadow-2xs"
                title="เลื่อนตารางไปทางซ้าย"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center gap-1 px-2 text-[10.5px] font-bold text-slate-600 select-none">
                <ArrowLeftRight className="w-3 h-3 text-[#0B3C5D]" />
                <span>เลื่อนตาราง ซ้าย-ขวา</span>
              </div>
              <button
                onClick={() => scrollTable('right')}
                className="p-1.5 rounded-lg bg-white text-slate-700 hover:bg-blue-50 hover:text-[#0B3C5D] transition-colors cursor-pointer border border-slate-200/60 shadow-2xs"
                title="เลื่อนตารางไปทางขวา"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleExportAccessCodes} className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export Codes</span>
            </button>
            <button onClick={handleExport} className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export ผลสำรวจ</span>
            </button>
          </div>
        </div>


        <div className="bg-white rounded-2xl border border-gray-200/70 shadow-xs overflow-hidden">
          <div ref={tableScrollRef} className="overflow-x-auto custom-scrollbar">
            {activeTab === 'SUMMARY' ? (
              /* --- TAB 1: SUMMARY (Sticky 4 Columns + 3-State Sorting) --- */
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b-2 border-[#0B3C5D]/10 text-[10.5px] font-bold uppercase tracking-wider text-[#0B3C5D]/70 select-none">
                    {renderSortHeader('emp_no', 'รหัสพนักงาน', 'min-w-[105px] w-28 whitespace-nowrap', 'center', 'bg-[#F0F4F8]', 'sticky left-0 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]')}
                    {renderSortHeader('name', 'ชื่อ-นามสกุล (ไทย)', 'min-w-[190px] whitespace-nowrap', 'left', 'bg-[#F0F4F8]', 'sticky left-[105px] z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]')}
                    {renderSortHeader('emp_initial', 'ชื่อเล่น', 'min-w-[80px] w-20 whitespace-nowrap', 'center', 'bg-[#F0F4F8]', 'sticky left-[295px] z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]')}
                    {renderSortHeader('position', 'ตำแหน่ง', 'min-w-[150px] whitespace-nowrap', 'left', 'bg-[#F0F4F8]', 'sticky left-[375px] z-20 shadow-[4px_0_8px_-3px_rgba(0,0,0,0.1)]')}
                    {renderSortHeader('email', 'Email', 'min-w-[150px] whitespace-nowrap', 'left')}
                    {renderSortHeader('division_name', 'Division Name', 'min-w-[120px] whitespace-nowrap', 'left')}
                    {renderSortHeader('department_name', 'Department Name', 'min-w-[130px] whitespace-nowrap', 'left')}
                    {renderSortHeader('section', 'Section Name', 'min-w-[130px] whitespace-nowrap', 'left')}
                    {renderSortHeader('bb_sub', 'BB Sub', 'min-w-[80px] whitespace-nowrap', 'center')}
                    {renderSortHeader('access_code', 'ACCESS CODE', 'w-24 whitespace-nowrap', 'center')}
                    {renderSortHeader('status', 'สถานะ', 'w-20 whitespace-nowrap', 'center')}
                    {renderSortHeader('q1', 'Q1', 'w-10', 'center', 'bg-blue-50/60', 'text-blue-800')}
                    {renderSortHeader('q2', 'Q2', 'w-10', 'center', 'bg-blue-50/60', 'text-blue-800')}
                    {renderSortHeader('q3', 'Q3', 'w-10', 'center', 'bg-blue-50/60', 'text-blue-800')}
                    {renderSortHeader('q4', 'Q4', 'w-10', 'center', 'bg-blue-50/60', 'text-blue-800')}
                    {renderSortHeader('q5', 'Q5', 'w-10', 'center', 'bg-blue-50/60', 'text-blue-800')}
                    {renderSortHeader('q6', 'Q6', 'w-12', 'center', 'bg-indigo-50/50', 'text-indigo-800')}
                    {renderSortHeader('q7', 'Q7', 'w-12', 'center', 'bg-indigo-50/50', 'text-indigo-800')}
                    {renderSortHeader('q8', 'Q8', 'w-12', 'center', 'bg-indigo-50/50', 'text-indigo-800')}
                    {renderSortHeader('q9', 'Q9 (ปลายเปิด)', 'w-24', 'center', 'bg-purple-50/50', 'text-purple-800')}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {loading ? (
                    <tr>
                      <td colSpan={20} className="py-16 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                          <span>กำลังโหลดข้อมูล...</span>
                        </div>
                      </td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan={20} className="py-16 text-center text-slate-400">
                        ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา
                      </td>
                    </tr>
                  ) : (
                    data.map((emp, rowIdx) => {
                      const fullName =
                        (emp.emp_title_th ? emp.emp_title_th + ' ' : '') + (emp.emp_name_th || '-');
                      const hasResponded = !!emp.submitted_at;
                      const rowBg = rowIdx % 2 === 0 ? 'bg-white' : 'bg-[#FAFBFC]';

                      return (
                        <tr
                          key={emp.id}
                          className={`transition-colors hover:bg-blue-50/30 ${rowBg}`}
                        >
                          <td className={`py-2.5 px-2.5 font-mono font-bold text-slate-900 text-center text-xs sticky left-0 z-10 ${rowBg} shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] whitespace-nowrap`}>
                            {emp.emp_no}
                          </td>
                          <td className={`py-2.5 px-3 font-medium text-slate-900 whitespace-nowrap text-xs sticky left-[105px] z-10 ${rowBg} shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]`}>
                            {fullName}
                          </td>
                          <td className={`py-2.5 px-1 text-center text-slate-600 font-medium sticky left-[295px] z-10 ${rowBg} shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] whitespace-nowrap`}>
                            {emp.emp_initial ? (
                              <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                                {emp.emp_initial}
                              </span>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td className={`py-2.5 px-2.5 text-slate-600 text-xs sticky left-[375px] z-10 ${rowBg} shadow-[4px_0_8px_-3px_rgba(0,0,0,0.1)]`} title={emp.position_title_en || ''}>
                             {emp.position_title_en || '-'}
                          </td>

                           <td className="py-2.5 px-2 text-slate-600 text-xs" title={emp.email || ''}>
                             {emp.email || '-'}
                           </td>
                          <td className="py-2.5 px-2 text-slate-600 truncate max-w-[130px] text-xs" title={emp.division_name || ''}>
                            {emp.division_name || '-'}
                          </td>
                          <td className="py-2.5 px-2 text-slate-600 truncate max-w-[130px] text-xs" title={emp.department_name || ''}>
                            {emp.department_name || '-'}
                          </td>
                          <td className="py-2.5 px-2 text-slate-600 truncate max-w-[130px] text-xs" title={emp.section_name || ''}>
                            {emp.section_name || '-'}
                          </td>
                          <td className="py-2.5 px-1.5 text-center text-slate-600 font-medium whitespace-nowrap text-xs">
                            {emp.bb_sub ? (
                              <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                                {emp.bb_sub}
                              </span>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td className="py-2.5 px-1.5 text-center whitespace-nowrap">
                            <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                              {emp.access_code || '-'}
                            </span>
                          </td>
                          <td className="py-2.5 px-1.5 text-center whitespace-nowrap">
                            {hasResponded ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-emerald-100 text-emerald-800">
                                ตอบแล้ว
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-medium bg-slate-100 text-slate-500">
                                ยังไม่ตอบ
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-1 text-center bg-blue-50/20">{renderRating(emp.q1)}</td>
                          <td className="py-2.5 px-1 text-center bg-blue-50/20">{renderRating(emp.q2)}</td>
                          <td className="py-2.5 px-1 text-center bg-blue-50/20">{renderRating(emp.q3)}</td>
                          <td className="py-2.5 px-1 text-center bg-blue-50/20">{renderRating(emp.q4)}</td>
                          <td className="py-2.5 px-1 text-center bg-blue-50/20">{renderRating(emp.q5)}</td>
                          <td className="py-2.5 px-1 text-center bg-indigo-50/20">{renderYesNo(emp.q6)}</td>
                          <td className="py-2.5 px-1 text-center bg-indigo-50/20">{renderYesNo(emp.q7)}</td>
                          <td className="py-2.5 px-1 text-center bg-indigo-50/20">{renderYesNo(emp.q8)}</td>
                          <td className="py-2.5 px-1.5 text-center bg-purple-50/20">
                            {emp.q9 && emp.q9.trim() !== '' ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10.5px] font-bold bg-purple-100 text-purple-800 border border-purple-200 shadow-2xs">
                                ตอบแล้ว
                              </span>
                            ) : (
                              <span className="text-slate-300 font-mono text-xs">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            ) : (
              /* --- TAB 2: RESPONSES (Sticky 4 Columns + Full Multiline Question Headers) --- */
              <table className="w-full text-left border-collapse min-w-[2350px]">
                <thead>
                  <tr className="border-b-2 border-[#0B3C5D]/10 text-[10.5px] font-bold tracking-tight text-[#0B3C5D]/80 select-none">
                    {renderSortHeader('emp_no', 'รหัสพนักงาน', 'min-w-[105px] w-28 whitespace-nowrap', 'center', 'bg-[#F0F4F8]', 'sticky left-0 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]')}
                    {renderSortHeader('name', 'ชื่อ-นามสกุล (ไทย)', 'min-w-[190px] whitespace-nowrap', 'left', 'bg-[#F0F4F8]', 'sticky left-[105px] z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]')}
                    {renderSortHeader('emp_initial', 'ชื่อเล่น', 'min-w-[80px] w-20 whitespace-nowrap', 'center', 'bg-[#F0F4F8]', 'sticky left-[295px] z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]')}
                    {renderSortHeader('position', 'ตำแหน่ง', 'min-w-[150px] whitespace-nowrap', 'left', 'bg-[#F0F4F8]', 'sticky left-[375px] z-20 shadow-[4px_0_8px_-3px_rgba(0,0,0,0.1)]')}
                    {renderSortHeader('submitted_at', 'วันที่-เวลาที่ตอบ', 'min-w-[140px] whitespace-nowrap', 'left', 'bg-[#F0F4F8]')}
                    {renderSortHeader('email', 'Email', 'min-w-[150px] whitespace-nowrap', 'left')}
                    {renderSortHeader('division_name', 'Division Name', 'min-w-[120px] whitespace-nowrap', 'left')}
                    {renderSortHeader('department_name', 'Department Name', 'min-w-[130px] whitespace-nowrap', 'left')}
                    {renderSortHeader('section', 'Section Name', 'min-w-[130px] whitespace-nowrap', 'left')}
                    {renderSortHeader('bb_sub', 'BB Sub', 'min-w-[80px] whitespace-nowrap', 'center')}
                    {renderSortHeader('access_code', 'ACCESS CODE', 'w-24 whitespace-nowrap', 'center')}
                    {renderSortHeader('q1', 'Q1: เมื่อเกิดปัญหาในการทำงาน พนักงานสามารถให้ข้อมูลข้อเท็จจริงได้อย่างเปิดเผย', 'min-w-[210px] w-56', 'left', 'bg-blue-50/70', 'text-blue-950 font-bold')}
                    {renderSortHeader('q2', 'Q2: หน่วยงานต่างๆ ให้ความร่วมมือในการให้ข้อมูลครบถ้วนและถูกต้อง เมื่อมีการตรวจสอบหรือสอบถามข้อเท็จจริง', 'min-w-[220px] w-60', 'left', 'bg-blue-50/70', 'text-blue-950 font-bold')}
                    {renderSortHeader('q3', 'Q3: เมื่อเกิดข้อผิดพลาด หัวหน้างานมุ่งเน้นการแก้ปัญหา มากกว่าการหาคนผิด', 'min-w-[210px] w-56', 'left', 'bg-blue-50/70', 'text-blue-950 font-bold')}
                    {renderSortHeader('q4', 'Q4: ข้อผิดพลาดที่เกิดขึ้นได้รับการแก้ไขที่สาเหตุที่แท้จริง', 'min-w-[200px] w-52', 'left', 'bg-blue-50/70', 'text-blue-950 font-bold')}
                    {renderSortHeader('q5', 'Q5: หากฉันพบความเสี่ยงหรือการปฏิบัติที่ไม่ถูกต้อง ฉันกล้าที่จะรายงาน', 'min-w-[210px] w-56', 'left', 'bg-blue-50/70', 'text-blue-950 font-bold')}
                    {renderSortHeader('q6', 'Q6: ฉันมั่นใจว่าการให้ข้อมูลตามข้อเท็จจริงจะไม่ส่งผลกระทบในทางลบต่อตัวฉัน', 'min-w-[210px] w-56', 'left', 'bg-indigo-50/60', 'text-indigo-950 font-bold')}
                    {renderSortHeader('q7', 'Q7: หัวหน้างานของฉันสนับสนุนให้พนักงานรายงานปัญหาตามความเป็นจริง', 'min-w-[210px] w-56', 'left', 'bg-indigo-50/60', 'text-indigo-950 font-bold')}
                    {renderSortHeader('q8', 'Q8: ฉันมีความเชื่อมั่นในตัวหัวหน้างานโดยตรง', 'min-w-[190px] w-48', 'left', 'bg-indigo-50/60', 'text-indigo-950 font-bold')}
                    {renderSortHeader('q9', 'Q9: ข้อเสนอแนะ (ท่านคิดว่า องค์กรควรปรับปรุงเรื่องใดมากที่สุด เพื่อสร้างวัฒนธรรมการทำงานที่โปร่งใสและเปิดเผยข้อมูล)', 'min-w-[320px] w-80', 'left', 'bg-purple-50/60', 'text-purple-950 font-bold')}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-xs">
                  {loading ? (
                    <tr>
                      <td colSpan={20} className="py-16 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                          <span>กำลังโหลดข้อมูล...</span>
                        </div>
                      </td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan={20} className="py-16 text-center text-slate-400">
                        ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา
                      </td>
                    </tr>
                  ) : (
                    data.map((emp, rowIdx) => {
                      const fullName =
                        (emp.emp_title_th ? emp.emp_title_th + ' ' : '') + (emp.emp_name_th || '-');
                      const rowBg = rowIdx % 2 === 0 ? 'bg-white' : 'bg-[#FAFBFC]';

                      return (
                        <tr
                          key={emp.id}
                          className={`transition-colors hover:bg-blue-50/30 ${rowBg}`}
                        >
                          {/* 1. Sticky emp_no */}
                          <td className={`py-3 px-3 font-mono font-bold text-slate-900 text-center sticky left-0 z-10 ${rowBg} shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] whitespace-nowrap`}>
                            {emp.emp_no}
                          </td>
                          <td className={`py-3 px-4 font-medium text-slate-900 whitespace-nowrap sticky left-[105px] z-10 ${rowBg} shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]`}>
                            {fullName}
                          </td>

                          {/* 3. Sticky Initial / Nickname */}
                          <td className={`py-3 px-2 text-center text-slate-600 font-medium whitespace-nowrap sticky left-[295px] z-10 ${rowBg} shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]`}>
                            {emp.emp_initial ? (
                              <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
                                {emp.emp_initial}
                              </span>
                            ) : (
                              '-'
                            )}
                          </td>

                          {/* 4. Sticky Position */}
                          <td className={`py-3 px-3 text-slate-600 sticky left-[375px] z-10 ${rowBg} shadow-[4px_0_8px_-3px_rgba(0,0,0,0.1)]`} title={emp.position_title_en || ''}>
                            {emp.position_title_en || '-'}
                          </td>

                          {/* Date-Time Column */}
                          <td className="py-3 px-4 font-mono text-[11px] text-[#0B3C5D] font-bold whitespace-nowrap">
                            {formatDateTime(emp.submitted_at)}
                          </td>

                          {/* Email Column */}
                          <td className="py-3 px-3 text-slate-600" title={emp.email || ''}>
                            {emp.email || '-'}
                          </td>

                          {/* 4 Org Structure Columns */}
                          <td className="py-3 px-3 text-slate-600 truncate max-w-[130px]" title={emp.division_name || ''}>
                            {emp.division_name || '-'}
                          </td>
                          <td className="py-3 px-3 text-slate-600 truncate max-w-[130px]" title={emp.department_name || ''}>
                            {emp.department_name || '-'}
                          </td>
                          <td className="py-3 px-3 text-slate-600 truncate max-w-[130px]" title={emp.section_name || ''}>
                            {emp.section_name || '-'}
                          </td>
                          <td className="py-3 px-2 text-center text-slate-600 font-medium whitespace-nowrap text-xs">
                            {emp.bb_sub ? (
                              <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
                                {emp.bb_sub}
                              </span>
                            ) : (
                              '-'
                            )}
                          </td>

                          {/* Access Code */}
                          <td className="py-3 px-3 text-center">
                            <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                              {emp.access_code || '-'}
                            </span>
                          </td>

                          {/* Q1-Q5 Rating */}
                          <td className="py-3 px-3 text-center bg-blue-50/20">{renderRating(emp.q1)}</td>
                          <td className="py-3 px-3 text-center bg-blue-50/20">{renderRating(emp.q2)}</td>
                          <td className="py-3 px-3 text-center bg-blue-50/20">{renderRating(emp.q3)}</td>
                          <td className="py-3 px-3 text-center bg-blue-50/20">{renderRating(emp.q4)}</td>
                          <td className="py-3 px-3 text-center bg-blue-50/20">{renderRating(emp.q5)}</td>

                          {/* Q6-Q8 Yes/No */}
                          <td className="py-3 px-3 text-center bg-indigo-50/20">{renderYesNo(emp.q6)}</td>
                          <td className="py-3 px-3 text-center bg-indigo-50/20">{renderYesNo(emp.q7)}</td>
                          <td className="py-3 px-3 text-center bg-indigo-50/20">{renderYesNo(emp.q8)}</td>

                          {/* Q9 Open Ended Answer Full Text */}
                          <td className="py-3 px-4 bg-purple-50/20 text-slate-700 leading-relaxed min-w-[280px] max-w-[380px]">
                            {emp.q9 ? (
                              <p className="whitespace-pre-wrap break-words text-xs text-slate-800 bg-white/70 p-2 rounded-lg border border-purple-100 shadow-2xs">
                                {emp.q9}
                              </p>
                            ) : (
                              <span className="text-slate-300 font-mono text-xs text-center block">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}
          </div>


          {/* Pagination Footer */}
          <div className="bg-slate-50/80 px-4 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center space-x-3">
              <span>
                แสดงผล <span className="font-semibold text-slate-800">{data.length}</span> จากทั้งหมด{' '}
                <span className="font-semibold text-slate-800">{totalRecords}</span> รายการ
              </span>
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="py-1 px-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 cursor-pointer"
              >
                <option value={350}>ทั้งหมด (350)</option>
                <option value={20}>20 / หน้า</option>
                <option value={50}>50 / หน้า</option>
                <option value={100}>100 / หน้า</option>
              </select>

            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1 || loading}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-3 py-1 font-medium text-slate-700 bg-white rounded-lg border border-slate-200">
                หน้า {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages || loading}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
