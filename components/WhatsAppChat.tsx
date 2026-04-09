"use client";

import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";

export default function WhatsAppChat() {
  const [isOpen, setIsOpen] = useState(false);

  // Use the actual number provided: 0781185860
  // which with code is +250 781 185 860
  const phoneNumberForWa = "250781185860";
//   const displayPhone = "+250 781 185 860";
  
  // Format current time context roughly showing "HH:MM"
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-[9999] flex flex-col items-end">
      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="mb-4 w-[340px] md:w-[360px] max-w-[calc(100vw-2rem)] max-h-[80vh] flex flex-col rounded-xl bg-white shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 border border-gray-100">
          {/* Header */}
          <div className="bg-[#25D366] px-4 py-4 md:px-5 md:py-4 text-white relative flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              aria-label="Close chat"
            >
              <IoCloseSharp size={22} className="md:w-6 md:h-6" />
            </button>
            <div className="relative flex-shrink-0">
              <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full border-2 border-white/40 bg-white shadow-sm">
                <FaWhatsapp className="text-[#25D366] text-[24px] md:text-[30px]" />
              </div>
              <div className="absolute bottom-0 right-0 h-3 w-3 md:h-3.5 md:w-3.5 rounded-full border-2 border-[#25D366] bg-green-400"></div>
            </div>
            <div>
              <h3 className="font-bold text-base md:text-[17px] leading-tight">OMEGA SIR Ltd</h3>
              <p className="text-xs md:text-sm text-white/90">Typically replies within minutes</p>
            </div>
          </div>

          {/* Chat Body Base Info */}
          <div className="bg-[#e5ddd5] px-4 py-5 md:px-5 md:py-6 flex-1 min-h-[200px] overflow-y-auto overflow-x-hidden w-full flex flex-col items-start gap-2"
            style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", backgroundSize: "cover" }}
          >
            {/* Bubble 1 */}
            <div className="relative flex items-end gap-2 lg:gap-3 max-w-[90%] w-full shrink-0">
              <div className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full bg-[#25D366] text-white flex-shrink-0 shadow-sm">
                <FaWhatsapp size={16} />
              </div>
              <div className="relative bg-white text-gray-800 text-[13px] md:text-[14px] px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex-1">
                <p>👋 Hello! How can we help you today?</p>
                <div className="text-[10px] md:text-xs text-gray-400 text-right mt-1 w-full">{currentTime}</div>
              </div>
            </div>

            {/* Bubble 2 */}
            <div className="relative flex items-end gap-2 ml-9 md:ml-[44px] max-w-[90%] w-full shrink-0">
              <div className="relative bg-white text-gray-800 text-[13px] md:text-[14px] px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex-1 mb-2">
                <p className="whitespace-normal break-words">Ask us about our services, projects or upcoming schedules.</p>
                <div className="text-[10px] md:text-xs text-gray-400 text-right mt-1 w-full">{currentTime}</div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-white px-4 py-4 md:px-5 md:py-4 flex flex-col gap-2.5 items-center shrink-0">
            <a
              href={`https://wa.me/${phoneNumberForWa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] py-2.5 md:py-3 text-sm md:text-base font-bold text-white transition hover:bg-[#128c7e]"
            >
              <FaWhatsapp size={20} className="md:h-5 md:w-5" />
              Start a conversation &rarr;
            </a>
{/* 
            <a
              href={`tel:${displayPhone.replace(/\s+/g, '')}`}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-2.5 md:py-3 text-sm md:text-base font-bold text-gray-700 transition hover:bg-gray-50"
            >
              <FaPhoneAlt size={16} className="text-orange-500 md:h-[18px] md:w-[18px]" />
              {displayPhone}
            </a> */}

            <p className="text-center text-[10px] md:text-xs text-gray-400 mt-1">
              Powered by WhatsApp • End-to-end encrypted
            </p>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <div className="flex items-center gap-3 md:gap-4">
        {!isOpen && (
          <div className="hidden sm:flex items-center justify-center rounded-full bg-slate-800 text-white font-medium text-sm md:text-base px-4 py-2 md:px-5 md:py-2.5 shadow-lg drop-shadow-md pr-6 md:pr-8 -mr-4 border border-slate-700">
            <FaWhatsapp className="text-[#25D366] mr-2 md:mr-3 h-5 w-5 md:h-6 md:w-6" />
            Click to chat with us
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full text-white shadow-xl transition-transform hover:scale-105 active:scale-95 z-10 ${
            isOpen ? "bg-[#d9534f]" : "bg-[#25D366]"
          }`}
          aria-label={isOpen ? "Close WhatsApp Chat" : "Open WhatsApp Chat"}
        >
          {isOpen ? (
            <IoCloseSharp size={30} className="md:h-9 md:w-9" />
          ) : (
            <FaWhatsapp size={35} className="md:h-10 md:w-10" />
          )}
        </button>
      </div>
    </div>
  );
}
