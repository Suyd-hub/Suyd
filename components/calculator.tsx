"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Asterisk, PaintbrushVertical, Hash, FileText, Book, History, Eye , Star, Box} from 'lucide-react'; // 添加新图标
import Link from 'next/link'; // 导入Link组件用于导航
import { useLanguage } from './LanguageContext';

// 定义历史记录项的接口
interface HistoryItem {
  id: string;
  timestamp: number;
  value: string;
  assessment: string;
  assessmentColor: string;
  paper_length: string;
  paper_width: string;
  paper_weight: string;
  paper_effect: string;
  paper2_weight: string;
  paper2_effect: string;
  tiechuang_length: string;
  tiechuang_width: string;
  tiechuang_weight: string;
  tiechuang_effect: string;
  jinkaCode: string;
  loss: string;
  pages: string;
  pinnumber: string;
  countryName: string;
  
  // 添加所有需要在分享页面展示的字段
  cityFactor: string;
  workHours: string;
  commuteHours: string;
  restTime: string;
  dailySalary: string;
  workDaysPerYear: string;
  workDaysPerWeek: string;
  wfhDaysPerWeek: string;
  annualLeave: string;
  paidSickLeave: string;
  publicHolidays: string;
  workEnvironment: string;
  leadership: string;
  teamwork: string;
  degreeType: string;
  schoolType: string;
  education: string;
  homeTown: string;
  shuttle: string;
  canteen: string;
  jinkaselect: string;
  printselect: string;
  tiechuangselect: string;  
  huheselect: string;
  fumoselect: string;  
  tangjinelect: string;    
  gongyi: string;
  walengvalue: string;
  duibiaovalue: string;
  bachelorType: string;
  paper2: boolean;
  jinka: boolean;
  waleng: boolean;
  fumo: boolean;  
  duibiao: boolean;  
  nixiang: boolean;
  tangjin: boolean;  
  muoqie: boolean;  
  yawen: boolean;  
  tiechuang: boolean;  
  huhe: boolean; 
  hasCanteen: boolean;
}

// 定义表单数据接口
interface FormData {
  paper_length: string;
  paper_width: string;
  paper_weight: string;
  paper_effect: string;
  paper2_weight: string;
  paper2_effect: string;
  tiechuang_length: string;
  tiechuang_width: string;
  tiechuang_weight: string;
  tiechuang_effect: string;
  loss: string;
  pages: string;
  pinnumber: string;
  nonChinaSalary: boolean;
  workDaysPerWeek: string;
  wfhDaysPerWeek: string;
  annualLeave: string;
  paidSickLeave: string;
  publicHolidays: string;
  workHours: string;
  commuteHours: string;
  restTime: string;
  cityFactor: string;
  workEnvironment: string;
  leadership: string;
  teamwork: string;
  homeTown: string;
  degreeType: string;
  schoolType: string;
  bachelorType: string;
  jinkaselect: string;
  printselect:string;
  tiechuangselect: string;  
  huheselect: string;
  fumoselect: string;
  tangjinselect: string;  
  shuttle: string;
  canteen: string;
  gongyi: string;
  walengvalue: string;
  duibiaovalue: string;
  education: string;
  paper2: boolean;
  jinka: boolean;
  waleng: boolean;
  fumo: boolean;  
  duibiao: boolean;  
  nixiang: boolean;
  tangjin: boolean;  
  muoqie: boolean;  
  yawen: boolean;  
  tiechuang: boolean;  
  huhe: boolean; 
  hasCanteen: boolean;
}

// 定义计算结果接口
interface Result {
  value: number;
  workDaysPerYear: number;
  dailySalary: number;
  assessment: string;
  assessmentColor: string;
}

const SalaryCalculator = () => {

  // 获取语言上下文
  const { t, language } = useLanguage();

  // 添加客户端检测
  const [isBrowser, setIsBrowser] = useState(false);
  
  // 添加滚动位置保存的引用
  const scrollPositionRef = useRef(0);
  
  // 添加历史记录状态
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  
  //// 在组件挂载时标记为浏览器环境
  // useEffect(() => {
  //   setIsBrowser(true);
    
  //   // 在客户端环境中执行重定向
  //   if (typeof window !== 'undefined') {
  //     const hostname = window.location.hostname;
  //     if (hostname !== 'worthjob.zippland.com' && hostname !== 'localhost' && !hostname.includes('127.0.0.1')) {
  //       window.location.href = 'https://worthjob.zippland.com' + window.location.pathname;
  //     }
  //   }
  // }, []);
  // 添加用于创建分享图片的引用
  const shareResultsRef = useRef<HTMLDivElement>(null);

  // 状态管理 - 基础表单和选项
  const [formData, setFormData] = useState<FormData>({
    paper_length: '0.85',
    paper_width:'0.5',
    paper_weight:'0.0004',
    paper_effect:'4600',
    paper2_weight:'0.00025',
    paper2_effect:'4300',
    tiechuang_length: '0.1',
    tiechuang_width: '0.1',
    tiechuang_weight: '0.0004',
    tiechuang_effect: '11000',
    loss: '1.002',
    pages: '5000', 
    walengvalue: '1.3',
    duibiaovalue: '0.35',
    pinnumber: '2',  
    nonChinaSalary: false,
    workDaysPerWeek: '5',
    wfhDaysPerWeek: '0',
    annualLeave: '5',
    paidSickLeave: '3',
    publicHolidays: '13',
    workHours: '10',
    commuteHours: '2',
    restTime: '2',
    cityFactor: '1.0',
    workEnvironment: '1.0',
    leadership: '1.0',
    teamwork: '1.0',
    homeTown: 'no',
    degreeType: 'bachelor',
    schoolType: 'firstTier',
    bachelorType: 'firstTier',
    jinkaselect: '0.75',
    printselect: '600',
    tiechuangselect: '0.05',
    huheselect: '0.025',
    fumoselect: '0.55' ,
    tangjinselect: '0.1',  
    shuttle: '1.0',
    canteen: '1.0',
    gongyi: 'private',  
    education: '1.0',
    paper2: false,         // 确保这是一个明确的布尔值
    jinka: false,         // 确保这是一个明确的布尔值 
    waleng: false,         // 确保这是一个明确的布尔值
    fumo: false,         // 确保这是一个明确的布尔值   
    duibiao: false,         // 确保这是一个明确的布尔值  
    nixiang: false,         // 确保这是一个明确的布尔值
    tangjin: false,         // 确保这是一个明确的布尔值   
    muoqie: false,         // 确保这是一个明确的布尔值  
    yawen: false,         // 确保这是一个明确的布尔值  
    tiechuang: false,         // 确保这是一个明确的布尔值  
    huhe: false,         // 确保这是一个明确的布尔值  
    hasCanteen: false,         // 确保这是一个明确的布尔值tangjin
  });

  const [showPPPInput, setShowPPPInput] = useState(false);
  // 修改为金卡代码，默认为涤纶金卡
  const [selectedjinka, setSelectedjinka] = useState<string>("涤纶金银");
  
  // 初始化时从localStorage加载金卡设置
  useEffect(() => {
    // 从本地存储读取金卡设置
    if (typeof window !== 'undefined') {
      const savedCountry = localStorage.getItem('setSelectedjinka');
      if (savedCountry) {
        setSelectedjinka(savedCountry);
      }
    }
  }, []);

  // 当金卡选择改变时保存到localStorage
  const handleCountryChange = (jinkaCode: string) => {
    setSelectedjinka(jinkaCode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedjinka', jinkaCode);
    }
  };

  const [result, setResult] = useState<Result | null>(null);
  const [showPPPList, setShowPPPList] = useState(false);
  const [assessment, setAssessment] = useState("");
  const [assessmentColor, setAssessmentColor] = useState("text-gray-500");
  const [visitorVisible, setVisitorVisible] = useState(false);

  const handleInputChange = useCallback((name: string, value: string | boolean) => {
    // 触发自定义事件，保存滚动位置
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('beforeStateChange'));
    }
    
    // 直接设置值，不进行任何验证
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 在状态更新后，触发恢复滚动位置事件
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('afterStateChange'));
      }
    }, 0);
  }, []);

  //单张材料价格算法
  const materialprice_perpaper = useCallback(() => {
    let total = 0;

    // 基础材料
    total +=
      Number(formData.paper_length) *
      Number(formData.paper_width) *
      Number(formData.paper_weight) *
      Number(formData.paper_effect);

    // 卡纸2
    if (formData.paper2) {
      total +=
        Number(formData.paper_length) *
        Number(formData.paper_width) *
        Number(formData.paper2_weight) *
        Number(formData.paper2_effect);
    }

    // 金卡
    if (formData.jinka) {
      total +=
        Number(formData.paper_length) *
        Number(formData.paper_width) *
        Number(formData.jinkaselect);
    }

    // 瓦楞
    if (formData.waleng) {
      total +=
        Number(formData.paper_length) *
        Number(formData.paper_width) *
        Number(formData.walengvalue);
    }

    return total.toFixed(3);
  }, [
    formData.paper_length,
    formData.paper_width,
    formData.paper_weight,
    formData.paper_effect,
    formData.paper2,
    formData.paper2_weight,
    formData.paper2_effect,
    formData.jinka,
    formData.jinkaselect,
    formData.waleng,
    formData.walengvalue,
  ]);

  //工艺类型价格算法
  const processprice = useCallback(() => {
    let total = 0;

    // 覆膜
    if (formData.fumo) {
      total +=
        Number(formData.paper_length) *
        Number(formData.paper_width) *
        Number(formData.fumoselect);
    }

    // 对裱
    if (formData.duibiao) {
      total +=
        Number(formData.paper_length) *
        Number(formData.paper_width) *
        Number(formData.duibiaovalue);
    }

    return total.toFixed(3);
  }, [
    formData.paper_length,
    formData.paper_width,
    formData.fumo,
    formData.fumoselect,
    formData.duibiao,
    formData.duibiaovalue,
  ]);

  //印刷工艺价格算法
  const printprice = useCallback(() => {
    let total = 0;

    // 印刷
    if (Number(formData.pages) >= 3000) {
      if (Number(formData.printselect) == 1100) {
        total += (Number(formData.printselect) + 4 * 0.06 * (Number(formData.pages) - 3000))/Number(formData.pages) ;
      }
      if (Number(formData.printselect) == 1300) {
        total += (Number(formData.printselect) + 5 * 0.06 * (Number(formData.pages) - 3000))/Number(formData.pages) ;
      }
      if (Number(formData.printselect) == 1600) {
        total += (Number(formData.printselect) + 6 * 0.06 * (Number(formData.pages) - 3000))/Number(formData.pages) ;
      }
      if (Number(formData.printselect) == 2000) {
        total += (Number(formData.printselect) + 7 * 0.06 * (Number(formData.pages) - 3000))/Number(formData.pages) ;
      }
      if (Number(formData.printselect) == 2400) {
        total += (Number(formData.printselect) + 8 * 0.06 * (Number(formData.pages) - 3000))/Number(formData.pages) ;
      }
      if (Number(formData.printselect) == 450) {
        total += (Number(formData.printselect) + 4 * 0.025 * (Number(formData.pages) - 3000))/Number(formData.pages) ;
      }
      if (Number(formData.printselect) == 600) {
        total += (Number(formData.printselect) + 5 * 0.025 * (Number(formData.pages) - 3000))/Number(formData.pages) ;
      }
      if (Number(formData.printselect) == 900) {
        total += (Number(formData.printselect) + 6 * 0.025 * (Number(formData.pages) - 3000))/Number(formData.pages) ;
      }
    }

    else {
      if (Number(formData.printselect) == 1100) {
        total += Number(formData.printselect) / Number(formData.pages) ;
      }
      if (Number(formData.printselect) == 1300) {
        total += Number(formData.printselect) / Number(formData.pages) ;
      }
      if (Number(formData.printselect) == 1600) {
        total += Number(formData.printselect) / Number(formData.pages) ;
      }
      if (Number(formData.printselect) == 2000) {
        total += Number(formData.printselect) / Number(formData.pages) ;
      }
      if (Number(formData.printselect) == 2400) {
        total += Number(formData.printselect) / Number(formData.pages) ;
      }
      if (Number(formData.printselect) == 450) {
        total += Number(formData.printselect) / Number(formData.pages) ;
      }
      if (Number(formData.printselect) == 600) {
        total += Number(formData.printselect) / Number(formData.pages) ;
      }
      if (Number(formData.printselect) == 900) {
        total += Number(formData.printselect) /Number(formData.pages) ;
      }
    }

    // 逆向UV
    if (formData.nixiang) {
      if (Number(formData.pages) >= 3000) {
        total += Number(formData.nixiang) * Number(formData.paper_length) * Number(formData.paper_width) * 0.5;
      }
      else{
        total += (Number(formData.nixiang) * Number(formData.paper_length) * Number(formData.paper_width) * 0.5 * 3000)/ Number(formData.pages);
      }
    }


    return total.toFixed(3);
  }, [
    formData.paper_length,
    formData.paper_width,
    formData.nixiang,
    formData.pages,
    formData.printselect,
  ]);

  //特殊工艺价格算法
  const specialprice = useCallback(() => {
    let total = 0;

    // 烫金
    if (formData.tangjin) {
      total +=
        Number(formData.tangjinselect);
    }

    // 模切
    if (formData.muoqie) {
      if (formData.fumo) {
        total += 0.1
      }
      else{
        total += 0.06
      }
    }

    // 压纹
    if (formData.yawen) {
      total += 0.1
    }

    return total.toFixed(3);
  }, [
    formData.tangjin,
    formData.tangjinselect,
    formData.muoqie,
    formData.fumo,
    formData.yawen,

  ]);

  //贴窗价格算法
  const tiechuangprice = useCallback(() => {
    let total = 0;

    // 贴窗膜
    if (formData.tiechuang) {
      total +=
        Number(formData.tiechuangselect) +
        Number(formData.tiechuang_length) *
        Number(formData.tiechuang_weight) *
        Number(formData.tiechuang_width);
    }

    //糊盒
    if (formData.huhe) {
      total +=
        Number(formData.huheselect);
    }

    return total.toFixed(3);
  }, [
    formData.tiechuang,
    formData.tiechuangselect,
    formData.tiechuang_length,
    formData.tiechuang_weight,
    formData.tiechuang_width,
    formData.huhe,
    formData.huheselect,
  ]);

  //单张纸价格算法
  const calculateperpaper = useCallback(() => {
    const material = Number(materialprice_perpaper());
    const process  = Number(processprice());
    const print    = Number(printprice());
    const special  = Number(specialprice());

    return ((material + process + print + special) * Number(formData.loss) ).toFixed(3);
  }, [
    materialprice_perpaper,
    processprice,
    printprice,
    specialprice,
    tiechuangprice,
    formData.loss,
  ]);

  //单个产品算法
  const calculateperprodcut = useCallback(() => {
    const perpaper = Number(calculateperpaper());
    const tiechuang= Number(tiechuangprice());

    return (perpaper / Number(formData.pinnumber) + tiechuang ).toFixed(3);
  }, [
    calculateperpaper,
    tiechuangprice,
    formData.pinnumber,
  ]);


  //选择按钮
  const RadioGroup = ({ label, name, value, onChange, options }: {
    label: string;
    name: string;
    value: string;
    onChange: (name: string, value: string | boolean) => void;
    options: Array<{ label: string; value: string; }>;
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <div className={`grid ${language === 'en' ? 'grid-cols-3' : 'grid-cols-4'} gap-2`}>
        {options.map((option) => (
          <button
            key={option.value}
            className={`px-3 py-2 rounded-md text-sm transition-colors
              ${value === option.value 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-medium' 
                : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'}`}
            onClick={(e) => {
              e.preventDefault(); // 阻止默认行为
              e.stopPropagation(); // 阻止事件冒泡
              onChange(name, option.value);
            }}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (    
  <div className="max-w-2xl mx-auto p-4 sm:p-6">
    {/* 标题 */}
    <div className="mb-4 text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 py-2">{t('title')}</h1>

      <div className="mb-3">
        <a
          className="text-sm text-gray-600 dark:text-gray-300 transition-colors inline-flex items-center gap-1.5"
        >
          <Box className="h-3.5 w-3.5" />
          {t('version')}
        </a>

        {/* 仅在客户端渲染历史记录按钮 */}
        {isBrowser && (
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-sm text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <History className="h-3.5 w-3.5" />
            {t('history')}
          </button>
        )}
      </div>
    </div>

    {/* 主运算程序 */}
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl shadow-gray-200/50 dark:shadow-black/30">
      <div className="p-6 space-y-8">
        {/* 基本信息 */}
        <div className="space-y-6">
          <label className="block text-m font-medium text-gray-700 dark:text-gray-300">基本信息</label>
          <div className="grid grid-cols-3 gap-4 ">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">长度（米）</label>
              <input
                type="number"
                value={formData.paper_length}
                onChange={(e) => handleInputChange('paper_length', e.target.value)}
                step="0.01"
                className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">宽度（米）</label>
              <input
                type="number"
                value={formData.paper_width}
                onChange={(e) => handleInputChange('paper_width', e.target.value)}
                step="0.01"
                className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">重量（吨）</label>
              <input
                type="number"
                value={formData.paper_weight}
                onChange={(e) => handleInputChange('paper_weight', e.target.value)}
                step="0.0001"
                className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"/>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">系数</label>
            <div className="flex items-center gap-2 mt-1">
              <Asterisk className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <input
                type="number"
                value={formData.paper_effect}
                onChange={(e) => handleInputChange('paper_effect', e.target.value)}
                step="100"
                className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"/>
            </div>
          </div>
        </div>

        {/* 纸张类型 算法参照是否有班车部分*/}
        <div className="space-y-6 mb-2">
          {/* 基本信息按钮行 */}
          <div className="flex space-x-2 mb-2">
            {/* 卡纸2金按钮 */}
            <div>
              <button
                type="button"
                onClick={() => handleInputChange('paper2', !formData.paper2)}
                className={`px-8 py-3 rounded-md text-sm transition-colors whitespace-nowrap overflow-hidden ${
                  formData.paper2 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-medium' 
                    : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
                }`}
              >
                <label
                  htmlFor="paper2"
                  className="flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {t('卡纸2')}
                </label>
              </button>
            </div>

            {/* 金卡按钮 */}
            <div>
              <button
                type="button"
                onClick={() => handleInputChange('jinka', !formData.jinka)}
                className={`px-8 py-3 rounded-md text-sm transition-colors whitespace-nowrap overflow-hidden ${
                  formData.jinka 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-medium' 
                    : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
                }`}
              >
                <label
                  htmlFor="jinka"
                  className="flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {t('金卡')}
                </label>
              </button>
            </div>
            {/* 瓦楞按钮 */}
            <div>
              <button
                type="button"
                onClick={() => {handleInputChange('waleng', !formData.waleng);}}
                className={`px-8 py-3 rounded-md text-sm transition-colors whitespace-nowrap overflow-hidden ${
                  formData.waleng
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-medium'
                    : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
                }`}
              >
                <label
                  htmlFor="waleng"
                  className="flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {t('瓦楞')}
                </label>
              </button>
            </div>
          </div>

          {/* 卡纸2隐藏选项 */}
          {formData.paper2 && (
            <div className="grid grid-cols-2 gap-4">
              {/* 重量 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  重量（吨）
                </label>
                <input
                  type="number"
                  value={formData.paper2_weight}
                  onChange={(e) => handleInputChange('paper2_weight', e.target.value)}
                  step="0.00001"
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>

              {/* 卡纸2系数 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  卡纸2系数
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    value={formData.paper2_effect}
                    onChange={(e) => handleInputChange('paper2_effect', e.target.value)}
                    step="100"
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 金卡隐藏选项 算法参照工作年限部分workyears*/}
          {formData.jinka && (
          <div className="grid grid-cols-1 gap-4 ">
            <select
              value={formData.jinkaselect}
              onChange={(e) => handleInputChange('jinkaselect', e.target.value)}
              className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
            >
              <option value="0.75">{t('涤纶金银(0.75)')}</option>
              <option value="0.85">{t('素面金银(0.85)')}</option>
              <option value="0.85">{t('铝箔金银(0.85)')}</option>
            </select>
          </div>
          )}

          <div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('单张材料价格/元')}</div>
            <div className="text-xl font-semibold mt-1 text-gray-900 dark:text-white">{materialprice_perpaper()}元</div>
          </div>

          {/* 分界线 */}
          <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>

        </div>

        {/* 工艺类型 */}
        <div className="space-y-6">
          <label className="block text-m font-medium text-gray-700 dark:text-gray-300">工艺类型</label>

          <div className="space-y-6 mb-2">
            {/* 工艺类型按钮行 */}
            <div className="flex space-x-2 mb-2">
              {/* 覆膜按钮 */}
              <div>
                <button
                  type="button"
                  onClick={() => handleInputChange('fumo', !formData.fumo)}
                  className={`px-9 py-3 rounded-md text-sm transition-colors whitespace-nowrap overflow-hidden ${
                    formData.fumo ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-medium' 
                      : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
                  }`}
                >
                  <label
                    htmlFor="fumo"
                    className="flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {t('覆膜')}
                  </label>
                </button>
              </div>

              {/* 对裱按钮 */}
              <div>
                <button
                  type="button"
                  onClick={() => {handleInputChange('duibiao', !formData.duibiao);                  }}
                  className={`px-9 py-3 rounded-md text-sm transition-colors whitespace-nowrap overflow-hidden ${
                    formData.duibiao ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-medium' 
                      : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
                  }`}
                >
                  <label
                    htmlFor="duibiao"
                    className="flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {t('对裱')}
                  </label>
                </button>
              </div>
            </div>

            {/* 选择框行 */}
            {formData.fumo && (
              <div className="mt-2">
                <select
                  value={formData.fumoselect}
                  onChange={(e) => handleInputChange('fumoselect', e.target.value)}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                >
                  <option value="0.55">{t('覆膜（opp）哑膜 0.55')}</option>
                  <option value="0.7">{t('覆膜（pet）0808 0.7')}</option>
                  <option value="0.1">{t('覆膜（pet）1210 1')}</option>
                  <option value="0.3">{t('上油 0.3')}</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('单张工艺/元')}</div>
            <div className="text-xl font-semibold mt-1 text-gray-900 dark:text-white">{processprice()}元</div>
          </div>

          {/* 分界线 */}
          <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>
        </div>

        {/* 印刷工艺 */}
        <div className="space-y-6">
          <label className="block text-m font-medium text-gray-700 dark:text-gray-300">印刷工艺</label>
        
          <div>
            <div className="flex items-center gap-2 mt-1">
              <PaintbrushVertical className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <select
                value={formData.printselect}
                onChange={(e) => handleInputChange('printselect', e.target.value)}
                className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
              >
                <option value="1100">{t('UV印刷4')}</option>
                <option value="1300">{t('UV印刷5')}</option>
                <option value="1600">{t('UV印刷6')}</option>
                <option value="2000">{t('UV印刷7')}</option>
                <option value="2400">{t('UV印刷8')}</option>
                <option value="450">{t('普通印刷4')}</option>
                <option value="600">{t('普通印刷5')}</option>
                <option value="900">{t('普通印刷6')}</option>
              </select>
            </div>
          </div>

          {/* 逆向UV */}
          <div className="flex items-center mb-2">
            <input
              id="nixiang"
              type="checkbox"
              checked={formData.nixiang === true}
              onChange={(e) => handleInputChange('nixiang', e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="paper2" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('逆向UV')}
            </label>
          </div>

          <div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('印刷工艺/元')}</div>
            <div className="text-xl font-semibold mt-1 text-gray-900 dark:text-white">{printprice()}元</div>
          </div>

          {/* 分界线 */}
          <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>

        </div>

        {/* 特殊工艺 */}
        <div className="space-y-6">
          <label className="block text-m font-medium text-gray-700 dark:text-gray-300">特殊工艺</label>

          <div className="space-y-6 mb-2">
            {/* 特殊工艺按钮行 */}
            <div className="flex space-x-2 mb-2">
              {/* 烫金按钮 */}
              <div>
                <button
                  type="button"
                  onClick={() => handleInputChange('tangjin', !formData.tangjin)}
                  className={`px-8 py-3 rounded-md text-sm transition-colors whitespace-nowrap overflow-hidden ${
                    formData.tangjin ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-medium' 
                      : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
                  }`}
                >
                  <label
                    htmlFor="tangjin"
                    className="flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {t('烫金')}
                  </label>
                </button>
              </div>

              {/* 模切按钮 */}
              <div>
                <button
                  type="button"
                  onClick={() => handleInputChange('muoqie', !formData.muoqie)}
                  className={`px-8 py-3 rounded-md text-sm transition-colors whitespace-nowrap overflow-hidden ${
                    formData.muoqie ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-medium' 
                      : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
                  }`}
                >
                  <label
                    htmlFor="muoqie"
                    className="flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {t('模切')}
                  </label>
                </button>
              </div>
              {/* 压纹按钮 */}
              <div>
                <button
                  type="button"
                  onClick={() => handleInputChange('yawen', !formData.yawen)}
                  className={`px-8 py-3 rounded-md text-sm transition-colors whitespace-nowrap overflow-hidden ${
                    formData.yawen ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-medium' 
                      : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
                  }`}
                >
                  <label
                    htmlFor="yawen"
                    className="flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {t('压纹')}
                  </label>
                </button>
              </div>
            </div>

            {/* 选择框行 */}
            {formData.tangjin && (
              <div className="mt-2">
                <select
                  value={formData.tangjinselect}
                  onChange={(e) => handleInputChange('tangjinselect', e.target.value)}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                >
                  <option value="0.1">{t('1处烫金')}</option>
                  <option value="0.2">{t('2处烫金')}</option>
                  <option value="0.3">{t('3处烫金')}</option>
                  <option value="0.4">{t('4处烫金')}</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('特殊工艺/元')}</div>
            <div className="text-xl font-semibold mt-1 text-gray-900 dark:text-white">{specialprice()}元</div>
          </div>

          {/* 分界线 */}
          <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>
        </div>

        {/* 贴窗工艺 算法参照是否有班车部分*/}
        <div className="space-y-6">
          <label className="block text-m font-medium text-gray-700 dark:text-gray-300">贴窗工艺</label>
          {/* 贴窗膜 */}
          <div className="flex items-center mb-2">
            <input
              id="tiechuang"
              type="checkbox"
              checked={formData.tiechuang === true}
              onChange={(e) => handleInputChange('tiechuang', e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="paper2" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('贴窗膜 (pet)')}
            </label>
          </div>
          {/* 贴窗隐藏选项 算法参照工作年限部分workyears*/}
          {formData.tiechuang && (
            <div className="grid grid-cols-3 gap-4">
              {/* 贴窗长度 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  贴窗长度（米）
                </label>
                <input
                  type="number"
                  value={formData.tiechuang_length}
                  onChange={(e) => handleInputChange('tiechuang_length', e.target.value)}
                  step="0.01"
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>

              {/* 贴窗宽度 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  贴窗宽度（米）
                </label>
                <input
                  type="number"
                  value={formData.tiechuang_width}
                  onChange={(e) => handleInputChange('tiechuang_width', e.target.value)}
                  step="0.01"
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>

              {/* 贴窗重量 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  贴窗重量（吨）
                </label>
                <input
                  type="number"
                  value={formData.tiechuang_weight}
                  onChange={(e) => handleInputChange('tiechuang_weight', e.target.value)}
                  step="0.01"
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>

              {/* 贴窗系数 */}
              {/* <div className="col-span-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  贴窗系数
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Hash className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <input
                    type="number"
                    value={formData.tiechuang_effect}
                    onChange={(e) => handleInputChange('tiechuang_effect', e.target.value)}
                    step="100"
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                  />
                </div>
              </div> */}

              {/* 下拉选择 */}
              <div className="col-span-3">
                <select
                  value={formData.tiechuangselect}
                  onChange={(e) => handleInputChange('tiechuangselect', e.target.value)}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                >
                  <option value="0.05">{t('小窗0.05元')}</option>
                  <option value="0.1">{t('大窗0.1元')}</option>
                </select>
              </div>
            </div>
          )}

          

          {/* 糊盒 */}
          <div className="flex items-center mb-2">
            <input
              id="huhe"
              type="checkbox"
              checked={formData.huhe === true}
              onChange={(e) => handleInputChange('huhe', e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="paper2" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('糊盒')}
            </label>
          </div>
          {/* 糊盒隐藏选项 算法参照工作年限部分workyears*/}
          {formData.huhe && (
          <div className="grid grid-cols-1 gap-4 ">
            
            <select
              value={formData.huheselect}
              onChange={(e) => handleInputChange('huheselect', e.target.value)}
              className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
            >
              <option value="0.025">{t('白卡（小）0.025')}</option>
              <option value="0.05">{t('白卡(中）0.05')}</option>
              <option value="0.1">{t('白卡（大）/ 瓦楞（大0.1）')}</option>
              <option value="0.06">{t('瓦楞（小）0.06')}</option>
            </select>
          </div>
          )}

          <div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('贴窗工艺/元')}</div>
            <div className="text-xl font-semibold mt-1 text-gray-900 dark:text-white">{tiechuangprice()}元</div>
          </div>

          {/* 分界线 */}
          <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>

        </div>

        {/* 最终结算 */}
        <div className="space-y-6">
          <label className="block text-m font-medium text-gray-700 dark:text-gray-300">最终结算</label>
          <div className="grid grid-cols-3 gap-4 ">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">损耗</label>
              <input
                type="number"
                value={formData.loss}
                onChange={(e) => handleInputChange('loss', e.target.value)}
                step="0.001"
                className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">张数</label>
              <input
                type="number"
                value={formData.pages}
                onChange={(e) => handleInputChange('pages', e.target.value)}
                step="100"
                className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">拼数</label>
              <input
                type="number"
                value={formData.pinnumber}
                onChange={(e) => handleInputChange('pinnumber', e.target.value)}
                step="1"
                className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"/>
            </div>
          </div>
          
          {/* 分界线 */}
          <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>

        </div>

        {/* 结果卡片优化 */}
        <div ref={shareResultsRef} className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 shadow-inner">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('单张纸价格')}</div>
              <div className="text-2xl font-semibold mt-1 text-gray-900 dark:text-white">{calculateperpaper()}元</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('单个产品价格')}</div>
              <div className="text-2xl font-semibold mt-1 text-gray-900 dark:text-white">
              {calculateperprodcut()}元
              </div>
            </div>
          </div>
          
          {/* 修改分享按钮为链接到分享页面，并保存到历史 */}
          {/* <div className="mt-6 flex justify-end">
            <Link
              href={{
                pathname: '/share',
                query: {
                  value: value.toFixed(2),
                  assessment: getValueAssessmentKey(),
                  assessmentColor: getValueAssessment().color,
                  cityFactor: formData.cityFactor,
                  workHours: formData.workHours,
                  commuteHours: formData.commuteHours,
                  restTime: formData.restTime,
                  dailySalary: getDisplaySalary(),
                  isYuan: selectedCountry !== 'CN' ? 'false' : 'true',
                  workDaysPerYear: calculateWorkingDays().toString(),
                  workDaysPerWeek: formData.workDaysPerWeek,
                  wfhDaysPerWeek: formData.wfhDaysPerWeek,
                  annualLeave: formData.annualLeave,
                  paidSickLeave: formData.paidSickLeave,
                  publicHolidays: formData.publicHolidays,
                  workEnvironment: formData.workEnvironment,
                  leadership: formData.leadership,
                  teamwork: formData.teamwork,
                  degreeType: formData.degreeType,
                  schoolType: formData.schoolType,
                  education: formData.education,
                  homeTown: formData.homeTown,
                  shuttle: formData.paper2 ? formData.shuttle : '1.0',
                  canteen: formData.hasCanteen ? formData.canteen : '1.0',
                  jinkaselect: formData.jinkaselect,
                  gongyi: formData.gongyi,
                  bachelorType: formData.bachelorType,
                  countryCode: selectedCountry,
                  countryName: getCountryName(selectedCountry),
                  currencySymbol: getCurrencySymbol(selectedCountry),
                  paper2: formData.paper2,
                  hasCanteen: formData.hasCanteen,
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${formData.salary ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800' : 
                'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'}`}
              onClick={() => formData.salary ? saveToHistory() : null}
            >
              <FileText className="w-4 h-4" />
              {t('view_report')}
            </Link>
          </div> */}
        </div>
      </div>
  </div>
</div> 

  )
   
    
}
export default SalaryCalculator;