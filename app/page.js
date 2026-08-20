"use client";

import { useState, React } from "react";
import { BarChart3, AlertTriangle, Activity } from "lucide-react";

export default function LotCalculator() {
  const [inputs, setInputs] = useState({
    accountBalance: 10000,
    riskPercentage: 2.5,
    stopLoss: 100,
    commission: 0,
    currencyPair: "EUR/USD",
    accountCurrency: "USD",
    entryPrice: 1.16686,
  });

  const [results, setResults] = useState({
    recommendedLot: 0.25,
    riskAmount: 250,
    pipValue: 2.5,
    totalUnits: 25000,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCalculate = (e) => {
    e.preventDefault();

    // 1. Parsing input & fallback value
    const balance = parseFloat(inputs.accountBalance) || 0;
    const riskPrc = (parseFloat(inputs.riskPercentage) || 0) / 100;
    const sl = parseFloat(inputs.stopLoss) || 0;
    const entryPrc = parseFloat(inputs.entryPrice) || 1;
    const coms = parseFloat(inputs.commission) || 0;
    const currencyPair = inputs.currencyPair;

    const riskBal = balance * riskPrc;

    let lotSize = 0;
    let pipValuePerLot = 0; // Nilai 1 pip jika bertransaksi 1 Standard Lot (100.000 units)

    // 2. Hitung Pip Value per Lot berdasarkan Pair
    if (currencyPair === "USD/JPY") {
      // Untuk USD/JPY (JPY pairs): 1 pip = 0.01 JPY
      pipValuePerLot = (100000 * 0.01) / entryPrc;
    } else {
      // Untuk Direct Pairs (EUR/USD, GBP/USD, dll): 1 pip = $10 / Standard Lot
      pipValuePerLot = 10;
    }

    // 3. Hitung Lot Size
    const riskPerLot = sl * pipValuePerLot + coms;
    if (riskPerLot > 0) {
      lotSize = riskBal / riskPerLot;
    }

    // 4. Hitung Total Units & Total Pip Value berdasarkan Lot Size hasil kalkulasi
    const totalUnits = lotSize * 100000;
    const totalPipValue = pipValuePerLot * lotSize; // Value pip aktual dari rekomendasi lot

    // 5. Update State Results
    setResults({
      riskAmount: riskBal.toFixed(2),
      recommendedLot: lotSize.toFixed(2),
      pipValue: totalPipValue.toFixed(2),
      totalUnits: Math.round(totalUnits).toLocaleString(), // Format angka dengan pemisah ribuan (contoh: 25,000)
    });
  };

  return (
    <div className="min-h-screen bg-[#0d131a] text-slate-200 font-sans p-4 sm:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex justify-between items-center bg-[#151c24] border border-slate-800 rounded-xl px-5 py-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <BarChart3 className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-wide text-white">
              Lot<span className="text-emerald-400">Calculator</span>
            </span>
          </div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="uppercase tracking-wider">
              Live Exchange Feeds
            </span>
          </div>
        </header>

        {/* Main Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left / Top Info: How Lot Size is Calculated */}
          <div className="lg:col-span-4 bg-[#151c24] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  How Lot Size is Calculated
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  The mathematical engine securing your capital risk:
                </p>
              </div>

              {/* Formula Box */}
              <div className="bg-[#0d131a] border border-emerald-500/30 rounded-xl p-4 text-center">
                <p className="text-xs font-mono text-emerald-400 font-medium">
                  Lot Size = Risk Amount / (Stop Loss × Pip Value)
                </p>
              </div>

              {/* Steps */}
              <div className="space-y-4 pt-2">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    01
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">
                      Calculate Cash Risk
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Account Balance ($10,000) × Risk % (2.5%) = $250.00 total
                      capital risked.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    02
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">
                      Verify Pip Value
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      For EUR/USD, 1 standard lot = $10.00 per pip. A micro lot
                      (0.01) = $0.10 per pip.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    03
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">
                      Determine Lot Size
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Risk Amount ($250) ÷ (Stop Loss [100 Pips] × Standard Pip
                      Value [$10]) = 0.25 Lots.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Disclosure Box */}
            <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-4 space-y-1">
              <div className="flex items-center space-x-2 text-rose-400 text-xs font-semibold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Risk Disclosure</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Trading foreign exchange on margin carries a high level of risk,
                and may not be suitable for all investors. Before deciding to
                trade, you should carefully consider your objectives, financial
                situation, and level of experience.
              </p>
            </div>
          </div>

          {/* Middle: Inputs / Configuration Portal */}
          <div className="lg:col-span-5 bg-[#151c24] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Configuration Portal
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Adjust calculation fields dynamically to determine precise lot
                  allocation.
                </p>
              </div>

              {/* Form Controls */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Account Balance */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Account Balance
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="accountBalance"
                        value={inputs.accountBalance}
                        onChange={handleInputChange}
                        className="no-spinner w-full bg-[#0d131a] border border-slate-700/60 rounded-xl py-2.5 px-3 text-sm font-semibold text-white focus:outline-none focus:border-emerald-500"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-medium">
                        USD
                      </span>
                    </div>
                  </div>

                  {/* Risk Percentage */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Risk Percentage
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        name="riskPercentage"
                        value={inputs.riskPercentage}
                        onChange={handleInputChange}
                        className="w-full bg-[#0d131a] border border-slate-700/60 rounded-xl py-2.5 px-3 text-sm font-semibold text-white focus:outline-none focus:border-emerald-500"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-medium">
                        %
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Stop Loss */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Stop Loss (PIPS)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="stopLoss"
                        value={inputs.stopLoss}
                        onChange={handleInputChange}
                        className="w-full bg-[#0d131a] border border-slate-700/60 rounded-xl py-2.5 px-3 text-sm font-semibold text-white focus:outline-none focus:border-emerald-500"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-medium">
                        PIPS
                      </span>
                    </div>
                  </div>

                  {/* komisi */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Commision
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="commission"
                        value={inputs.commission}
                        onChange={handleInputChange}
                        className="w-full bg-[#0d131a] border border-slate-700/60 rounded-xl py-2.5 px-3 text-sm font-semibold text-white focus:outline-none focus:border-emerald-500"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-medium">
                        USD/LOTS
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* entry */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Entry Price
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="entryPrice"
                        value={inputs.entryPrice}
                        onChange={handleInputChange}
                        className="w-full bg-[#0d131a] border border-slate-700/60 rounded-xl py-2.5 px-3 text-sm font-semibold text-white focus:outline-none focus:border-emerald-500"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-medium">
                        USD
                      </span>
                    </div>
                  </div>

                  {/* Currency Pair */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Currency Pair
                    </label>
                    <select
                      name="currencyPair"
                      value={inputs.currencyPair}
                      onChange={handleInputChange}
                      className="w-full bg-[#0d131a] border border-slate-700/60 rounded-xl py-2.5 px-3 text-sm font-semibold text-white focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                    >
                      <option value="EUR/USD">EUR / USD</option>
                      <option value="GBP/USD">GBP / USD</option>
                      <option value="USD/JPY">USD / JPY</option>
                      <option value="AUD/USD">AUD / USD</option>
                    </select>
                  </div>
                </div>

                {/* Account Currency */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Account Currency
                  </label>
                  <select
                    name="accountCurrency"
                    value={inputs.accountCurrency}
                    onChange={handleInputChange}
                    className="w-full bg-[#0d131a] border border-slate-700/60 rounded-xl py-2.5 px-3 text-sm font-semibold text-white focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleCalculate}
              className="w-full mt-6 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold py-3.5 rounded-xl transition duration-200 tracking-wide uppercase text-sm"
            >
              Run Calculation Feed
            </button>
          </div>

          {/* Right: Output Metrics / Real-Time Calculations */}
          <div className="lg:col-span-3 bg-[#151c24] border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Real-Time Calculations
                </h3>
              </div>

              {/* Highlight Result Card */}
              <div className="bg-[#0d131a] border border-emerald-500/40 rounded-xl p-4 space-y-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  Recomended Lot Size
                </span>
                <div className="text-3xl font-extrabold text-white">
                  {results.recommendedLot}
                </div>
                <span className="text-[11px] text-slate-500 block">
                  Standard Lots
                </span>
              </div>

              {/* Secondary Metric Cards */}
              <div className="bg-[#0d131a] border border-slate-800 rounded-xl p-3.5 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Risk Amount (USD)
                </span>
                <div className="text-lg font-bold text-white">
                  {results.riskAmount}
                </div>
                <span className="text-[10px] text-slate-500">
                  {inputs.riskPercentage}% of Account
                </span>
              </div>

              <div className="bg-[#0d131a] border border-slate-800 rounded-xl p-3.5 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Pip Value (0.25 Lots)
                </span>
                <div className="text-lg font-bold text-white">
                  ${results.pipValue}
                </div>
                <span className="text-[10px] text-slate-500">
                  Based on Current Rate
                </span>
              </div>

              <div className="bg-[#0d131a] border border-slate-800 rounded-xl p-3.5 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Total Units Size
                </span>
                <div className="text-lg font-bold text-white">
                  {results.totalUnits}
                </div>
                <span className="text-[10px] text-slate-500">
                  Units Controlled
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-slate-500 py-2">
          © 2026 LotCalc Utility. All rights reserved. Precise calculations
          provided on a best-effort basis.
        </footer>
      </div>
    </div>
  );
}
