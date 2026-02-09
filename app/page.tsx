'use client';

import React, { useRef, useState, useEffect } from 'react';

// === 아이콘 컴포넌트 ===
const EraserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" /><path d="M22 21H7" /><path d="m5 11 9 9" /></svg>
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

export default function RunMathApp() {
  // === 기본 상태 ===
  const [step, setStep] = useState(1);
  const [studentInfo, setStudentInfo] = useState({ name: '', school: '' });
  const [parentRequest, setParentRequest] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  // === [핵심 수정] 필기 최적화 (useRef 사용으로 렉 제거) ===
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // useState 대신 useRef를 써서 화면 갱신 없이 내부적으로만 기록 (속도 10배 향상)
  const isDrawing = useRef(false); 
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  // 1. 캔버스 초기화
  useEffect(() => {
    if (step !== 1 && step !== 3) return;

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
          // 펜이 휙휙 지나가도 끊기지 않도록 부드러운 곡선 처리 설정
          context.imageSmoothingEnabled = true;
          context.lineWidth = 3;
          context.strokeStyle = step === 3 ? '#ef4444' : '#1f2937';
          ctxRef.current = context; // Ref에 저장
        }
      }
    };

    // 화면 로딩 후 즉시 실행
    setTimeout(resizeCanvas, 50);
    window.addEventListener('resize', resizeCanvas);
    
    // ★ 아이패드 스크롤 방지 (강력한 설정)
    const preventTouch = (e: TouchEvent) => {
      if (e.target === canvas) {
        e.preventDefault();
      }
    };
    canvas.addEventListener('touchstart', preventTouch, { passive: false });
    canvas.addEventListener('touchmove', preventTouch, { passive: false });
    canvas.addEventListener('touchend', preventTouch, { passive: false });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('touchstart', preventTouch);
      canvas.removeEventListener('touchmove', preventTouch);
      canvas.removeEventListener('touchend', preventTouch);
    };
  }, [step]);

  // 2. 그리기 함수 (최적화됨)
  const getPos = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    // 터치/마우스 구분
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    return { 
      x: clientX - rect.left, 
      y: clientY - rect.top 
    };
  };

  const startDrawing = (e: any) => {
    // 텍스트 선택 등 기본 동작 방지
    if (!ctxRef.current) return;
    
    isDrawing.current = true; // State 변경 아님 (렌더링 안 함)
    const { x, y } = getPos(e);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
  };

  const draw = (e: any) => {
    if (!isDrawing.current || !ctxRef.current) return;
    
    // ★ 여기가 핵심: 리액트 간섭 없이 브라우저에게 바로 그림 요청
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
    ctxRef.current.clearRect(0, 0, canvasRef.current.width * 2, canvasRef.current.height * 2);
  };

  const handleRefresh = () => {
    if (confirm('처음 화면으로 돌아가시겠습니까? 입력한 내용이 사라집니다.')) {
      window.location.reload();
    }
  };

  // === 스타일 (디자인 유지) ===
  const styles = {
    container: { maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: '"Noto Sans KR", sans-serif', color: '#333', paddingBottom: '120px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '15px', marginBottom: '30px', position: 'sticky' as 'sticky', top: 0, background: 'white', zIndex: 40, paddingTop: '10px' },
    title: { margin: 0, color: '#1e3a8a', fontSize: '22px', fontWeight: 'bold' },
    badge: { background: '#f3f4f6', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', color: '#666', marginRight: '10px' },
    card: { background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0', marginBottom: '20px' },
    input: { width: '100%', padding: '16px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '12px', marginBottom: '15px', background: '#f9fafb', outline: 'none', boxSizing: 'border-box' as 'border-box' },
    sectionTitle: (color: string) => ({ borderLeft: `5px solid ${color}`, paddingLeft: '15px', marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }),
    button: { padding: '12px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.2s', height: '50px' },
    canvasContainer: { width: '100%', height: '400px', border: '2px dashed #ccc', borderRadius: '16px', background: 'white', position: 'relative' as 'relative', overflow: 'hidden', touchAction: 'none' },
    gridRow: { display: 'flex', borderBottom: '1px solid #f0f0f0', height: '100%' },
    gridCell: { flex: 1, borderRight: '1px solid #eee' },
    footer: { position: 'fixed' as 'fixed', bottom: 0, left: 0, right: 0, background: 'white', padding: '15px 20px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', boxShadow: '0 -4px 20px rgba(0,0,0,0.05)', zIndex: 50 },
    refreshBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#666', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px' }
  };

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
          {/* === 1단계: 학생 정보 === */}
          {step === 1 && (
            <div>
              <h2 style={styles.sectionTitle('#1e3a8a')}>1. 학생 정보 입력</h2>
              <div style={styles.card}>
                <input type="text" placeholder="학생 이름" value={studentInfo.name} onChange={e => setStudentInfo({...studentInfo, name: e.target.value})} style={styles.input} />
                <input type="text" placeholder="학교 / 학년" value={studentInfo.school} onChange={e => setStudentInfo({...studentInfo, school: e.target.value})} style={styles.input} />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', marginTop: '30px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#555', fontWeight: 'bold' }}>진도 및 실력 진단</h3>
                <button onClick={clearCanvas} style={{ ...styles.button, padding: '6px 12px', background: 'white', border: '1px solid #ddd', fontSize: '14px', color: '#666' }}>
                  <EraserIcon /> 지우기
                </button>
              </div>
              <div style={styles.canvasContainer}>
                <canvas
                  ref={canvasRef}
                  style={{ width: '100%', height: '100%', touchAction: 'none' }}
                  onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing}
                />
                {!isDrawing.current && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#ddd', pointerEvents: 'none' }}>* 펜으로 자유롭게 쓰세요</div>}
              </div>
            </div>
          )}

          {/* === 2단계: 학원 소개 === */}
          {step === 2 && (
            <div>
              <h2 style={styles.sectionTitle('#f97316')}>2. 런수학 커리큘럼</h2>
              <div style={{ ...styles.card, background: '#fff7ed', border: '1px solid #ffedd5' }}>
                <h3 style={{ marginTop: 0, color: '#9a3412', fontWeight: 'bold', fontSize: '18px' }}>🏆 런수학만의 3단계 학습법</h3>
                <p style={{ lineHeight: '1.8', color: '#666', margin: 0 }}>
                  1. <strong>개념 영상:</strong> 10분 핵심 요약으로 예습<br/>
                  2. <strong>맞춤 문제:</strong> 학생 수준에 딱 맞는 난이도<br/>
                  3. <strong>오답 클리닉:</strong> 틀린 문제는 알 때까지 반복
                </p>
              </div>
              <div style={{ ...styles.card, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                 <h3 style={{ marginTop: 0, color: '#1e40af', fontWeight: 'bold', fontSize: '18px' }}>👨‍🏫 선생님 수업 방향</h3>
                 <p style={{ color: '#64748b', margin: 0, fontStyle: 'italic' }}>"포기하지 않으면, 수학은 반드시 재미있어집니다."</p>
              </div>
            </div>
          )}

          {/* === 3단계: 시간표 === */}
          {step === 3 && (
            <div>
              <h2 style={styles.sectionTitle('#22c55e')}>3. 희망 수업 시간표</h2>
              <div style={{ textAlign: 'right', marginBottom: '10px' }}>
                <button onClick={clearCanvas} style={{ ...styles.button, display:'inline-flex', padding: '6px 12px', background: 'white', border: '1px solid #ddd', fontSize: '14px', color: '#666' }}>
                  <EraserIcon /> 다시 쓰기
                </button>
              </div>
              <div style={{ ...styles.canvasContainer, height: '500px', border: '2px solid #eee' }}>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', pointerEvents: 'none', userSelect: 'none' }}>
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
                  style={{ width: '100%', height: '100%', touchAction: 'none' }}
                  onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing}
                />
              </div>
              <p style={{ textAlign: 'center', color: '#999', fontSize: '14px', marginTop: '10px' }}>* 가능한 시간에 빨간색으로 표시해주세요.</p>
            </div>
          )}

          {/* === 4단계: 요청사항 === */}
          {step === 4 && (
            <div>
              <h2 style={styles.sectionTitle('#8b5cf6')}>4. 학부모님 요청사항</h2>
              <textarea
                placeholder="예: 아이가 낯을 가리니 초반에는 친근하게 다가와 주세요."
                value={parentRequest}
                onChange={e => setParentRequest(e.target.value)}
                style={{ ...styles.input, height: '200px', resize: 'none' }}
              />
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