import React from 'react';
import { CheckCircle2, Clock, XCircle, Circle, ShieldCheck, AlertCircle } from 'lucide-react';

export default function WarrantyTimeline({ events }) {
  if (!events || events.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-brand-600" />
          <h3 className="text-base font-black text-slate-900">Warranty Card Lifecycle & Timeline</h3>
        </div>
        <span className="text-[11px] font-semibold text-slate-400">Chronological Audit</span>
      </div>

      <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {events.map((event, idx) => {
          const isCompleted = event.status === 'COMPLETED';
          const isCurrent = event.status === 'CURRENT';
          const isRejected = event.status === 'REJECTED';
          const isUpcoming = event.status === 'UPCOMING';

          let iconBg = 'bg-slate-100 text-slate-400 border-slate-300';
          let badgeClass = 'bg-slate-100 text-slate-600';
          let statusLabel = 'Upcoming';

          if (isCompleted) {
            iconBg = 'bg-emerald-500 text-white border-emerald-500 shadow-xs shadow-emerald-500/30';
            badgeClass = 'bg-emerald-100 text-emerald-800 font-bold';
            statusLabel = 'Completed';
          } else if (isCurrent) {
            iconBg = 'bg-brand-500 text-white border-brand-500 shadow-md shadow-brand-500/30 ring-4 ring-amber-100';
            badgeClass = 'bg-amber-100 text-brand-800 font-bold animate-pulse';
            statusLabel = 'In Progress';
          } else if (isRejected) {
            iconBg = 'bg-rose-500 text-white border-rose-500 shadow-xs shadow-rose-500/30';
            badgeClass = 'bg-rose-100 text-rose-800 font-bold';
            statusLabel = 'Declined';
          }

          const formattedDate = event.eventDate 
            ? new Date(event.eventDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
            : 'Scheduled Milestone';

          return (
            <div key={event.id || idx} className="relative group">
              {/* Timeline marker icon */}
              <div
                className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center border-2 transition-transform ${iconBg}`}
              >
                {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                {isCurrent && <Clock className="w-3.5 h-3.5 animate-spin" />}
                {isRejected && <XCircle className="w-3.5 h-3.5" />}
                {isUpcoming && <Circle className="w-2.5 h-2.5 fill-current" />}
              </div>

              {/* Event Content */}
              <div className="bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 rounded-2xl p-4 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>{event.stepOrder}. {event.eventTitle}</span>
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider ${badgeClass}`}>
                      {statusLabel}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {formattedDate}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  {event.eventDescription}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
