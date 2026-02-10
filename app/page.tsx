'use client';

import React, { useRef, useState, useEffect } from 'react';

// ★★★ 구글 스크립트 주소 ★★★
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzUHmRX9QOKYd3wzknAP0m4WK0x61ZZMnmO6V1wRtmRoRQYBzKbUPT8IS5ejuCJs4xH/exec"; 

// ★★★ 선생님 전화번호 ★★★
const TEACHER_PHONE = "01076501239";

// === 아이콘 컴포넌트 ===
const PenIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>);
const EraserIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" /><path d="M22 21H7" /><path d="m5 11 9 9" /></svg>);
const TrashIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>);
const ChevronRightIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>);
const ChevronLeftIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>);
const CheckIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>);
const RefreshIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>);
const CameraIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>);
const GroupIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const LoopIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"></path><path d="m16.2 7.8 2.9-2.9"></path><path d="M18 12h4"></path><path d="m16.2 16.2 2.9 2.9"></path><path d="M12 18v4"></path><path d="m4.9 19.1 2.9-2.9"></path><path d="M2 12h4"></path><path d="m4.9 4.9 2.9 2.9"></path></svg>;
const HistoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><path d="M12 7v5l4 2"/></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const FeedbackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15l2 2 4-4"/></svg>;

export default function RunMathApp() {
  const [isParentMode, setIsParentMode] = useState(false);
  const [parentData, setParentData] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'parent') {
        setIsParentMode(true);
        setParentData({
          name: params.get('name'),
          school: params.get('school'),
          time: params.get('time'),
          book: params.get('book'),
          date: params.get('date')
        });
      }
    }
  }, []);

  const [step, setStep] = useState(1);
  const [studentInfo, setStudentInfo] = useState({ name: '', school: '' });
  const [contacts, setContacts] = useState({ parent: '', student: '' });
  const [selectedPlan, setSelectedPlan] = useState(''); 
  const [scheduleInfo, setScheduleInfo] = useState({ time: '', book: '' });
  
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSaving, setIsSaving] = useState(false); 
  const [showHistory, setShowHistory] = useState(false); 
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [canvasData, setCanvasData] = useState<{ [key: number]: string }>({});

  const [photos, setPhotos] = useState<{ [key: string]: string | null }>({
    small1: null, small2: null,
    loop1: null, loop2: null
  });

  useEffect(() => {
    const savedPhotos = localStorage.getItem('runMathPhotos');
    if (savedPhotos) setPhotos(JSON.parse(savedPhotos));
    
    const savedHistory = localStorage.getItem('runMathHistory');
    if (savedHistory) setHistoryList(JSON.parse(savedHistory));
  }, []);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');

  const saveCanvasState = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      setCanvasData(prev => ({ ...prev, [step]: dataUrl }));
    }
  };

  useEffect(() => {
    // 2, 3, 4단계는 캔버스 없음 (3단계: 피드백, 4단계: 시간표)
    if (step === 2 || step === 3 || step === 4 || isParentMode || showHistory) return; 

    setTool('pen');
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const rect = parent.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1; 
        
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = '100%';
        canvas.style.height = '100%';

        const context = canvas.getContext('2d');
        if (context) {
          context.scale(dpr, dpr);
          
          context.fillStyle = 'white';
          context.fillRect(0, 0, canvas.width, canvas.height);

          context.lineCap = 'round';
          context.lineJoin = 'round';
          context.imageSmoothingEnabled = true;
          context.globalCompositeOperation = 'source-over';
          context.lineWidth = 3;
          context.strokeStyle = step === 5 ? '#ef4444' : '#1f2937'; // 5단계(요청)는 빨간펜 기본 아님
          
          if(canvasData[step]) {
            const img = new Image();
            img.src = canvasData[step];
            img.onload = () => context.drawImage(img, 0, 0, rect.width, rect.height);
          }
          
          ctxRef.current = context;
        }
      }
    };

    setTimeout(resizeCanvas, 50);
    window.addEventListener('resize', resizeCanvas);
    
    const preventTouch = (e: TouchEvent) => { if (e.target === canvas) e.preventDefault(); };
    canvas.addEventListener('touchstart', preventTouch, { passive: false });
    canvas.addEventListener('touchmove', preventTouch, { passive: false });
    canvas.addEventListener('touchend', preventTouch, { passive: false });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if(canvas) {
        canvas.removeEventListener('touchstart', preventTouch);
        canvas.removeEventListener('touchmove', preventTouch);
        canvas.removeEventListener('touchend', preventTouch);
      }
    };
  }, [step, isParentMode, showHistory]);

  useEffect(() => {
    if (!ctxRef.current) return;
    if (tool === 'eraser') {
      ctxRef.current.globalCompositeOperation = 'source-over';
      ctxRef.current.strokeStyle = 'white'; 
      ctxRef.current.lineWidth = 25;
    } else {
      ctxRef.current.globalCompositeOperation = 'source-over';
      ctxRef.current.lineWidth = 3;
      ctxRef.current.strokeStyle = step === 5 ? '#ef4444' : '#1f2937';
    }
  }, [tool, step]);

  const getPos = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };
  const startDrawing = (e: any) => {
    if (!ctxRef.current) return;
    isDrawing.current = true;
    const { x, y } = getPos(e);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
  };
  const draw = (e: any) => {
    if (!isDrawing.current || !ctxRef.current) return;
    if(e.cancelable && e.preventDefault) e.preventDefault(); 
    const { x, y } = getPos(e);
    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
  };
  const stopDrawing = () => {
    if (!ctxRef.current) return;
    isDrawing.current = false;
    ctxRef.current.closePath();
  };
  const clearCanvas = () => {
    if (!ctxRef.current || !canvasRef.current) return;
    ctxRef.current.fillStyle = 'white';
    ctxRef.current.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setCanvasData(prev => ({...prev, [step]: ''}));
  };

  const handleRefresh = () => {
    if (confirm('처음 화면으로 돌아가시겠습니까?')) window.location.href = window.location.pathname;
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const newPhotos = { ...photos, [id]: base64String };
        setPhotos(newPhotos);
        localStorage.setItem('runMathPhotos', JSON.stringify(newPhotos));
      };
      reader.readAsDataURL(file);
    }
  };

  const PhotoUploadBox = ({ id }: { id: string }) => (
    <label style={styles.photoBox} onClick={(e) => e.stopPropagation()}>
      {photos[id] ? (
        <img src={photos[id]!} alt="uploaded" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#999', fontSize: '12px' }}>
          <CameraIcon />
          <span style={{ marginTop: '4px' }}>사진 추가</span>
        </div>
      )}
      <input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e, id)} style={{ display: 'none' }} />
    </label>
  );

  const handleComplete = async () => {
    if(!confirm('상담을 완료하고 구글 시트에 저장하시겠습니까?')) return;
    
    saveCanvasState(); 
    setIsSaving(true);

    const payload = {
      name: studentInfo.name,
      school: studentInfo.school,
      plan: selectedPlan || '미선택',
      pPhone: contacts.parent,
      sPhone: contacts.student,
      request: parentData ? parentData.request : '', 
      time: scheduleInfo.time,
      book: scheduleInfo.book,
      // 1단계(학생정보)와 5단계(요청) 캔버스 이미지만 전송
      images: [canvasData[1], canvasRef.current?.toDataURL('image/png')]
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(payload)
      });
    } catch (e) {
      alert("인터넷 연결을 확인해주세요. (저장 실패)");
      setIsSaving(false);
      return;
    }

    const newRecord = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      name: studentInfo.name,
      school: studentInfo.school,
      plan: selectedPlan || '미선택',
      pPhone: contacts.parent
    };
    const updatedHistory = [newRecord, ...historyList];
    setHistoryList(updatedHistory);
    localStorage.setItem('runMathHistory', JSON.stringify(updatedHistory));

    setTimeout(() => {
      setIsSaving(false);
      setIsCompleted(true);
    }, 1000);
  };

  const handleNext = () => {
    saveCanvasState();
    setStep(step + 1);
  }

  const getParentUrl = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const params = new URLSearchParams({
      mode: 'parent',
      name: studentInfo.name,
      school: studentInfo.school,
      time: scheduleInfo.time || '상담 후 결정',
      book: scheduleInfo.book || '상담 후 결정',
      date: new Date().toLocaleDateString()
    });
    return `${baseUrl}${window.location.pathname}?${params.toString()}`;
  };

  const styles = {
    container: { maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: '"Noto Sans KR", sans-serif', color: '#333', paddingBottom: '120px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '15px', marginBottom: '30px', position: 'sticky' as 'sticky', top: 0, background: 'white', zIndex: 40, paddingTop: '10px' },
    title: { margin: 0, color: '#1e3a8a', fontSize: '22px', fontWeight: 'bold' },
    badge: { background: '#f3f4f6', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', color: '#666', marginRight: '10px' },
    card: { background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0', marginBottom: '20px' },
    input: { width: '100%', padding: '16px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '12px', marginBottom: '15px', background: '#f9fafb', outline: 'none', boxSizing: 'border-box' as 'border-box' },
    sectionTitle: (color: string) => ({ borderLeft: `5px solid ${color}`, paddingLeft: '15px', marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }),
    toolBtn: (isActive: boolean) => ({
      padding: '8px 16px', borderRadius: '10px', border: isActive ? '2px solid #2563eb' : '1px solid #ddd',
      cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' as 'bold', display: 'flex', alignItems: 'center', gap: '5px',
      background: isActive ? '#eff6ff' : 'white', color: isActive ? '#2563eb' : '#666', transition: '0.2s', userSelect: 'none' as 'none', WebkitUserSelect: 'none' as 'none'
    }),
    button: { padding: '12px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.2s', height: '50px', userSelect: 'none' as 'none' },
    canvasContainer: { 
      width: '100%', height: '400px', border: '2px dashed #ccc', borderRadius: '16px', 
      background: 'white', position: 'relative' as 'relative', overflow: 'hidden', 
      touchAction: 'none', userSelect: 'none' as 'none', WebkitUserSelect: 'none' as 'none', WebkitTouchCallout: 'none' as 'none'
    },
    gridCell: { flex: 1, borderRight: '1px solid #eee' },
    footer: { position: 'fixed' as 'fixed', bottom: 0, left: 0, right: 0, background: 'white', padding: '15px 20px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', boxShadow: '0 -4px 20px rgba(0,0,0,0.05)', zIndex: 50 },
    refreshBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#666', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px', userSelect: 'none' as 'none' },
    splitContainer: { display: 'flex', gap: '15px', marginTop: '20px' },
    splitCard: (borderColor: string, bg: string, isSelected: boolean) => ({ 
      flex: 1, padding: '25px', borderRadius: '16px', 
      border: isSelected ? `3px solid ${borderColor}` : `1px solid #eee`, 
      background: isSelected ? bg : 'white',
      opacity: (selectedPlan && !isSelected) ? 0.6 : 1, 
      display: 'flex', flexDirection: 'column' as 'column', alignItems: 'center', textAlign: 'center' as 'center',
      boxShadow: isSelected ? '0 10px 20px rgba(0,0,0,0.1)' : '0 4px 12px rgba(0,0,0,0.05)',
      cursor: 'pointer', transition: '0.2s'
    }),
    photoBox: {
      width: '100%', height: '100px', borderRadius: '10px', border: '2px dashed #ccc', 
      background: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', overflow: 'hidden', position: 'relative' as 'relative', transition: '0.2s'
    },
    exampleImg: {
        width: '100%', borderRadius: '10px', border: '1px solid #ddd', marginBottom: '10px'
    }
  };

  // === [화면 1] 학부모님용 모바일 명함 ===
  if (isParentMode && parentData) {
    return (
      <div style={{ maxWidth: '480px', margin: '0 auto', background: '#f8fafc', minHeight: '100vh', padding: '20px', fontFamily: '"Noto Sans KR", sans-serif' }}>
        <div style={{ background: 'white', padding: '30px 20px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', background: '#1e3a8a', borderRadius: '15px', margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px' }}>📚</div>
          <h1 style={{ color: '#1e3a8a', margin: '0 0 5px 0', fontSize: '24px' }}>런수학학원</h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>"포기하지 않으면, 수학은 반드시 재미있어집니다."</p>
          <div style={{ margin: '20px 0', height: '1px', background: '#eee' }}></div>
          
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: '18px', color: '#333', marginBottom: '15px' }}>📋 상담 결과 요약</h3>
            <div style={{ background: '#f1f5f9', padding: '15px', borderRadius: '12px', marginBottom: '10px' }}>
              <span style={{ color: '#64748b', fontSize: '12px' }}>학생 이름</span>
              <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}>{parentData.name} ({parentData.school})</div>
            </div>
            <div style={{ background: '#eff6ff', padding: '15px', borderRadius: '12px', border: '1px solid #bfdbfe', marginBottom: '10px' }}>
              <span style={{ color: '#2563eb', fontSize: '12px', fontWeight: 'bold' }}>희망 수업 시간</span>
              <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#1e3a8a', marginTop: '5px' }}>{parentData.time}</div>
            </div>
            <div style={{ background: '#fff7ed', padding: '15px', borderRadius: '12px', border: '1px solid #fed7aa' }}>
              <span style={{ color: '#ea580c', fontSize: '12px', fontWeight: 'bold' }}>사용 교재</span>
              <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#9a3412', marginTop: '5px' }}>{parentData.book}</div>
            </div>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '10px', textAlign: 'center' }}>상담일: {parentData.date}</p>
          </div>
        </div>
        <div style={{ marginTop: '20px' }}>
          <a href={`tel:${TEACHER_PHONE}`} style={{ display: 'block', textDecoration: 'none' }}>
            <div style={{ background: '#1e3a8a', color: 'white', padding: '15px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 4px 15px rgba(30, 58, 138, 0.3)' }}>
              <PhoneIcon />
              <span style={{ fontWeight: 'bold', fontSize: '16px' }}>선생님께 전화 걸기</span>
            </div>
          </a>
        </div>
      </div>
    );
  }

  // === [화면 2] 지난 기록 ===
  if (showHistory) {
    return (
      <div style={styles.container}>
         <div style={styles.header}>
            <h1 style={styles.title}>📂 지난 상담 기록</h1>
            <button onClick={() => setShowHistory(false)} style={styles.refreshBtn}>✕ 닫기</button>
         </div>
         {historyList.length === 0 ? (
           <div style={{ textAlign: 'center', padding: '50px 0', color: '#999' }}>저장된 상담 기록이 없습니다.</div>
         ) : (
           historyList.map((record) => (
             <div key={record.id} style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #eee', marginBottom: '15px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                 <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{record.name}</span>
                 <span style={{ fontSize: '14px', color: '#666' }}>{record.date}</span>
               </div>
               <div style={{ fontSize: '14px', color: '#555' }}>{record.school} | {record.plan}</div>
               {record.pPhone && <div style={{ fontSize: '14px', color: '#888', marginTop: '5px' }}>📞 {record.pPhone}</div>}
             </div>
           ))
         )}
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h1 style={styles.title}>런수학학원</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {!isCompleted && (
            <>
              <button onClick={() => setShowHistory(true)} style={styles.refreshBtn}>
                <HistoryIcon /> 기록
              </button>
              <span style={styles.badge}>{step} / 5 단계</span>
              <button onClick={handleRefresh} style={styles.refreshBtn}>
                <RefreshIcon /> 초기화
              </button>
            </>
          )}
        </div>
      </div>

      {isCompleted ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <div style={{ width: '80px', height: '80px', background: '#dcfce7', borderRadius: '50%', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckIcon />
          </div>
          <h2 style={{ fontSize: '28px', marginBottom: '10px', fontWeight: 'bold' }}>상담 저장 완료!</h2>
          <p style={{ color: '#666', marginBottom: '30px' }}>
            학부모님 핸드폰 카메라로<br/>아래 <strong>QR 코드</strong>를 보여주세요.
          </p>
          <div style={{ background: 'white', padding: '20px', borderRadius: '20px', border: '2px solid #2563eb', display: 'inline-block', boxShadow: '0 10px 30px rgba(37, 99, 235, 0.2)' }}>
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(getParentUrl())}`} alt="QR" style={{ width: '250px', height: '250px' }} />
            <p style={{marginTop: '15px', color: '#2563eb', fontSize: '16px', fontWeight: 'bold'}}>✨ 런수학 모바일 명함 전송</p>
          </div>
          <div style={{ marginTop: '30px', color: '#888', fontSize: '14px' }}>* 구글 시트 '상담대기' 탭에 저장되었습니다.<br/>(등록생 체크 시 자동 이동)</div>
          <br />
          <button onClick={() => window.location.reload()} style={{ ...styles.button, background: '#1f2937', color: 'white', marginTop: '40px', width: '100%', justifyContent: 'center' }}>새로운 상담 시작하기</button>
        </div>
      ) : (
        <>
          {/* === 1단계: 학생 정보 (필기) === */}
          {step === 1 && (
            <div>
              <h2 style={styles.sectionTitle('#1e3a8a')}>1. 학생 정보 입력</h2>
              <div style={styles.card}>
                <input type="text" placeholder="학생 이름" value={studentInfo.name} onChange={e => setStudentInfo({...studentInfo, name: e.target.value})} style={styles.input} />
                <input type="text" placeholder="학교 / 학년" value={studentInfo.school} onChange={e => setStudentInfo({...studentInfo, school: e.target.value})} style={styles.input} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', marginTop: '30px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#555', fontWeight: 'bold' }}>진도 및 실력 진단</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setTool('pen')} style={styles.toolBtn(tool === 'pen')}><PenIcon /> 펜</button>
                  <button onClick={() => setTool('eraser')} style={styles.toolBtn(tool === 'eraser')}><EraserIcon /> 지우개</button>
                  <button onClick={clearCanvas} style={{ ...styles.toolBtn(false), color: '#ef4444', borderColor: '#fee2e2' }}><TrashIcon /> 비우기</button>
                </div>
              </div>
              <div style={styles.canvasContainer}>
                <canvas ref={canvasRef} style={{ width: '100%', height: '100%', touchAction: 'none' }} 
                  onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing}
                />
              </div>
            </div>
          )}

          {/* === 2단계: 커리큘럼 === */}
          {step === 2 && (
            <div>
              <h2 style={styles.sectionTitle('#f97316')}>2. 런수학 수업 시스템 선택</h2>
              <div style={styles.splitContainer}>
                <div style={styles.splitCard('#2563eb', '#eff6ff', selectedPlan === '소수 정예반')} onClick={() => setSelectedPlan('소수 정예반')}>
                  <div style={{ marginBottom: '15px' }}><GroupIcon /></div>
                  <h3 style={{ margin: '0 0 10px 0', color: '#1e3a8a', fontSize: '20px', fontWeight: 'bold' }}>소수 정예반</h3>
                  <div style={{ background: 'white', padding: '5px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', color: '#2563eb', marginBottom: '15px', border: '1px solid #bfdbfe' }}>최대 6명 제한</div>
                  <ul style={{ textAlign: 'left', paddingLeft: '20px', margin: 0, lineHeight: '1.6', color: '#4b5563', fontSize: '14px', marginBottom: '20px' }}>
                    <li><strong>1:1 과외식 밀착 지도</strong></li>
                    <li><strong>개별 맞춤 진도 및 교재</strong></li>
                    <li><strong>철저한 오답 및 학습 관리</strong></li>
                  </ul>
                  <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: 'auto' }}>
                    <PhotoUploadBox id="small1" />
                    <PhotoUploadBox id="small2" />
                  </div>
                </div>
                <div style={styles.splitCard('#ea580c', '#fff7ed', selectedPlan === '30-10-7 루프반')} onClick={() => setSelectedPlan('30-10-7 루프반')}>
                  <div style={{ marginBottom: '15px' }}><LoopIcon /></div>
                  <h3 style={{ margin: '0 0 10px 0', color: '#9a3412', fontSize: '20px', fontWeight: 'bold' }}>30-10-7 루프반</h3>
                  <div style={{ background: 'white', padding: '5px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', color: '#ea580c', marginBottom: '15px', border: '1px solid #fed7aa' }}>몰입 학습 시스템</div>
                  <ul style={{ textAlign: 'left', paddingLeft: '20px', margin: 0, lineHeight: '1.6', color: '#4b5563', fontSize: '14px', marginBottom: '20px' }}>
                    <li><strong>30분: 숙제 점검/오답 질문</strong></li>
                    <li><strong>10분: 핵심 개념 강의</strong></li>
                    <li><strong>7분: 당일 개념 테스트</strong></li>
                    <li style={{ color: '#ea580c', fontWeight: 'bold', marginTop: '5px' }}>🔄 (10분+7분) 무한 반복</li>
                  </ul>
                  <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: 'auto' }}>
                    <PhotoUploadBox id="loop1" />
                    <PhotoUploadBox id="loop2" />
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '40px' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#333', fontSize: '18px', fontWeight: 'bold', borderLeft:'4px solid #333', paddingLeft:'10px' }}>🖥️ 런수학 온라인 시스템 체험</h3>
                <div style={{ width: '100%', height: '500px', borderRadius: '16px', border: '4px solid #333', background: 'black', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', position: 'relative' }}>
                  <iframe src="https://script.google.com/macros/s/AKfycbyy4vL-1KwNGwTb_ZD7P28eLjKR4gN_E6ShGCS3eoKGhEjGGNZkrf-YXkitzwc1UBkN/exec" style={{ width: '100%', height: '100%', border: 'none' }} title="Run Math Video System" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation-by-user-activation" allowFullScreen />
                  <div style={{ position: 'absolute', bottom: '0', width: '100%', background: 'rgba(0,0,0,0.7)', color: 'white', textAlign: 'center', padding: '8px', fontSize: '12px' }}>* 실제 학원생들이 사용하는 학습 사이트입니다.</div>
                </div>
              </div>
            </div>
          )}

          {/* === [NEW] 3단계: 피드백 & 관리 시스템 === */}
          {step === 3 && (
            <div>
              <h2 style={styles.sectionTitle('#e11d48')}>3. 피드백 및 관리 시스템</h2>
              
              {/* 섹션 1: 꼼꼼한 피드백 */}
              <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                  <FeedbackIcon />
                  <h3 style={{ margin: 0, fontSize: '20px', color: '#be123c', fontWeight: 'bold' }}>1:1 맞춤 피드백 예시</h3>
                </div>
                <p style={{ color: '#666', marginBottom: '15px' }}>실제 학생들에게 제공되는 분석 리포트입니다.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <img src="https://docs.google.com/presentation/d/10vbMBLOfwkY6BT7ZuJ7qTvGFnomNVYFTcnisFMBYrBA/export/png" alt="피드백1" style={styles.exampleImg} />
                  <img src="https://docs.google.com/presentation/d/1lFHrfh4v2_AP3DcyL1bbGN3K2_XjDROVQn57hqPbyPI/export/png" alt="피드백2" style={styles.exampleImg} />
                  <img src="https://docs.google.com/presentation/d/1JLxDtRDUytNH0CN68JO6TG8OynpjESLhplZ0D9ZCs9Q/export/png" alt="피드백3" style={styles.exampleImg} />
                  <img src="https://docs.google.com/presentation/d/1Z20RF-B4FAz-0V5aoGbO9Y9I4L-8PCdVNuC_9Ay4L3A/export/png" alt="피드백4" style={styles.exampleImg} />
                </div>
              </div>

              {/* 섹션 2: 망각 방지 시스템 */}
              <div style={{ background: '#fff1f2', padding: '25px', borderRadius: '16px', border: '2px solid #fda4af' }}>
                <h3 style={{ margin: '0 0 15px 0', fontSize: '20px', color: '#9f1239', fontWeight: 'bold' }}>🧠 과학적 망각 방지 시스템</h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', padding: '0 10px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '30px', marginBottom: '5px' }}>📚</div>
                    <div style={{ fontWeight: 'bold', color: '#be123c' }}>학습 당일</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>개념+테스트</div>
                  </div>
                  <div style={{ fontSize: '20px', color: '#fb7185' }}>➜</div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '30px', marginBottom: '5px' }}>⏰</div>
                    <div style={{ fontWeight: 'bold', color: '#be123c' }}>5일 후</div>
                    <div style={{ fontSize: '12px', color: '#e11d48', fontWeight: 'bold' }}>1차 복습 Check</div>
                  </div>
                  <div style={{ fontSize: '20px', color: '#fb7185' }}>➜</div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '30px', marginBottom: '5px' }}>🔥</div>
                    <div style={{ fontWeight: 'bold', color: '#be123c' }}>12일 후</div>
                    <div style={{ fontSize: '12px', color: '#e11d48', fontWeight: 'bold' }}>2차 복습 Check</div>
                  </div>
                </div>
                <p style={{ textAlign: 'center', color: '#be123c', fontWeight: 'bold', margin: 0 }}>
                  "동영상 시스템이 자동으로 복습 시기를 알려줍니다."
                </p>
              </div>
            </div>
          )}

          {/* === 4단계: 시간표 및 교재 === */}
          {step === 4 && (
            <div>
              <h2 style={styles.sectionTitle('#22c55e')}>4. 수업 시간 및 교재 설정</h2>
              <div style={{ ...styles.card, marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#555' }}>🕒 수업 일정 및 교재</h3>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontSize: '13px', color: '#888', marginBottom: '5px' }}>희망 요일 및 시간 (예: 월수금 5시)</label>
                  <input type="text" placeholder="수업 요일과 시간을 적어주세요" value={scheduleInfo.time} onChange={e => setScheduleInfo({...scheduleInfo, time: e.target.value})} style={{ ...styles.input, marginBottom: 0 }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#888', marginBottom: '5px' }}>사용 교재 (예: 개념원리, 쎈)</label>
                  <input type="text" placeholder="사용할 교재명을 적어주세요" value={scheduleInfo.book} onChange={e => setScheduleInfo({...scheduleInfo, book: e.target.value})} style={{ ...styles.input, marginBottom: 0 }} />
                </div>
              </div>
            </div>
          )}

          {/* === 5단계: 요청사항 (필기) === */}
          {step === 5 && (
            <div>
              <h2 style={styles.sectionTitle('#8b5cf6')}>5. 학부모님 요청사항</h2>
              <div style={{ ...styles.card, marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#555' }}>📞 연락처 정보</h3>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '13px', color: '#888', marginBottom: '5px' }}>학부모 전화번호</label>
                    <input type="tel" placeholder="010-0000-0000" value={contacts.parent} onChange={e => setContacts({...contacts, parent: e.target.value})} style={{ ...styles.input, marginBottom: 0 }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '13px', color: '#888', marginBottom: '5px' }}>학생 전화번호</label>
                    <input type="tel" placeholder="010-0000-0000" value={contacts.student} onChange={e => setContacts({...contacts, student: e.target.value})} style={{ ...styles.input, marginBottom: 0 }} />
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '14px', color: '#666' }}>상담 내용 메모</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setTool('pen')} style={styles.toolBtn(tool === 'pen')}><PenIcon /> 펜</button>
                  <button onClick={() => setTool('eraser')} style={styles.toolBtn(tool === 'eraser')}><EraserIcon /> 지우개</button>
                  <button onClick={clearCanvas} style={{ ...styles.toolBtn(false), color: '#ef4444', borderColor: '#fee2e2' }}><TrashIcon /> 비우기</button>
                </div>
              </div>
              <div style={styles.canvasContainer}>
                <canvas ref={canvasRef} style={{ width: '100%', height: '100%', touchAction: 'none' }} 
                  onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing}
                />
              </div>
              <div style={{ marginTop: '20px', background: '#fffbeb', padding: '20px', borderRadius: '16px', border: '1px solid #fcd34d', display: 'flex', gap: '15px' }}>
                <span style={{ fontSize: '24px' }}>💡</span>
                <div>
                  <h4 style={{ margin: '0 0 5px 0', color: '#92400e', fontWeight: 'bold' }}>상담 체크리스트</h4>
                  <p style={{ margin: 0, color: '#b45309', fontSize: '14px' }}>차량 운행 여부 안내 / 수강료 결제일 안내 / 교재비 안내</p>
                </div>
              </div>
            </div>
          )}

          {/* 하단 버튼바 */}
          <div style={styles.footer}>
             <button onClick={() => setStep(step - 1)} style={{ ...styles.button, background: '#f3f4f6', color: '#666', visibility: step === 1 ? 'hidden' : 'visible' }}><ChevronLeftIcon /> 이전</button>
             {step < 5 ? (
               <button onClick={handleNext} style={{ ...styles.button, background: '#2563eb', color: 'white' }}>{step === 4 ? '다음: 마무리' : '다음 단계'} <ChevronRightIcon /></button>
             ) : (
               <button onClick={handleComplete} disabled={isSaving} style={{ ...styles.button, background: isSaving ? '#9ca3af' : '#16a34a', color: 'white' }}>{isSaving ? '저장 중...' : <><CheckIcon /> 상담 완료</>}</button>
             )}
          </div>
        </>
      )}
    </div>
  );
}