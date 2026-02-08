'use client';

import React, { useRef, useState, useEffect } from 'react';

// --- 아이콘 (직접 그리기) ---
const EraserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" />
    <path d="M22 21H7" />
    <path d="m5 11 9 9" />
  </svg>
);
const ChevronRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);
const ChevronLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);
const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export default function RunMathApp() {
  const [step, setStep] = useState(1);
  const [studentInfo, setStudentInfo] = useState({ name: '', school: '' });
  const [parentRequest, setParentRequest] = useState(''); // 학부모 요청사항
  const [isCompleted, setIsCompleted] = useState(false); // 상담 완료 여부

  // 캔버스 관련
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (step === 1 || step === 3) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth * 2;
        canvas.height = parent.offsetHeight * 2;
        canvas.style.width = `${parent.offsetWidth}px`;
        canvas.style.height = `${parent.offsetHeight}px`;
      }
      const context = canvas.getContext('2d');
      if (context) {
        context.scale(2, 2);
        context.lineCap = 'round';
        context.strokeStyle = step === 3 ? '#ff0000' : '#1e3a8a';
        context.lineWidth = 3;
        contextRef.current = context;
      }
    }
  }, [step, isCompleted]);

  const startDrawing = (event: React.MouseEvent | React.TouchEvent) => {
    let offsetX, offsetY;
    if ('touches' in event) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      offsetX = event.touches[0].clientX - rect.left;
      offsetY = event.touches[0].clientY - rect.top;
    } else {
      const nativeEvent = event.nativeEvent as MouseEvent;
      offsetX = nativeEvent.offsetX;
      offsetY = nativeEvent.offsetY;
    }
    if (contextRef.current) {
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    }
  };

  const draw = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !contextRef.current) return;
    let offsetX, offsetY;
    if ('touches' in event) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      offsetX = event.touches[0].clientX - rect.left;
      offsetY = event.touches[0].clientY - rect.top;
    } else {
      const nativeEvent = event.nativeEvent as MouseEvent;
      offsetX = nativeEvent.offsetX;
      offsetY = nativeEvent.offsetY;
    }
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    if (contextRef.current) contextRef.current.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas && contextRef.current) {
      contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // 상담 완료 처리 함수
  const finishConsultation = () => {
    // 실제로는 여기서 서버(DB)로 데이터를 전송합니다.
    console.log('저장된 데이터:', { studentInfo, parentRequest });
    alert('상담 내용이 선생님 아이패드에 저장되었습니다!');
    setIsCompleted(true);
  };

  // 새 상담 시작하기
  const resetAll = () => {
    setStudentInfo({ name: '', school: '' });
    setParentRequest('');
    setStep(1);
    setIsCompleted(false);
  };

  return (
    <div
      style={{
        fontFamily: 'sans-serif',
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
        paddingBottom: '100px',
      }}
    >
      {/* 상단 헤더 */}
      <header
        style={{
          borderBottom: '2px solid #eee',
          paddingBottom: '10px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1 style={{ color: '#003366', margin: 0, fontSize: '24px' }}>
          런수학학원
        </h1>
        {!isCompleted && (
          <div
            style={{
              background: '#f0f0f0',
              padding: '5px 12px',
              borderRadius: '20px',
              fontSize: '14px',
              color: '#666',
            }}
          >
            상담 진행중: <strong>{step}</strong> / 4 단계
          </div>
        )}
      </header>

      {/* === 상담 완료 화면 (QR코드) === */}
      {isCompleted ? (
        <div
          style={{
            textAlign: 'center',
            padding: '40px 20px',
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              background: '#dcfce7',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: '#16a34a',
            }}
          >
            <CheckIcon />
          </div>
          <h2 style={{ fontSize: '28px', color: '#333', marginBottom: '10px' }}>
            상담이 완료되었습니다!
          </h2>
          <p style={{ color: '#666', marginBottom: '30px' }}>
            아래 QR코드를 학부모님께 보여드리면,
            <br />
            <strong>오늘 상담 내용과 명함</strong>이 전송됩니다.
          </p>

          {/* QR 코드 (임시 생성 API 사용) */}
          <div
            style={{
              background: 'white',
              padding: '20px',
              display: 'inline-block',
              borderRadius: '15px',
              border: '1px solid #eee',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            }}
          >
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=RunMath_Consultation_${studentInfo.name}`}
              alt="상담 결과 QR"
              style={{ width: '200px', height: '200px' }}
            />
          </div>
          <p style={{ marginTop: '15px', fontSize: '14px', color: '#888' }}>
            * 카메라 앱으로 스캔하세요
          </p>

          <div style={{ marginTop: '40px' }}>
            <button
              onClick={resetAll}
              style={{
                background: '#333',
                color: 'white',
                padding: '15px 40px',
                fontSize: '18px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              새로운 상담 시작하기
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* === 1단계: 학생 정보 === */}
          {step === 1 && (
            <div className="fade-in">
              <h2
                style={{
                  borderLeft: '5px solid #003366',
                  paddingLeft: '10px',
                  color: '#333',
                }}
              >
                1. 학생 정보 입력
              </h2>
              <div
                style={{
                  marginBottom: '25px',
                  display: 'flex',
                  gap: '15px',
                  flexDirection: 'column',
                }}
              >
                <input
                  type="text"
                  placeholder="학생 이름"
                  value={studentInfo.name}
                  onChange={(e) =>
                    setStudentInfo({ ...studentInfo, name: e.target.value })
                  }
                  style={{
                    padding: '15px',
                    fontSize: '18px',
                    borderRadius: '12px',
                    border: '1px solid #ddd',
                    background: '#f9fafb',
                  }}
                />
                <input
                  type="text"
                  placeholder="학교 / 학년"
                  value={studentInfo.school}
                  onChange={(e) =>
                    setStudentInfo({ ...studentInfo, school: e.target.value })
                  }
                  style={{
                    padding: '15px',
                    fontSize: '18px',
                    borderRadius: '12px',
                    border: '1px solid #ddd',
                    background: '#f9fafb',
                  }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px',
                }}
              >
                <h3 style={{ margin: 0, color: '#444' }}>진도 및 실력 진단</h3>
                <button
                  onClick={clearCanvas}
                  style={{
                    padding: '6px 12px',
                    background: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    color: '#666',
                  }}
                >
                  <EraserIcon /> 지우기
                </button>
              </div>
              <div
                style={{
                  height: '400px',
                  border: '2px dashed #cbd5e1',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  position: 'relative',
                  background: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                  backgroundColor: '#fff',
                }}
              >
                <canvas
                  ref={canvasRef}
                  style={{ width: '100%', height: '100%', touchAction: 'none' }}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
                {!isDrawing && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 20,
                      right: 20,
                      color: '#aaa',
                      pointerEvents: 'none',
                    }}
                  >
                    * 펜으로 자유롭게 쓰세요
                  </div>
                )}
              </div>
            </div>
          )}

          {/* === 2단계: 학원 소개 === */}
          {step === 2 && (
            <div className="fade-in">
              <h2
                style={{
                  borderLeft: '5px solid #ff6600',
                  paddingLeft: '10px',
                  color: '#333',
                }}
              >
                2. 런수학 커리큘럼
              </h2>
              <div
                style={{
                  background: 'white',
                  padding: '20px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  marginBottom: '20px',
                  border: '1px solid #eee',
                }}
              >
                <h3 style={{ marginTop: 0, color: '#003366' }}>
                  🏆 런수학만의 3단계 학습법
                </h3>
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    overflowX: 'auto',
                    padding: '10px 0',
                  }}
                >
                  <div
                    style={{
                      minWidth: '220px',
                      height: '160px',
                      background: '#f3f4f6',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#9ca3af',
                    }}
                  >
                    수업 사진 1
                  </div>
                  <div
                    style={{
                      minWidth: '220px',
                      height: '160px',
                      background: '#f3f4f6',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#9ca3af',
                    }}
                  >
                    수업 사진 2
                  </div>
                </div>
              </div>
              <div
                style={{
                  background: '#eff6ff',
                  padding: '20px',
                  borderRadius: '16px',
                  border: '1px solid #dbeafe',
                }}
              >
                <h3 style={{ marginTop: 0, color: '#1e40af' }}>
                  👨‍🏫 선생님 수업 방향
                </h3>
                <ul
                  style={{
                    lineHeight: '2',
                    color: '#374151',
                    paddingLeft: '20px',
                    margin: 0,
                  }}
                >
                  <li>
                    <strong>개념 설명:</strong> 10분 핵심 요약 영상 제공
                  </li>
                  <li>
                    <strong>오답 관리:</strong> 취약 유형 완벽 분석
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* === 3단계: 시간표 짜기 === */}
          {step === 3 && (
            <div className="fade-in">
              <h2
                style={{
                  borderLeft: '5px solid #10b981',
                  paddingLeft: '10px',
                  color: '#333',
                }}
              >
                3. 희망 수업 시간표
              </h2>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginBottom: '10px',
                }}
              >
                <button
                  onClick={clearCanvas}
                  style={{
                    padding: '6px 12px',
                    background: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    color: '#666',
                  }}
                >
                  <EraserIcon /> 다시 쓰기
                </button>
              </div>
              <div
                style={{
                  position: 'relative',
                  height: '500px',
                  border: '2px solid #ddd',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: 'white',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    pointerEvents: 'none',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      height: '40px',
                      background: '#f3f4f6',
                      borderBottom: '1px solid #ddd',
                    }}
                  >
                    <div
                      style={{ width: '15%', borderRight: '1px solid #ddd' }}
                    ></div>
                    {['월', '화', '수', '목', '금'].map((day) => (
                      <div
                        key={day}
                        style={{
                          flex: 1,
                          borderRight: '1px solid #ddd',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {day}
                      </div>
                    ))}
                    <div
                      style={{
                        flex: 1,
                        color: '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      토
                    </div>
                  </div>
                  {[1, 2, 3, 4, 5, 6].map((time) => (
                    <div
                      key={time}
                      style={{
                        flex: 1,
                        display: 'flex',
                        borderBottom: '1px solid #eee',
                      }}
                    >
                      <div
                        style={{
                          width: '15%',
                          borderRight: '1px solid #ddd',
                          background: '#f9fafb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          color: '#888',
                        }}
                      >
                        {time + 4}시
                      </div>
                      <div
                        style={{ flex: 1, borderRight: '1px solid #eee' }}
                      ></div>
                      <div
                        style={{ flex: 1, borderRight: '1px solid #eee' }}
                      ></div>
                      <div
                        style={{ flex: 1, borderRight: '1px solid #eee' }}
                      ></div>
                      <div
                        style={{ flex: 1, borderRight: '1px solid #eee' }}
                      ></div>
                      <div
                        style={{ flex: 1, borderRight: '1px solid #eee' }}
                      ></div>
                      <div style={{ flex: 1 }}></div>
                    </div>
                  ))}
                </div>
                <canvas
                  ref={canvasRef}
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    touchAction: 'none',
                  }}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
              </div>
            </div>
          )}

          {/* === 4단계: 학부모 요청사항 (NEW) === */}
          {step === 4 && (
            <div className="fade-in">
              <h2
                style={{
                  borderLeft: '5px solid #8b5cf6',
                  paddingLeft: '10px',
                  color: '#333',
                }}
              >
                4. 학부모님 요청사항
              </h2>
              <p style={{ color: '#666', marginBottom: '15px' }}>
                등록 전, 학부모님께서 특별히 원하시는 점이나 당부 사항을
                적어주세요.
              </p>

              <textarea
                value={parentRequest}
                onChange={(e) => setParentRequest(e.target.value)}
                placeholder="예: 아이가 낯을 가리니 초반에는 친근하게 다가와 주세요. 숙제 양을 조절해 주세요."
                style={{
                  width: '100%',
                  height: '200px',
                  padding: '20px',
                  fontSize: '18px',
                  borderRadius: '16px',
                  border: '1px solid #ddd',
                  background: '#f9fafb',
                  resize: 'none',
                  lineHeight: '1.6',
                  outline: 'none',
                }}
              />

              <div
                style={{
                  marginTop: '20px',
                  background: '#fffbeb',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid #fcd34d',
                  display: 'flex',
                  gap: '10px',
                }}
              >
                <div style={{ fontSize: '24px' }}>💡</div>
                <div>
                  <h4 style={{ margin: '0 0 5px 0', color: '#92400e' }}>
                    상담 체크리스트
                  </h4>
                  <p style={{ margin: 0, color: '#b45309', fontSize: '14px' }}>
                    차량 운행 여부 확인하셨나요? / 결제일 안내 드렸나요?
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 하단 네비게이션 */}
          <footer
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              width: '100%',
              background: 'white',
              padding: '15px 20px',
              borderTop: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between',
              boxShadow: '0 -4px 6px -1px rgba(0,0,0,0.05)',
            }}
          >
            <button
              onClick={() => setStep(step - 1)}
              style={{
                background: '#f3f4f6',
                color: '#4b5563',
                border: 'none',
                padding: '12px 24px',
                fontSize: '16px',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                visibility: step === 1 ? 'hidden' : 'visible',
              }}
            >
              <ChevronLeftIcon /> 이전
            </button>

            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                style={{
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  fontSize: '16px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.3)',
                }}
              >
                {step === 3
                  ? '다음: 마무리'
                  : step === 2
                  ? '다음: 시간표 짜기'
                  : '다음: 학원 소개'}{' '}
                <ChevronRightIcon />
              </button>
            ) : (
              <button
                onClick={finishConsultation}
                style={{
                  background: '#059669',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  fontSize: '16px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.3)',
                }}
              >
                <CheckIcon /> 상담 완료 및 QR 생성
              </button>
            )}
          </footer>
        </>
      )}
    </div>
  );
}
