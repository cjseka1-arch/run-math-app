'use client';

import React, { useRef, useState, useEffect } from 'react';

// ★★★ 구글 스크립트 주소 ★★★
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzUHmRX9QOKYd3wzknAP0m4WK0x61ZZMnmO6V1wRtmRoRQYBzKbUPT8IS5ejuCJs4xH/exec"; 

// ★★★ 선생님 전화번호 ★★★
const TEACHER_PHONE = "01076501239";

// ★★★ [새 사진 4장] Imgur 이미지 주소 (무조건 이거부터 나옴) ★★★
const DRIVE_IMAGES = [
  "https://i.imgur.com/XZ5GcQX.jpeg", // 사진 1
  "https://i.imgur.com/JDag5r6.jpeg", // 사진 2
  "https://i.imgur.com/gzo6Yw2.jpeg", // 사진 3
  "https://i.imgur.com/bmk6FJE.jpeg"  // 사진 4
];

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
const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
const BookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const UserPlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>;

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
          division: params.get('division'),
          time: params.get('time'),
          book: params.get('book'),
          date: params.get('date')
        });
      }
    }
  }, []);

  const [step, setStep] = useState(1);
  const [studentInfo, setStudentInfo] = useState({ name: '', school: '' });
  const [division, setDivision] = useState(''); 
  const [contacts, setContacts] = useState({ parent: '', student: '' });
  const [selectedPlan, setSelectedPlan] = useState(''); 
  const [scheduleInfo, setScheduleInfo] = useState({ time: '', book: '' });
  
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSaving, setIsSaving] = useState(false); 
  const [showHistory, setShowHistory] = useState(false); 
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [canvasData, setCanvasData] = useState<{ [key: number]: string }>({});

  const [photos, setPhotos] = useState<{ [key: string]: string | null }>({
    small1: DRIVE_IMAGES[0], small2: DRIVE_IMAGES[1], 
    loop1: DRIVE_IMAGES[2], loop2: DRIVE_IMAGES[3],
    elem1: DRIVE_IMAGES[0], elem2: DRIVE_IMAGES[1], elem3: DRIVE_IMAGES[2], elem4: DRIVE_IMAGES[3],
    mid1: DRIVE_IMAGES[0], mid2: DRIVE_IMAGES[1], mid3: DRIVE_IMAGES[2], mid4: DRIVE_IMAGES[3]
  });

  useEffect(() => {
    try {
      // ★★★ [중요] 저장소 키를 'runMathPhotos_v2'로 변경하여 기존 캐시 무시하고 새 사진 강제 로드 ★★★
      const savedPhotos = localStorage.getItem('runMathPhotos_v2');
      if (savedPhotos) setPhotos(JSON.parse(savedPhotos));
      
      const savedHistory = localStorage.getItem('runMathHistory');
      if (savedHistory) setHistoryList(JSON.parse(savedHistory));
    } catch (e) {
      console.error("로컬 스토리지 로드 실패", e);
    }
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
    if (step === 2 || step === 3 || step === 4 || step === 5 || isParentMode || showHistory) return; 

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
          context.strokeStyle = step === 6 ? '#ef4444' : '#1f2937'; 
          
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
      ctxRef.current.strokeStyle = step === 6 ? '#ef4444' : '#1f2937';
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

  const compressImage = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const maxWidth = 300; 
        const scaleSize = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scaleSize;

        if (ctx) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', 0.4)); 
        } else {
            resolve(img.src);
        }
      };
    });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file);
        setPhotos(prev => {
            const updated = { ...prev, [id]: compressedBase64 };
            try {
                // ★★★ [중요] 저장소 키 변경됨 (v2) ★★★
                localStorage.setItem('runMathPhotos_v2', JSON.stringify(updated));
            } catch(e) {
                console.log('Storage Full');
            }
            return updated;
        });
      } catch (err) {
        alert("사진 처리 중 오류가 발생했습니다.");
      }
    }
  };

  // ★★★ [아이패드 보안 차단 방지 적용] ★★★
  const PhotoUploadBox = ({ id }: { id: string }) => (
    <label style={styles.photoBox} onClick={(e) => e.stopPropagation()}>
      {photos[id] ? (
        <img 
            src={photos[id]!} 
            alt="Img" 
            referrerPolicy="no-referrer" // ★ Imgur 차단 방지 핵심
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none'; // 에러나면 숨김
            }}
        /> 
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#999', fontSize: '10px' }}>
          <CameraIcon />
          <span style={{ marginTop: '2px' }}>+</span>
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
      school: `[${division}] ${studentInfo.school}`, 
      plan: selectedPlan || '미선택',
      pPhone: contacts.parent,
      sPhone: contacts.student,
      request: parentData ? parentData.request : '', 
      time: scheduleInfo.time,
      book: scheduleInfo.book,
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
    if (step === 2) {
      if (division === '고등부' && selectedPlan === '30-10-7 루프반') {
        setStep(3); 
      } else {
        setStep(4); 
      }
    } else if (step === 3) {
       setStep(4);
    } else {
       setStep(step + 1);
    }
  }

  const handleBack = () => {
    if (step === 4) {
      if (division === '고등부' && selectedPlan === '30-10-7 루프반') {
        setStep(3);
      } else {
        setStep(2);
      }
    } else {
      setStep(step - 1);
    }
  }

  const handleDivisionSelect = (div: string) => {
    setDivision(div);
    setStep(2); 
  }

  const getParentUrl = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const params = new URLSearchParams({
      mode: 'parent',
      name: studentInfo.name,
      school: studentInfo.school,
      division: division, 
      time: scheduleInfo.time || '상담 후 결정',
      book: scheduleInfo.book || '상담 후 결정',
      date: new Date().toLocaleDateString()
    });
    return `${baseUrl}${window.location.pathname}?${params.toString()}`;
  };

  const handleSaveContact = () => {
    const vcardContent = `BEGIN:VCARD
VERSION:3.0
FN:런수학학원
TEL;TYPE=CELL:${TEACHER_PHONE}
END:VCARD`;
    const blob = new Blob([vcardContent], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "런수학학원.vcf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveConsultation = () => {
    window.print(); 
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
      flex: 1, // ★ 한 줄에서 균등 분할
      height: '80px', // 높이를 살짝 줄여서 한줄에 4개 들어갈 때 비율 조정
      borderRadius: '8px', border: '2px dashed #ccc', 
      background: '#f8f9fa', 
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', overflow: 'hidden', position: 'relative' as 'relative', transition: '0.2s',
      minWidth: '50px' // 너무 작아지지 않게 최소 폭 설정
    },
    exampleImg: { width: '100%', borderRadius: '10px', border: '1px solid #ddd', marginBottom: '10px' },
    divBtn: (color: string, bg: string) => ({
      width: '100%', padding: '20px', borderRadius: '15px', border: `2px solid ${color}`, background: bg,
      fontSize: '20px', fontWeight: 'bold', color: color, cursor: 'pointer', marginBottom: '15px',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: '0.2s'
    }),
    loopStep: {
      background: 'white', padding: '15px', borderRadius: '12px', border: '1px solid #e5e7eb',
      display: 'flex', flexDirection: 'column' as 'column', alignItems: 'center', justifyContent: 'center',
      textAlign: 'center' as 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', position: 'relative' as 'relative', zIndex: 1
    }
  };

  // === [화면 1] 학부모님용 모바일 명함 ===
  if (isParentMode && parentData) {
    return (
      <div style={{ maxWidth: '480px', margin: '0 auto', background: '#f8fafc', minHeight: '100vh', padding: '20px', fontFamily: '"Noto Sans KR", sans-serif' }}>
        <div style={{ background: 'white', padding: '30px 20px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', textAlign: 'center' }}>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <img src="/logo.png" alt="런수학학원" style={{ display: 'block', maxWidth: '250px', width: '80%', height: 'auto' }} />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '25px' }}>
            <a href={`tel:${TEACHER_PHONE}`} style={{ textDecoration: 'none', flex: 1 }}>
                <div style={{ background: '#1e3a8a', color: 'white', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '14px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(30, 58, 138, 0.2)' }}>
                <PhoneIcon /> 전화 걸기
                </div>
            </a>
            <button onClick={handleSaveContact} style={{ flex: 1, border: 'none', background: '#2563eb', color: 'white', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '14px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(37, 99, 235, 0.2)', cursor: 'pointer' }}>
                <UserPlusIcon /> 연락처 저장
            </button>
          </div>

          <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>"포기하지 않으면, 수학은 반드시 재미있어집니다."</p>
          <div style={{ margin: '20px 0', height: '1px', background: '#eee' }}></div>
          
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: '18px', color: '#333', marginBottom: '15px' }}>📋 상담 결과 요약</h3>
            <div style={{ background: '#f1f5f9', padding: '15px', borderRadius: '12px', marginBottom: '10px' }}>
              <span style={{ color: '#64748b', fontSize: '12px' }}>학생 이름</span>
              <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}>{parentData.name} ({parentData.school})</div>
            </div>
            {parentData.division && (
               <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                 <span style={{ background: '#333', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '12px' }}>{parentData.division}</span>
               </div>
            )}
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
          <button onClick={handleSaveConsultation} style={{ width: '100%', border: 'none', background: '#475569', color: 'white', padding: '15px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
             <DownloadIcon /> 상담 내용 저장하기 (PDF)
          </button>
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
              <span style={styles.badge}>{step} 단계</span>
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
          {/* === 1단계: 학생 정보 + 과정 선택 === */}
          {step === 1 && (
            <div>
              <h2 style={styles.sectionTitle('#1e3a8a')}>1. 학생 정보 및 과정 선택</h2>
              
              <div style={styles.card}>
                <input type="text" placeholder="학생 이름" value={studentInfo.name} onChange={e => setStudentInfo({...studentInfo, name: e.target.value})} style={styles.input} />
                <input type="text" placeholder="학교 / 학년" value={studentInfo.school} onChange={e => setStudentInfo({...studentInfo, school: e.target.value})} style={styles.input} />
              </div>

              <div style={{ marginTop: '30px' }}>
                <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', color: '#555', fontWeight: 'bold' }}>과정을 선택하세요</h3>
                
                <button onClick={() => handleDivisionSelect('초등부')} style={styles.divBtn('#f59e0b', '#fffbeb')}>
                  <StarIcon /> 초등부 (기초 완성)
                </button>
                <button onClick={() => handleDivisionSelect('중등부')} style={styles.divBtn('#10b981', '#ecfdf5')}>
                  <BookIcon /> 중등부 (내신/선행)
                </button>
                <button onClick={() => handleDivisionSelect('고등부')} style={styles.divBtn('#2563eb', '#eff6ff')}>
                  <GroupIcon /> 고등부 (입시 전문)
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', marginTop: '40px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#555', fontWeight: 'bold' }}>초기 진단 (필기)</h3>
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

          {/* === 2단계: 프로그램 선택/설명 === */}
          {step === 2 && (
            <div>
              <h2 style={styles.sectionTitle('#f97316')}>
                2. {division} 맞춤 프로그램
              </h2>

              {/* [고등부] 분리된 화면 1: 반 선택만 표시 */}
              {division === '고등부' && (
                <div>
                  <div style={styles.splitContainer}>
                    {/* 소수 정예반 카드 */}
                    <div style={styles.splitCard('#2563eb', '#eff6ff', selectedPlan === '소수 정예반')} onClick={() => setSelectedPlan('소수 정예반')}>
                      <div style={{ marginBottom: '15px' }}><GroupIcon /></div>
                      <h3 style={{ margin: '0 0 10px 0', color: '#1e3a8a', fontSize: '20px', fontWeight: 'bold' }}>소수 정예반</h3>
                      <div style={{ background: 'white', padding: '5px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', color: '#2563eb', marginBottom: '15px', border: '1px solid #bfdbfe' }}>최대 6명 제한</div>
                      <ul style={{ textAlign: 'left', paddingLeft: '20px', margin: 0, lineHeight: '1.6', color: '#4b5563', fontSize: '14px', marginBottom: '20px' }}>
                        <li><strong>1:1 과외식 밀착 지도</strong></li>
                        <li><strong>개별 맞춤 진도 및 교재</strong></li>
                        <li><strong>철저한 오답 및 학습 관리</strong></li>
                      </ul>
                      {/* ★ 고등부 소수정예 사진 2장 */}
                      <div style={{ display: 'flex', gap: '5px', width: '100%', marginTop: 'auto' }}>
                        <PhotoUploadBox id="small1" />
                        <PhotoUploadBox id="small2" />
                      </div>
                    </div>

                    {/* 루프반 카드 */}
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
                      {/* ★ 고등부 루프반 사진 2장 */}
                      <div style={{ display: 'flex', gap: '5px', width: '100%', marginTop: 'auto' }}>
                        <PhotoUploadBox id="loop1" />
                        <PhotoUploadBox id="loop2" />
                      </div>
                    </div>
                  </div>
                  {selectedPlan === '30-10-7 루프반' && (
                     <div style={{ marginTop: '20px', textAlign: 'center', color: '#ea580c', fontWeight: 'bold', animation: 'fadeIn 0.5s' }}>
                       👇 '다음' 버튼을 누르면 루프반 상세 안내로 이어집니다.
                     </div>
                  )}
                </div>
              )}

              {/* [초등부] */}
              {division === '초등부' && (
                <div style={{ textAlign: 'left', padding: '10px' }}>
                  <div style={{ background: '#fffbeb', border: '2px solid #fcd34d', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
                    <h3 style={{ margin: '0 0 15px 0', fontSize: '20px', color: '#92400e', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <StarIcon /> 1:5 듀얼 케어 시스템
                    </h3>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', background: 'white', padding: '15px', borderRadius: '12px', border: '1px solid #fae8ff' }}>
                      <div style={{ flex: 1, textAlign: 'center', borderRight: '1px solid #eee' }}>
                        <div style={{ fontSize: '24px', marginBottom: '5px' }}>👨‍🏫</div>
                        <div style={{ fontWeight: 'bold', color: '#333' }}>메인 선생님</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>핵심 개념 설명</div>
                      </div>
                      <div style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', marginBottom: '5px' }}>👩‍🏫</div>
                        <div style={{ fontWeight: 'bold', color: '#333' }}>밀착 튜터링</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>풀이/채점 (1:5)</div>
                      </div>
                    </div>
                    {/* ★ 초등부 사진 4장 한줄 배치 */}
                    <div style={{ display: 'flex', gap: '5px', marginTop: '15px' }}>
                      <PhotoUploadBox id="elem1" />
                      <PhotoUploadBox id="elem2" />
                      <PhotoUploadBox id="elem3" />
                      <PhotoUploadBox id="elem4" />
                    </div>
                  </div>
                  <div style={{ marginBottom: '25px' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#333', fontWeight: 'bold' }}>📚 수준별 맞춤 교재 (디딤돌)</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {['기본', '기본+응용', '응용', '최상위S', '최상위'].map((book, idx) => (
                        <div key={book} style={{ 
                          background: idx >= 3 ? '#fff1f2' : '#f0f9ff', 
                          border: idx >= 3 ? '1px solid #fda4af' : '1px solid #bae6fd',
                          padding: '10px 15px', borderRadius: '10px', 
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          fontSize: '14px', fontWeight: 'bold', color: '#444'
                        }}>
                          <span>Step {idx + 1}. {book}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', color: '#334155', fontWeight: 'bold' }}>📝 학습 관리 루틴</h3>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#475569', lineHeight: '1.8' }}>
                      <li><strong>과제량:</strong> 기본 1장 (학부모님 요청 시 조절 가능)</li>
                      <li><strong>완북 기간:</strong> 한 권당 약 2개월 소요</li>
                      <li><strong>진급 기준:</strong> 성취도 평가(시험) 후 다음 단계 결정</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* [중등부] */}
              {division === '중등부' && (
                <div style={{ textAlign: 'left', padding: '10px' }}>
                  <div style={{ marginBottom: '30px' }}>
                    <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', color: '#333', fontWeight: 'bold', borderLeft:'4px solid #10b981', paddingLeft:'10px' }}>📚 개인별 맞춤 교재</h3>
                    <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                      <div style={{ background: '#f0fdf4', padding: '15px', borderRadius: '12px', border: '1px solid #86efac', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ background: '#10b981', color: 'white', padding: '5px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>기본</div>
                        <div>
                          <div style={{ fontWeight: 'bold', color: '#166534' }}>개념원리(올리드) + 쎈B</div>
                          <div style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>탄탄한 개념과 유형 학습</div>
                        </div>
                      </div>
                      <div style={{ background: '#fff7ed', padding: '15px', borderRadius: '12px', border: '1px solid #fdba74', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ background: '#f97316', color: 'white', padding: '5px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>심화</div>
                        <div>
                          <div style={{ fontWeight: 'bold', color: '#9a3412' }}>일품 / 블랙라벨 / A급</div>
                          <div style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>학생 성취도별 선택 심화</div>
                        </div>
                      </div>
                      <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '12px', fontSize: '13px', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>🚧</span>
                        <span><b>전 학년 개념 구멍 발생 시</b> 즉시 해당 파트 보강 후 진도 복귀</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '30px' }}>
                    <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', color: '#333', fontWeight: 'bold', borderLeft:'4px solid #2563eb', paddingLeft:'10px' }}>👨‍🏫 1:6 소수 정예 튜터링</h3>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'stretch', height: '100px' }}>
                      <div style={{ flex: 1, background: '#eff6ff', borderRadius: '12px', border: '1px solid #bfdbfe', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
                         <div style={{ fontSize: '20px', marginBottom: '5px' }}>👨‍🏫</div>
                         <div style={{ fontWeight: 'bold', color: '#1e3a8a', fontSize: '14px' }}>Main 선생님</div>
                         <div style={{ fontSize: '11px', color: '#64748b', textAlign: 'center' }}>개념 설명 & 진도 관리</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', color: '#94a3b8' }}>➜</div>
                      <div style={{ flex: 1, background: '#fffbeb', borderRadius: '12px', border: '1px solid #fcd34d', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
                         <div style={{ fontSize: '20px', marginBottom: '5px' }}>📝</div>
                         <div style={{ fontWeight: 'bold', color: '#b45309', fontSize: '14px' }}>튜터링 (1:6)</div>
                         <div style={{ fontSize: '11px', color: '#78350f', textAlign: 'center' }}>채점, 풀이, 오답 정리</div>
                      </div>
                    </div>
                    {/* ★ 중등부 사진 4장 한줄 배치 */}
                    <div style={{ display: 'flex', gap: '5px', marginTop: '15px' }}>
                      <PhotoUploadBox id="mid1" />
                      <PhotoUploadBox id="mid2" />
                      <PhotoUploadBox id="mid3" />
                      <PhotoUploadBox id="mid4" />
                    </div>
                  </div>

                  <div style={{ background: '#fafafa', padding: '20px', borderRadius: '16px', border: '1px solid #e5e5e5' }}>
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#333', fontWeight: 'bold', textAlign: 'center' }}>🔄 시험대비 '무한 루프' (3~4주)</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', position: 'relative' }}>
                      <div style={styles.loopStep}><span style={{ fontSize: '12px', color: '#2563eb', fontWeight: 'bold' }}>STEP 1</span><div style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '5px' }}>개인별 시험지</div></div>
                      <div style={styles.loopStep}><span style={{ fontSize: '12px', color: '#ca8a04', fontWeight: 'bold' }}>STEP 2</span><div style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '5px' }}>40분 실전 Check</div></div>
                      <div style={styles.loopStep}><span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 'bold' }}>STEP 3</span><div style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '5px' }}>채점 및 피드백</div></div>
                      <div style={{ ...styles.loopStep, border: '2px solid #ef4444', background: '#fef2f2' }}><span style={{ fontSize: '12px', color: '#dc2626', fontWeight: 'bold' }}>STEP 4</span><div style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '5px' }}>오답 & 재시험</div></div>
                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '5px 10px', borderRadius: '20px', border: '1px solid #ddd', fontSize: '12px', fontWeight: 'bold', color: '#ef4444', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>↻ 반복</div>
                    </div>
                    <p style={{ textAlign: 'center', fontSize: '13px', color: '#666', marginTop: '15px' }}>* 틀린 문제는 유사 문제로 변형되어 완벽히 이해할 때까지 평균 2회 이상 반복합니다.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* === 3단계 (조건부): 고등부 루프반 상세 설명 === */}
          {step === 3 && (
            <div>
              <h2 style={styles.sectionTitle('#ea580c')}>
                3. 루프반 상세 시스템
              </h2>
              
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#333', fontSize: '18px', fontWeight: 'bold', borderLeft:'4px solid #333', paddingLeft:'10px' }}>🖥️ 런수학 온라인 시스템</h3>
                <p style={{ color: '#666', marginBottom: '15px', fontSize: '14px' }}>
                  학원 자체 온라인 시스템을 통해<br/>
                  모든 학습 이력이 데이터로 기록됩니다.
                </p>
                <div style={{ width: '100%', height: '500px', borderRadius: '16px', border: '4px solid #333', background: 'black', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', position: 'relative' }}>
                  <iframe src="https://script.google.com/macros/s/AKfycbyy4vL-1KwNGwTb_ZD7P28eLjKR4gN_E6ShGCS3eoKGhEjGGNZkrf-YXkitzwc1UBkN/exec" style={{ width: '100%', height: '100%', border: 'none' }} title="Run Math Video System" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation-by-user-activation" allowFullScreen />
                </div>
              </div>
              
              <div style={{ background: '#fff1f2', padding: '15px', borderRadius: '16px', border: '2px solid #fda4af' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#9f1239', fontWeight: 'bold' }}>🧠 망각 방지 루틴</h3>
                <div style={{ marginBottom: '15px', fontSize: '13px', color: '#881337', lineHeight: '1.4' }}>
                   인간은 학습 1시간 후 50%를 망각합니다.<br/>
                   런수학은 과학적인 3단계 복습 주기를 설계했습니다.
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: 'white', borderRadius: '12px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', marginBottom: '5px' }}>1️⃣</div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>당일</div>
                  </div>
                  <div style={{ color: '#ccc' }}>➜</div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', marginBottom: '5px' }}>2️⃣</div>
                    <div style={{ fontWeight: 'bold', color: '#be123c', fontSize: '14px' }}>5일 후</div>
                  </div>
                  <div style={{ color: '#ccc' }}>➜</div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', marginBottom: '5px' }}>3️⃣</div>
                    <div style={{ fontWeight: 'bold', color: '#be123c', fontSize: '14px' }}>12일 후</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* === 4단계: 피드백 & 관리 시스템 (모든 학년 공통) === */}
          {step === 4 && (
            <div>
              <h2 style={styles.sectionTitle('#e11d48')}>
                {division === '고등부' && selectedPlan === '30-10-7 루프반' ? '4.' : '3.'} 피드백 및 관리
              </h2>
              
              <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                  <FeedbackIcon />
                  <h3 style={{ margin: 0, fontSize: '20px', color: '#be123c', fontWeight: 'bold' }}>1:1 맞춤 피드백</h3>
                </div>
                <p style={{ color: '#666', marginBottom: '15px' }}>
                  학생들에게 실제로 제공되는<br/>꼼꼼한 분석 리포트입니다.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {/* ★★★ [수정] 피드백 예시 이미지도 차단 방지 적용 ★★★ */}
                  <img src="https://docs.google.com/presentation/d/10vbMBLOfwkY6BT7ZuJ7qTvGFnomNVYFTcnisFMBYrBA/export/png" alt="피드백1" style={styles.exampleImg} referrerPolicy="no-referrer" />
                  <img src="https://docs.google.com/presentation/d/1lFHrfh4v2_AP3DcyL1bbGN3K2_XjDROVQn57hqPbyPI/export/png" alt="피드백2" style={styles.exampleImg} referrerPolicy="no-referrer" />
                  <img src="https://docs.google.com/presentation/d/1JLxDtRDUytNH0CN68JO6TG8OynpjESLhplZ0D9ZCs9Q/export/png" alt="피드백3" style={styles.exampleImg} referrerPolicy="no-referrer" />
                  <img src="https://docs.google.com/presentation/d/1Z20RF-B4FAz-0V5aoGbO9Y9I4L-8PCdVNuC_9Ay4L3A/export/png" alt="피드백4" style={styles.exampleImg} referrerPolicy="no-referrer" />
                </div>
              </div>
            </div>
          )}

          {/* === 5단계: 시간표 및 교재 (공통) === */}
          {step === 5 && (
            <div>
              <h2 style={styles.sectionTitle('#22c55e')}>
                {division === '고등부' && selectedPlan === '30-10-7 루프반' ? '5.' : '4.'} 수업 시간 및 교재
              </h2>
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

          {/* === 6단계: 요청사항 (공통) === */}
          {step === 6 && (
            <div>
              <h2 style={styles.sectionTitle('#8b5cf6')}>
                {division === '고등부' && selectedPlan === '30-10-7 루프반' ? '6.' : '5.'} 학부모님 요청사항
              </h2>
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
                  <p style={{ margin: 0, color: '#b45309', fontSize: '14px' }}>수강료 결제일 안내</p>
                </div>
              </div>
            </div>
          )}

          {/* 하단 버튼바 */}
          <div style={styles.footer}>
             <button onClick={handleBack} style={{ ...styles.button, background: '#f3f4f6', color: '#666', visibility: step === 1 ? 'hidden' : 'visible' }}><ChevronLeftIcon /> 이전</button>
             {step < 6 ? (
               <button onClick={handleNext} style={{ ...styles.button, background: '#2563eb', color: 'white' }}>다음 단계 <ChevronRightIcon /></button>
             ) : (
               <button onClick={handleComplete} disabled={isSaving} style={{ ...styles.button, background: isSaving ? '#9ca3af' : '#16a34a', color: 'white' }}>{isSaving ? '저장 중...' : <><CheckIcon /> 상담 완료</>}</button>
             )}
          </div>
        </>
      )}
    </div>
  );
}