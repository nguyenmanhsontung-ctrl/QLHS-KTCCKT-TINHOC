/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { User, UserRole, Lesson, Question, Test, Answer } from './types';
import { LogOut, BookOpen, Users, FileText, Settings, Plus, Trash2, CheckCircle, Clock, Shield, ChevronRight, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [allData, setAllData] = useState<{
    users: User[];
    lessons: Lesson[];
    questions: Question[];
    tests: Test[];
    answers: Answer[];
  }>({ users: [], lessons: [], questions: [], tests: [], answers: [] });
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedGrade, setSelectedGrade] = useState('10');

  // Login state
  const [cccd, setCccd] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/data');
      const data = await res.json();
      setAllData(data);
    } catch (e) {
      console.error("Failed to fetch data", e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cccd, password })
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      } else {
        setLoginError('Sai CCCD hoặc mật khẩu');
      }
    } catch (e) {
      setLoginError('Lỗi kết nối server');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('dashboard');
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-indigo-100"
        >
          <div className="text-center mb-8">
            <div className="bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
              <Shield className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Đăng Nhập</h1>
            <p className="text-slate-500 mt-2">Hệ thống quản lý trắc nghiệm AI</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">CCCD / Tên đăng nhập</label>
              <input 
                type="text" 
                value={cccd}
                onChange={(e) => setCccd(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="Nhập CCCD"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Mật khẩu</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {loginError && (
              <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg text-center">{loginError}</p>
            )}

            <button 
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
            >
              Vào hệ thống
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-400 text-xs">Admin: Tungtitchoaity / Nhien110517@</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <BrainCircuit className="text-white w-6 h-6" />
            </div>
            <span className="font-bold text-slate-900 truncate">QuizMaster AI</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <SidebarItem 
            icon={<FileText size={20} />} 
            label="Tổng quan" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          {user.role === UserRole.ADMIN && (
            <>
              <SidebarItem 
                icon={<Users size={20} />} 
                label="Học sinh" 
                active={activeTab === 'students'} 
                onClick={() => setActiveTab('students')} 
              />
              <SidebarItem 
                icon={<BookOpen size={20} />} 
                label="Bài học" 
                active={activeTab === 'lessons'} 
                onClick={() => setActiveTab('lessons')} 
              />
              <SidebarItem 
                icon={<Plus size={20} />} 
                label="Câu hỏi" 
                active={activeTab === 'questions'} 
                onClick={() => setActiveTab('questions')} 
              />
            </>
          )}
          <SidebarItem 
            icon={<Settings size={20} />} 
            label="Cài đặt" 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
          />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 mb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              {user.fullName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{user.fullName}</p>
              <p className="text-xs text-slate-500 capitalize">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {activeTab === 'dashboard' && 'Bảng điều khiển'}
              {activeTab === 'students' && 'Quản lý học sinh'}
              {activeTab === 'lessons' && 'Quản lý bài học'}
              {activeTab === 'questions' && 'Ngân hàng câu hỏi'}
              {activeTab === 'settings' && 'Cài đặt hệ thống'}
            </h2>
            <p className="text-slate-500">Chào mừng trở lại hệ thống</p>
          </div>
          
          {user.role === UserRole.ADMIN && (
            <div className="flex gap-2">
              {['10', '11', '12'].map(grade => (
                <button
                  key={grade}
                  onClick={() => setSelectedGrade(grade)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedGrade === grade 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Khối {grade}
                </button>
              ))}
            </div>
          )}
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                  title="Học sinh" 
                  value={allData.users.filter(u => u.role === UserRole.STUDENT).length} 
                  icon={<Users className="text-blue-600" />} 
                  color="blue"
                />
                <StatCard 
                  title="Câu hỏi" 
                  value={allData.questions.length} 
                  icon={<BookOpen className="text-purple-600" />} 
                  color="purple"
                />
                <StatCard 
                  title="Bài kiểm tra" 
                  value={allData.tests.length} 
                  icon={<FileText className="text-emerald-600" />} 
                  color="emerald"
                />
                
                <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Bài kiểm tra gần đây</h3>
                  <div className="space-y-4">
                    {allData.tests.slice(0, 5).map(test => (
                      <div key={test.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-indigo-200 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="bg-indigo-50 p-3 rounded-lg text-indigo-600">
                            <FileText size={20} />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{test.title}</p>
                            <p className="text-xs text-slate-500">{test.subject} • {test.duration} phút</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                            Khối {test.grade}
                          </span>
                          <ChevronRight size={16} className="text-slate-300" />
                        </div>
                      </div>
                    ))}
                    {allData.tests.length === 0 && (
                      <p className="text-center py-8 text-slate-400 italic">Chưa có bài kiểm tra nào</p>
                    )}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Hoạt động mới</h3>
                  <div className="space-y-6">
                    {allData.answers.slice(0, 5).map(ans => {
                      const student = allData.users.find(u => u.id === ans.studentId);
                      const test = allData.tests.find(t => t.id === ans.testId);
                      return (
                        <div key={ans.id} className="flex gap-3">
                          <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0"></div>
                          <div>
                            <p className="text-sm text-slate-900">
                              <span className="font-bold">{student?.fullName}</span> đã nộp bài <span className="font-bold">{test?.title}</span>
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              Điểm: {ans.score}/{ans.maxScore} • {new Date(ans.submittedAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    {allData.answers.length === 0 && (
                      <p className="text-center py-8 text-slate-400 italic">Chưa có hoạt động nào</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'students' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <div className="relative w-64">
                    <input 
                      type="text" 
                      placeholder="Tìm kiếm học sinh..." 
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <Users className="absolute left-3 top-2.5 text-slate-400" size={16} />
                  </div>
                  <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all">
                    <Plus size={16} />
                    Thêm học sinh
                  </button>
                </div>
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Họ và tên</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">CCCD</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Lớp</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Ngày tạo</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {allData.users
                      .filter(u => u.role === UserRole.STUDENT && u.grade === selectedGrade)
                      .map(student => (
                        <tr key={student.id} className="hover:bg-slate-50 transition-all">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-xs font-bold">
                                {student.fullName.charAt(0)}
                              </div>
                              <span className="font-medium text-slate-900">{student.fullName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">{student.cccd}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold">
                              {student.className}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500">
                            {new Date(student.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-slate-400 hover:text-red-600 transition-all">
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {allData.users.filter(u => u.role === UserRole.STUDENT && u.grade === selectedGrade).length === 0 && (
                  <div className="py-20 text-center">
                    <Users size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-400">Chưa có học sinh nào ở khối {selectedGrade}</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
        active 
        ? 'bg-indigo-50 text-indigo-600 font-bold' 
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  );
}

function StatCard({ title, value, icon, color }: { title: string, value: number, icon: React.ReactNode, color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50',
    purple: 'bg-purple-50',
    emerald: 'bg-emerald-50'
  };
  
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className={`${colors[color]} p-3 rounded-xl`}>
          {icon}
        </div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-slate-900">{value}</span>
        <span className="text-slate-400 text-sm">tổng số</span>
      </div>
    </div>
  );
}
