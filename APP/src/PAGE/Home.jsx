// Updated PAGE/Home.jsx - With AppContext integration and permission filtering
import { useState, useEffect, useMemo } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../context/AppContext";
import { filterNavByPermissions } from "../utils/permissionUtils";
import { 
  FiHome, FiUser, FiUsers, FiBook, FiCalendar, 
  FiMessageSquare, FiFileText, FiSettings, 
  FiFilePlus, 
  FiChevronDown, FiChevronRight, FiMenu, 
  FiLogOut, FiUser as FiProfile, 
  FiSearch, FiAward,
  FiPieChart, FiDatabase,
  FiCheckCircle, FiDollarSign, FiTrendingUp,
  FiShoppingCart, FiPackage, FiTool, FiClock, FiBell, FiRefreshCw
} from "react-icons/fi";
import { FaGraduationCap, FaChalkboardTeacher, FaRegCalendarAlt } from "react-icons/fa";

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, profile, t } = useApp();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    registration: true,
    lists: true,
    finance: true,
    inventory: false,
    assets: false,
    hr: false,
    academic: true,
    administration: true
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    window.location.reload();
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('userType');
    localStorage.removeItem('userPermissions');
    localStorage.removeItem('authToken'); // Clear JWT token
    navigate("/login");
  };

  const navItems = [
    {
      path: "/",
      icon: <FiHome className={styles.navIcon} />,
      label: t('dashboard'),
      section: null,
    },
    {
      section: t('registration'),
      sectionKey: 'registration',
      icon: <FiUser className={styles.sectionIcon} />,
      items: [
        {
          path: "/create-register-student",
          icon: <FaGraduationCap className={styles.navIcon} />,
          label: t('registerStudent'),
        },
        {
          path: "/create-register-staff",
          icon: <FaChalkboardTeacher className={styles.navIcon} />,
          label: t('registerStaff'),
        },
      ],
    },
    {
      section: t('lists'),
      sectionKey: 'lists',
      icon: <FiDatabase className={styles.sectionIcon} />,
      items: [
        {
          path: "/list-student",
          icon: <FiUsers className={styles.navIcon} />,
          label: t('students'),
        },
        {
          path: "/list-staff",
          icon: <FiUsers className={styles.navIcon} />,
          label: t('staff'),
        },
        {
          path: "/list-guardian",
          icon: <FiUsers className={styles.navIcon} />,
          label: t('guardians'),
        },
      ],
    },
    {
      section: 'Finance Management',
      sectionKey: 'finance',
      icon: <FiDollarSign className={styles.sectionIcon} />,
      items: [
        {
          path: "/finance",
          icon: <FiPieChart className={styles.navIcon} />,
          label: 'Finance Dashboard',
        },
        {
          path: "/finance/fee-management",
          icon: <FiDollarSign className={styles.navIcon} />,
          label: 'Fee Management',
        },
        {
          path: "/finance/fee-types",
          icon: <FiDollarSign className={styles.navIcon} />,
          label: 'Fee Types',
        },
        {
          path: "/finance/monthly-payments",
          icon: <FiCalendar className={styles.navIcon} />,
          label: 'Monthly Payments',
        },
        {
          path: "/finance/monthly-payment-settings",
          icon: <FiSettings className={styles.navIcon} />,
          label: 'Payment Settings',
        },
        {
          path: "/finance/expenses",
          icon: <FiTrendingUp className={styles.navIcon} />,
          label: 'Expenses',
        },
        {
          path: "/finance/expense-approval",
          icon: <FiCheckCircle className={styles.navIcon} />,
          label: 'Expense Approval',
        },
        {
          path: "/finance/budgets",
          icon: <FiPieChart className={styles.navIcon} />,
          label: 'Budgets',
        },
        {
          path: "/finance/reports",
          icon: <FiFileText className={styles.navIcon} />,
          label: 'Financial Reports',
        },
        {
          path: "/finance/inventory-integration",
          icon: <FiPackage className={styles.navIcon} />,
          label: '🔗 Inventory Integration',
        },
      ],
    },
    {
      section: 'Inventory & Stock',
      sectionKey: 'inventory',
      icon: <FiPackage className={styles.sectionIcon} />,
      items: [
        {
          path: "/inventory",
          icon: <FiShoppingCart className={styles.navIcon} />,
          label: 'Inventory Dashboard',
        },
        {
          path: "/inventory/items",
          icon: <FiPackage className={styles.navIcon} />,
          label: 'Items',
        },
        {
          path: "/inventory/purchase-orders",
          icon: <FiFileText className={styles.navIcon} />,
          label: 'Purchase Orders',
        },
        {
          path: "/inventory/movements",
          icon: <FiTool className={styles.navIcon} />,
          label: 'Stock Movements',
        },
        {
          path: "/inventory/suppliers",
          icon: <FiUsers className={styles.navIcon} />,
          label: 'Suppliers',
        },
        {
          path: "/inventory/reports",
          icon: <FiPieChart className={styles.navIcon} />,
          label: 'Inventory Reports',
        },
      ],
    },
    {
      section: 'Asset Management',
      sectionKey: 'assets',
      icon: <FiTool className={styles.sectionIcon} />,
      items: [
        {
          path: "/assets",
          icon: <FiPieChart className={styles.navIcon} />,
          label: 'Asset Dashboard',
        },
        {
          path: "/assets/registry",
          icon: <FiFileText className={styles.navIcon} />,
          label: 'Asset Registry',
        },
        {
          path: "/assets/assignments",
          icon: <FiUsers className={styles.navIcon} />,
          label: 'Assignments',
        },
        {
          path: "/assets/maintenance",
          icon: <FiTool className={styles.navIcon} />,
          label: 'Maintenance',
        },
        {
          path: "/assets/depreciation",
          icon: <FiTrendingUp className={styles.navIcon} />,
          label: 'Depreciation',
        },
        {
          path: "/assets/disposal",
          icon: <FiFileText className={styles.navIcon} />,
          label: 'Disposal',
        },
        {
          path: "/assets/reports",
          icon: <FiPieChart className={styles.navIcon} />,
          label: 'Asset Reports',
        },
      ],
    },
    {
      section: 'HR & Staff Management',
      sectionKey: 'hr',
      icon: <FiUsers className={styles.sectionIcon} />,
      items: [
        {
          path: "/hr",
          icon: <FiPieChart className={styles.navIcon} />,
          label: 'HR Dashboard',
        },
        {
          path: "/hr/salary",
          icon: <FiDollarSign className={styles.navIcon} />,
          label: '💰 Salary Management',
        },
        {
          path: "/hr/attendance",
          icon: <FiCalendar className={styles.navIcon} />,
          label: 'Attendance System',
        },
        {
          path: "/hr/device-status",
          icon: <FiClock className={styles.navIcon} />,
          label: '🔌 Device Status',
        },
        {
          path: "/hr/attendance-time-settings",
          icon: <FiClock className={styles.navIcon} />,
          label: '⏰ Time & Shift Settings',
        },
        {
          path: "/hr/staff-specific-timing",
          icon: <FiClock className={styles.navIcon} />,
          label: '👤 Staff-Specific Timing',
        },
        {
          path: "/hr/attendance-deduction-settings",
          icon: <FiSettings className={styles.navIcon} />,
          label: '⚙️ Attendance Deductions',
        },
        {
          path: "/hr/leave",
          icon: <FiCalendar className={styles.navIcon} />,
          label: 'Leave Management',
        },
        {
          path: "/hr/payroll",
          icon: <FiDollarSign className={styles.navIcon} />,
          label: 'Payroll System',
        },
        {
          path: "/hr/performance",
          icon: <FiTrendingUp className={styles.navIcon} />,
          label: 'Performance',
        },
        {
          path: "/hr/reports",
          icon: <FiPieChart className={styles.navIcon} />,
          label: 'HR Reports',
        },
      ],
    },
    {
      section: t('academic'),
      sectionKey: 'academic',
      icon: <FiBook className={styles.sectionIcon} />,
      items: [
        {
          path: "/evaluation",
          icon: <FiPieChart className={styles.navIcon} />,
          label: t('evaluation'),
        },
        {
          path: "/evaluation-book",
          icon: <FiBook className={styles.navIcon} />,
          label: t('evaluationBook'),
        },
        {
          path: "/evaluation-book/reports",
          icon: <FiFileText className={styles.navIcon} />,
          label: t('evalBookReports'),
        },
        {
          path: "/mark-list-view",
          icon: <FiFileText className={styles.navIcon} />,
          label: t('markLists'),
        },
        {
          path: "/student-attendance-system",
          icon: <FiCheckCircle className={styles.navIcon} />,
          label: '📋 Student Attendance (Weekly)',
        },
        {
          path: "/student-attendance-time-settings",
          icon: <FiClock className={styles.navIcon} />,
          label: '⏰ Student Attendance Settings',
        },
        {
          path: "/create-mark-list",
          icon: <FiFilePlus className={styles.navIcon} />,
          label: t('createMarklist'),
        },
        {
          path: "/report-card",
          icon: <FiAward className={styles.navIcon} />,
          label: t('reportCard'),
        },
        {
          path: "/schedule",
          icon: <FiCalendar className={styles.navIcon} />,
          label: t('schedule'),
        },
        {
          path: "/post",
          icon: <FiMessageSquare className={styles.navIcon} />,
          label: t('post'),
        },
        {
          path: "/tasks",
          icon: <FiCheckCircle className={styles.navIcon} />,
          label: t('tasks'),
        },
      ],
    },
    {
      section: t('administration'),
      sectionKey: 'administration',
      icon: <FiSettings className={styles.sectionIcon} />,
      items: [
        {
          path: "/communication",
          icon: <FiMessageSquare className={styles.navIcon} />,
          label: t('communication'),
        },
        {
          path: "/guardian-notifications",
          icon: <FiBell className={styles.navIcon} />,
          label: 'Guardian Notifications',
        },
        {
          path: "/class-teacher-assignment",
          icon: <FaChalkboardTeacher className={styles.navIcon} />,
          label: t('classTeachers'),
        },
        {
          path: "/evaluation-book/assignments",
          icon: <FiUsers className={styles.navIcon} />,
          label: t('evalBookAssignments'),
        },
        {
          path: "/settings",
          icon: <FiSettings className={styles.navIcon} />,
          label: t('settings'),
        },
        {
          path: "/admin-sub-accounts",
          icon: <FiUsers className={styles.navIcon} />,
          label: t('subAccounts'),
        },
      ],
    },
  ];

  // Get user type and permissions for filtering navigation
  // Use useState to make these reactive
  const [userType, setUserType] = useState(() => {
    const stored = localStorage.getItem('userType');
    console.log('🔐 Initial userType from localStorage:', stored);
    // If no userType is stored, default to 'admin' for backward compatibility
    return stored || 'admin';
  });
  const [userPermissions, setUserPermissions] = useState(() => {
    try {
      const storedPermissions = localStorage.getItem('userPermissions');
      const parsed = storedPermissions ? JSON.parse(storedPermissions) : [];
      console.log('🔑 Initial permissions from localStorage:', parsed.length, 'permissions', parsed);
      return parsed;
    } catch (e) {
      console.error('❌ Error parsing permissions:', e);
      return [];
    }
  });

  // Update user type and permissions when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const newUserType = localStorage.getItem('userType') || 'admin';
      console.log('🔄 Storage changed - userType:', newUserType);
      setUserType(newUserType);
      
      try {
        const storedPermissions = localStorage.getItem('userPermissions');
        const parsed = storedPermissions ? JSON.parse(storedPermissions) : [];
        console.log('🔄 Storage changed - permissions:', parsed.length, 'permissions');
        setUserPermissions(parsed);
      } catch (e) {
        console.error('❌ Error parsing permissions on storage change:', e);
        setUserPermissions([]);
      }
    };

    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Also check on mount
    handleStorageChange();

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Filter navigation items based on user permissions
  const filteredNavItems = useMemo(() => {
    console.log('🔍 Filtering navigation:', { 
      userType, 
      permissionCount: userPermissions.length,
      permissions: userPermissions 
    });
    
    let filtered = filterNavByPermissions(navItems, userPermissions, userType);
    
    // Sub-accounts should never see the Sub-Accounts management page
    if (userType === 'sub-account') {
      filtered = filtered.map(item => {
        if (item.items) {
          return {
            ...item,
            items: item.items.filter(subItem => subItem.path !== '/admin-sub-accounts')
          };
        }
        return item;
      }).filter(item => !item.items || item.items.length > 0);
    }
    
    console.log('✅ Filtered navigation items:', filtered.length, 'sections');
    return filtered;
  }, [userPermissions, userType]);

  return (
    <div className={styles.container}>
      {/* Profile Header */}
      {!isMobile ? (
        <motion.header 
          className={styles.profileHeader}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          style={{ 
            background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})` 
          }}
        >
          <div className={styles.searchContainer}>
            <FiSearch className={styles.searchIcon} />
            <input 
              type="search" 
              placeholder={t('search')}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.profileControls}>
            <motion.button
              className={styles.refreshBtn}
              onClick={handleRefresh}
              disabled={isRefreshing}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={t('refresh') || 'Refresh'}
            >
              <FiRefreshCw 
                className={`${styles.refreshIcon} ${isRefreshing ? styles.spinning : ''}`} 
              />
            </motion.button>

            <motion.div 
              className={styles.profileDropdown}
              onClick={() => setProfileOpen(!profileOpen)}
              whileHover={{ scale: 1.02 }}
            >
              <div className={styles.profileAvatar}>
                {profile.profileImage ? (
                  <img src={profile.profileImage} alt="Profile" className={styles.avatarImage} />
                ) : (
                  <FiProfile className={styles.avatarIcon} />
                )}
              </div>
              <span className={styles.profileName}>{profile.name}</span>
              <FiChevronDown 
                className={`${styles.dropdownArrow} ${profileOpen ? styles.rotated : ''}`} 
              />
            </motion.div>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  className={styles.dropdownMenu}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link to="/settings" className={styles.dropdownItem}>
                    <FiProfile className={styles.dropdownIcon} /> {t('myProfile')}
                  </Link>
                  <Link to="/settings" className={styles.dropdownItem}>
                    <FiSettings className={styles.dropdownIcon} /> {t('settings')}
                  </Link>
                  <motion.button
                    onClick={handleLogout}
                    className={styles.dropdownItem}
                    whileHover={{ x: 5 }}
                  >
                    <FiLogOut className={styles.dropdownIcon} /> {t('logout')}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.header>
      ) : (
        <motion.header 
          className={styles.profileHeader}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          style={{ 
            background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})` 
          }}
        >
          <motion.button 
            className={styles.menuButton}
            onClick={() => setMobileMenuOpen(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiMenu />
          </motion.button>

          <div className={styles.logoText}>Skoolific</div>

          <div className={styles.mobileHeaderControls}>
            <motion.button
              className={styles.refreshBtn}
              onClick={handleRefresh}
              disabled={isRefreshing}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={t('refresh') || 'Refresh'}
            >
              <FiRefreshCw 
                className={`${styles.refreshIcon} ${isRefreshing ? styles.spinning : ''}`} 
              />
            </motion.button>

            <motion.div 
              className={styles.profileDropdown}
              onClick={() => setProfileOpen(!profileOpen)}
              whileHover={{ scale: 1.02 }}
            >
              <div className={styles.profileAvatar}>
                {profile.profileImage ? (
                  <img src={profile.profileImage} alt="Profile" className={styles.avatarImage} />
                ) : (
                  <FiProfile className={styles.avatarIcon} />
                )}
              </div>
              <FiChevronDown 
                className={`${styles.dropdownArrow} ${profileOpen ? styles.rotated : ''}`} 
              />
            </motion.div>
          </div>
        </motion.header>
      )}

      {/* Sidebar Navigation */}
      <motion.nav
        className={`${styles.sidebar} ${mobileMenuOpen ? styles.mobileOpen : ""}`}
        initial={{ x: isMobile ? -300 : 0 }}
        animate={{
          x: mobileMenuOpen ? 0 : isMobile ? -300 : 0,
          width: isMobile ? "80%" : "280px",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ 
          background: `linear-gradient(180deg, ${theme.primaryColor}dd, ${theme.secondaryColor}dd)` 
        }}
      >
        <div className={styles.logo}>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={styles.logoText}
          >
            Skoolific
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.3 }}
            className={styles.logoSubtext}
          >
            School Management System
          </motion.p>
        </div>

        <ul className={styles.navLinks}>
          {filteredNavItems.map((item, index) => {
            if (item.path) {
              return (
                <motion.li
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to={item.path}
                    className={`${styles.navLink} ${
                      location.pathname === item.path ? styles.active : ""
                    }`}
                    style={location.pathname === item.path ? {
                      background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`
                    } : {}}
                  >
                    <span className={styles.icon}>{item.icon}</span>
                    <span className={styles.linkText}>{item.label}</span>
                  </Link>
                </motion.li>
              );
            } else {
              const sectionKey = item.sectionKey;
              return (
                <li key={index} className={styles.navSection}>
                  <motion.div
                    className={styles.sectionHeader}
                    onClick={() => toggleSection(sectionKey)}
                    whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                  >
                    <div className={styles.sectionTitle}>
                      <span className={styles.sectionIcon}>{item.icon}</span>
                      <span>{item.section}</span>
                    </div>
                    {expandedSections[sectionKey] ? (
                      <FiChevronDown className={styles.chevronIcon} />
                    ) : (
                      <FiChevronRight className={styles.chevronIcon} />
                    )}
                  </motion.div>
                  <AnimatePresence>
                    {expandedSections[sectionKey] && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className={styles.subMenu}
                      >
                        {item.items.map((subItem, subIndex) => (
                          <motion.li 
                            key={subIndex} 
                            whileHover={{ x: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <Link
                              to={subItem.path}
                              className={`${styles.navLink} ${
                                location.pathname === subItem.path ? styles.active : ""
                              }`}
                              style={location.pathname === subItem.path ? {
                                background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`
                              } : {}}
                            >
                              <span className={styles.icon}>{subItem.icon}</span>
                              <span className={styles.linkText}>{subItem.label}</span>
                            </Link>
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>
              );
            }
          })}
        </ul>

        {/* Mobile Profile and Logout */}
        {isMobile && (
          <motion.div 
            className={styles.mobileProfileMenu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link to="/settings" className={styles.mobileProfileLink}>
              <FiProfile className={styles.mobileMenuIcon} /> {t('myProfile')}
            </Link>
            <motion.button 
              onClick={handleLogout} 
              className={styles.mobileLogoutBtn}
              whileHover={{ x: 5 }}
            >
              <FiLogOut className={styles.mobileMenuIcon} /> {t('logout')}
            </motion.button>
          </motion.div>
        )}
      </motion.nav>

      {/* Overlay for mobile menu */}
      {mobileMenuOpen && isMobile && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Profile Dropdown */}
      {profileOpen && isMobile && (
        <motion.div
          className={styles.mobileProfileDropdown}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Link to="/settings" className={styles.dropdownItem}>
            <FiProfile className={styles.dropdownIcon} /> {t('myProfile')}
          </Link>
          <Link to="/settings" className={styles.dropdownItem}>
            <FiSettings className={styles.dropdownIcon} /> {t('settings')}
          </Link>
          <motion.button 
            onClick={handleLogout} 
            className={styles.dropdownItem}
            whileHover={{ x: 5 }}
          >
            <FiLogOut className={styles.dropdownIcon} /> {t('logout')}
          </motion.button>
        </motion.div>
      )}

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={styles.contentWrapper}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default Home;
