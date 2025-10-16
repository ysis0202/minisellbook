export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">개인정보 처리방침</h1>
        
        <p className="text-sm text-gray-600 mb-8">
          최종 수정일: {new Date().toLocaleDateString('ko-KR')}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. 개인정보의 처리 목적</h2>
          <p className="text-gray-700 mb-4">
            MoneyCells(&ldquo;머니셀즈&rdquo;)는 다음의 목적을 위하여 개인정보를 처리합니다. 
            처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 
            이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>서비스 제공 및 회원 관리</li>
            <li>가계부 기능 제공 및 데이터 동기화</li>
            <li>본인 인증 및 계정 관리</li>
            <li>서비스 개선 및 신규 서비스 개발</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. 수집하는 개인정보 항목</h2>
          <div className="text-gray-700">
            <p className="mb-3 font-medium">필수 수집 항목:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>이메일 주소 (로그인 및 계정 관리)</li>
              <li>프로필 정보 (이름, 프로필 사진 - 소셜 로그인 시)</li>
            </ul>
            
            <p className="mb-3 font-medium">서비스 이용 과정에서 생성되는 정보:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>거래 내역 (수입, 지출, 저축 기록)</li>
              <li>카테고리 및 계정 정보</li>
              <li>서비스 이용 기록, 접속 로그</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. 개인정보의 처리 및 보유 기간</h2>
          <p className="text-gray-700 mb-4">
            개인정보는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 
            동의받은 개인정보 보유·이용기간 내에서 처리·보유합니다.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li><strong>회원 정보:</strong> 회원 탈퇴 시까지 (단, 관계 법령에 따라 보존할 필요가 있는 경우 해당 기간까지)</li>
            <li><strong>거래 내역:</strong> 회원이 직접 삭제하거나 회원 탈퇴 시까지</li>
            <li><strong>접속 로그:</strong> 3개월</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. 개인정보의 제3자 제공</h2>
          <p className="text-gray-700">
            MoneyCells는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 
            다만, 다음의 경우는 예외로 합니다:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-4">
            <li>이용자가 사전에 동의한 경우</li>
            <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. 개인정보의 파기 절차 및 방법</h2>
          <div className="text-gray-700">
            <p className="mb-3 font-medium">파기 절차:</p>
            <p className="mb-4 ml-4">
              회원 탈퇴 시 즉시 파기되며, 별도의 DB로 옮겨져 내부 방침 및 기타 관련 법령에 따라 
              일정 기간 저장된 후 파기됩니다.
            </p>
            
            <p className="mb-3 font-medium">파기 방법:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>전자적 파일 형태: 복구 및 재생이 불가능한 방법으로 영구 삭제</li>
              <li>기타 기록물: 파쇄 또는 소각</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. 정보주체의 권리·의무 및 행사 방법</h2>
          <p className="text-gray-700 mb-4">
            정보주체는 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>개인정보 열람 요구</li>
            <li>개인정보 정정·삭제 요구</li>
            <li>개인정보 처리 정지 요구</li>
            <li>회원 탈퇴 (동의 철회)</li>
          </ul>
          <p className="text-gray-700 mt-4">
            위 권리 행사는 앱 내 &lsquo;프로필&rsquo; 메뉴에서 직접 수행하거나, 
            개인정보 보호책임자에게 서면, 전화, 이메일 등으로 연락하시면 지체 없이 조치하겠습니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. 개인정보의 안전성 확보 조치</h2>
          <p className="text-gray-700 mb-4">
            MoneyCells는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>개인정보 암호화: 비밀번호 등 중요 정보는 암호화하여 저장 및 관리</li>
            <li>해킹 등에 대비한 기술적 대책: 백신 프로그램 설치 및 주기적 갱신</li>
            <li>개인정보에 대한 접근 제한: 개인정보를 처리하는 직원을 최소화하고 접근 권한 관리</li>
            <li>접속 기록의 보관 및 위변조 방지: 접속 기록을 최소 6개월 이상 보관·관리</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. 개인정보 자동 수집 장치의 설치·운영 및 거부</h2>
          <p className="text-gray-700">
            MoneyCells는 PWA(Progressive Web App) 기술을 사용하여 사용자 경험을 개선하고 있습니다. 
            이 과정에서 로컬 스토리지 등의 기술을 사용할 수 있으며, 
            이는 브라우저 설정을 통해 거부하실 수 있습니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. 개인정보 보호책임자</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-700 mb-2">
              <strong>개인정보 보호책임자:</strong> MoneyCells 운영팀
            </p>
            <p className="text-gray-700 mb-2">
              <strong>이메일:</strong> support@moneycells.com
            </p>
            <p className="text-gray-700">
              개인정보 침해에 대한 신고나 상담이 필요하신 경우 위 연락처로 문의하시기 바랍니다.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. 개인정보 처리방침의 변경</h2>
          <p className="text-gray-700">
            이 개인정보 처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 
            삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. 기타</h2>
          <div className="text-gray-700">
            <p className="mb-3 font-medium">개인정보 침해 신고·상담:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>개인정보 침해신고센터: (국번없이) 118 (privacy.kisa.or.kr)</li>
              <li>대검찰청 사이버범죄수사단: (국번없이) 1301 (www.spo.go.kr)</li>
              <li>경찰청 사이버안전국: (국번없이) 182 (cyberbureau.police.go.kr)</li>
            </ul>
          </div>
        </section>

        <div className="border-t pt-6 mt-8">
          <p className="text-sm text-gray-600">
            본 개인정보 처리방침은 {new Date().toLocaleDateString('ko-KR')}부터 적용됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}

