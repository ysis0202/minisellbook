import React, { useEffect, useMemo, useState } from "react";
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ko } from "date-fns/locale";

// --- Types ---
type EntryType = "income" | "expense";

type Entry = {
  id: string;
  date: string;
  type: EntryType;
  amountIn: number;
  amountOut: number;
  category: string;
  memo?: string;
  orderNo?: string;
  channel?: string;
  payment?: string;
};

type Settings = {
  openingBalance: number;
  vatRate: number;
  businessType: "일반과세" | "간이과세" | "면세" | "미지정";
};

// --- LocalStorage Hook ---
function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch (error) {
      console.warn("Failed to read localStorage", error);
      return initial;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn("Failed to write localStorage", error);
    }
  }, [key, value]);

  return [value, setValue] as const;
}

// --- Utilities ---
const KR = (n: number | undefined) =>
  (n ?? 0).toLocaleString("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  });

const uid = () => Math.random().toString(36).slice(2, 10);

const CATEGORY_PRESET: Record<EntryType, string[]> = {
  income: ["매출(상품가)", "배송비(수입)", "예치금(선입금)", "기타수입"],
  expense: ["배송비(지출)", "매입원가", "소모품", "수수료", "임차료", "광고", "환불", "대표 인출", "기타비용"],
};

const ICONS = {
  menu: "☰",
  chevronLeft: "‹",
  chevronRight: "›",
  close: "✕",
};

export default function App() {
  const [navOpen, setNavOpen] = useState(false);
  const [settings, setSettings] = useLocalStorage<Settings>("settings", {
    openingBalance: 0,
    vatRate: 10,
    businessType: "미지정",
  });
  const [showSettings, setShowSettings] = useState(false);
  const [entries, setEntries] = useLocalStorage<Entry[]>("entries", []);

  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formType, setFormType] = useState<EntryType>("income");
  const [form, setForm] = useState<Partial<Entry>>({
    date: format(new Date(), "yyyy-MM-dd"),
    category: CATEGORY_PRESET.income[0],
    channel: "라이브",
    payment: "계좌",
  });

  const entriesByDay = useMemo(() => {
    const map: Record<string, Entry[]> = {};
    entries.forEach((entry) => {
      if (!map[entry.date]) {
        map[entry.date] = [];
      }
      map[entry.date].push(entry);
    });
    return map;
  }, [entries]);

  const monthRange = {
    start: startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 }),
    end: endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 }),
  };

  const monthEntries = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return entries.filter((entry) => {
      const date = parseISO(entry.date);
      return date >= start && date <= end;
    });
  }, [entries, currentMonth]);

  const totals = useMemo(() => {
    const income = monthEntries.reduce((total, entry) => total + entry.amountIn, 0);
    const expense = monthEntries.reduce((total, entry) => total + entry.amountOut, 0);
    const net = settings.openingBalance + (income - expense);
    return { income, expense, net };
  }, [monthEntries, settings.openingBalance]);

  const dayList = entriesByDay[format(selectedDate, "yyyy-MM-dd")] ?? [];

  const resetForm = (type: EntryType) => {
    setFormType(type);
    setForm({
      date: format(selectedDate, "yyyy-MM-dd"),
      type,
      category: CATEGORY_PRESET[type][0],
      amountIn: undefined,
      amountOut: undefined,
      memo: "",
      orderNo: "",
      channel: "라이브",
      payment: "계좌",
    });
    setEditId(null);
    setShowForm(true);
  };

  const saveForm = () => {
    if (!form.date || !form.category) return;

    const payload: Entry = {
      id: editId || uid(),
      date: form.date,
      type: formType,
      amountIn: formType === "income" ? Math.max(0, Number(form.amountIn ?? 0)) : 0,
      amountOut: formType === "expense" ? Math.max(0, Number(form.amountOut ?? 0)) : 0,
      category: form.category,
      memo: form.memo?.trim() || "",
      orderNo: form.orderNo?.trim() || "",
      channel: form.channel || "",
      payment: form.payment || "",
    };

    setEntries((prev) => {
      const exists = prev.some((entry) => entry.id === payload.id);
      const next = exists
        ? prev.map((entry) => (entry.id === payload.id ? payload : entry))
        : [payload, ...prev];
      return next;
    });
    setShowForm(false);
  };

  const onEdit = (entry: Entry) => {
    setEditId(entry.id);
    setFormType(entry.type);
    setForm({ ...entry });
    setShowForm(true);
  };

  const onDelete = (id: string) => {
    if (!window.confirm("삭제하시겠어요?")) return;
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const TopBar = () => (
    <div className="top-bar">
      <button className="icon-button" onClick={() => setNavOpen(true)} aria-label="메뉴 열기">
        {ICONS.menu}
      </button>
      <div className="top-bar__title">Live Ledger</div>
      <button className="profile-button" onClick={() => setShowSettings(true)} aria-label="설정 열기">
        <div className="profile-avatar">🙂</div>
      </button>
    </div>
  );

  const SideNav = () => (
    <div className={`side-nav ${navOpen ? "side-nav--open" : ""}`}>
      <div className="side-nav__overlay" onClick={() => setNavOpen(false)} />
      <div className="side-nav__panel">
        <div className="side-nav__title">메뉴</div>
        <nav className="side-nav__list">
          <button className="side-nav__item" onClick={() => setNavOpen(false)}>
            대시보드
          </button>
          <button className="side-nav__item" onClick={() => setNavOpen(false)}>
            캘린더
          </button>
          <button
            className="side-nav__item"
            onClick={() => {
              setShowSettings(true);
              setNavOpen(false);
            }}
          >
            프로필/초기세팅
          </button>
          <button className="side-nav__item" onClick={() => exportCSV(entries)}>
            데이터 내보내기 (CSV)
          </button>
        </nav>
      </div>
    </div>
  );

  const SummaryCards = () => (
    <div className="summary-grid">
      <Card title="이번달 유입(현금)">{KR(totals.income)}</Card>
      <Card title="이번달 유출(현금)">{KR(totals.expense)}</Card>
      <Card title="추정 잔액(시작잔액 포함)">{KR(totals.net)}</Card>
    </div>
  );

  const MonthSwitcher = () => (
    <div className="month-switcher">
      <button className="icon-button" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} aria-label="이전 달">
        {ICONS.chevronLeft}
      </button>
      <div className="month-switcher__label">{format(currentMonth, "yyyy년 M월", { locale: ko })}</div>
      <button className="icon-button" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} aria-label="다음 달">
        {ICONS.chevronRight}
      </button>
    </div>
  );

  const CalendarGrid = () => {
    const days: Date[] = [];
    for (let d = monthRange.start; d <= monthRange.end; d = addDays(d, 1)) {
      days.push(d);
    }
    const header = ["일", "월", "화", "수", "목", "금", "토"];

    return (
      <div className="calendar">
        <div className="calendar__header">
          {header.map((label) => (
            <div key={label} className="calendar__header-cell">
              {label}
            </div>
          ))}
        </div>
        <div className="calendar__grid">
          {days.map((day) => {
            const iso = format(day, "yyyy-MM-dd");
            const list = entriesByDay[iso] || [];
            const income = list.reduce((total, entry) => total + entry.amountIn, 0);
            const expense = list.reduce((total, entry) => total + entry.amountOut, 0);
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            return (
              <button
                key={iso}
                className={`calendar__cell ${isSelected ? "calendar__cell--selected" : ""} ${
                  isCurrentMonth ? "" : "calendar__cell--muted"
                }`}
                onClick={() => setSelectedDate(day)}
              >
                <div className="calendar__date">{format(day, "d")}</div>
                <div className="calendar__amount calendar__amount--income">+{(income / 1000).toFixed(0)}k</div>
                <div className="calendar__amount calendar__amount--expense">-{(expense / 1000).toFixed(0)}k</div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const DayDetail = () => (
    <div className="day-detail">
      <div className="day-detail__header">
        <div className="day-detail__date">{format(selectedDate, "yyyy년 M월 d일 (EEE)", { locale: ko })}</div>
        <div className="day-detail__actions">
          <button className="chip" onClick={() => resetForm("income")}>
            + 수입
          </button>
          <button className="chip" onClick={() => resetForm("expense")}>
            - 지출
          </button>
        </div>
      </div>
      <div className="day-detail__list">
        {dayList.length === 0 && <div className="day-detail__empty">내역이 없습니다.</div>}
        {dayList.map((entry) => (
          <div key={entry.id} className="entry-card">
            <div>
              <div className="entry-card__title">
                {entry.category} {entry.type === "income" ? "↗" : "↘"}
              </div>
              <div className="entry-card__meta">
                {entry.memo || entry.orderNo || entry.channel || ""}
              </div>
            </div>
            <div className={`entry-card__amount ${entry.type === "income" ? "entry-card__amount--income" : "entry-card__amount--expense"}`}>
              {KR(entry.type === "income" ? entry.amountIn : -entry.amountOut)}
            </div>
            <div className="entry-card__buttons">
              <button className="chip" onClick={() => onEdit(entry)}>
                수정
              </button>
              <button className="chip" onClick={() => onDelete(entry.id)}>
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const FAB = () => (
    <button className="fab" onClick={() => resetForm("income")} aria-label="새 수입 추가">
      +
    </button>
  );

  return (
    <div className="app">
      <TopBar />
      <SideNav />
      <SummaryCards />
      <MonthSwitcher />
      <CalendarGrid />
      <DayDetail />
      <FAB />

      {showSettings && (
        <Modal onClose={() => setShowSettings(false)} title="프로필 / 초기 세팅">
          <div className="modal-grid">
            <Labeled label="사업자 유형">
              <select
                value={settings.businessType}
                onChange={(event) => setSettings({ ...settings, businessType: event.target.value as Settings["businessType"] })}
              >
                <option value="미지정">미지정</option>
                <option value="일반과세">일반과세</option>
                <option value="간이과세">간이과세</option>
                <option value="면세">면세</option>
              </select>
            </Labeled>
            <Labeled label="부가세율(%)">
              <input
                type="number"
                value={settings.vatRate}
                onChange={(event) => setSettings({ ...settings, vatRate: Number(event.target.value) })}
              />
            </Labeled>
            <Labeled label="시작 잔액(원)">
              <input
                type="number"
                value={settings.openingBalance}
                onChange={(event) => setSettings({ ...settings, openingBalance: Number(event.target.value) })}
              />
            </Labeled>
            <div className="modal-actions">
              <button className="primary" onClick={() => setShowSettings(false)}>
                저장
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showForm && (
        <Modal
          onClose={() => setShowForm(false)}
          title={editId ? "내역 수정" : formType === "income" ? "수입 추가" : "지출 추가"}
        >
          <div className="modal-grid">
            <div className="toggle-group">
              <button
                className={`toggle ${formType === "income" ? "toggle--active" : ""}`}
                onClick={() => setFormType("income")}
              >
                수입
              </button>
              <button
                className={`toggle ${formType === "expense" ? "toggle--active" : ""}`}
                onClick={() => setFormType("expense")}
              >
                지출
              </button>
            </div>
            <Labeled label="날짜">
              <input type="date" value={form.date ?? ""} onChange={(event) => setForm({ ...form, date: event.target.value })} />
            </Labeled>
            <Labeled label="금액">
              {formType === "income" ? (
                <input
                  type="number"
                  placeholder="0"
                  value={form.amountIn ?? ""}
                  onChange={(event) => setForm({ ...form, amountIn: Number(event.target.value) })}
                />
              ) : (
                <input
                  type="number"
                  placeholder="0"
                  value={form.amountOut ?? ""}
                  onChange={(event) => setForm({ ...form, amountOut: Number(event.target.value) })}
                />
              )}
            </Labeled>
            <Labeled label="카테고리">
              <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
                {CATEGORY_PRESET[formType].map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </Labeled>
            <div className="form-grid">
              <Labeled label="채널">
                <select value={form.channel} onChange={(event) => setForm({ ...form, channel: event.target.value })}>
                  <option value="라이브">라이브</option>
                  <option value="택배">택배</option>
                  <option value="오프라인">오프라인</option>
                </select>
              </Labeled>
              <Labeled label="결제수단">
                <select value={form.payment} onChange={(event) => setForm({ ...form, payment: event.target.value })}>
                  <option value="계좌">계좌</option>
                  <option value="현금">현금</option>
                  <option value="카드">카드</option>
                </select>
              </Labeled>
            </div>
            <Labeled label="주문번호">
              <input
                placeholder="주문번호"
                value={form.orderNo ?? ""}
                onChange={(event) => setForm({ ...form, orderNo: event.target.value })}
              />
            </Labeled>
            <Labeled label="메모">
              <input
                placeholder="메모"
                value={form.memo ?? ""}
                onChange={(event) => setForm({ ...form, memo: event.target.value })}
              />
            </Labeled>
            <div className="modal-actions modal-actions--split">
              {editId && (
                <button
                  className="secondary"
                  onClick={() => {
                    onDelete(editId);
                    setShowForm(false);
                  }}
                >
                  삭제
                </button>
              )}
              <div className="modal-actions__spacer" />
              <button className="primary" onClick={saveForm}>
                저장
              </button>
            </div>
          </div>
        </Modal>
      )}

      <style>{`
        .app {
          min-height: 100vh;
          background: #f3f4f6;
          color: #111827;
        }
        .top-bar {
          position: sticky;
          top: 0;
          z-index: 30;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1rem;
          height: 3.5rem;
          border-bottom: 1px solid #e5e7eb;
          background: #ffffff;
        }
        .top-bar__title {
          font-weight: 600;
          font-size: 1rem;
        }
        .icon-button {
          border: none;
          background: transparent;
          border-radius: 0.75rem;
          padding: 0.5rem;
          font-size: 1.125rem;
          line-height: 1;
          transition: background 0.2s ease;
        }
        .icon-button:hover {
          background: #e5e7eb;
        }
        .profile-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border: none;
          background: transparent;
          border-radius: 0.75rem;
          padding: 0.5rem;
          transition: background 0.2s ease;
        }
        .profile-button:hover {
          background: #e5e7eb;
        }
        .profile-avatar {
          width: 2rem;
          height: 2rem;
          border-radius: 9999px;
          background: #e5e7eb;
          display: grid;
          place-items: center;
          font-size: 1rem;
        }
        .side-nav {
          position: fixed;
          inset: 0;
          z-index: 40;
          pointer-events: none;
        }
        .side-nav--open {
          pointer-events: auto;
        }
        .side-nav__overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.35);
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .side-nav--open .side-nav__overlay {
          opacity: 1;
        }
        .side-nav__panel {
          position: absolute;
          inset: 0 auto 0 0;
          width: 18rem;
          background: #ffffff;
          padding: 1rem;
          box-shadow: 0 10px 25px rgba(15, 23, 42, 0.15);
          transform: translateX(-100%);
          transition: transform 0.25s ease;
        }
        .side-nav--open .side-nav__panel {
          transform: translateX(0);
        }
        .side-nav__title {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .side-nav__list {
          display: grid;
          gap: 0.5rem;
        }
        .side-nav__item {
          text-align: left;
          padding: 0.5rem 0.75rem;
          border-radius: 0.75rem;
          border: none;
          background: transparent;
          transition: background 0.2s ease;
        }
        .side-nav__item:hover {
          background: #f3f4f6;
        }
        .summary-grid {
          display: grid;
          gap: 0.75rem;
          padding: 1rem;
        }
        @media (min-width: 768px) {
          .summary-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        .card {
          padding: 1rem;
          border-radius: 1.25rem;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08);
        }
        .card__label {
          font-size: 0.75rem;
          color: #6b7280;
          margin-bottom: 0.25rem;
        }
        .card__value {
          font-size: 1.25rem;
          font-weight: 600;
        }
        .month-switcher {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1rem;
        }
        .month-switcher__label {
          font-size: 1.1rem;
          font-weight: 600;
        }
        .calendar {
          padding: 0 1rem 0.5rem;
        }
        .calendar__header {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          text-align: center;
          font-size: 0.75rem;
          color: #6b7280;
          margin-bottom: 0.25rem;
        }
        .calendar__header-cell {
          padding: 0.25rem 0;
        }
        .calendar__grid {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 0.35rem;
        }
        .calendar__cell {
          aspect-ratio: 1 / 1;
          border-radius: 1rem;
          border: 1px solid #e5e7eb;
          background: #ffffff;
          padding: 0.5rem;
          text-align: left;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          gap: 0.25rem;
          transition: box-shadow 0.2s ease, border 0.2s ease;
        }
        .calendar__cell--muted {
          background: #f9fafb;
          color: #9ca3af;
        }
        .calendar__cell--selected {
          border: 2px solid #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
        }
        .calendar__date {
          font-size: 0.75rem;
          font-weight: 600;
        }
        .calendar__amount {
          font-size: 0.625rem;
        }
        .calendar__amount--income {
          color: #047857;
        }
        .calendar__amount--expense {
          color: #dc2626;
        }
        .day-detail {
          padding: 1rem;
        }
        .day-detail__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .day-detail__date {
          font-size: 0.9rem;
          color: #4b5563;
        }
        .day-detail__actions {
          display: flex;
          gap: 0.5rem;
        }
        .chip {
          border-radius: 0.75rem;
          border: 1px solid #d1d5db;
          padding: 0.4rem 0.75rem;
          background: #f3f4f6;
          font-size: 0.75rem;
          transition: background 0.2s ease;
        }
        .chip:hover {
          background: #e5e7eb;
        }
        .day-detail__list {
          display: grid;
          gap: 0.75rem;
        }
        .day-detail__empty {
          font-size: 0.85rem;
          color: #6b7280;
        }
        .entry-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 1.25rem;
          border: 1px solid #e5e7eb;
          background: #ffffff;
        }
        .entry-card__title {
          font-size: 0.9rem;
          font-weight: 600;
        }
        .entry-card__meta {
          font-size: 0.75rem;
          color: #6b7280;
          margin-top: 0.15rem;
        }
        .entry-card__amount {
          font-weight: 600;
          font-size: 0.95rem;
          white-space: nowrap;
        }
        .entry-card__amount--income {
          color: #047857;
        }
        .entry-card__amount--expense {
          color: #dc2626;
        }
        .entry-card__buttons {
          display: flex;
          gap: 0.5rem;
        }
        .fab {
          position: fixed;
          right: 1.5rem;
          bottom: 1.5rem;
          width: 3.5rem;
          height: 3.5rem;
          border-radius: 9999px;
          border: none;
          background: #2563eb;
          color: #ffffff;
          font-size: 1.75rem;
          display: grid;
          place-items: center;
          box-shadow: 0 18px 30px rgba(37, 99, 235, 0.35);
        }
        .fab:hover {
          background: #1d4ed8;
        }
        .modal-grid {
          display: grid;
          gap: 0.75rem;
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
          margin-top: 0.25rem;
        }
        .modal-actions--split {
          align-items: center;
        }
        .modal-actions__spacer {
          flex: 1;
        }
        .primary {
          padding: 0.6rem 1rem;
          border-radius: 0.9rem;
          border: none;
          background: #2563eb;
          color: #ffffff;
          font-weight: 600;
        }
        .primary:hover {
          background: #1d4ed8;
        }
        .secondary {
          padding: 0.6rem 1rem;
          border-radius: 0.9rem;
          border: none;
          background: #e5e7eb;
          color: #374151;
          font-weight: 500;
        }
        .secondary:hover {
          background: #d1d5db;
        }
        .toggle-group {
          display: flex;
          gap: 0.5rem;
        }
        .toggle {
          flex: 1;
          padding: 0.5rem 0.75rem;
          border-radius: 0.75rem;
          border: 1px solid #d1d5db;
          background: #f9fafb;
        }
        .toggle--active {
          background: #2563eb;
          color: #ffffff;
          border-color: #2563eb;
        }
        .form-grid {
          display: grid;
          gap: 0.75rem;
        }
        @media (min-width: 480px) {
          .form-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        input,
        select {
          width: 100%;
          padding: 0.55rem 0.75rem;
          border-radius: 0.75rem;
          border: 1px solid #d1d5db;
          background: #ffffff;
        }
        input:focus,
        select:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }
        .modal {
          position: fixed;
          inset: 0;
          z-index: 50;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 4rem 1rem 2rem;
        }
        .modal__overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.35);
        }
        .modal__content {
          position: relative;
          z-index: 1;
          width: min(32rem, 100%);
          background: #ffffff;
          border-radius: 1.5rem;
          border: 1px solid #e5e7eb;
          box-shadow: 0 30px 50px rgba(15, 23, 42, 0.25);
          overflow: hidden;
        }
        .modal__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid #e5e7eb;
        }
        .modal__title {
          font-weight: 600;
        }
        .modal__body {
          padding: 1rem 1.25rem;
        }
      `}</style>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card">
      <div className="card__label">{title}</div>
      <div className="card__value">{children}</div>
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="modal">
      <div className="modal__overlay" onClick={onClose} />
      <div className="modal__content">
        <div className="modal__header">
          <div className="modal__title">{title}</div>
          <button className="icon-button" onClick={onClose} aria-label="닫기">
            {ICONS.close}
          </button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="labeled">
      <span className="labeled__text">{label}</span>
      {children}
      <style>{`
        .labeled {
          display: grid;
          gap: 0.3rem;
        }
        .labeled__text {
          font-size: 0.75rem;
          color: #6b7280;
        }
      `}</style>
    </label>
  );
}

function exportCSV(rows: Entry[]) {
  if (rows.length === 0) {
    alert("내보낼 데이터가 없습니다.");
    return;
  }
  const header = [
    "id",
    "date",
    "type",
    "amountIn",
    "amountOut",
    "category",
    "memo",
    "orderNo",
    "channel",
    "payment",
  ];
  const body = rows
    .map((row) =>
      [
        row.id,
        row.date,
        row.type,
        row.amountIn,
        row.amountOut,
        row.category,
        row.memo ?? "",
        row.orderNo ?? "",
        row.channel ?? "",
        row.payment ?? "",
      ].join(",")
    )
    .join("\n");
  const csv = `${header.join(",\")}\n${body}`;
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `entries_${format(new Date(), "yyyyMMdd")}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
