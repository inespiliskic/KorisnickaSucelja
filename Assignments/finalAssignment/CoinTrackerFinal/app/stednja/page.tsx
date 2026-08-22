"use client";
import { FormEvent, useState } from "react";
import { useFinance } from "../context/FinanceContext";
import { euro } from "../lib/format";
import Modal from "../components/Modal";
import { inputClass, labelClass, primaryButtonClass } from "../components/FormFields";

export default function StednjaPage(){
 const {savingsGoals,addSavingsGoal,depositToGoal,deleteSavingsGoal,totalSaved,profile}=useFinance();
 const [open,setOpen]=useState(false); const [sortOrder,setSortOrder]=useState<"desc"|"asc">("desc"); const [depositId,setDepositId]=useState<number|null>(null); const [name,setName]=useState(""); const [target,setTarget]=useState(""); const [amount,setAmount]=useState("");
 function add(e:FormEvent){e.preventDefault(); const n=Number(target); if(!name.trim()||n<=0)return; addSavingsGoal({name:name.trim(),target:n}); setName("");setTarget("");setOpen(false)}
 function deposit(e:FormEvent){e.preventDefault();const n=Number(amount);if(depositId&&n>0)depositToGoal(depositId,n);setAmount("");setDepositId(null)}
 const sortedGoals=[...savingsGoals].sort((a,b)=>sortOrder==="desc"?b.saved-a.saved:a.saved-b.saved);
 return <div className="space-y-6">
  <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-3xl font-bold text-gray-900">Štednja</h1><p className="mt-1 text-gray-500">Postavi ciljeve i prati napredak prema njima.</p></div><button onClick={()=>setOpen(true)} className={primaryButtonClass}>+ Novi cilj</button></header>
  <section className="grid gap-4 sm:grid-cols-2"><div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100"><p className="text-xs text-gray-500">Ukupno ušteđeno</p><p className="mt-2 text-2xl font-bold text-emerald-600">{euro(totalSaved,profile.currency)}</p></div><div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100"><p className="text-xs text-gray-500">Aktivni ciljevi</p><p className="mt-2 text-2xl font-bold text-gray-900">{savingsGoals.length}</p></div></section>
  <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-gray-900">Ciljevi štednje</p>
        <p className="text-xs text-gray-500">Sortiraj prema trenutno ušteđenom iznosu.</p>
      </div>
      <select value={sortOrder} onChange={e=>setSortOrder(e.target.value as "desc"|"asc")} className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none">
        <option value="desc">Najveći → najmanji</option>
        <option value="asc">Najmanji → najveći</option>
      </select>
    </div>
  </section>
  <section className="grid gap-5 lg:grid-cols-2">{sortedGoals.map(g=>{const pct=Math.min(100,Math.round(g.saved/g.target*100));return <div key={g.id} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"><div className="flex justify-between gap-4"><div><p className="text-lg font-bold text-gray-900">{g.name}</p><p className="text-xs text-gray-500">Cilj {euro(g.target,profile.currency)}</p></div><button onClick={()=>deleteSavingsGoal(g.id)} className="text-xs text-gray-400 hover:text-rose-600">Ukloni</button></div><div className="mt-5 flex items-end justify-between"><div><p className="text-2xl font-bold text-gray-900">{euro(g.saved,profile.currency)}</p><p className="text-xs text-gray-500">preostalo {euro(Math.max(0,g.target-g.saved),profile.currency)}</p></div><span className="text-sm font-bold text-purple-900">{pct}%</span></div><div className="mt-4 h-3 rounded-full bg-gray-100"><div className="h-3 rounded-full bg-emerald-500" style={{width:`${pct}%`}}/></div><button disabled={pct>=100} onClick={()=>setDepositId(g.id)} className="mt-5 w-full rounded-2xl bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50">{pct>=100?"Cilj ostvaren ✓":"Dodaj uplatu"}</button></div>})}</section>
  <Modal title="Novi cilj štednje" open={open} onClose={()=>setOpen(false)}><form onSubmit={add} className="space-y-4"><label className={labelClass}>Naziv<input className={inputClass} value={name} onChange={e=>setName(e.target.value)} placeholder="npr. Putovanje"/></label><label className={labelClass}>Ciljani iznos ({profile.currency})<input className={inputClass} type="number" min="1" value={target} onChange={e=>setTarget(e.target.value)}/></label><button className={`${primaryButtonClass} w-full`}>Spremi cilj</button></form></Modal>
  <Modal title="Dodaj uplatu" open={depositId!==null} onClose={()=>setDepositId(null)}><form onSubmit={deposit} className="space-y-4"><label className={labelClass}>Iznos ({profile.currency})<input autoFocus className={inputClass} type="number" min="0.01" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)}/></label><button className={`${primaryButtonClass} w-full`}>Dodaj na štednju</button></form></Modal>
 </div>
}
