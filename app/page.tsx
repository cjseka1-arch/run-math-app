'use client';

import React, { useRef, useState, useEffect } from 'react';

// === 아이콘 컴포넌트 ===
const PenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
);
const EraserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" /><path d="M22 21H7" /><path d="m5 11 9 9" /></svg>
);
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
);
const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
);
const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
);
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
);
const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
);
const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
);
const GroupIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const LoopIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"></path><path d="m16.2 7.8 2.9-2.9"></path><path d="M18 12h4"></path><path d="m16.2 16.2 2.9 2.9"></path><path d="M12 18v4"></path><path d="m4.9 19.1 2.9-2.9"></path><path d="M2 12h4"></path><path d="m4.9 4.9 2.9 2.9"></path></svg>;

export default function RunMathApp() {
  const [step, setStep] = useState(1);
  const [studentInfo, setStudentInfo] = useState({ name: '', school: '' });
  const [parentRequest, setParentRequest] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  // === 사진 업로드 상태 ===
  // [key: string] : 이미지 URL
  const [photos, setPhotos] = useState<{ [key: string]: string | null }>({
    small1: null, small2: null,
    loop1: null, loop2: null
  });

  // === 필기 상태 ===
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');

  // 1. 캔버스 초기화
  useEffect(() => {
    if (step === 2) return; 

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
          context.lineCap = 'round';
          context.lineJoin = 'round';
          context.imageSmoothingEnabled = true;
          context.globalCompositeOperation = 'source-over';
          context.lineWidth = 3;
          context.strokeStyle = step === 3 ? '#ef4444' : '#1f2937'; 
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
  }, [step]);

  // 2. 도구 변경
  useEffect(() => {
    if (!ctxRef.current) return;
    if (tool === 'eraser') {
      ctxRef.current.globalCompositeOperation = 'destination-out';
      ctxRef.current.lineWidth = 25;
    } else {
      ctxRef.current.globalCompositeOperation = 'source-over';
      ctxRef.current.lineWidth = 3;
      ctxRef.current.strokeStyle = step === 3 ? '#ef4444' : '#1f2937';
    }
  }, [tool, step]);

  // 3. 그리기 로직
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
    ctxRef.current.save();
    ctxRef.current.globalCompositeOperation = 'destination-out';
    ctxRef.current.fillRect(0, 0, canvasRef.current.width * 2, canvasRef.current.height * 2);
    ctxRef.current.restore();
  };

  const handleRefresh = () => {
    if (confirm('처음 화면으로 돌아가시겠습니까?')) {
      window.location.reload();
    }
  };

  // === 사진 업로드 핸들러 ===
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotos(prev => ({ ...prev, [id]: url }));
    }
  };

  // === 스타일 ===
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
    // 2단계 분할 카드 스타일
    splitContainer: { display: 'flex', gap: '15px', marginTop: '20px' },
    splitCard: (borderColor: string, bg: string) => ({ 
      flex: 1, padding: '25px', borderRadius: '16px', border: `2px solid ${borderColor}`, background: bg, 
      display: 'flex', flexDirection: 'column' as 'column', alignItems: 'center', textAlign: 'center' as 'center',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
    }),
    photoBox: {
      width: '100%', height: '100px', borderRadius: '10px', border: '2px dashed #ccc', 
      background: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', overflow: 'hidden', position: 'relative' as 'relative', transition: '0.2s'
    }
  };

  // 사진 업로드 버튼 컴포넌트
  const PhotoUploadBox = ({ id }: { id: string }) => (
    <label style={styles.photoBox}>
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

  return (
    <div style={styles.container}>
      {/* 헤더 */}
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h1 style={styles.title}>런수학학원</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {!isCompleted && (
            <span style={styles.badge}>
              {step} / 4 단계
            </span>
          )}
          <button onClick={handleRefresh} style={styles.refreshBtn}>
            <RefreshIcon /> 초기화
          </button>
        </div>
      </div>

      {isCompleted ? (
        // === 완료 화면 ===
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <div style={{ width: '80px', height: '80px', background: '#dcfce7', borderRadius: '50%', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckIcon />
          </div>
          <h2 style={{ fontSize: '28px', marginBottom: '10px', fontWeight: 'bold' }}>상담이 완료되었습니다!</h2>
          <p style={{ color: '#666', marginBottom: '40px' }}>아래 QR코드를 학부모님께 보여주세요.</p>
          <div style={{ background: 'white', padding: '15px', borderRadius: '15px', border: '1px solid #eee', display: 'inline-block' }}>
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=RunMath_${studentInfo.name}`} alt="QR" style={{ width: '200px', height: '200px' }} />
          </div>
          <br />
          <button onClick={() => window.location.reload()} style={{ ...styles.button, background: '#1f2937', color: 'white', marginTop: '40px', width: '100%', justifyContent: 'center' }}>
            새로운 상담 시작하기
          </button>
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
                <canvas
                  ref={canvasRef}
                  style={{ width: '100%', height: '100%', touchAction: 'none', outline: 'none', WebkitTapHighlightColor: 'transparent' }}
                  onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing}
                />
                {!isDrawing.current && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#ddd', pointerEvents: 'none', userSelect: 'none' as 'none' }}>* 펜으로 자유롭게 쓰세요</div>}
              </div>
            </div>
          )}

          {/* === 2단계: 커리큘럼 (사진 업로드 추가됨!) === */}
          {step === 2 && (
            <div>
              <h2 style={styles.sectionTitle('#f97316')}>2. 런수학 수업 시스템 선택</h2>
              <p style={{ color: '#666', marginBottom: '20px' }}>학생의 성향에 맞는 수업 방식을 선택할 수 있습니다.</p>
              
              <div style={styles.splitContainer}>
                {/* 1. 소수 정예 (밀착 관리) */}
                <div style={styles.splitCard('#2563eb', '#eff6ff')}>
                  <div style={{ marginBottom: '15px' }}><GroupIcon /></div>
                  <h3 style={{ margin: '0 0 10px 0', color: '#1e3a8a', fontSize: '20px', fontWeight: 'bold' }}>소수 정예반</h3>
                  <div style={{ background: 'white', padding: '5px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', color: '#2563eb', marginBottom: '15px', border: '1px solid #bfdbfe' }}>최대 6명 제한</div>
                  <ul style={{ textAlign: 'left', paddingLeft: '20px', margin: 0, lineHeight: '1.6', color: '#4b5563', fontSize: '14px', marginBottom: '20px' }}>
                    <li><strong>선생님 밀착 마크</strong></li>
                    <li><strong>즉각적인 피드백</strong></li>
                    <li><strong>집중 관리 시스템</strong></li>
                  </ul>
                  {/* 사진 업로드 2개 */}
                  <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: 'auto' }}>
                    <PhotoUploadBox id="small1" />
                    <PhotoUploadBox id="small2" />
                  </div>
                </div>

                {/* 2. 시스템 루프 (자기주도) */}
                <div style={styles.splitCard('#ea580c', '#fff7ed')}>
                  <div style={{ marginBottom: '15px' }}><LoopIcon /></div>
                  <h3 style={{ margin: '0 0 10px 0', color: '#9a3412', fontSize: '20px', fontWeight: 'bold' }}>30-10-5 루프반</h3>
                  <div style={{ background: 'white', padding: '5px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', color: '#ea580c', marginBottom: '15px', border: '1px solid #fed7aa' }}>효율적 순환 시스템</div>
                  <ul style={{ textAlign: 'left', paddingLeft: '20px', margin: 0, lineHeight: '1.6', color: '#4b5563', fontSize: '14px', marginBottom: '20px' }}>
                    <li><strong>30분 (개념/문제풀이)</strong></li>
                    <li><strong>10분 (1:1 점검)</strong></li>
                    <li><strong>5분 (휴식/리프레시)</strong></li>
                  </ul>
                  {/* 사진 업로드 2개 */}
                  <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: 'auto' }}>
                    <PhotoUploadBox id="loop1" />
                    <PhotoUploadBox id="loop2" />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '25px', padding: '15px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#64748b' }}>
                <span style={{ fontSize: '18px' }}>💡</span> <strong>사진 추가 팁</strong><br/>
                네모 박스를 눌러 수업 풍경이나 교재 사진을 올려보세요.
              </div>
            </div>
          )}

          {/* === 3단계: 시간표 === */}
          {step === 3 && (
            <div>
              <h2 style={styles.sectionTitle('#22c55e')}>3. 희망 수업 시간표</h2>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginBottom: '10px' }}>
                  <button onClick={() => setTool('pen')} style={styles.toolBtn(tool === 'pen')}><PenIcon /> 펜</button>
                  <button onClick={() => setTool('eraser')} style={styles.toolBtn(tool === 'eraser')}><EraserIcon /> 지우개</button>
                  <button onClick={clearCanvas} style={{ ...styles.toolBtn(false), color: '#ef4444', borderColor: '#fee2e2' }}><TrashIcon /> 비우기</button>
              </div>

              <div style={{ ...styles.canvasContainer, height: '500px', border: '2px solid #eee' }}>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', pointerEvents: 'none', userSelect: 'none' as 'none' }}>
                  <div style={{ display: 'flex', height: '45px', background: '#f3f4f6', borderBottom: '1px solid #ddd' }}>
                    <div style={{ width: '15%', borderRight: '1px solid #ddd' }}></div>
                    {['월','화','수','목','금'].map(d=><div key={d} style={{ flex:1, borderRight:'1px solid #ddd', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold', color: '#555' }}>{d}</div>)}
                  </div>
                  {[2,3,4,5,6,7].map(t=>(
                    <div key={t} style={{ flex:1, display:'flex', borderBottom:'1px solid #f0f0f0' }}>
                      <div style={{ width:'15%', borderRight:'1px solid #ddd', background:'#f9fafb', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', color:'#888' }}>{t}시</div>
                      <div style={styles.gridCell}></div><div style={styles.gridCell}></div><div style={styles.gridCell}></div><div style={styles.gridCell}></div><div style={{ flex:1 }}></div>
                    </div>
                  ))}
                </div>
                <canvas
                  ref={canvasRef}
                  style={{ width: '100%', height: '100%', touchAction: 'none', outline: 'none', WebkitTapHighlightColor: 'transparent' }}
                  onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing}
                />
              </div>
              <p style={{ textAlign: 'center', color: '#999', fontSize: '14px', marginTop: '10px' }}>* 가능한 시간에 빨간색으로 표시해주세요.</p>
            </div>
          )}

          {/* === 4단계: 요청사항 (필기) === */}
          {step === 4 && (
            <div>
              <h2 style={styles.sectionTitle('#8b5cf6')}>4. 학부모님 요청사항</h2>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '14px', color: '#666' }}>자유롭게 적어주세요.</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setTool('pen')} style={styles.toolBtn(tool === 'pen')}><PenIcon /> 펜</button>
                  <button onClick={() => setTool('eraser')} style={styles.toolBtn(tool === 'eraser')}><EraserIcon /> 지우개</button>
                  <button onClick={clearCanvas} style={{ ...styles.toolBtn(false), color: '#ef4444', borderColor: '#fee2e2' }}><TrashIcon /> 비우기</button>
                </div>
              </div>

              <div style={styles.canvasContainer}>
                 <canvas
                  ref={canvasRef}
                  style={{ width: '100%', height: '100%', touchAction: 'none', outline: 'none', WebkitTapHighlightColor: 'transparent' }}
                  onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing}
                />
                {!isDrawing.current && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#ddd', pointerEvents: 'none', userSelect: 'none' as 'none' }}>* 학부모님 말씀을 기록하세요</div>}
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
             <button 
                onClick={() => setStep(step - 1)} 
                style={{ 
                  ...styles.button, 
                  background: '#f3f4f6', 
                  color: '#666', 
                  visibility: step === 1 ? 'hidden' : 'visible' 
                }}
             >
               <ChevronLeftIcon /> 이전
             </button>
             
             {step < 4 ? (
               <button onClick={() => setStep(step + 1)} style={{ ...styles.button, background: '#2563eb', color: 'white' }}>
                 {step === 3 ? '다음: 마무리' : '다음 단계'} <ChevronRightIcon />
               </button>
             ) : (
               <button onClick={() => setIsCompleted(true)} style={{ ...styles.button, background: '#16a34a', color: 'white' }}>
                 <CheckIcon /> 상담 완료
               </button>
             )}
          </div>
        </>
      )}
    </div>
  );
}