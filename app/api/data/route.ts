import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Usamos SERVICE_ROLE_KEY para asegurar lectura sin bloqueos de RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 });
  }

  try {
    // 1. Obtener User ID
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 2. Obtener TODAS las transacciones
    const { data: transactions, error: txError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: true });

    if (txError) {
      return NextResponse.json({ error: 'Error fetching transactions' }, { status: 500 });
    }

    // --- VARIABLES GLOBALES ---
    // NO usar toISOString() - convierte a UTC y cambia las fechas
    // Calcular el mes actual y anterior como strings YYYY-MM usando la fecha local
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 01-12
    const currentMonthKey = `${year}-${month}`; // e.g., "2026-01"
    
    // Calcular mes anterior
    let prevYear = year;
    let prevMonth = parseInt(month) - 1;
    if (prevMonth < 1) {
      prevMonth = 12;
      prevYear = year - 1;
    }
    const prevMonthKey = `${prevYear}-${String(prevMonth).padStart(2, '0')}`; // e.g., "2025-12"

    // Acumuladores
    const kpi = { local: { balance: 0, ingresos: 0, egresos: 0, ahorros: 0 }, usd: { balance: 0, ingresos: 0, egresos: 0, ahorros: 0 } };
    const cats: Record<string, { ars: number; usd: number; total_ref: number }> = {};
    const methods: Record<string, { ars: number; usd: number; total_ref: number }> = {};
    
    // Mapa Diario (Relleno con 0)
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const dailyMap = new Map();
    for (let i = 1; i <= daysInMonth; i++) {
      dailyMap.set(i, { ars: 0, usd: 0, total_ref: 0 });
    }

    // Analytics
    let anCurrLocal = 0, anCurrUsd = 0;
    let anPrevLocal = 0, anPrevUsd = 0;

    // --- TOP GASTOS DEL MES ---
    const expensesOfMonth: any[] = [];

    // --- PROCESAMIENTO ---
    transactions?.forEach(t => {
      // 1. Parsing Seguro de Montos
      const amount = Number(t.amount) || 0;
      const amountArs = Number(t.amount_ars) || amount;
      const isUsd = t.currency === 'USD';
      
      // 2. Parsing Seguro de Tipos
      const typeUpper = (t.type || '').toUpperCase();
      const isIncome = typeUpper.includes('INGRESO');
      const isSavings = typeUpper.includes('AHORRO'); // Detects both 'AHORRO' and 'AHORROS'
      const isExpense = ['GASTO', 'EGRESO', 'PAGO', 'COMPRA', 'DEBITO', 'OUTCOME'].some(k => typeUpper.includes(k)) || (t.installments_total > 1);

      // 3. Fecha
      const tDate = new Date(t.date);
      if (isNaN(tDate.getTime())) return; 

      // Claves
      const tDateStr = t.date.split('T')[0];
      const tMonthKey = tDateStr.slice(0, 7); // YYYY-MM
      const tDay = parseInt(tDateStr.split('-')[2]) || tDate.getDate();

      // A. KPI HISTÓRICOS
      if (isIncome) {
        if (isUsd) { kpi.usd.ingresos += amount; kpi.usd.balance += amount; }
        else { kpi.local.ingresos += amount; kpi.local.balance += amount; }
      } else if (isSavings) {
        // Ahorros se registran por separado, NO afectan el balance
        if (isUsd) { kpi.usd.ahorros += amount; }
        else { kpi.local.ahorros += amount; }
      } else if (isExpense) {
        if (isUsd) { kpi.usd.egresos += amount; kpi.usd.balance -= amount; }
        else { kpi.local.egresos += amount; kpi.local.balance -= amount; }
      }

      // B. ANALYTICS (Solo Mes Actual y Anterior)
      if (isExpense) {
        if (tMonthKey === currentMonthKey) {
          if (isUsd) anCurrUsd += amount; else anCurrLocal += amount;
          
          // Categorías
          const cat = t.category || 'Varios';
          if (!cats[cat]) cats[cat] = { ars: 0, usd: 0, total_ref: 0 };
          if (isUsd) cats[cat].usd += amount; else cats[cat].ars += amount;
          cats[cat].total_ref += amountArs;

          // Métodos
          const method = t.payment_method || 'Otros';
          if (!methods[method]) methods[method] = { ars: 0, usd: 0, total_ref: 0 };
          if (isUsd) methods[method].usd += amount; else methods[method].ars += amount;
          methods[method].total_ref += amountArs;

          // Diario
          if (dailyMap.has(tDay)) {
            const current = dailyMap.get(tDay);
            dailyMap.set(tDay, {
                ars: current.ars + (isUsd ? 0 : amount),
                usd: current.usd + (isUsd ? amount : 0),
                total_ref: current.total_ref + amountArs
            });
          }

          // Guardar para Top Gastos - usar solo la parte YYYY-MM-DD sin conversión a zona horaria
          const [dateOnly] = t.date.split('T'); // "2026-01-31"
          const [txYear, txMonth, txDay] = dateOnly.split('-');
          expensesOfMonth.push({
            id: t.id,
            description: t.description || 'Sin descripción',
            category: t.category || 'Otros',
            amount: amount,
            currency: t.currency === 'USD' ? 'USD' : 'PESOS',
            formatted_date: `${txDay}/${txMonth}` // "31/01"
          });

        } else if (tMonthKey === prevMonthKey) {
          if (isUsd) anPrevUsd += amount; else anPrevLocal += amount;
        }
      }
    });

    // --- FORMATEO FINAL ---

    const chartData = Object.keys(cats)
      .map(k => ({ name: k, value: cats[k].total_ref, ars: cats[k].ars, usd: cats[k].usd }))
      .sort((a, b) => b.value - a.value);

    const methodsData = Object.keys(methods)
      .map(k => ({ name: k, value: methods[k].total_ref, ars: methods[k].ars, usd: methods[k].usd }))
      .sort((a, b) => b.value - a.value);

    const dailySpending = Array.from(dailyMap.entries())
      .map(([day, val]) => ({ day, amount: val.total_ref, ars: val.ars, usd: val.usd }))
      .sort((a, b) => a.day - b.day);

    // Calcular Top 5 Gastos
    const topExpenses = expensesOfMonth
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

    const allTransactions = [...transactions].reverse().map(t => {
      // Parsear fecha ISO sin conversión a zona horaria
      const [dateOnly, timeWithZ] = t.date.split('T'); // "2026-01-31" y "23:00:00Z"
      const timePart = timeWithZ?.split('Z')[0] || '00:00:00'; // "23:00:00"
      const [txYear, txMonth, txDay] = dateOnly.split('-');
      const [hours, minutes] = timePart.split(':');
      
      // Formatear como DD/MM/YYYY HH:MM (sin conversión de zona horaria)
      const formattedDate = `${txDay}/${txMonth}/${txYear} ${hours}:${minutes}`;
      
      return {
        id: t.id,
        fecha: formattedDate,
        descripcion: t.description || '',
        categoria: t.category || 'Sin categoría',
        monto: Number(t.amount) || 0,
        moneda: t.currency === 'USD' ? 'USD' : 'PESOS',
        tipo: t.type || 'EGRESO',
        metodo: t.payment_method || 'Otros',
        installments_total: t.installments_total,
        installment_number: t.installment_number,
        date_iso: t.date
      };
    });

    return NextResponse.json({
      kpi,
      chartData,
      methodsData,
      dailySpending,
      recentTransactions: allTransactions.slice(0, 10),
      allTransactions,
      topExpenses, // <--- AQUÍ VA LA NUEVA DATA
      analytics: {
        totalCurrent: anCurrLocal,
        totalPrevious: anPrevLocal,
        current: { local: anCurrLocal, usd: anCurrUsd },
        previous: { local: anPrevLocal, usd: anPrevUsd },
        methods: methodsData
      }
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
