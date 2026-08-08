
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const AI_API_URL = "http://localhost:3000/api/ai/chat";

const AiBot = () => {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content: {
        urgency: "LOW",
        reason:
          "No symptoms have been provided yet.",
        response:
          "Hello! I'm Sahara AI 👋 I'm here to help you understand your health concerns, assess urgency, and connect you with healthcare services when needed.",
        recommendedActions: [
          "Tell me what symptoms you're experiencing",
          "Describe when your symptoms started",
          "Mention anything that makes your symptoms better or worse",
        ],
        results: [],
        buttons: [
          {
            title: "Emergency SOS",
            action: "SOS",
          },
          {
            title: "Find Hospital",
            action: "HOSPITAL",
          },
          {
            title: "Find Blood",
            action: "BLOOD",
          },
          {
            title: "Doctor Consultation",
            action: "DOCTOR",
          },
        ],
        followUpQuestion:
          "What health concern would you like help with?",
      },
      time: new Date(),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // =====================================================
  // AUTO SCROLL
  // =====================================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // =====================================================
  // INPUT
  // =====================================================

  const handleInputChange = (e) => {
    setInput(e.target.value);

    const textarea = textareaRef.current;

    if (textarea) {
      textarea.style.height = "auto";

      textarea.style.height = `${Math.min(
        textarea.scrollHeight,
        140
      )}px`;
    }
  };

  // =====================================================
  // SEND MESSAGE
  // =====================================================

  const sendMessage = async () => {
    const message = input.trim();

    if (!message || loading) {
      return;
    }

    // ---------------------------------------------
    // Add user message
    // ---------------------------------------------

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: message,
      time: new Date(),
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setInput("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    setLoading(true);

    try {
      // ---------------------------------------------
      // Authentication token
      // ---------------------------------------------

      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      // ---------------------------------------------
      // CURRENT CHAT ONLY
      // ---------------------------------------------

      const currentConversation = [
        ...messages,
        userMessage,
      ].map((msg) => ({
        role:
          msg.role === "assistant"
            ? "assistant"
            : "user",

        // AI messages are structured objects,
        // so send only the natural language response
        content:
          typeof msg.content === "string"
            ? msg.content
            : msg.content?.response || "",
      }));

      // ---------------------------------------------
      // API REQUEST
      // ---------------------------------------------

      const response = await fetch(
        AI_API_URL,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            ...(token && {
              Authorization: `Bearer ${token}`,
            }),
          },

          body: JSON.stringify({
            prompt: message,

            // Only current browser chat
            conversation:
              currentConversation.slice(-10),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to get a response from Sahara AI."
        );
      }

      // ---------------------------------------------
      // STRUCTURED AI RESPONSE
      // ---------------------------------------------

      if (
        !data.response ||
        typeof data.response !== "object"
      ) {
        throw new Error(
          "Sahara AI returned an invalid response."
        );
      }

      const aiMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: data.response,
        databaseUsed:
          data.databaseUsed || false,
        databaseAction:
          data.databaseAction || "NONE",
        time: new Date(),
      };

      setMessages((prev) => [
        ...prev,
        aiMessage,
      ]);
    } catch (error) {
      console.error(
        "Sahara AI Error:",
        error
      );

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          role: "error",
          content:
            error.message ||
            "Something went wrong. Please try again.",
          time: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // ENTER TO SEND
  // =====================================================

  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();
      sendMessage();
    }
  };

  // =====================================================
  // QUICK PROMPTS
  // =====================================================

  const quickPrompts = [
    {
      icon: "🩺",
      title: "Check my symptoms",
      text: "I want to tell you about some symptoms I'm experiencing.",
    },
    {
      icon: "👨‍⚕️",
      title: "Find a doctor",
      text: "Recommend me some doctors based on my health concern.",
    },
    {
      icon: "🏥",
      title: "Find a hospital",
      text: "Help me find a nearby hospital.",
    },
    {
      icon: "🩸",
      title: "Find blood",
      text: "I need help finding blood.",
    },
  ];

  const handleQuickPrompt = (prompt) => {
    setInput(prompt);

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  };

  // =====================================================
  // CLEAR CHAT
  // =====================================================

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        role: "assistant",
        content: {
          urgency: "LOW",
          reason:
            "This is a new conversation.",
          response:
            "New chat started. I'm Sahara AI. How can I help you today?",
          recommendedActions: [],
          results: [],
          buttons: [
            {
              title: "Emergency SOS",
              action: "SOS",
            },
            {
              title: "Find Hospital",
              action: "HOSPITAL",
            },
            {
              title: "Find Blood",
              action: "BLOOD",
            },
            {
              title: "Doctor Consultation",
              action: "DOCTOR",
            },
          ],
          followUpQuestion: "",
        },
        time: new Date(),
      },
    ]);
  };

  // =====================================================
  // ACTION HANDLER
  // =====================================================

  const handleAction = (action) => {
    switch (action) {
      case "SOS":
        navigate("/emergency");
        break;

      case "HOSPITAL":
        navigate("/hospitals");
        break;

      case "BLOOD":
        navigate("/blood");
        break;

      case "DOCTOR":
        navigate("/doctors");
        break;

      case "APPOINTMENT":
        navigate("/appointments");
        break;

      default:
        console.log(
          "Unknown AI action:",
          action
        );
    }
  };

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (date) => {
    if (!date) return "";

    return new Intl.DateTimeFormat(
      "en-US",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    ).format(date);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-[#f7f9fc] overflow-hidden">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <header className="h-[76px] bg-white border-b border-slate-200 flex items-center justify-between px-5 sm:px-8 shrink-0">

        <div className="flex items-center gap-3">

          {/* AI LOGO */}

          <div className="relative">

            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">

              <span className="text-xl">
                ✦
              </span>

            </div>

            <span className="absolute -right-1 -bottom-1 w-3.5 h-3.5 rounded-full bg-green-500 border-[3px] border-white" />

          </div>


          <div>

            <div className="flex items-center gap-2">

              <h1 className="font-bold text-slate-900">
                Sahara AI
              </h1>

              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wide">
                AI Assistant
              </span>

            </div>

            <p className="text-xs text-slate-500 mt-0.5">
              Healthcare assistance • Online
            </p>

          </div>

        </div>


        {/* NEW CHAT */}

        <button
          type="button"
          onClick={clearChat}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition"
        >
          <span className="text-base">
            ↻
          </span>

          <span className="hidden sm:inline">
            New chat
          </span>
        </button>

      </header>


      {/* ================================================= */}
      {/* CHAT */}
      {/* ================================================= */}

      <main className="flex-1 overflow-y-auto">

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

          <div className="space-y-7">

            {messages.map((message) => (

              <ChatMessage
                key={message.id}
                message={message}
                onAction={handleAction}
                formatTime={formatTime}
              />

            ))}

          </div>


          {/* ================================================= */}
          {/* QUICK PROMPTS */}
          {/* ================================================= */}

          {messages.length === 1 && !loading && (

            <div className="mt-8 ml-0 sm:ml-12">

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                What can I help with?
              </p>

              <div className="grid sm:grid-cols-2 gap-3">

                {quickPrompts.map(
                  (item) => (

                    <button
                      key={item.title}
                      type="button"
                      onClick={() =>
                        handleQuickPrompt(
                          item.text
                        )
                      }
                      className="group flex items-center gap-3 text-left p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-500/5 transition-all"
                    >

                      <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-emerald-50 flex items-center justify-center text-lg transition">
                        {item.icon}
                      </div>

                      <div>

                        <p className="text-sm font-semibold text-slate-700 group-hover:text-emerald-700">
                          {item.title}
                        </p>

                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                          {item.text}
                        </p>

                      </div>

                    </button>

                  )
                )}

              </div>

            </div>

          )}


          {/* ================================================= */}
          {/* TYPING */}
          {/* ================================================= */}

          {loading && (

            <div className="flex gap-3 mt-7">

              <AIAvatar />

              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-md px-5 py-4 shadow-sm">

                <div className="flex items-center gap-1.5">

                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />

                  <span
                    className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                    style={{
                      animationDelay:
                        "150ms",
                    }}
                  />

                  <span
                    className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                    style={{
                      animationDelay:
                        "300ms",
                    }}
                  />

                  <span className="ml-2 text-xs text-slate-400">
                    Sahara AI is thinking...
                  </span>

                </div>

              </div>

            </div>

          )}

          <div ref={messagesEndRef} />

        </div>

      </main>


      {/* ================================================= */}
      {/* INPUT */}
      {/* ================================================= */}

      <footer className="bg-white border-t border-slate-200 px-4 sm:px-6 py-4 shrink-0">

        <div className="max-w-4xl mx-auto">

          <div className="flex items-start gap-2 mb-3">

            <span className="text-amber-500 text-xs mt-0.5">
              ⚠
            </span>

            <p className="text-[11px] leading-4 text-slate-400">
              Sahara AI provides general healthcare
              guidance and does not replace professional
              medical advice. For emergencies, seek
              immediate medical assistance.
            </p>

          </div>


          <div className="flex items-end gap-2 p-2 rounded-2xl border border-slate-200 bg-slate-50 focus-within:bg-white focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all">

            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={loading}
              rows="1"
              placeholder="Describe your symptoms or ask Sahara AI..."
              className="flex-1 resize-none bg-transparent outline-none border-none px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 max-h-[140px] disabled:opacity-50"
            />

            <button
              type="button"
              onClick={sendMessage}
              disabled={
                !input.trim() || loading
              }
              className="w-11 h-11 shrink-0 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white flex items-center justify-center transition shadow-sm"
            >

              {loading ? (
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <span className="text-lg">
                  ↑
                </span>
              )}

            </button>

          </div>


          <p className="text-center text-[10px] text-slate-400 mt-2">
            Enter to send • Shift + Enter for a new line
          </p>

        </div>

      </footer>

    </div>
  );
};


// =====================================================
// CHAT MESSAGE
// =====================================================

const ChatMessage = ({
  message,
  onAction,
  formatTime,
}) => {

  // =====================================================
  // USER
  // =====================================================

  if (message.role === "user") {

    return (
      <div className="flex justify-end">

        <div className="max-w-[88%] sm:max-w-[72%]">

          <div className="bg-emerald-600 text-white rounded-2xl rounded-br-md px-5 py-3.5 shadow-sm">

            <p className="text-sm leading-6 whitespace-pre-wrap">
              {message.content}
            </p>

          </div>

          <p className="text-[10px] text-slate-400 text-right mt-1.5">
            You • {formatTime(message.time)}
          </p>

        </div>

      </div>
    );
  }


  // =====================================================
  // ERROR
  // =====================================================

  if (message.role === "error") {

    return (
      <div className="flex gap-3">

        <div className="w-9 h-9 shrink-0 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
          !
        </div>

        <div className="max-w-[85%]">

          <div className="bg-red-50 border border-red-200 rounded-2xl rounded-tl-md px-5 py-4">

            <p className="text-sm text-red-700 leading-6">
              {message.content}
            </p>

          </div>

          <p className="text-[10px] text-slate-400 mt-1.5">
            Sahara AI
          </p>

        </div>

      </div>
    );
  }


  // =====================================================
  // AI DATA
  // =====================================================

  const ai = message.content || {};

  const urgency = getUrgencyConfig(
    ai.urgency
  );


  return (
    <div className="flex gap-3">

      <AIAvatar />

      <div className="w-full max-w-[90%] sm:max-w-[82%]">

        {/* ================================================= */}
        {/* AI MAIN CARD */}
        {/* ================================================= */}

        <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-md shadow-sm overflow-hidden">

          {/* --------------------------------------------- */}
          {/* URGENCY HEADER */}
          {/* --------------------------------------------- */}

          <div
            className={`px-5 py-3.5 border-b ${urgency.border} ${urgency.background}`}
          >

            <div className="flex items-center justify-between gap-4">

              <div className="flex items-center gap-3">

                <div
                  className={`w-9 h-9 rounded-xl ${urgency.iconBackground} flex items-center justify-center`}
                >
                  <span>
                    {urgency.icon}
                  </span>
                </div>

                <div>

                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                    Sahara AI Assessment
                  </p>

                  <h3
                    className={`text-sm font-bold ${urgency.text}`}
                  >
                    {urgency.label}
                  </h3>

                </div>

              </div>

              <span
                className={`hidden sm:inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold ${urgency.badge}`}
              >
                {ai.urgency || "LOW"}
              </span>

            </div>

          </div>


          {/* --------------------------------------------- */}
          {/* RESPONSE */}
          {/* --------------------------------------------- */}

          <div className="px-5 py-5">

            {ai.response && (

              <p className="text-sm text-slate-700 leading-7 whitespace-pre-wrap">
                {ai.response}
              </p>

            )}


            {/* ------------------------------------------- */}
            {/* REASON */}
            {/* ------------------------------------------- */}

            {ai.reason && (

              <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-100">

                <div className="flex gap-3">

                  <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-sm shrink-0">
                    💡
                  </div>

                  <div>

                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Why this level?
                    </p>

                    <p className="text-sm text-slate-600 leading-6 mt-1">
                      {ai.reason}
                    </p>

                  </div>

                </div>

              </div>

            )}


            {/* ------------------------------------------- */}
            {/* RECOMMENDED ACTIONS */}
            {/* ------------------------------------------- */}

            {Array.isArray(
              ai.recommendedActions
            ) &&
              ai.recommendedActions.length >
                0 && (

                <div className="mt-5">

                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Recommended actions
                  </h4>

                  <div className="space-y-2">

                    {ai.recommendedActions.map(
                      (action, index) => (

                        <div
                          key={index}
                          className="flex items-start gap-3"
                        >

                          <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                            ✓
                          </div>

                          <p className="text-sm text-slate-600 leading-6">
                            {action}
                          </p>

                        </div>

                      )
                    )}

                  </div>

                </div>
              )}


            {/* ------------------------------------------- */}
            {/* DATABASE RESULTS */}
            {/* ------------------------------------------- */}

            {Array.isArray(ai.results) &&
              ai.results.length > 0 && (

                <div className="mt-6">

                  <div className="flex items-center justify-between mb-3">

                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Sahara recommendations
                    </h4>

                    <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                      {ai.results.length} found
                    </span>

                  </div>


                  <div className="space-y-3">

                    {ai.results.map(
                      (result, index) => (

                        <DatabaseResult
                          key={
                            result.id ||
                            result._id ||
                            index
                          }
                          result={result}
                          onAction={onAction}
                        />

                      )
                    )}

                  </div>

                </div>
              )}


            {/* ------------------------------------------- */}
            {/* FOLLOW UP */}
            {/* ------------------------------------------- */}

            {ai.followUpQuestion && (

              <div className="mt-6 pt-5 border-t border-slate-100">

                <div className="flex gap-3">

                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    ?
                  </div>

                  <div>

                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Sahara AI asks
                    </p>

                    <p className="text-sm font-medium text-slate-700 mt-1 leading-6">
                      {ai.followUpQuestion}
                    </p>

                  </div>

                </div>

              </div>

            )}

          </div>


          {/* --------------------------------------------- */}
          {/* ACTION BUTTONS */}
          {/* --------------------------------------------- */}

          {Array.isArray(ai.buttons) &&
            ai.buttons.length > 0 && (

              <div className="px-5 pb-5">

                <div className="flex flex-wrap gap-2">

                  {ai.buttons.map(
                    (button, index) => (

                      <button
                        key={`${button.action}-${index}`}
                        type="button"
                        onClick={() =>
                          onAction(
                            button.action
                          )
                        }
                        className={getButtonClass(
                          button.action
                        )}
                      >

                        {getActionIcon(
                          button.action
                        )}

                        {button.title}

                        <span className="ml-1">
                          →
                        </span>

                      </button>

                    )
                  )}

                </div>

              </div>

            )}

        </div>


        <p className="text-[10px] text-slate-400 mt-1.5">
          Sahara AI • {formatTime(message.time)}
        </p>

      </div>

    </div>
  );
};


// =====================================================
// DATABASE RESULT
// =====================================================

const DatabaseResult = ({
  result,
  onAction,
}) => {

  const type =
    result.type ||
    result.category ||
    "doctor";

  // ===================================================
  // DOCTOR
  // ===================================================

  if (
    type.toLowerCase() ===
      "doctor" ||
    result.specialization
  ) {

    return (
      <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-200 hover:shadow-sm transition">

        <div className="flex items-start gap-3">

          <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-xl shrink-0">
            👨‍⚕️
          </div>

          <div className="flex-1 min-w-0">

            <div className="flex items-start justify-between gap-3">

              <div>

                <h5 className="font-bold text-slate-800 text-sm">
                  {result.name ||
                    result.fullName ||
                    "Doctor"}
                </h5>

                <p className="text-xs text-emerald-600 font-medium mt-0.5">
                  {result.specialization ||
                    "Healthcare Specialist"}
                </p>

              </div>

              {result.experience !==
                undefined && (

                <span className="text-[10px] font-semibold bg-slate-50 text-slate-500 px-2 py-1 rounded-lg whitespace-nowrap">
                  {result.experience} yrs
                </span>

              )}

            </div>


            <div className="mt-3 space-y-1.5">

              {result.qualification && (

                <p className="text-xs text-slate-500">
                  🎓 {result.qualification}
                </p>

              )}

              {result.hospital && (

                <p className="text-xs text-slate-500">
                  🏥{" "}
                  {typeof result.hospital ===
                  "string"
                    ? result.hospital
                    : result.hospital.name}
                </p>

              )}

              {result.consultationFee !==
                undefined && (

                <p className="text-xs text-slate-500">
                  💰 Consultation: NPR{" "}
                  {result.consultationFee}
                </p>

              )}

            </div>


            <div className="flex gap-2 mt-4">

              <button
                type="button"
                onClick={() =>
                  onAction("DOCTOR")
                }
                className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition"
              >
                View Doctor
              </button>

              <button
                type="button"
                onClick={() =>
                  onAction("APPOINTMENT")
                }
                className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition"
              >
                Book Appointment
              </button>

            </div>

          </div>

        </div>

      </div>
    );
  }


  // ===================================================
  // HOSPITAL
  // ===================================================

  if (
    type.toLowerCase() ===
      "hospital" ||
    result.beds ||
    result.emergencyAvailable !==
      undefined
  ) {

    return (
      <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-200 hover:shadow-sm transition">

        <div className="flex items-start gap-3">

          <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-xl shrink-0">
            🏥
          </div>

          <div className="flex-1">

            <h5 className="font-bold text-slate-800 text-sm">
              {result.name ||
                "Hospital"}
            </h5>

            <p className="text-xs text-slate-500 mt-1">
              📍 {result.city || ""}
              {result.address
                ? ` • ${result.address}`
                : ""}
            </p>


            <div className="flex flex-wrap gap-2 mt-3">

              {result.emergencyAvailable && (

                <span className="px-2 py-1 rounded-lg bg-red-50 text-red-600 text-[10px] font-semibold">
                  🚨 Emergency
                </span>

              )}

              {result.ambulanceAvailable && (

                <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-semibold">
                  🚑 Ambulance
                </span>

              )}

              {result.isOpen && (

                <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-semibold">
                  ● Open
                </span>

              )}

            </div>


            {result.beds && (

              <div className="grid grid-cols-3 gap-2 mt-4">

                <MiniStat
                  label="Beds"
                  value={
                    result.beds.total ??
                    0
                  }
                />

                <MiniStat
                  label="Available"
                  value={
                    result.beds.available ??
                    0
                  }
                />

                <MiniStat
                  label="ICU"
                  value={
                    result.beds.icu ??
                    0
                  }
                />

              </div>

            )}


            <button
              type="button"
              onClick={() =>
                onAction("HOSPITAL")
              }
              className="mt-4 px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition"
            >
              View Hospital →
            </button>

          </div>

        </div>

      </div>
    );
  }


  // ===================================================
  // GENERIC RESULT
  // ===================================================

  return (
    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">

      <pre className="text-xs text-slate-600 whitespace-pre-wrap">
        {JSON.stringify(
          result,
          null,
          2
        )}
      </pre>

    </div>
  );
};


// =====================================================
// MINI STAT
// =====================================================

const MiniStat = ({
  label,
  value,
}) => {

  return (
    <div className="bg-slate-50 rounded-lg p-2 text-center">

      <p className="text-sm font-bold text-slate-700">
        {value}
      </p>

      <p className="text-[9px] text-slate-400 uppercase">
        {label}
      </p>

    </div>
  );
};


// =====================================================
// AI AVATAR
// =====================================================

const AIAvatar = () => {

  return (
    <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-sm">
      ✦
    </div>
  );
};


// =====================================================
// URGENCY CONFIG
// =====================================================

const getUrgencyConfig = (
  urgency
) => {

  switch (urgency) {

    case "CRITICAL":

      return {
        label: "Immediate emergency attention",
        icon: "🚨",
        text: "text-red-700",
        border: "border-red-200",
        background: "bg-red-50",
        iconBackground: "bg-red-100",
        badge: "bg-red-100 text-red-700",
      };


    case "HIGH":

      return {
        label: "High urgency",
        icon: "⚠️",
        text: "text-orange-700",
        border: "border-orange-200",
        background: "bg-orange-50",
        iconBackground: "bg-orange-100",
        badge: "bg-orange-100 text-orange-700",
      };


    case "MEDIUM":

      return {
        label: "Medical attention recommended",
        icon: "🟡",
        text: "text-amber-700",
        border: "border-amber-200",
        background: "bg-amber-50",
        iconBackground: "bg-amber-100",
        badge: "bg-amber-100 text-amber-700",
      };


    case "LOW":

    default:

      return {
        label: "Low urgency",
        icon: "🟢",
        text: "text-emerald-700",
        border: "border-emerald-200",
        background: "bg-emerald-50",
        iconBackground: "bg-emerald-100",
        badge: "bg-emerald-100 text-emerald-700",
      };
  }
};


// =====================================================
// ACTION ICON
// =====================================================

const getActionIcon = (
  action
) => {

  switch (action) {

    case "SOS":
      return "🚨";

    case "HOSPITAL":
      return "🏥";

    case "BLOOD":
      return "🩸";

    case "DOCTOR":
      return "👨‍⚕️";

    case "APPOINTMENT":
      return "📅";

    default:
      return "→";
  }
};


// =====================================================
// ACTION BUTTON STYLE
// =====================================================

const getButtonClass = (
  action
) => {

  if (action === "SOS") {

    return "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition";
  }

  if (
    action === "HOSPITAL" ||
    action === "DOCTOR"
  ) {

    return "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition";
  }

  return "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition";
};


export default AiBot;
