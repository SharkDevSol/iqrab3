// Updated App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LoadingScreen from "./COMPONENTS/LoadingScreen";
import Home from "./PAGE/Home";
import CreateRegisterStaff from "./PAGE/CreateRegister/CreateRegisterStaff/CreateRegisterStaff";
import CreateRegisterStudent from "./PAGE/CreateRegister/CreateRegisterStudent/CreateRegisterStudent";
import StudentFormBuilder from "./PAGE/CreateRegister/CreateRegisterStudent/StudentFormBuilder";
import StaffFormBuilder from "./PAGE/CreateRegister/CreateRegisterStaff/StaffFormBuilder";
import ListStudent from "./PAGE/List/ListStudent/ListStudent";
import ListStaff from "./PAGE/List/ListStaff/ListStaff";
import EditStaff from "./PAGE/List/ListStaff/EditStaff";
import ListGuardian from "./PAGE/List/ListGuardian/ListGuardian";
import { EvaluationManager } from "./PAGE/Evaluation/Evaluation";  // Changed to named import
import EvaluationFormPage from "./PAGE/Evaluation/EvaluationFormPage";
import EvaluationFormDisplay from "./PAGE/Evaluation/EvaluationFormDisplay";
import EvaluationDetailsView from "./PAGE/Evaluation/EvaluationDetailsView";
import ErrorBoundary from "./COMPONENTS/ErrorBoundary";
import MarkListView from "./PAGE/MarkListView/MarkListView";
import StudentAttendanceSystem from "./PAGE/Academic/StudentAttendanceSystem";
import StudentAttendanceTimeSettings from "./PAGE/Academic/StudentAttendanceTimeSettings";
// Counsellor removed - not used
import Post from "./PAGE/Post/Post";
import MarkListSystem from "./PAGE/CreateMarklist/CreateMarklist/CreateMarklist";
import MarkListManagement from "./PAGE/CreateMarklist/MarkListManagement";
// SubjectMappingSetup removed - not used
import "./PAGE/CreateMarklist/CreateMarklist/MarkListFrontend.css";
import ReportCard from "./PAGE/CreateMarklist/ReportCard/ReportCard";
// Roaster removed - not used
import CreateAccounts from "./PAGE/CreateAccounts/CreateAccounts";
// PaymentList removed
// BranchCreate removed - not used
import Dashboard from "./PAGE/Dashboard/Dashboard";
import DashboardPage from "./PAGE/Dashboard/DashboardPage";
import StudentFaults from "./PAGE/StudentFaults/StudentFaultsS";
import ScheduleDashboard from "./PAGE/Schedule/ScheduleDashboard";
import ScheduleTimetable from "./PAGE/Schedule/ScheduleTimetable";
import ClassRequirementsForm from './PAGE/Schedule/ClassRequirementsForm';
import ClassShiftForm from './PAGE/Schedule/ClassShiftForm';
import Setting from "./PAGE/Setting/Setting";
import Students from "./Students/Students";
import Staff from "./Staff/Staff";
import PostStudents from "./Students/PostStudents/PostStudents";
import ClassStudents from "./Students/ClassStudents/ClassStudents";
import CommunicationStudents from "./Students/CommunicationStudents/CommunicationStudents";
import ProfileStudents from "./Students/ProfileStudents/ProfileStudents";
import POSTS from "./Staff/POSTS/POSTS";
import PF from "./Staff/PF/PF";
import MRLIST from "./Staff/MRLIST/MRLIST";
import EVA from "./Staff/EVA/EVA";
import PV from "./Staff/PV/PV";
import COMSTA from "./Staff/COMSTA/COMSTA";
import TeacherClassAttendance from "./Staff/ATTENDANCE/TeacherClassAttendance";
import ClassTeacherAssignment from "./PAGE/AttendanceView/ClassTeacherAssignment";
import LiveAttendanceMonitor from "./PAGE/LiveAttendanceMonitor";
import StaffLogin from "./COMPONENTS/StaffLogin";
import StaffProfile from "./COMPONENTS/StaffProfile";
import StudentProfile from "./COMPONENTS/StudentProfile";
import GuardianProfile from "./COMPONENTS/GuardianProfile";
import StudentLogin from "./COMPONENTS/StudentLogin";
import GuardianLogin from "./COMPONENTS/GuardianLogin";
import AdminChat from "./PAGE/Communication/AdminChat";
import GuardianChat from "./PAGE/Communication/GuardianChat";
import TeacherChat from "./PAGE/Communication/TeacherChat";
import AdminCommunications from "./PAGE/Communication/AdminCommunications";
import { EvaluationBookFormBuilder, TeacherAssignmentManager, TeacherClassList, DailyEvaluationForm, GuardianEvaluationInbox, GuardianFeedbackForm, EvaluationBookReports } from "./PAGE/EvaluationBook";
import { Provider } from 'react-redux';
import { store } from '../src/PAGE/store';
import InitialRedirect from "./COMPONENTS/InitialRedirect";  
import ProtectedRoute from "./COMPONENTS/ProtectedRoute";
import Login from "./PAGE/Login/Login";
import TaskPage from "./PAGE/TaskPage";  
import TaskDetail from "./PAGE/TaskDetail";  
import StaffForm from "./PAGE/CreateRegister/CreateRegisterStaff/StaffForm"; 
import AdminSubAccounts from "./PAGE/AdminSubAccounts/AdminSubAccounts";
import { useParams } from "react-router-dom";

// Guardian App Components
import Guardian from "./Guardian/Guardian";
import GuardianHome from "./Guardian/GuardianHome/GuardianHome";
import GuardianProfilePage from "./Guardian/GuardianProfilePage/GuardianProfilePage";
import GuardianWards from "./Guardian/GuardianWards/GuardianWards";
import GuardianAttendance from "./Guardian/GuardianAttendance/GuardianAttendance";
import GuardianMarks from "./Guardian/GuardianMarks/GuardianMarks";
import GuardianMessages from "./Guardian/GuardianMessages/GuardianMessages";

// Finance Module Components
import FinanceDashboard from "./PAGE/Finance/FinanceDashboard";
import ChartOfAccounts from "./PAGE/Finance/ChartOfAccounts/ChartOfAccounts";
import FeeManagement from "./PAGE/Finance/FeeManagement/FeeManagement";
import FeeTypeManagement from "./PAGE/Finance/FeeTypeManagement";
import InvoiceManagement from "./PAGE/Finance/InvoiceManagement";
import FeePaymentManagement from "./PAGE/Finance/FeePaymentManagement";
import ExpenseManagement from "./PAGE/Finance/ExpenseManagement";
import ExpenseApproval from "./PAGE/Finance/ExpenseApproval";
import BudgetManagement from "./PAGE/Finance/BudgetManagement";
import PayrollManagement from "./PAGE/Finance/PayrollManagement";
import FinanceReports from "./PAGE/Finance/FinanceReports";
import ComingSoon from "./PAGE/Finance/ComingSoon";
import MonthlyPayments from "./PAGE/Finance/MonthlyPaymentsNew";
import MonthlyPaymentSettings from "./PAGE/Finance/MonthlyPaymentSettings";

// Inventory & Asset modules - Coming Soon
// Using ComingSoon component for all inventory and asset pages

// HR & Staff Management Module Components
import HRDashboard from "./PAGE/HR/HRDashboard";
import SalaryManagement from "./PAGE/HR/SalaryManagement";
import AttendanceSystem from "./PAGE/HR/AttendanceSystem";
import AttendanceDeductionSettings from "./PAGE/HR/AttendanceDeductionSettings";
import AttendanceTimeSettings from "./PAGE/HR/AttendanceTimeSettingsCombined";
import DeviceStatus from "./PAGE/HR/DeviceStatus";
import LeaveManagement from "./PAGE/HR/LeaveManagement";
import PayrollSystem from "./PAGE/HR/PayrollSystem";
import PerformanceManagement from "./PAGE/HR/PerformanceManagement";
import HRReports from "./PAGE/HR/HRReports";

// Redirect components for legacy routes with params
const StudentProfileRedirect = () => {
  const { username } = useParams();
  return <Navigate to={`/app/student/${username}`} replace />;
};

const GuardianProfileRedirect = () => {
  const { username } = useParams();
  return <Navigate to={`/app/guardian/${username}`} replace />;
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Minimum loading time for smooth experience
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div>
      <Provider store={store}>
        <Routes>
          {/* Public Route - Login */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <InitialRedirect>
                <Home />
              </InitialRedirect>
            </ProtectedRoute>
          }>
              <Route index element={<DashboardPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="dashboard-old" element={<Dashboard />} />
              <Route path="create-register-student" element={<CreateRegisterStudent />} />
              <Route path="Student-Form-Builder" element={<StudentFormBuilder />} />
              <Route path="Staff-Form-Builder" element={<StaffFormBuilder />} />
              <Route path="create-register-staff" element={<CreateRegisterStaff />} />
              <Route path="list-student" element={<ListStudent />} />
              <Route path="list-staff" element={<ListStaff />} />
              <Route path="edit-staff/:staffType/:className/:uniqueId" element={<EditStaff />} />
              <Route path="list-guardian" element={<ListGuardian />} />
              <Route
                path="evaluation"
                element={
                  <ErrorBoundary>
                    <EvaluationManager />
                  </ErrorBoundary>
                }
              />
              <Route
                path="evaluation-form/:evaluationId"
                element={
                  <ErrorBoundary>
                    <EvaluationFormPage />
                  </ErrorBoundary>
                }
              />
              <Route path="/evaluation-form/:id" element={<EvaluationFormDisplay />} />
              <Route path="/evaluation/:id" element={<EvaluationDetailsView />} />
              <Route path="evaluation-book" element={<EvaluationBookFormBuilder />} />
              <Route path="evaluation-book/assignments" element={<TeacherAssignmentManager />} />
              <Route path="evaluation-book/teacher" element={<TeacherClassList />} />
              <Route path="evaluation-book/daily/:className" element={<DailyEvaluationForm />} />
              <Route path="evaluation-book/guardian" element={<GuardianEvaluationInbox />} />
              <Route path="evaluation-book/guardian/feedback/:evaluationId" element={<GuardianFeedbackForm />} />
              <Route path="evaluation-book/reports" element={<EvaluationBookReports />} />
              <Route path="mark-list-view" element={<MarkListView />} />
              <Route path="student-attendance-system" element={<StudentAttendanceSystem />} />
              <Route path="student-attendance-time-settings" element={<StudentAttendanceTimeSettings />} />
              <Route path="class-teacher-assignment" element={<ClassTeacherAssignment />} />
              <Route path="live-attendance" element={<LiveAttendanceMonitor />} />
              <Route path="communication" element={<AdminChat />} />
              {/* Counsellor route removed */}
              <Route path="create-mark-list" element={<MarkListSystem />} />
              <Route path="Mark-List-Management" element={<MarkListManagement />} />
              {/* Subject-Mapping-Setup route removed */}
              <Route path="post" element={<Post />} />
              {/* Roaster route removed */}
              <Route path="report-card" element={<ReportCard />} />
              <Route path="create-accounts" element={<CreateAccounts />} />
              <Route path="admin-sub-accounts" element={<AdminSubAccounts />} />
              {/* Payment route removed */}
              <Route path="settings" element={<Setting />} />
              {/* Branch-create route removed */}
              <Route path="schedule" element={<ScheduleDashboard />} />
              <Route path="schedule/Timetable" element={<ScheduleTimetable />} />
              <Route path="schedule/ClassShiftForm" element={<ClassShiftForm />} />
              <Route path="schedule/requirements" element={<ClassRequirementsForm />} />

              {/* New route for StaffForm */}
              <Route path="staff-form/:staffType/:className" element={<StaffForm />} />
              
              {/* Tasks routes - inside Home layout */}
              <Route path="tasks" element={<TaskPage />} />
              <Route path="tasks/:taskId" element={<TaskDetail />} />
              
              {/* Finance Module Routes */}
              <Route path="finance" element={<FinanceDashboard />} />
              <Route path="finance/accounts" element={<ChartOfAccounts />} />
              <Route path="finance/fee-management" element={<FeeManagement />} />
              <Route path="finance/fee-types" element={<FeeTypeManagement />} />
              <Route path="finance/invoices" element={<InvoiceManagement />} />
              <Route path="finance/payments" element={<FeePaymentManagement />} />
              <Route path="finance/monthly-payments" element={<MonthlyPayments />} />
              <Route path="finance/monthly-payment-settings" element={<MonthlyPaymentSettings />} />
              <Route path="finance/expenses" element={<ExpenseManagement />} />
              <Route path="finance/expense-approval" element={<ExpenseApproval />} />
              <Route path="finance/budgets" element={<BudgetManagement />} />
              <Route path="finance/payroll" element={<PayrollManagement />} />
              <Route path="finance/reports" element={<FinanceReports />} />
              <Route path="finance/inventory-integration" element={<ComingSoon title="Inventory Integration" description="Connect finance with inventory for automated expense tracking." />} />
              
              {/* Inventory Module Routes - Coming Soon */}
              <Route path="inventory" element={<ComingSoon title="Inventory Dashboard" description="Manage your school's inventory and stock items." />} />
              <Route path="inventory/items" element={<ComingSoon title="Items Management" description="Add and manage inventory items." />} />
              <Route path="inventory/purchase-orders" element={<ComingSoon title="Purchase Orders" description="Create and track purchase orders." />} />
              <Route path="inventory/movements" element={<ComingSoon title="Stock Movements" description="Track stock movements and transfers." />} />
              <Route path="inventory/suppliers" element={<ComingSoon title="Supplier Management" description="Manage your suppliers and vendors." />} />
              <Route path="inventory/reports" element={<ComingSoon title="Inventory Reports" description="View inventory analytics and reports." />} />
              
              {/* Asset Management Module Routes - Coming Soon */}
              <Route path="assets" element={<ComingSoon title="Asset Dashboard" description="Overview of all school assets." />} />
              <Route path="assets/registry" element={<ComingSoon title="Asset Registry" description="Register and manage school assets." />} />
              <Route path="assets/assignments" element={<ComingSoon title="Asset Assignments" description="Assign assets to staff and departments." />} />
              <Route path="assets/maintenance" element={<ComingSoon title="Asset Maintenance" description="Track asset maintenance schedules." />} />
              <Route path="assets/depreciation" element={<ComingSoon title="Asset Depreciation" description="Calculate and track asset depreciation." />} />
              <Route path="assets/disposal" element={<ComingSoon title="Asset Disposal" description="Manage asset disposal and write-offs." />} />
              <Route path="assets/reports" element={<ComingSoon title="Asset Reports" description="View asset analytics and reports." />} />
              
              {/* HR & Staff Management Module Routes */}
              <Route path="hr" element={<HRDashboard />} />
              <Route path="hr/salary" element={<SalaryManagement />} />
              <Route path="hr/attendance" element={<AttendanceSystem />} />
              <Route path="hr/device-status" element={<DeviceStatus />} />
              <Route path="hr/attendance-deduction-settings" element={<AttendanceDeductionSettings />} />
              <Route path="hr/attendance-time-settings" element={<AttendanceTimeSettings />} />
              {/* Redirect old shift routes to combined time settings */}
              <Route path="hr/shift-time-settings" element={<Navigate to="/hr/attendance-time-settings" replace />} />
              <Route path="hr/staff-shift-assignment" element={<Navigate to="/hr/attendance-time-settings" replace />} />
              <Route path="hr/leave" element={<LeaveManagement />} />
              <Route path="hr/payroll" element={<PayrollSystem />} />
              <Route path="hr/performance" element={<PerformanceManagement />} />
              <Route path="hr/reports" element={<HRReports />} />
              
              {/* Student Faults */}
              <Route path="student-faults" element={<StudentFaults />} />
            </Route>
            <Route path="/students" element={<ProtectedRoute><Students /></ProtectedRoute>}>
              <Route index element={<PostStudents />} />
              <Route path="class-students" element={<ClassStudents />} />
              <Route path="communication-students" element={<CommunicationStudents />} />
              <Route path="profile-students" element={<ProfileStudents />} />
            </Route>
            <Route path="/staff" element={<ProtectedRoute><Staff /></ProtectedRoute>}>
              <Route index element={<PV />} />
              <Route path="post-staff-new" element={<POSTS />} />
              {/* OLD ATTENDANCE REMOVED - Use /app/staff profile instead */}
              {/* <Route path="attendance-staff" element={<TeacherClassAttendance />} /> */}
              <Route path="mark-list-staff" element={<MRLIST />} />
              <Route path="evaluation-staff-control" element={<EVA />} />
              {/* Redirect old profile to new profile */}
              <Route path="profile-staff" element={<StaffProfile />} />
              <Route path="communication-staff" element={<COMSTA />} />
            </Route>
            <Route path="/guardian" element={<ProtectedRoute><Guardian /></ProtectedRoute>}>
              <Route index element={<GuardianHome />} />
              <Route path="wards" element={<GuardianWards />} />
              <Route path="attendance" element={<GuardianAttendance />} />
              <Route path="marks" element={<GuardianMarks />} />
              <Route path="messages" element={<GuardianMessages />} />
              <Route path="profile" element={<GuardianProfilePage />} />
            </Route>
            
            {/* ============================================== */}
            {/* MOBILE APP ROUTES - Completely Standalone      */}
            {/* These routes are independent from the main app */}
            {/* Access via: /app/student-login, /app/staff-profile, etc. */}
            {/* ============================================== */}
            <Route path="/app/student-login" element={<StudentLogin />} />
            <Route path="/app/guardian-login" element={<GuardianLogin />} />
            <Route path="/app/staff-login" element={<StaffLogin />} />
            <Route path="/app/student/:username" element={<StudentProfile />} />
            <Route path="/app/guardian/:username" element={<GuardianProfile />} />
            <Route path="/app/guardian-chat" element={<GuardianChat />} />
            <Route path="/app/staff" element={<StaffProfile />} />
            <Route path="/app/teacher-chat" element={<TeacherChat />} />
            
            {/* Legacy route redirects - for backward compatibility */}
            <Route path="/student-login" element={<Navigate to="/app/student-login" replace />} />
            <Route path="/guardian-login" element={<Navigate to="/app/guardian-login" replace />} />
            <Route path="/staff-login" element={<Navigate to="/app/staff-login" replace />} />
            <Route path="/student-profile/:username" element={<StudentProfileRedirect />} />
            <Route path="/guardian-profile/:username" element={<GuardianProfileRedirect />} />
            <Route path="/staff-profile" element={<Navigate to="/app/staff" replace />} />
          </Routes>
      </Provider>
    </div>
  );
}

export default App;