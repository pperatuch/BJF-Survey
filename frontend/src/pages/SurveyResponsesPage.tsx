import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import api from '../lib/api';
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
} from 'lucide-react';

interface EmployeeResponse {
  id: number;
  emp_no: string;
  emp_title_th: string | null;
  emp_name_th: string | null;
  emp_initial: string | null;
  position_title_en: string | null;
  section_name: string | null;
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
  }, [debouncedSearch, selectedSection, selectedStatus, startDate, endDate, currentPage, perPage, activeTab]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchSummary();
    fetchData();
  };

  const handleExport = async () => {
    try {
      const res = await api.get('/survey/responses/export', {
        params: {
          section: selectedSection !== 'all' ? selectedSection : undefined,
          status: activeTab === 'RESPONSES' ? 'responded' : (selectedStatus !== 'all' ? selectedStatus : undefined),
          start_date: activeTab === 'RESPONSES' && startDate ? startDate : undefined,
          end_date: activeTab === 'RESPONSES' && endDate ? endDate : undefined,
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `BJF_Survey_Responses_${new Date().toISOString().slice(0,10)}.xls`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export responses:', err);
      alert('ไม่สามารถดาวน์โหลดไฟล์ได้ กรุณาลองใหม่อีกครั้ง');
    }
  };

  const handleExportAccessCodes = async () => {
    try {
      const res = await api.get('/survey/access-codes/export', {
        params: {
          section: selectedSection !== 'all' ? selectedSection : undefined,
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `BJF_Survey_AccessCodes_${new Date().toISOString().slice(0,10)}.xls`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export access codes:', err);
      alert('ไม่สามารถดาวน์โหลดไฟล์ได้ กรุณาลองใหม่อีกครั้ง');
    }
  };



  // Helper render rating score badge
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
      <span
        title={config.label}
        className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold border ${config.bg} shadow-xs transition-transform hover:scale-110`}
      >
        {score}
      </span>
    );
  };

  // Helper render Yes/No badge
  const renderYesNo = (val: string | null) => {
    if (!val) {
      return <span className="text-slate-300 font-mono text-xs">-</span>;
    }

    const isYes = val.toLowerCase() === 'yes' || val === 'ใช่';
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${
          isYes
            ? 'bg-blue-50 text-blue-700 border border-blue-200'
            : 'bg-slate-100 text-slate-600 border border-slate-200'
        }`}
      >
        {isYes ? 'Yes' : 'No'}
      </span>
    );
  };

  // Format date helper
  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleString('th-TH', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] text-slate-800 flex flex-col font-sans">
      {/* Top Navigation Bar - BJC Theme */}
      <header className="bg-[#0B3C5D] text-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 px-3 py-1.5 rounded-lg flex items-center space-x-2 backdrop-blur-xs border border-white/15">
              <span className="font-extrabold tracking-wider text-emerald-400 text-sm">BJC</span>
              <span className="text-white/40">|</span>
              <span className="font-semibold text-xs tracking-wide uppercase">SURVEY</span>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm">
              <span className="bg-white/15 text-white px-3 py-1 rounded-full text-xs font-medium">
                Admin Panel
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-medium text-white">{user?.name || 'Administrator'}</div>
              <div className="text-[11px] text-emerald-300/80">
                {user?.position || user?.role || 'Admin'} • BJF
              </div>
            </div>
            <button
              onClick={() => logout()}
              title="ออกจากระบบ"
              className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Page Header Card */}
        <div className="bg-white rounded-2xl shadow-xs border border-gray-200/70 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="inline-flex items-center justify-center p-2 rounded-xl bg-blue-50 text-blue-700">
                <Building2 className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold text-[#0B3C5D]">
                แบบสะท้อนความคิดเห็น (BJF Survey)
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              ผลการตอบแบบสำรวจความโปร่งใสและวัฒนธรรมองค์กรของพนักงาน BJF ทั้งหมด
            </p>
          </div>

          {/* Metric Badges */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/60 border border-blue-100 rounded-2xl px-5 py-3 flex items-center space-x-3 text-[#0B3C5D] shadow-xs">
              <div className="p-2.5 bg-[#0B3C5D] rounded-xl text-white shadow-xs">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold tracking-widest uppercase opacity-70">
                  Total Responses
                </div>
                <div className="text-xl font-black text-slate-900 leading-none mt-0.5">
                  {summary ? summary.responded : '-'}
                  <span className="text-xs text-slate-400 font-normal ml-1.5">
                    / {summary?.total || '-'} คน
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Selection: SUMMARY vs RESPONSES */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => {
              setActiveTab('SUMMARY');
              setSelectedStatus('all');
              setCurrentPage(1);
            }}
            className={`px-5 py-2.5 text-xs font-bold tracking-wider transition-all rounded-t-xl border border-b-0 cursor-pointer ${
              activeTab === 'SUMMARY'
                ? 'bg-white text-[#0B3C5D] border-gray-200 shadow-xs'
                : 'bg-transparent text-gray-400 border-transparent hover:text-gray-600'
            }`}
          >
            SUMMARY (ภาพรวมพนักงานทั้งหมด)
          </button>
          <button
            onClick={() => {
              setActiveTab('RESPONSES');
              setSelectedStatus('all');
              setCurrentPage(1);
            }}
            className={`px-5 py-2.5 text-xs font-bold tracking-wider transition-all rounded-t-xl border border-b-0 cursor-pointer ${
              activeTab === 'RESPONSES'
                ? 'bg-white text-[#0B3C5D] border-gray-200 shadow-xs'
                : 'bg-transparent text-gray-400 border-transparent hover:text-gray-600'
            }`}
          >
            RESPONSES (ดูรายคนและเวลาที่ตอบ)
          </button>
        </div>

        {/* Summary Statistics Cards */}
        {summary && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 border border-gray-200/70 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-500">พนักงานทั้งหมด</div>
                <div className="text-2xl font-black text-slate-800 mt-0.5">{summary.total}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-200/70 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-500">ตอบแบบสอบถามแล้ว</div>
                <div className="text-2xl font-black text-emerald-600 mt-0.5">{summary.responded}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-200/70 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-500">ยังไม่ตอบ</div>
                <div className="text-2xl font-black text-amber-600 mt-0.5">{summary.pending}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-200/70 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-500">อัตราการตอบ (% Turnout)</div>
                <div className="text-2xl font-black text-blue-600 mt-0.5">{summary.response_rate}%</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
          </div>
        )}

        {/* Filter and Action Bar */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200/70 shadow-xs space-y-3 lg:space-y-0 lg:flex lg:items-center lg:justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[220px] max-w-sm">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหารหัส, ชื่อ-นามสกุล, ชื่อเล่น, ตำแหน่ง..."
                className="w-full pl-9 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Section Filter */}
            <select
              value={selectedSection}
              onChange={(e) => {
                setSelectedSection(e.target.value);
                setCurrentPage(1);
              }}
              className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="all">ทุกแผนก (All Sections)</option>
              {summary?.sections.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>

            {/* Status Filter (Active only in SUMMARY tab) */}
            {activeTab === 'SUMMARY' && (
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
              >
                <option value="all">สถานะทั้งหมด</option>
                <option value="responded">✅ ตอบแล้ว</option>
                <option value="pending">⏳ ยังไม่ตอบ</option>
              </select>
            )}

            {/* Date Range Filter (Active only in RESPONSES tab) */}
            {activeTab === 'RESPONSES' && (
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1 text-xs">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400 text-[11px] font-medium">วันที่:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
                />
                <span className="text-slate-400 text-xs">ถึง</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
                />
                {(startDate || endDate) && (
                  <button
                    onClick={() => {
                      setStartDate('');
                      setEndDate('');
                    }}
                    className="text-slate-400 hover:text-rose-500 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              title="รีเฟรชข้อมูล"
              className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-blue-600' : ''}`} />
            </button>
          </div>

          {/* Export Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportAccessCodes}
              title="ดาวน์โหลดรายชื่อพนักงานพร้อม Access Code (รหัสพนักงาน, ชื่อ-นามสกุลไทย, ชื่อเล่น, Access Code)"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export Access Codes (แจกพนักงาน)</span>
            </button>

            <button
              onClick={handleExport}
              title="ดาวน์โหลดผลการตอบแบบสอบถามทั้งหมด"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export ผลสำรวจ</span>
            </button>
          </div>
        </div>


        {/* Responses Table Container */}
        <div className="bg-white rounded-2xl border border-gray-200/70 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            {activeTab === 'SUMMARY' ? (
              /* --- TAB 1: SUMMARY (แบบเดิม) --- */
              <table className="w-full text-left border-collapse min-w-[1100px]">
                <thead>
                  <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 select-none">
                    <th className="py-3.5 px-4 w-28 text-center">รหัสพนักงาน</th>
                    <th className="py-3.5 px-4 min-w-[180px]">ชื่อ-นามสกุล (ไทย)</th>
                    <th className="py-3.5 px-2 w-20 text-center">ชื่อเล่น</th>
                    <th className="py-3.5 px-4 min-w-[150px]">ตำแหน่ง</th>
                    <th className="py-3.5 px-3 min-w-[120px]">แผนก</th>
                    <th className="py-3.5 px-3 w-24 text-center">Access Code</th>
                    <th className="py-3.5 px-3 w-24 text-center">สถานะ</th>
                    <th className="py-3.5 px-2 w-12 text-center text-blue-700 bg-blue-50/50">Q1</th>
                    <th className="py-3.5 px-2 w-12 text-center text-blue-700 bg-blue-50/50">Q2</th>
                    <th className="py-3.5 px-2 w-12 text-center text-blue-700 bg-blue-50/50">Q3</th>
                    <th className="py-3.5 px-2 w-12 text-center text-blue-700 bg-blue-50/50">Q4</th>
                    <th className="py-3.5 px-2 w-12 text-center text-blue-700 bg-blue-50/50">Q5</th>
                    <th className="py-3.5 px-2 w-14 text-center text-indigo-700 bg-indigo-50/40">Q6</th>
                    <th className="py-3.5 px-2 w-14 text-center text-indigo-700 bg-indigo-50/40">Q7</th>
                    <th className="py-3.5 px-2 w-14 text-center text-indigo-700 bg-indigo-50/40">Q8</th>
                    <th className="py-3.5 px-3 w-28 text-center text-purple-700 bg-purple-50/40">Q9 (ปลายเปิด)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {loading ? (
                    <tr>
                      <td colSpan={16} className="py-16 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                          <span>กำลังโหลดข้อมูล...</span>
                        </div>
                      </td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan={16} className="py-16 text-center text-slate-400">
                        ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา
                      </td>
                    </tr>
                  ) : (
                    data.map((emp, rowIdx) => {
                      const fullName =
                        (emp.emp_title_th ? emp.emp_title_th + ' ' : '') + (emp.emp_name_th || '-');
                      const hasResponded = !!emp.submitted_at;

                      return (
                        <tr
                          key={emp.id}
                          className={`transition-colors hover:bg-blue-50/30 ${
                            rowIdx % 2 === 0 ? 'bg-white' : 'bg-[#FAFBFC]'
                          }`}
                        >
                          <td className="py-3 px-4 font-mono font-bold text-slate-900 text-center">
                            {emp.emp_no}
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-900">
                            {fullName}
                          </td>
                          <td className="py-3 px-2 text-center text-slate-600 font-medium">
                            {emp.emp_initial ? (
                              <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
                                {emp.emp_initial}
                              </span>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td className="py-3 px-4 text-slate-600 truncate max-w-[160px]" title={emp.position_title_en || ''}>
                            {emp.position_title_en || '-'}
                          </td>
                          <td className="py-3 px-3 text-slate-600 truncate max-w-[140px]" title={emp.section_name || ''}>
                            {emp.section_name || '-'}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                              {emp.access_code || '-'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            {hasResponded ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                                ตอบแล้ว
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-500">
                                ยังไม่ตอบ
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-2 text-center bg-blue-50/20">{renderRating(emp.q1)}</td>
                          <td className="py-3 px-2 text-center bg-blue-50/20">{renderRating(emp.q2)}</td>
                          <td className="py-3 px-2 text-center bg-blue-50/20">{renderRating(emp.q3)}</td>
                          <td className="py-3 px-2 text-center bg-blue-50/20">{renderRating(emp.q4)}</td>
                          <td className="py-3 px-2 text-center bg-blue-50/20">{renderRating(emp.q5)}</td>
                          <td className="py-3 px-2 text-center bg-indigo-50/20">{renderYesNo(emp.q6)}</td>
                          <td className="py-3 px-2 text-center bg-indigo-50/20">{renderYesNo(emp.q7)}</td>
                          <td className="py-3 px-2 text-center bg-indigo-50/20">{renderYesNo(emp.q8)}</td>
                          <td className="py-3 px-3 text-center bg-purple-50/20">
                            {emp.q9 && emp.q9.trim() !== '' ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200 shadow-2xs">
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
              /* --- TAB 2: RESPONSES (หัวข้อยาว + คำตอบ Q9 ตัวเต็ม) --- */
              <table className="w-full text-left border-collapse min-w-[1500px]">
                <thead>
                  <tr className="bg-[#F0F4F8] border-b-2 border-[#0B3C5D]/10 text-[10px] font-bold uppercase tracking-wider text-[#0B3C5D]/70 select-none">
                    <th className="py-3 px-4 min-w-[140px] text-[#0B3C5D] sticky left-0 z-20 bg-[#F0F4F8] shadow-[4px_0_10px_-4px_rgba(0,0,0,0.1)] whitespace-nowrap">
                      วันที่-เวลา
                    </th>
                    <th className="py-3 px-3 w-24 text-center whitespace-nowrap">รหัสพนักงาน</th>
                    <th className="py-3 px-4 min-w-[160px] whitespace-nowrap">ชื่อ-นามสกุล</th>
                    <th className="py-3 px-2 w-16 text-center whitespace-nowrap">ชื่อเล่น</th>
                    <th className="py-3 px-3 min-w-[140px] whitespace-nowrap">ตำแหน่ง</th>
                    <th className="py-3 px-3 min-w-[120px] whitespace-nowrap">แผนก</th>
                    <th className="py-3 px-3 w-24 text-center whitespace-nowrap">Access Code</th>
                    <th className="py-3 px-3 min-w-[200px] max-w-[240px] whitespace-normal leading-tight text-slate-700 bg-blue-50/50">
                      Q1: เมื่อเกิดปัญหาในการทำงาน พนักงานสามารถให้ข้อมูลข้อเท็จจริงได้อย่างเปิดเผย
                    </th>
                    <th className="py-3 px-3 min-w-[200px] max-w-[240px] whitespace-normal leading-tight text-slate-700 bg-blue-50/50">
                      Q2: หน่วยงานต่างๆ ให้ความร่วมมือในการให้ข้อมูลครบถ้วนและถูกต้อง เมื่อมีการตรวจสอบหรือสอบถามข้อเท็จจริง
                    </th>
                    <th className="py-3 px-3 min-w-[200px] max-w-[240px] whitespace-normal leading-tight text-slate-700 bg-blue-50/50">
                      Q3: เมื่อเกิดข้อผิดพลาด หัวหน้างานมุ่งเน้นการแก้ปัญหา มากกว่าการหาคนผิด
                    </th>
                    <th className="py-3 px-3 min-w-[200px] max-w-[240px] whitespace-normal leading-tight text-slate-700 bg-blue-50/50">
                      Q4: ข้อผิดพลาดที่เกิดขึ้นได้รับการแก้ไขที่สาเหตุที่แท้จริง
                    </th>
                    <th className="py-3 px-3 min-w-[200px] max-w-[240px] whitespace-normal leading-tight text-slate-700 bg-blue-50/50">
                      Q5: หากฉันพบความเสี่ยงหรือการปฏิบัติที่ไม่ถูกต้อง ฉันกล้าที่จะรายงาน
                    </th>
                    <th className="py-3 px-3 min-w-[170px] max-w-[200px] whitespace-normal leading-tight text-indigo-900 bg-indigo-50/40">
                      Q6: ฉันมั่นใจว่าการให้ข้อมูลตามข้อเท็จจริงจะไม่ส่งผลกระทบในทางลบต่อตัวฉัน
                    </th>
                    <th className="py-3 px-3 min-w-[170px] max-w-[200px] whitespace-normal leading-tight text-indigo-900 bg-indigo-50/40">
                      Q7: หัวหน้างานของฉันสนับสนุนให้พนักงานรายงานปัญหาตามความเป็นจริง
                    </th>
                    <th className="py-3 px-3 min-w-[170px] max-w-[200px] whitespace-normal leading-tight text-indigo-900 bg-indigo-50/40">
                      Q8: ฉันมีความเชื่อมั่นในตัวหัวหน้างานโดยตรง
                    </th>
                    <th className="py-3 px-4 min-w-[280px] max-w-[380px] whitespace-normal leading-tight text-purple-900 bg-purple-50/40">
                      Q9: ข้อเสนอแนะ (ท่านคิดว่า องค์กรควรปรับปรุงเรื่องใดมากที่สุดเพื่อสร้างวัฒนธรรมการทำงานที่โปร่งใสและเปิดเผยข้อมูล)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {loading ? (
                    <tr>
                      <td colSpan={16} className="py-16 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                          <span>กำลังโหลดข้อมูล...</span>
                        </div>
                      </td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan={16} className="py-16 text-center text-slate-400">
                        ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา
                      </td>
                    </tr>
                  ) : (
                    data.map((emp, rowIdx) => {
                      const fullName =
                        (emp.emp_title_th ? emp.emp_title_th + ' ' : '') + (emp.emp_name_th || '-');

                      return (
                        <tr
                          key={emp.id}
                          className={`transition-colors hover:bg-blue-50/30 ${
                            rowIdx % 2 === 0 ? 'bg-white' : 'bg-[#FAFBFC]'
                          }`}
                        >
                          {/* Date-Time Column (Sticky Left) */}
                          <td className="py-3 px-4 font-mono text-[11px] text-[#0B3C5D] font-bold whitespace-nowrap sticky left-0 z-10 bg-inherit shadow-[4px_0_10px_-4px_rgba(0,0,0,0.05)]">
                            {formatDateTime(emp.submitted_at)}
                          </td>

                          {/* Emp NO */}
                          <td className="py-3 px-3 font-mono font-bold text-slate-900 text-center">
                            {emp.emp_no}
                          </td>

                          {/* Name (TH) */}
                          <td className="py-3 px-4 font-medium text-slate-900 whitespace-nowrap">
                            {fullName}
                          </td>

                          {/* Initial / Nickname */}
                          <td className="py-3 px-2 text-center text-slate-600 font-medium whitespace-nowrap">
                            {emp.emp_initial ? (
                              <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
                                {emp.emp_initial}
                              </span>
                            ) : (
                              '-'
                            )}
                          </td>

                          {/* Position */}
                          <td className="py-3 px-3 text-slate-600 truncate max-w-[150px]" title={emp.position_title_en || ''}>
                            {emp.position_title_en || '-'}
                          </td>

                          {/* Section */}
                          <td className="py-3 px-3 text-slate-600 truncate max-w-[130px]" title={emp.section_name || ''}>
                            {emp.section_name || '-'}
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
