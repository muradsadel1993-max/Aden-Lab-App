import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
  ScrollView,
  Modal,
  Image,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function App() {
  const [users, setUsers] = useState([
    { id: '1', fullName: 'مراد سادل', username: 'admin', password: 'admin123', role: 'admin' },
    { id: '2', fullName: 'د. أنيس اليافعي', username: 'lab1', password: '123', role: 'technician' },
  ]);

  const [nextPatientId, setNextPatientId] = useState(4);

  const [tests, setTests] = useState([
    { id: '1', category: 'الكيمياء الحيوية (Biochemistry)', name: 'Fasting Blood Sugar (FBS)', type: 'numeric', male: '70 - 110', female: '70 - 110', unit: 'mg/dl' },
    { id: '2', category: 'الكيمياء الحيوية (Biochemistry)', name: 'Urea', type: 'numeric', male: '15 - 45', female: '15 - 45', unit: 'mg/dl' },
    { id: '3', category: 'أمراض الدم (Hematology)', name: 'Hemoglobin (Hb)', type: 'numeric', male: '13.5 - 17.5', female: '12.0 - 15.5', unit: 'g/dl' },
    { id: '4', category: 'المصليات (Serology)', name: 'Widal Test', type: 'text', options: ['Negative', '1/80', '1/160', '1/320'], male: 'Negative', female: 'Negative', unit: 'Titer' },
    { id: '5', category: 'المصليات (Serology)', name: 'Malaria Test', type: 'text', options: ['no malaria', 'malaria'], male: 'Negative', female: 'Negative', unit: 'ICT/Slide' },
  ]);

  const [categories, setCategories] = useState([
    'الكيمياء الحيوية (Biochemistry)',
    'أمراض الدم (Hematology)',
    'المصليات (Serology)',
    'المزارع (Cultures)',
  ]);

  const [patients, setPatients] = useState([
    {
      id: '1',
      name: 'صالح محمد قاسم',
      age: '45',
      gender: 'ذكر',
      date: '2026/06/07',
      notes: [{ id: 'n1', text: 'المريض حضر صائمًا.' }],
      results: [{ testName: 'Malaria Test', value: 'malaria', unit: 'ICT/Slide', normal: 'Negative' }],
    },
    {
      id: '2',
      name: 'علي ناصر عمر',
      age: '30',
      gender: 'ذكر',
      date: '2026/06/07',
      notes: [],
      results: [{ testName: 'Malaria Test', value: 'no malaria', unit: 'ICT/Slide', normal: 'Negative' }],
    },
    {
      id: '3',
      name: 'فاطمة أحمد عوض',
      age: '28',
      gender: 'أنثى',
      date: '2026/05/15',
      notes: [],
      results: [{ testName: 'Malaria Test', value: 'malaria', unit: 'ICT/Slide', normal: 'Negative' }],
    },
  ]);

  const [sysSettings, setSysSettings] = useState({
    labName: 'مختبر عدن الطبي الحديث',
    labSubName: 'Aden Laboratory Center',
    address: 'عدن - كريتر - الشارع العام',
    phones: '777123456 - 02255443',
    logoIcon: 'microscope',
    logoUrl: 'https://cdn-icons-png.flaticon.com/512/822/822143.png',
    headerText: 'الجمهورية اليمنية - وزارة الصحة العامة والسكان - إدارة المنشآت الطبية الخاصة',
    footerText: 'ملاحظة طبية: يرجى مطابقة نتائج الفحوصات المخبرية مع الأعراض السريرية للمريض. إعادة الفحص مجانية خلال 48 ساعة.',
    dateFormat: 'YYYY/MM/DD',
    allowPastDates: true,
    smartBackup: true,
    coloredPrinting: true,
  });

  const [editSettings, setEditSettings] = useState({ ...sysSettings });

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('login');

  const [patientModalVisible, setPatientModalVisible] = useState(false);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [newFullName, setNewFullName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('technician');

  const [pName, setPName] = useState('');
  const [pAge, setPAge] = useState('');
  const [pGender, setPGender] = useState('ذكر');
  const [pDate, setPDate] = useState('2026/06/07');

  const [selectedTestToEnter, setSelectedTestToEnter] = useState('');
  const [resultValue, setResultValue] = useState('');

  const [noteText, setNoteText] = useState('');

  const [filterTest, setFilterTest] = useState('الكل');
  const [filterDateText, setFilterDateText] = useState('');
  const [filterResultText, setFilterResultText] = useState('');

  const [selectedSettingTestId, setSelectedSettingTestId] = useState('4');
  const [newOptionInput, setNewOptionInput] = useState('');

  const [testModalVisible, setTestModalVisible] = useState(false);
  const [editingTestId, setEditingTestId] = useState(null);
  const [testForm, setTestForm] = useState({
    category: 'الكيمياء الحيوية (Biochemistry)',
    name: '',
    type: 'numeric',
    male: '',
    female: '',
    unit: '',
    optionsText: 'Negative, Positive',
  });

  const currentTargetTest = useMemo(() => tests.find(t => t.name === selectedTestToEnter), [tests, selectedTestToEnter]);

  const getGenderNormal = (test, gender) => {
    if (!test) return '';
    return gender === 'ذكر' ? (test.male || '') : (test.female || test.male || '');
  };

  const resetTestForm = (category = categories[0]) => {
    setEditingTestId(null);
    setTestForm({
      category,
      name: '',
      type: 'numeric',
      male: '',
      female: '',
      unit: '',
      optionsText: 'Negative, Positive',
    });
    setTestModalVisible(true);
  };

  const openEditTest = (test) => {
    setEditingTestId(test.id);
    setTestForm({
      category: test.category,
      name: test.name,
      type: test.type,
      male: test.male || '',
      female: test.female || '',
      unit: test.unit || '',
      optionsText: (test.options || []).join(', '),
    });
    setTestModalVisible(true);
  };

  const saveTest = () => {
    if (!testForm.name.trim() || !testForm.category.trim() || !testForm.unit.trim()) {
      Alert.alert('تنبيه', 'الرجاء إدخال اسم الفحص والقسم والوحدة.');
      return;
    }

    const payload = {
      category: testForm.category.trim(),
      name: testForm.name.trim(),
      type: testForm.type,
      male: testForm.male.trim(),
      female: testForm.female.trim(),
      unit: testForm.unit.trim(),
    };

    if (testForm.type === 'text') {
      const options = testForm.optionsText.split(',').map(x => x.trim()).filter(Boolean);
      if (options.length === 0) {
        Alert.alert('تنبيه', 'أدخل خيارًا واحدًا على الأقل للفحص النوعي.');
        return;
      }
      payload.options = options;
    }

    if (editingTestId) {
      setTests(prev => prev.map(t => (t.id === editingTestId ? { ...t, ...payload } : t)));
    } else {
      setTests(prev => [...prev, { id: Date.now().toString(), ...payload }]);
    }

    setTestModalVisible(false);
  };

  const deleteTest = (id) => {
    Alert.alert('تأكيد الحذف', 'هل تريد حذف هذا الفحص نهائيًا؟', [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'حذف', style: 'destructive', onPress: () => setTests(prev => prev.filter(t => t.id !== id)) },
    ]);
  };

  const handleLogin = () => {
    const foundUser = users.find(
      u => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password.trim()
    );
    if (foundUser) {
      setCurrentUser(foundUser);
      setCurrentScreen('dashboard');
      setUsername('');
      setPassword('');
    } else {
      Alert.alert('خطأ في الدخول', 'بيانات المستخدم غير صحيحة.');
    }
  };

  const handleAddEmployee = () => {
    if (!newFullName.trim() || !newUsername.trim() || !newPassword.trim()) return;
    setUsers([
      ...users,
      { id: Date.now().toString(), fullName: newFullName, username: newUsername.toLowerCase(), password: newPassword, role: newRole },
    ]);
    setNewFullName('');
    setNewUsername('');
    setNewPassword('');
  };

  const handleAddPatient = () => {
    if (!pName.trim() || !pAge.trim()) {
      Alert.alert('تنبيه', 'الرجاء إدخال اسم المريض وعمره بالكامل');
      return;
    }
    const newPatient = {
      id: nextPatientId.toString(),
      name: pName,
      age: pAge,
      gender: pGender,
      date: pDate,
      notes: [],
      results: [],
    };
    setPatients([newPatient, ...patients]);
    setNextPatientId(prev => prev + 1);
    setPatientModalVisible(false);
    setPName('');
    setPAge('');
    setPDate('2026/06/07');
  };

  const handleSaveResult = () => {
    if (!resultValue.trim() || !selectedTestToEnter || !selectedPatient) {
      Alert.alert('تنبيه', 'الرجاء كتابة أو اختيار النتيجة أولاً');
      return;
    }

    const targetTest = tests.find(t => t.name === selectedTestToEnter);
    if (!targetTest) return;

    const updatedPatients = patients.map(p => {
      if (p.id === selectedPatient.id) {
        const cleanResults = p.results.filter(r => r.testName !== targetTest.name);
        const newResult = {
          testName: targetTest.name,
          value: resultValue,
          unit: targetTest.unit,
          normal: getGenderNormal(targetTest, p.gender),
        };
        return { ...p, results: [...cleanResults, newResult] };
      }
      return p;
    });

    setPatients(updatedPatients);
    setResultModalVisible(false);
    setResultValue('');
    Alert.alert('تم الحفظ', 'تمت إضافة نتيجة الفحص للمريض بنجاح!');
  };

  const handleSaveNote = () => {
    if (!selectedPatient || !noteText.trim()) {
      Alert.alert('تنبيه', 'اكتب الملاحظة أولاً.');
      return;
    }

    setPatients(prev =>
      prev.map(p =>
        p.id === selectedPatient.id
          ? { ...p, notes: [{ id: Date.now().toString(), text: noteText.trim() }, ...(p.notes || [])] }
          : p
      )
    );

    setNoteText('');
    setNoteModalVisible(false);
    Alert.alert('تمت الإضافة', 'تم حفظ الملاحظة بنجاح.');
  };

  const handleAddOptionToTest = () => {
    if (!newOptionInput.trim()) return;
    setTests(tests.map(t => {
      if (t.id === selectedSettingTestId && t.type === 'text') {
        return { ...t, options: [...(t.options || []), newOptionInput.trim()] };
      }
      return t;
    }));
    setNewOptionInput('');
  };

  const handleRemoveOptionFromTest = (optToRemove) => {
    setTests(tests.map(t => {
      if (t.id === selectedSettingTestId && t.type === 'text') {
        return { ...t, options: (t.options || []).filter(o => o !== optToRemove) };
      }
      return t;
    }));
  };

  const getFilteredAnalytics = () => {
    let totalCount = 0;
    let matchingResults = [];

    patients.forEach(p => {
      p.results.forEach(r => {
        const matchTest = filterTest === 'الكل' || r.testName === filterTest;
        const matchDate = !filterDateText || p.date.startsWith(filterDateText.trim());
        const matchValue = !filterResultText || r.value.toLowerCase().includes(filterResultText.trim().toLowerCase());

        if (matchTest && matchDate && matchValue) {
          totalCount++;
          matchingResults.push({
            patientId: p.id,
            patientName: p.name,
            date: p.date,
            testName: r.testName,
            value: r.value,
          });
        }
      });
    });

    return { totalCount, matchingResults };
  };

  const analyticsData = getFilteredAnalytics();

  const saveSettings = () => {
    setSysSettings({ ...editSettings });
    setCurrentScreen('dashboard');
  };

  const openNoteModal = (patient) => {
    setSelectedPatient(patient);
    setNoteText('');
    setNoteModalVisible(true);
  };

  const openResultModal = (patient) => {
    setSelectedPatient(patient);
    if (tests.length > 0) {
      setSelectedTestToEnter(tests[0].name);
      setResultValue('');
    }
    setResultModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {currentScreen === 'login' && (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
          <View style={styles.logoContainer}>
            <View style={styles.iconCircle}>
              {sysSettings.logoUrl ? (
                <Image source={{ uri: sysSettings.logoUrl }} style={styles.mainLogoStyle} resizeMode="contain" />
              ) : (
                <FontAwesome5 name={sysSettings.logoIcon} size={45} color="#ffffff" />
              )}
            </View>
            <Text style={styles.brandName}>{sysSettings.labName}</Text>
            <Text style={styles.brandSub}>{sysSettings.labSubName}</Text>
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.loginHeader}>تسجيل دخول الموظفين</Text>
            <View style={styles.inputWrapper}>
              <FontAwesome5 name="user" size={16} color="#888" style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="اسم المستخدم" placeholderTextColor="#aaa" value={username} onChangeText={setUsername} autoCapitalize="none" />
            </View>
            <View style={styles.inputWrapper}>
              <FontAwesome5 name="lock" size={16} color="#888" style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="كلمة المرور" placeholderTextColor="#aaa" secureTextEntry value={password} onChangeText={setPassword} />
            </View>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>دخول النظام</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}

      {currentScreen === 'dashboard' && currentUser && (
        <View style={{ flex: 1 }}>
          <View style={styles.topBar}>
            <Text style={styles.welcomeText}>مرحباً: {currentUser.fullName} ({currentUser.role === 'admin' ? 'المدير العام' : 'مخبري'})</Text>
            <TouchableOpacity onPress={() => setCurrentScreen('login')} style={styles.logoutIcon}>
              <FontAwesome5 name="sign-out-alt" size={18} color="#ff4d4d" />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.menuGrid}>
            <View style={styles.banner}>
              {sysSettings.logoUrl ? (
                <Image source={{ uri: sysSettings.logoUrl }} style={styles.dashboardLogoStyle} resizeMode="contain" />
              ) : (
                <FontAwesome5 name={sysSettings.logoIcon} size={35} color="#ffffff" />
              )}
              <Text style={styles.bannerTitle}>{sysSettings.labName}</Text>
              <Text style={styles.bannerSub}>{sysSettings.address}</Text>
            </View>

            <TouchableOpacity style={styles.menuCard} onPress={() => setCurrentScreen('manage_patients')}>
              <View style={[styles.cardIconWrapper, { backgroundColor: '#e6f7ff' }]}>
                <FontAwesome5 name="user-plus" size={22} color="#0055ff" />
              </View>
              <Text style={styles.cardTitle}>سجل المرضى وإصدار النتائج</Text>
              <Text style={styles.cardDesc}>استقبال الحالات، حقن القيم المخبرية، وطباعة الفواتير والتقارير فوراً</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuCard, { borderRightWidth: 4, borderColor: '#008080' }]} onPress={() => setCurrentScreen('analytics')}>
              <View style={[styles.cardIconWrapper, { backgroundColor: '#f0fdf4' }]}>
                <FontAwesome5 name="chart-bar" size={22} color="#16a34a" />
              </View>
              <Text style={styles.cardTitle}>التقارير الإحصائية الشاملة والمتكاملة</Text>
              <Text style={styles.cardDesc}>جرد عدد الحالات، تتبع الملاريا والحالات الموجبة باليوم والشهر</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuCard} onPress={() => setCurrentScreen('manage_tests')}>
              <View style={[styles.cardIconWrapper, { backgroundColor: '#e6f2f2' }]}>
                <FontAwesome5 name="vials" size={22} color="#008080" />
              </View>
              <Text style={styles.cardTitle}>إدارة وقوائم الفحوصات</Text>
              <Text style={styles.cardDesc}>تعديل قيم المرجعية والوحدات القياسية للفحوصات</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuCard} onPress={() => { setEditSettings({ ...sysSettings }); setCurrentScreen('settings'); }}>
              <View style={[styles.cardIconWrapper, { backgroundColor: '#fdf2f8' }]}>
                <FontAwesome5 name="cogs" size={22} color="#db2777" />
              </View>
              <Text style={styles.cardTitle}>إعدادات النظام والملاحظات</Text>
              <Text style={styles.cardDesc}>تعديل الهوية والطباعة وإدارة العدادات والإعدادات العامة</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {currentScreen === 'manage_patients' && (
        <View style={{ flex: 1 }}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => setCurrentScreen('dashboard')} style={styles.backButton}>
              <FontAwesome5 name="arrow-right" size={16} color="#008080" />
              <Text style={styles.backText}>الرئيسية</Text>
            </TouchableOpacity>
            <Text style={styles.screenTitle}>سجل الحالات اليومية للمرضى</Text>
          </View>

          <View style={{ padding: 16, flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.miniSectionTitle}>قائمة كشوفات المرضى الحالية:</Text>
            <TouchableOpacity style={styles.addNewPatientBtn} onPress={() => setPatientModalVisible(true)}>
              <FontAwesome5 name="plus" size={12} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 12, marginRight: 6, fontWeight: 'bold' }}>تسجيل حالة مريض</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
            {patients.map(p => (
              <View key={p.id} style={styles.patientBigCard}>
                <View style={styles.patientCardHeader}>
                  <Text style={styles.patientCardName}>{p.name} ({p.gender})</Text>
                  <View style={styles.idBadge}>
                    <Text style={styles.idBadgeText}>رقم الحالة: {p.id}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', marginTop: 6 }}>
                  <Text style={styles.patientCardAge}>العمر: {p.age} سنة</Text>
                  <Text style={styles.patientCardDate}>التاريخ: {p.date}</Text>
                </View>

                {p.notes && p.notes.length > 0 && (
                  <View style={styles.notesBox}>
                    <Text style={styles.notesTitle}>الملاحظات:</Text>
                    {p.notes.map(note => (
                      <Text key={note.id} style={styles.noteItem}>• {note.text}</Text>
                    ))}
                  </View>
                )}

                <View style={styles.patientTestsList}>
                  {p.results.length === 0 ? (
                    <Text style={{ color: '#aaa', fontSize: 11, textAlign: 'right' }}>⚠️ لم يتم إدخال نتائج فحوصات لهذا المريض بعد.</Text>
                  ) : (
                    p.results.map((r, idx) => (
                      <Text key={idx} style={styles.miniResultTag}>
                        🔬 {r.testName}: <Text style={{ fontWeight: 'bold', color: '#008080' }}>{r.value} {r.unit}</Text>
                      </Text>
                    ))
                  )}
                </View>

                <View style={styles.patientActionsRow}>
                  <TouchableOpacity style={[styles.pActionBtn, { backgroundColor: '#e6f2f2' }]} onPress={() => openResultModal(p)}>
                    <FontAwesome5 name="plus-circle" size={12} color="#008080" />
                    <Text style={{ color: '#008080', fontSize: 11, marginRight: 4, fontWeight: 'bold' }}>إدخال / تعديل نتيجة</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.pActionBtn, { backgroundColor: '#f3e8ff' }]} onPress={() => openNoteModal(p)}>
                    <FontAwesome5 name="sticky-note" size={12} color="#7c3aed" />
                    <Text style={{ color: '#7c3aed', fontSize: 11, marginRight: 4, fontWeight: 'bold' }}>إضافة ملاحظة</Text>
                  </TouchableOpacity>

                  {p.results.length > 0 && (
                    <TouchableOpacity style={[styles.pActionBtn, { backgroundColor: '#e6f7ff' }]} onPress={() => { setSelectedPatient(p); setCurrentScreen('print_report'); }}>
                      <FontAwesome5 name="print" size={11} color="#0055ff" />
                      <Text style={{ color: '#0055ff', fontSize: 11, marginRight: 4, fontWeight: 'bold' }}>معاينة وطباعة التقرير</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>

          <Modal animationType="slide" transparent={true} visible={patientModalVisible}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>تسجيل مريض جديد بالاستقبال</Text>
                <View style={styles.nextIdNotice}>
                  <Text style={{ fontSize: 12, color: '#008080', fontWeight: 'bold' }}>المعرف التسلسلي المخصص لهذه الحالة تلقائياً هو: {nextPatientId}</Text>
                </View>

                <TextInput style={styles.modalInput} placeholder="اسم المريض الرباعي" placeholderTextColor="#aaa" value={pName} onChangeText={setPName} />
                <TextInput style={styles.modalInput} placeholder="العمر" placeholderTextColor="#aaa" keyboardType="numeric" value={pAge} onChangeText={setPAge} />

                <Text style={styles.inputLabel}>الجنس:</Text>
                <View style={styles.logoPickerRow}>
                  {['ذكر', 'أنثى'].map(g => (
                    <TouchableOpacity key={g} style={[styles.roleBtn, pGender === g && styles.roleBtnSelected]} onPress={() => setPGender(g)}>
                      <Text style={{ color: pGender === g ? '#fff' : '#333', fontSize: 12 }}>{g}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.inputLabel}>تاريخ الفحص والمخطر (يدوي):</Text>
                <TextInput style={styles.modalInput} value={pDate} onChangeText={setPDate} />

                <View style={styles.modalButtonsRow}>
                  <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#008080' }]} onPress={handleAddPatient}>
                    <Text style={styles.modalBtnText}>إضافة وتأكيد</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#888' }]} onPress={() => setPatientModalVisible(false)}>
                    <Text style={styles.modalBtnText}>إلغاء</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <Modal animationType="fade" transparent={true} visible={resultModalVisible}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>إدخال وحقن نتيجة مخبرية</Text>
                <Text style={styles.inputLabel}>اختر الفحص الطبي المُراد إدخاله:</Text>
                <ScrollView style={{ maxHeight: 110, width: '100%', borderWidth: 1, borderColor: '#eee', padding: 6, borderRadius: 8, marginBottom: 10 }}>
                  {tests.map(t => (
                    <TouchableOpacity key={t.id} style={[styles.testSelectOption, selectedTestToEnter === t.name && { backgroundColor: '#e6f2f2' }]} onPress={() => { setSelectedTestToEnter(t.name); setResultValue(''); }}>
                      <Text style={{ textAlign: 'right', fontSize: 12, color: '#333', fontWeight: selectedTestToEnter === t.name ? 'bold' : 'normal' }}>
                        {t.name} ({t.type === 'text' ? 'نصي خيارات' : 'رقمي'})
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <Text style={styles.inputLabel}>النتيجة الظاهرة (Result Value):</Text>
                {currentTargetTest && currentTargetTest.type === 'text' ? (
                  <View style={{ width: '100%', marginVertical: 8 }}>
                    <Text style={{ fontSize: 11, color: '#008080', marginBottom: 6, textAlign: 'right' }}>⚠️ هذا الفحص له خيارات معتمدة تلقائياً:</Text>
                    <View style={styles.optionsFlexRow}>
                      {(currentTargetTest.options || []).map(opt => (
                        <TouchableOpacity key={opt} style={[styles.optionSelectCard, resultValue === opt && styles.optionSelectCardActive]} onPress={() => setResultValue(opt)}>
                          <Text style={[styles.optionCardText, resultValue === opt && { color: '#fff' }]}>{opt}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <View style={{ flexDirection: 'row-reverse', alignItems: 'center', marginTop: 4 }}>
                      <Text style={{ fontSize: 12, color: '#555' }}>الخيار المحدد الحالي: </Text>
                      <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#16a34a' }}>{resultValue || 'لم يتم الاختيار'}</Text>
                    </View>
                  </View>
                ) : (
                  <TextInput style={styles.modalInput} placeholder="اكتب النتيجة الرقمية هنا" placeholderTextColor="#aaa" keyboardType="numeric" value={resultValue} onChangeText={setResultValue} />
                )}

                <View style={styles.modalButtonsRow}>
                  <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#008080' }]} onPress={handleSaveResult}>
                    <Text style={styles.modalBtnText}>اعتماد النتيجة</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#888' }]} onPress={() => setResultModalVisible(false)}>
                    <Text style={styles.modalBtnText}>إلغاء</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <Modal animationType="slide" transparent={true} visible={noteModalVisible}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>إضافة ملاحظة للمريض</Text>
                <TextInput
                  style={[styles.modalInput, { minHeight: 100, textAlignVertical: 'top' }]}
                  multiline
                  placeholder="اكتب الملاحظة هنا..."
                  placeholderTextColor="#aaa"
                  value={noteText}
                  onChangeText={setNoteText}
                />
                <View style={styles.modalButtonsRow}>
                  <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#7c3aed' }]} onPress={handleSaveNote}>
                    <Text style={styles.modalBtnText}>حفظ الملاحظة</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#888' }]} onPress={() => setNoteModalVisible(false)}>
                    <Text style={styles.modalBtnText}>إلغاء</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      )}

      {currentScreen === 'analytics' && (
        <View style={{ flex: 1 }}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => setCurrentScreen('dashboard')} style={styles.backButton}>
              <FontAwesome5 name="arrow-right" size={16} color="#008080" />
              <Text style={styles.backText}>الرئيسية</Text>
            </TouchableOpacity>
            <Text style={styles.screenTitle}>مركز التقارير المتقدمة والإحصائيات الكلية</Text>
          </View>

          <ScrollView style={{ flex: 1, padding: 16 }}>
            <View style={styles.filterContainerCard}>
              <Text style={styles.filterCardTitle}><FontAwesome5 name="filter" size={12} /> محرك البحث والفرز الإحصائي للمختبر</Text>

              <Text style={styles.inputLabel}>1. فلترة بحسب نوع الفحص الطبي:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 6, flexDirection: 'row-reverse' }}>
                <TouchableOpacity style={[styles.filterTagBtn, filterTest === 'الكل' && styles.filterTagBtnActive]} onPress={() => setFilterTest('الكل')}>
                  <Text style={{ color: filterTest === 'الكل' ? '#fff' : '#333', fontSize: 12 }}>كل الفحوصات</Text>
                </TouchableOpacity>
                {tests.map(t => (
                  <TouchableOpacity key={t.id} style={[styles.filterTagBtn, filterTest === t.name && styles.filterTagBtnActive]} onPress={() => setFilterTest(t.name)}>
                    <Text style={{ color: filterTest === t.name ? '#fff' : '#333', fontSize: 12 }}>{t.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.inputLabel}>2. التصفية بالتاريخ (اكتب اليوم أو الشهر بالكامل مثل 2026/06):</Text>
              <TextInput style={styles.settingsInput} placeholder="مثال: 2026/06 أو 2026/06/07" placeholderTextColor="#aaa" value={filterDateText} onChangeText={setFilterDateText} />

              <Text style={styles.inputLabel}>3. الفرز بحسب قيمة النتيجة (لمعرفة الحالات الموجبة مثل malaria):</Text>
              <TextInput style={styles.settingsInput} placeholder="اكتب كلمة الفرز هنا (مثلاً: malaria)" placeholderTextColor="#aaa" value={filterResultText} onChangeText={setFilterResultText} />
            </View>

            <View style={styles.counterDashboardBox}>
              <Text style={{ fontSize: 14, color: '#fff', fontWeight: 'bold' }}>إجمالي عدد الحالات المتطابقة مع الفرز الحالي:</Text>
              <Text style={{ fontSize: 36, color: '#fff', fontWeight: 'bold', marginTop: 4 }}>{analyticsData.totalCount} <Text style={{ fontSize: 14, fontWeight: 'normal' }}>حالة فحص</Text></Text>
            </View>

            <Text style={[styles.miniSectionTitle, { marginBottom: 8, marginTop: 10 }]}>تفاصيل السجلات المشمولة بالتقرير الإحصائي:</Text>
            {analyticsData.matchingResults.length === 0 ? (
              <View style={styles.noDataBox}>
                <Text style={{ color: '#777', fontSize: 12 }}>لا توجد سجلات مطابقة لمعايير الفرز الحالية.</Text>
              </View>
            ) : (
              analyticsData.matchingResults.map((item, index) => (
                <View key={index} style={styles.analyticsResultRowCard}>
                  <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', width: '100%' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 13, color: '#333' }}>حالة رقم #{item.patientId} - {item.patientName}</Text>
                    <Text style={{ fontSize: 11, color: '#888' }}>{item.date}</Text>
                  </View>
                  <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', width: '100%', marginTop: 6, borderTopWidth: 0.5, borderTopColor: '#eee', paddingTop: 4 }}>
                    <Text style={{ fontSize: 12, color: '#555' }}>الفحص: <Text style={{ fontWeight: '500' }}>{item.testName}</Text></Text>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: item.value.toLowerCase().includes('malaria') && !item.value.toLowerCase().includes('no') ? '#dc2626' : '#16a34a' }}>النتيجة: {item.value}</Text>
                  </View>
                </View>
              ))
            )}
            <View style={{ height: 30 }} />
          </ScrollView>
        </View>
      )}

      {currentScreen === 'print_report' && selectedPatient && (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <View style={[styles.topBar, { backgroundColor: '#f4f7f6' }]}>
            <TouchableOpacity onPress={() => setCurrentScreen('manage_patients')} style={styles.backButton}>
              <FontAwesome5 name="arrow-right" size={16} color="#008080" />
              <Text style={styles.backText}>رجوع</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.directPrintButton} onPress={() => Alert.alert('أمر الطباعة', 'تم إرسال مستند الفحص إلى طابعة المختبر بنجاح!')}>
              <FontAwesome5 name="print" size={12} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 12, marginRight: 6, fontWeight: 'bold' }}>اطبع الآن</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={{ flex: 1, padding: 16 }}>
            <View style={styles.officialPrintTemplate}>
              <Text style={styles.previewHeaderText}>{sysSettings.headerText}</Text>
              <View style={styles.previewDivider} />

              <View style={styles.previewLabHeader}>
                {sysSettings.logoUrl ? (
                  <Image source={{ uri: sysSettings.logoUrl }} style={styles.previewLogoImage} resizeMode="contain" />
                ) : (
                  <FontAwesome5 name={sysSettings.logoIcon} size={32} color="#008080" />
                )}
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.previewLabName}>{sysSettings.labName}</Text>
                  <Text style={styles.previewLabSub}>{sysSettings.labSubName}</Text>
                </View>
              </View>

              <View style={styles.reportPatientMetaGrid}>
                <View style={styles.metaRow}><Text style={styles.metaVal}>{selectedPatient.name}</Text><Text style={styles.metaKey}>اسم المريض:</Text></View>
                <View style={styles.metaRow}><Text style={[styles.metaVal, { fontWeight: 'bold', color: '#dc2626' }]}>#{selectedPatient.id}</Text><Text style={styles.metaKey}>رقم المريض / الملف:</Text></View>
                <View style={styles.metaRow}><Text style={styles.metaVal}>{selectedPatient.age} سنة / {selectedPatient.gender}</Text><Text style={styles.metaKey}>العمر/الجنس:</Text></View>
                <View style={styles.metaRow}><Text style={styles.metaVal}>{selectedPatient.date}</Text><Text style={styles.metaKey}>تاريخ الفحص:</Text></View>
              </View>

              {selectedPatient.notes && selectedPatient.notes.length > 0 && (
                <View style={styles.reportNotesBox}>
                  <Text style={styles.reportNotesTitle}>ملاحظات المريض:</Text>
                  {selectedPatient.notes.map(note => (
                    <Text key={note.id} style={styles.reportNoteItem}>• {note.text}</Text>
                  ))}
                </View>
              )}

              <View style={styles.tableHeaderRow}>
                <Text style={[styles.tableCol, { flex: 2, textAlign: 'left' }]}>Test Name</Text>
                <Text style={styles.tableCol}>Result</Text>
                <Text style={styles.tableCol}>Unit</Text>
                <Text style={[styles.tableCol, { flex: 1.5, textAlign: 'right' }]}>Normal Range</Text>
              </View>

              {selectedPatient.results.map((res, i) => (
                <View key={i} style={styles.tableBodyRow}>
                  <Text style={[styles.tableBodyCol, { flex: 2, textAlign: 'left', fontWeight: '500' }]}>{res.testName}</Text>
                  <Text style={[styles.tableBodyCol, { fontWeight: 'bold', color: '#008080' }]}>{res.value}</Text>
                  <Text style={styles.tableBodyCol}>{res.unit}</Text>
                  <Text style={[styles.tableBodyCol, { flex: 1.5, textAlign: 'right', fontStyle: 'italic', color: '#555' }]}>{res.normal}</Text>
                </View>
              ))}

              <View style={[styles.previewDivider, { marginTop: 40 }]} />
              <Text style={styles.previewFooterText}>{sysSettings.footerText}</Text>

              <View style={styles.previewFooterContacts}>
                <Text style={styles.mockText}>تلفون المختبر: {sysSettings.phones}</Text>
                <Text style={styles.mockText}>الموقع الرئيسي: {sysSettings.address}</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      )}

      {currentScreen === 'settings' && (
        <View style={{ flex: 1 }}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => setCurrentScreen('dashboard')} style={styles.backButton}>
              <FontAwesome5 name="arrow-right" size={16} color="#008080" />
              <Text style={styles.backText}>رجوع</Text>
            </TouchableOpacity>
            <Text style={styles.screenTitle}>لوحة التحكم والحسابات للمدير</Text>
          </View>

          <ScrollView style={{ flex: 1, padding: 16 }}>
            <View style={[styles.settingsSection, { borderColor: '#008080', borderWidth: 1.5 }]}>
              <Text style={[styles.sectionHeaderTitle, { color: '#008080' }]}><FontAwesome5 name="sort-numeric-down" size={14} /> ترقيم الحالات والملفات الطبية</Text>
              <Text style={styles.inputLabel}>الرقم التسلسلي للمريض القادم حالياً بالفحص:</Text>
              <TextInput style={styles.settingsInput} keyboardType="numeric" value={nextPatientId.toString()} onChangeText={(val) => setNextPatientId(parseInt(val) || 1)} />
              <TouchableOpacity
                style={[styles.addEmpSubmitBtn, { backgroundColor: '#dc2626', marginTop: 12 }]}
                onPress={() => {
                  Alert.alert(
                    'تأكيد إعادة ترقيم المختبر',
                    'هل أنت متأكد من تصفير الترقيم للبدء من (1)؟ يستخدم هذا الإجراء عند بداية العام الجديد لتنظيم الكشوفات.',
                    [
                      { text: 'إلغاء', style: 'cancel' },
                      { text: 'نعم، تصفير الآن', onPress: () => { setNextPatientId(1); Alert.alert('تم التصفير', 'تم تعديل عداد المرضى القادمين ليبدأ من الرقم 1 بنجاح للعام الجديد!'); } },
                    ]
                  );
                }}
              >
                <FontAwesome5 name="redo" size={12} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 13, fontWeight: 'bold', marginRight: 6 }}>تصفير الترقيم التسلسلي (بداية عام جديد)</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.settingsSection, { borderColor: '#db2777', borderWidth: 1 }]}>
              <Text style={[styles.sectionHeaderTitle, { color: '#db2777' }]}><FontAwesome5 name="edit" size={14} /> التحكم بالخيارات التلقائية للفحوصات النصية</Text>
              <Text style={styles.inputLabel}>اختر الفحص النصي المراد إدارة كلماته الافتراضية:</Text>
              <View style={{ flexDirection: 'row-reverse', flexWrap: 'wrap', marginVertical: 6 }}>
                {tests.filter(t => t.type === 'text').map(t => (
                  <TouchableOpacity key={t.id} style={[styles.filterTagBtn, selectedSettingTestId === t.id && { backgroundColor: '#db2777' }]} onPress={() => setSelectedSettingTestId(t.id)}>
                    <Text style={{ fontSize: 11, color: selectedSettingTestId === t.id ? '#fff' : '#333' }}>{t.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>الكلمات المفتاحية النشطة حالياً بالفحص:</Text>
              <View style={styles.optionsFlexRow}>
                {(tests.find(t => t.id === selectedSettingTestId)?.options || []).map(opt => (
                  <View key={opt} style={styles.editableOptionBadge}>
                    <Text style={{ fontSize: 11, color: '#333', marginLeft: 6 }}>{opt}</Text>
                    <TouchableOpacity onPress={() => handleRemoveOptionFromTest(opt)}>
                      <FontAwesome5 name="times-circle" size={12} color="#ff4d4d" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              <View style={{ flexDirection: 'row-reverse', alignItems: 'center', marginTop: 10 }}>
                <TextInput style={[styles.settingsInput, { flex: 1 }]} placeholder="أدخل كلمة جديدة (مثلاً: Weak Positive)" value={newOptionInput} onChangeText={setNewOptionInput} />
                <TouchableOpacity style={styles.addOptionMiniBtn} onPress={handleAddOptionToTest}>
                  <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>إضافة</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.settingsSection}>
              <Text style={styles.sectionHeaderTitle}><FontAwesome5 name="users-cog" size={14} /> إدارة حسابات الموظفين وكلمات المرور</Text>
              <TextInput style={styles.settingsInput} placeholder="الاسم الكامل للموظف" placeholderTextColor="#999" value={newFullName} onChangeText={setNewFullName} />
              <TextInput style={styles.settingsInput} placeholder="اسم المستخدم للدخول (English)" placeholderTextColor="#999" value={newUsername} onChangeText={setNewUsername} autoCapitalize="none" />
              <TextInput style={styles.settingsInput} placeholder="كلمة المرور الخاصة به" placeholderTextColor="#999" value={newPassword} onChangeText={setNewPassword} />
              <TouchableOpacity style={styles.addEmpSubmitBtn} onPress={handleAddEmployee}>
                <Text style={{ color: '#fff', fontSize: 13, fontWeight: 'bold' }}>تفعيل وإضافة الحساب للموظفين</Text>
              </TouchableOpacity>

              {users.map(emp => (
                <View key={emp.id} style={styles.empRowItem}>
                  <Text style={styles.empNameText}>{emp.fullName} ({emp.role === 'admin' ? 'مدير' : 'مخبري'})</Text>
                  <Text style={styles.empDetailsText}>المستخدم: {emp.username} | السر: {emp.password}</Text>
                </View>
              ))}
            </View>

            <View style={styles.settingsSection}>
              <Text style={styles.sectionHeaderTitle}><FontAwesome5 name="id-card" size={14} /> إعدادات الهوية والتقارير</Text>
              <Text style={styles.inputLabel}>اسم المختبر:</Text>
              <TextInput style={styles.settingsInput} value={editSettings.labName} onChangeText={text => setEditSettings({ ...editSettings, labName: text })} />
              <Text style={styles.inputLabel}>رابط صورة شعار المركز (رابط صورة مباشر URL):</Text>
              <TextInput style={styles.settingsInput} value={editSettings.logoUrl} onChangeText={text => setEditSettings({ ...editSettings, logoUrl: text })} placeholder="انسخ رابط صورتك أو شعارك الخاص هنا" placeholderTextColor="#aaa" />
              <Text style={styles.inputLabel}>رأس ورقة الفحوصات (Header):</Text>
              <TextInput style={styles.settingsInput} value={editSettings.headerText} onChangeText={text => setEditSettings({ ...editSettings, headerText: text })} />
              <Text style={styles.inputLabel}>تذييل ورقة الفحوصات (Footer):</Text>
              <TextInput style={styles.settingsInput} value={editSettings.footerText} onChangeText={text => setEditSettings({ ...editSettings, footerText: text })} />
            </View>

            <TouchableOpacity style={styles.saveSettingsBtn} onPress={saveSettings}>
              <Text style={styles.saveSettingsBtnText}>حفظ كل التغييرات</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {currentScreen === 'manage_tests' && (
        <View style={{ flex: 1 }}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => setCurrentScreen('dashboard')} style={styles.backButton}>
              <FontAwesome5 name="arrow-right" size={16} color="#008080" />
              <Text style={styles.backText}>الرئيسية</Text>
            </TouchableOpacity>
            <Text style={styles.screenTitle}>دليل الفحوصات الطبية المعتمدة</Text>
          </View>

          <View style={styles.testsTopActions}>
            <TouchableOpacity style={styles.globalAddTestBtn} onPress={() => resetTestForm(categories[0])}>
              <FontAwesome5 name="plus" size={12} color="#fff" />
              <Text style={styles.globalAddTestBtnText}>إضافة فحص جديد</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={{ flex: 1, padding: 16 }}>
            {categories.map(category => {
              const categoryTests = tests.filter(t => t.category === category);
              return (
                <View key={category} style={styles.categorySection}>
                  <View style={styles.categoryHeaderRow}>
                    <Text style={styles.categoryTitleText}>{category}</Text>
                    <TouchableOpacity style={styles.addTestBtn} onPress={() => resetTestForm(category)}>
                      <FontAwesome5 name="plus" size={11} color="#fff" />
                      <Text style={styles.addTestBtnText}>إضافة فحص</Text>
                    </TouchableOpacity>
                  </View>

                  {categoryTests.length === 0 ? (
                    <View style={styles.emptyCategoryBox}>
                      <Text style={{ color: '#777', fontSize: 12 }}>لا توجد فحوصات داخل هذا القسم بعد.</Text>
                    </View>
                  ) : (
                    categoryTests.map(test => (
                      <View key={test.id} style={styles.testCard}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.testNameText}>{test.name}</Text>
                          <Text style={styles.testDetailsText}>النوع: {test.type === 'text' ? 'نصي خيارات' : 'رقمي مرجعي'} | الوحدة: {test.unit}</Text>
                          <Text style={styles.testDetailsText}>ذكر: {test.male || '-'} | أنثى: {test.female || '-'}</Text>
                          {test.type === 'text' ? <Text style={styles.testDetailsText}>الخيارات: {(test.options || []).join(' • ')}</Text> : null}
                        </View>
                        <View style={styles.testActionRow}>
                          <TouchableOpacity onPress={() => openEditTest(test)} style={styles.smallActionBtn}>
                            <FontAwesome5 name="edit" size={11} color="#008080" />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => deleteTest(test.id)} style={[styles.smallActionBtn, { backgroundColor: '#fee2e2' }]}>
                            <FontAwesome5 name="trash" size={11} color="#dc2626" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))
                  )}
                </View>
              );
            })}
          </ScrollView>

          <Modal animationType="slide" transparent={true} visible={testModalVisible}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{editingTestId ? 'تعديل فحص' : 'إضافة فحص جديد'}</Text>

                <TextInput style={styles.modalInput} placeholder="اسم الفحص" value={testForm.name} onChangeText={text => setTestForm({ ...testForm, name: text })} />
                <TextInput style={styles.modalInput} placeholder="القسم / التصنيف" value={testForm.category} onChangeText={text => setTestForm({ ...testForm, category: text })} />
                <TextInput style={styles.modalInput} placeholder="الوحدة" value={testForm.unit} onChangeText={text => setTestForm({ ...testForm, unit: text })} />

                <Text style={styles.inputLabel}>النوع:</Text>
                <View style={styles.logoPickerRow}>
                  {['numeric', 'text'].map(t => (
                    <TouchableOpacity key={t} style={[styles.roleBtn, testForm.type === t && styles.roleBtnSelected]} onPress={() => setTestForm({ ...testForm, type: t })}>
                      <Text style={{ color: testForm.type === t ? '#fff' : '#333', fontSize: 12 }}>{t === 'text' ? 'نوعي' : 'رقمي'}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TextInput style={styles.modalInput} placeholder="المدى للذكر" value={testForm.male} onChangeText={text => setTestForm({ ...testForm, male: text })} />
                <TextInput style={styles.modalInput} placeholder="المدى للأنثى" value={testForm.female} onChangeText={text => setTestForm({ ...testForm, female: text })} />

                {testForm.type === 'text' && (
                  <TextInput
                    style={[styles.modalInput, { minHeight: 80 }]}
                    placeholder="الخيارات مفصولة بفواصل: Negative, Positive"
                    multiline
                    value={testForm.optionsText}
                    onChangeText={text => setTestForm({ ...testForm, optionsText: text })}
                  />
                )}

                <View style={styles.modalButtonsRow}>
                  <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#008080' }]} onPress={saveTest}>
                    <Text style={styles.modalBtnText}>حفظ</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#888' }]} onPress={() => setTestModalVisible(false)}>
                    <Text style={styles.modalBtnText}>إلغاء</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f6' },
  keyboardView: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  logoContainer: { alignItems: 'center', marginBottom: 30 },
  iconCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#008080', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  mainLogoStyle: { width: 65, height: 65, borderRadius: 32 },
  dashboardLogoStyle: { width: 50, height: 50 },
  brandName: { fontSize: 20, fontWeight: 'bold', color: '#008080', marginTop: 12, textAlign: 'center' },
  brandSub: { fontSize: 13, color: '#666', textAlign: 'center', marginTop: 4 },
  formContainer: { backgroundColor: '#fff', padding: 18, borderRadius: 16, elevation: 3 },
  loginHeader: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 14, textAlign: 'center' },
  inputWrapper: { flexDirection: 'row-reverse', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, marginBottom: 12, paddingHorizontal: 10 },
  inputIcon: { marginLeft: 8 },
  input: { flex: 1, minHeight: 46, textAlign: 'right' },
  loginButton: { backgroundColor: '#008080', padding: 14, borderRadius: 10, alignItems: 'center' },
  loginButtonText: { color: '#fff', fontWeight: 'bold' },
  topBar: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', padding: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e5e5e5' },
  welcomeText: { fontSize: 12, fontWeight: 'bold', color: '#333', flex: 1, textAlign: 'right' },
  logoutIcon: { padding: 6 },
  menuGrid: { padding: 16, gap: 12 },
  banner: { backgroundColor: '#008080', borderRadius: 18, padding: 20, alignItems: 'center' },
  bannerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 10, textAlign: 'center' },
  bannerSub: { color: '#dff', fontSize: 12, marginTop: 4, textAlign: 'center' },
  menuCard: { backgroundColor: '#fff', padding: 16, borderRadius: 16, elevation: 2 },
  cardIconWrapper: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#222', textAlign: 'right' },
  cardDesc: { fontSize: 12, color: '#666', textAlign: 'right', marginTop: 5 },
  backButton: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
  backText: { color: '#008080', fontWeight: 'bold' },
  screenTitle: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  miniSectionTitle: { fontSize: 13, fontWeight: 'bold', color: '#333' },
  addNewPatientBtn: { backgroundColor: '#008080', flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  patientBigCard: { backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 12, elevation: 2 },
  patientCardHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  patientCardName: { fontSize: 14, fontWeight: 'bold', color: '#222', flex: 1, textAlign: 'right' },
  idBadge: { backgroundColor: '#e6f2f2', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  idBadgeText: { fontSize: 11, color: '#008080', fontWeight: 'bold' },
  patientCardAge: { fontSize: 12, color: '#555' },
  patientCardDate: { fontSize: 12, color: '#555' },
  notesBox: { marginTop: 10, backgroundColor: '#f8fafc', borderRadius: 12, padding: 10 },
  notesTitle: { fontSize: 12, fontWeight: 'bold', color: '#7c3aed', marginBottom: 6, textAlign: 'right' },
  noteItem: { fontSize: 11, color: '#444', textAlign: 'right', marginBottom: 4 },
  patientTestsList: { marginTop: 10 },
  miniResultTag: { fontSize: 12, color: '#333', textAlign: 'right', marginBottom: 4 },
  patientActionsRow: { flexDirection: 'row-reverse', gap: 8, marginTop: 10, flexWrap: 'wrap' },
  pActionBtn: { flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalContent: { width: '100%', backgroundColor: '#fff', borderRadius: 18, padding: 16, maxHeight: '90%' },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: '#222', marginBottom: 12, textAlign: 'center' },
  nextIdNotice: { backgroundColor: '#eefaf7', padding: 10, borderRadius: 10, marginBottom: 12 },
  modalInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, textAlign: 'right', marginBottom: 10 },
  inputLabel: { fontSize: 12, color: '#444', marginBottom: 6, textAlign: 'right' },
  logoPickerRow: { flexDirection: 'row-reverse', gap: 8, flexWrap: 'wrap', marginBottom: 10 },
  roleBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: '#f1f5f9' },
  roleBtnSelected: { backgroundColor: '#008080' },
  modalButtonsRow: { flexDirection: 'row-reverse', gap: 10, marginTop: 6 },
  modalBtn: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 10 },
  modalBtnText: { color: '#fff', fontWeight: 'bold' },
  testSelectOption: { paddingVertical: 10, paddingHorizontal: 8, borderRadius: 8, marginBottom: 6 },
  optionsFlexRow: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8 },
  optionSelectCard: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#f3f4f6', borderRadius: 999 },
  optionSelectCardActive: { backgroundColor: '#008080' },
  optionCardText: { fontSize: 12, color: '#333' },
  filterContainerCard: { backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 12 },
  filterCardTitle: { fontSize: 13, fontWeight: 'bold', color: '#222', marginBottom: 8, textAlign: 'right' },
  filterTagBtn: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#f3f4f6', borderRadius: 999, marginLeft: 8, marginBottom: 8 },
  filterTagBtnActive: { backgroundColor: '#008080' },
  settingsInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, textAlign: 'right', marginBottom: 10, backgroundColor: '#fff' },
  counterDashboardBox: { backgroundColor: '#008080', borderRadius: 16, padding: 16, alignItems: 'center' },
  noDataBox: { backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center' },
  analyticsResultRowCard: { backgroundColor: '#fff', borderRadius: 14, padding: 12, marginBottom: 10 },
  directPrintButton: { backgroundColor: '#008080', flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  officialPrintTemplate: { backgroundColor: '#fff', borderRadius: 16, padding: 14 },
  previewHeaderText: { fontSize: 11, color: '#555', textAlign: 'center', lineHeight: 18 },
  previewDivider: { height: 1, backgroundColor: '#ddd', marginVertical: 10 },
  previewLabHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  previewLogoImage: { width: 48, height: 48 },
  previewLabName: { fontSize: 16, fontWeight: 'bold', color: '#008080', textAlign: 'right' },
  previewLabSub: { fontSize: 12, color: '#666', textAlign: 'right' },
  reportPatientMetaGrid: { marginTop: 14 },
  metaRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 6 },
  metaKey: { fontSize: 12, color: '#666' },
  metaVal: { fontSize: 12, color: '#222' },
  reportNotesBox: { marginTop: 10, backgroundColor: '#f8fafc', borderRadius: 12, padding: 10 },
  reportNotesTitle: { fontSize: 12, fontWeight: 'bold', color: '#7c3aed', marginBottom: 6, textAlign: 'right' },
  reportNoteItem: { fontSize: 11, color: '#444', textAlign: 'right', marginBottom: 4 },
  tableHeaderRow: { flexDirection: 'row', borderWidth: 1, borderColor: '#ddd', backgroundColor: '#f8fafc', marginTop: 12 },
  tableCol: { flex: 1, fontSize: 12, fontWeight: 'bold', color: '#333', padding: 8, borderLeftWidth: 1, borderLeftColor: '#ddd', textAlign: 'center' },
  tableBodyRow: { flexDirection: 'row', borderWidth: 1, borderTopWidth: 0, borderColor: '#ddd' },
  tableBodyCol: { flex: 1, fontSize: 12, color: '#222', padding: 8, borderLeftWidth: 1, borderLeftColor: '#ddd', textAlign: 'center' },
  previewFooterText: { fontSize: 12, color: '#444', textAlign: 'center', lineHeight: 18 },
  previewFooterContacts: { marginTop: 12, alignItems: 'center' },
  mockText: { fontSize: 11, color: '#666' },
  settingsSection: { backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#eee' },
  sectionHeaderTitle: { fontSize: 14, fontWeight: 'bold', color: '#222', marginBottom: 10, textAlign: 'right' },
  addEmpSubmitBtn: { backgroundColor: '#008080', alignItems: 'center', paddingVertical: 12, borderRadius: 10, marginBottom: 12, flexDirection: 'row-reverse', justifyContent: 'center' },
  empRowItem: { paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#eee' },
  empNameText: { fontSize: 12, fontWeight: 'bold', color: '#222', textAlign: 'right' },
  empDetailsText: { fontSize: 11, color: '#666', textAlign: 'right', marginTop: 3 },
  saveSettingsBtn: { backgroundColor: '#db2777', alignItems: 'center', paddingVertical: 14, borderRadius: 12, marginVertical: 8 },
  saveSettingsBtnText: { color: '#fff', fontWeight: 'bold' },
  testsTopActions: { paddingHorizontal: 16, paddingTop: 12 },
  globalAddTestBtn: { backgroundColor: '#008080', flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, alignSelf: 'flex-start' },
  globalAddTestBtnText: { color: '#fff', fontSize: 12, marginRight: 6, fontWeight: 'bold' },
  categorySection: { backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 12 },
  categoryHeaderRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  categoryTitleText: { fontSize: 14, fontWeight: 'bold', color: '#222', textAlign: 'right', flex: 1, marginLeft: 8 },
  addTestBtn: { backgroundColor: '#008080', flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  addTestBtnText: { color: '#fff', fontSize: 12, marginRight: 6, fontWeight: 'bold' },
  emptyCategoryBox: { backgroundColor: '#f8fafc', padding: 14, borderRadius: 12, alignItems: 'center' },
  testCard: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 12, marginBottom: 10, flexDirection: 'row-reverse', gap: 10 },
  testNameText: { fontSize: 13, fontWeight: 'bold', color: '#222', textAlign: 'right' },
  testDetailsText: { fontSize: 11, color: '#666', textAlign: 'right', marginTop: 4 },
  testActionRow: { justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  smallActionBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#e6f2f2', alignItems: 'center', justifyContent: 'center' },
  editableOptionBadge: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#f3f4f6', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, marginBottom: 8 },
});