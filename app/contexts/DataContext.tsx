import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { MonthlyData, Expense } from '../types/expense';
import { getMonthlyData, getTodayString } from '../services/storage';

interface DataContextType {
  monthlyData: MonthlyData;
  todayExpenses: Expense[];
  refreshData: () => Promise<void>;
  setMonthlyData: (data: MonthlyData) => void;
  setTodayExpenses: (expenses: Expense[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [monthlyData, setMonthlyData] = useState<MonthlyData>({
    records: [],
    totals: {
      month: 0,
      today: 0,
      byCategory: {
        food: 0,
        transport: 0,
        daily: 0,
        entertainment: 0,
        other: 0,
      },
    },
  });
  const [todayExpenses, setTodayExpenses] = useState<Expense[]>([]);

  const refreshData = useCallback(async () => {
    try {
      const data = await getMonthlyData();
      setMonthlyData(data);
      
      const today = getTodayString();
      const todayRecords = data.records.filter((e) => e.date === today);
      todayRecords.sort((a, b) => a.timestamp - b.timestamp);
      setTodayExpenses(todayRecords);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  }, []);

  return (
    <DataContext.Provider
      value={{
        monthlyData,
        todayExpenses,
        refreshData,
        setMonthlyData,
        setTodayExpenses,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};