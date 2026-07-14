import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Send,
  Mic,
  Paperclip,
  X,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  FileText,
  Calendar,
  DollarSign,
  Users,
  Clock,
  AlertCircle,
  CheckCircle,
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Zap,
  Star,
  BookOpen,
  Lightbulb,
  MessageSquare,
  Bot,
  User,
  History,
  Settings,
  HelpCircle,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Download,
  Share2,
  ExternalLink,
  Filter,
  Search as SearchIcon,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  Globe,
  Shield,
  Lock,
  Eye,
  EyeOff,
  Clock as ClockIcon,
  Calendar as CalendarIcon,
  FileSpreadsheet,
  FolderOpen,
} from "lucide-react";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  actions?: {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
  }[];
  attachments?: {
    name: string;
    type: string;
    size: string;
  }[];
  metadata?: {
    confidence?: number;
    sources?: string[];
    generatedAt?: string;
  };
}

interface Suggestion {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: "Payroll" | "HR" | "Analytics" | "Compliance" | "General";
  action: () => void;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  action: () => void;
}

interface ConversationHistory {
  id: string;
  title: string;
  date: Date;
  preview: string;
  messages: number;
}

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "assistant",
      content: "👋 Hello! I'm your AI Payroll Assistant. I can help you with payroll calculations, compliance questions, employee data analysis, and more. How can I assist you today?",
      timestamp: new Date(),
      metadata: {
        confidence: 0.95,
        sources: ["Knowledge Base", "Payroll Guidelines"],
        generatedAt: new Date().toISOString(),
      },
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [feedback, setFeedback] = useState<{ [key: string]: "like" | "dislike" | null }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Sample suggestions
  const suggestions: Suggestion[] = [
    {
      id: "s1",
      title: "Calculate Payroll",
      description: "Calculate payroll for March 2026",
      icon: <DollarSign className="w-5 h-5" />,
      category: "Payroll",
      action: () => handleSuggestionClick("Calculate payroll for March 2026 including all deductions and bonuses"),
    },
    {
      id: "s2",
      title: "Tax Compliance",
      description: "Check tax compliance status",
      icon: <Shield className="w-5 h-5" />,
      category: "Compliance",
      action: () => handleSuggestionClick("Check tax compliance status for Q1 2026"),
    },
    {
      id: "s3",
      title: "Employee Analysis",
      description: "Analyze employee attendance",
      icon: <Users className="w-5 h-5" />,
      category: "HR",
      action: () => handleSuggestionClick("Analyze employee attendance for March 2026"),
    },
    {
      id: "s4",
      title: "Generate Report",
      description: "Create payroll summary report",
      icon: <FileText className="w-5 h-5" />,
      category: "Analytics",
      action: () => handleSuggestionClick("Generate a comprehensive payroll summary report for March 2026"),
    },
    {
      id: "s5",
      title: "Leave Balance",
      description: "Check employee leave balances",
      icon: <CalendarIcon className="w-5 h-5" />,
      category: "HR",
      action: () => handleSuggestionClick("Show me the leave balances for all employees"),
    },
    {
      id: "s6",
      title: "Budget Analysis",
      description: "Analyze payroll budget",
      icon: <BarChart3 className="w-5 h-5" />,
      category: "Analytics",
      action: () => handleSuggestionClick("Analyze payroll budget variance for Q1 2026"),
    },
  ];

  // Sample quick actions
  const quickActions: QuickAction[] = [
    {
      id: "qa1",
      label: "New Payroll Run",
      icon: <Plus className="w-5 h-5" />,
      description: "Start a new payroll process",
      action: () => handleQuickAction("Starting new payroll run..."),
    },
    {
      id: "qa2",
      label: "Check Compliance",
      icon: <Shield className="w-5 h-5" />,
      description: "Review compliance status",
      action: () => handleQuickAction("Checking compliance status..."),
    },
    {
      id: "qa3",
      label: "Employee Lookup",
      icon: <SearchIcon className="w-5 h-5" />,
      description: "Find employee info",
      action: () => handleQuickAction("Searching employee records..."),
    },
    {
      id: "qa4",
      label: "Generate Report",
      icon: <FileSpreadsheet className="w-5 h-5" />,
      description: "Create custom report",
      action: () => handleQuickAction("Generating report..."),
    },
  ];

  // Sample conversation history
  const conversationHistory: ConversationHistory[] = [
    {
      id: "h1",
      title: "Payroll Calculation March 2026",
      date: new Date("2026-03-28T10:30:00"),
      preview: "Calculated total payroll for March 2026 including...",
      messages: 12,
    },
    {
      id: "h2",
      title: "Tax Compliance Check",
      date: new Date("2026-03-27T14:20:00"),
      preview: "Checked tax compliance status for Q1 2026...",
      messages: 8,
    },
    {
      id: "h3",
      title: "Employee Attendance Analysis",
      date: new Date("2026-03-26T09:15:00"),
      preview: "Analyzed employee attendance patterns and...",
      messages: 6,
    },
    {
      id: "h4",
      title: "Budget Review",
      date: new Date("2026-03-25T16:45:00"),
      preview: "Reviewed payroll budget and identified...",
      messages: 10,
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    setTimeout(() => {
      const responses = [
        "I've analyzed your request and found that the payroll for March 2026 totals $543,000. This includes $68,000 in taxes and $19,000 in benefits. Would you like me to break this down by department?",
        "Based on my analysis, 94% of employees have completed their mandatory training. There are 2 open compliance cases that need attention. Shall I provide more details?",
        "I've calculated that the average salary across all departments is $6,700. Engineering has the highest average at $8,500, while HR has the lowest at $4,800.",
        "The Q1 2026 payroll budget shows a 5.2% variance. The main drivers are overtime costs and performance bonuses. Should I provide a detailed breakdown?",
        "I've identified 3 employees with attendance patterns that need review. Two have excessive lateness and one has frequent absences. Would you like to see the details?",
        "Your tax compliance status is 100% for federal filings, but there are pending state filings for California. The deadline is April 15, 2026.",
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        type: "assistant",
        content: randomResponse,
        timestamp: new Date(),
        metadata: {
          confidence: 0.85 + Math.random() * 0.1,
          sources: ["Payroll Database", "Tax Records", "Employee System"],
          generatedAt: new Date().toISOString(),
        },
        actions: [
          {
            label: "View Details",
            icon: <Eye className="w-4 h-4" />,
            onClick: () => alert("Opening detailed view..."),
          },
          {
            label: "Export",
            icon: <Download className="w-4 h-4" />,
            onClick: () => alert("Exporting data..."),
          },
          {
            label: "Share",
            icon: <Share2 className="w-4 h-4" />,
            onClick: () => alert("Opening share dialog..."),
          },
        ],
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSuggestionClick = (query: string) => {
    setInputValue(query);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const handleQuickAction = (message: string) => {
    setInputValue(message);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleFeedback = (messageId: string, type: "like" | "dislike") => {
    setFeedback(prev => ({
      ...prev,
      [messageId]: prev[messageId] === type ? null : type,
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setInputValue("Calculate payroll for March 2026 with all deductions and bonuses");
        setIsRecording(false);
      }, 2000);
    }
  };

  const handleFileUpload = () => {
    alert("File upload dialog would open here. Supported formats: PDF, Excel, CSV");
  };

  const loadConversation = (historyId: string) => {
    const history = conversationHistory.find(h => h.id === historyId);
    if (history) {
      alert(`Loading conversation: ${history.title}`);
      setShowHistory(false);
    }
  };

  const deleteConversation = (historyId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this conversation?")) {
      alert(`Deleted conversation ${historyId}`);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 p-6 ${isMaximized ? "fixed inset-0 z-50 p-0" : ""}`}>
      <div className={`max-w-7xl mx-auto h-full ${isMaximized ? "max-w-full" : ""}`}>
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg shadow-purple-200 animate-pulse">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">AI Assistant</h1>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold animate-pulse">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  Online
                </span>
              </div>
              <p className="text-slate-600 ml-1">
                Get intelligent insights and assistance for payroll and HR tasks
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-sm ${
                  showHistory 
                    ? "bg-purple-100 text-purple-700 border border-purple-200" 
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                <History className="w-4 h-4" />
                History
                <span className="text-xs bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full">
                  {conversationHistory.length}
                </span>
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
              >
                {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Left Sidebar - Suggestions */}
          <div className="lg:col-span-1 space-y-4 overflow-y-auto">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-4">
              <h3 className="font-semibold text-slate-900 text-sm mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={action.action}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-3 group border border-transparent hover:border-slate-200"
                  >
                    <div className="p-1.5 bg-purple-100 text-purple-600 rounded-lg group-hover:bg-purple-200 transition-all">
                      {action.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{action.label}</p>
                      <p className="text-xs text-slate-500">{action.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-4 flex-1">
              <h3 className="font-semibold text-slate-900 text-sm mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                Suggestions
              </h3>
              <div className="space-y-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={suggestion.action}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg group-hover:bg-indigo-200 transition-all">
                        {suggestion.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{suggestion.title}</p>
                        <p className="text-xs text-slate-500">{suggestion.description}</p>
                        <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full mt-1 inline-block">
                          {suggestion.category}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] ${
                      message.type === "user"
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                        : "bg-slate-50 text-slate-900 border border-slate-200"
                    } rounded-2xl p-4 shadow-sm`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-1.5 rounded-full ${
                        message.type === "user"
                          ? "bg-white/20"
                          : "bg-indigo-100"
                      }`}>
                        {message.type === "user" ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <Bot className="w-4 h-4 text-indigo-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                        
                        {message.metadata && (
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                            {message.metadata.confidence && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                                <Check className="w-3 h-3" />
                                {Math.round(message.metadata.confidence * 100)}% confidence
                              </span>
                            )}
                            {message.metadata.sources && (
                              <span className="text-slate-400">
                                Sources: {message.metadata.sources.join(", ")}
                              </span>
                            )}
                          </div>
                        )}

                        {message.actions && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {message.actions.map((action, index) => (
                              <button
                                key={index}
                                onClick={action.onClick}
                                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all"
                              >
                                {action.icon}
                                {action.label}
                              </button>
                            ))}
                          </div>
                        )}

                        {message.type === "assistant" && (
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              onClick={() => handleCopyMessage(message.content)}
                              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-all"
                            >
                              {isCopied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                            </button>
                            <button
                              onClick={() => handleFeedback(message.id, "like")}
                              className={`p-1 rounded-lg transition-all ${
                                feedback[message.id] === "like"
                                  ? "text-green-600 bg-green-100"
                                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                              }`}
                            >
                              <ThumbsUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleFeedback(message.id, "dislike")}
                              className={`p-1 rounded-lg transition-all ${
                                feedback[message.id] === "dislike"
                                  ? "text-red-600 bg-red-100"
                                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                              }`}
                            >
                              <ThumbsDown className="w-3 h-3" />
                            </button>
                            <span className="text-[10px] text-slate-400">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-[85%]">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      </div>
                      <span className="text-sm text-slate-500">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-slate-200 p-4">
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about payroll, HR, or compliance..."
                    className="w-full pl-4 pr-24 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none min-h-[52px] max-h-[120px] transition-all"
                    rows={1}
                    style={{ height: "auto" }}
                  />
                  <div className="absolute right-2 bottom-2 flex items-center gap-1">
                    <button
                      onClick={handleVoiceInput}
                      className={`p-1.5 rounded-lg transition-all ${
                        isRecording
                          ? "bg-red-100 text-red-600 animate-pulse"
                          : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleFileUpload}
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-200 flex-shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                <span>AI may make mistakes. Verify important information.</span>
                <button className="hover:text-slate-600 transition-all">
                  <HelpCircle className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar - History / Settings */}
          <div className="lg:col-span-1">
            {showHistory ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-4 h-full overflow-y-auto">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                    <History className="w-4 h-4" />
                    Conversation History
                  </h3>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="p-1 hover:bg-slate-100 rounded-lg transition-all"
                  >
                    <X className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
                <div className="space-y-2">
                  {conversationHistory.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => loadConversation(conv.id)}
                      className="p-3 rounded-xl hover:bg-slate-50 transition-all cursor-pointer border border-transparent hover:border-slate-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">{conv.title}</p>
                          <p className="text-xs text-slate-500 line-clamp-1">{conv.preview}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                            <span>{conv.messages} messages</span>
                            <span>•</span>
                            <span>{conv.date.toLocaleDateString()}</span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => deleteConversation(conv.id, e)}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-3 px-4 py-2 text-sm bg-slate-50 text-slate-700 rounded-xl hover:bg-slate-100 transition-all">
                  View All History
                </button>
              </div>
            ) : showSettings ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-4 h-full overflow-y-auto">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Settings
                  </h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="p-1 hover:bg-slate-100 rounded-lg transition-all"
                  >
                    <X className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">AI Model</label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none">
                      <option>GPT-4 (Recommended)</option>
                      <option>GPT-3.5 Turbo</option>
                      <option>Claude 3</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Response Style</label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none">
                      <option>Balanced</option>
                      <option>Detailed</option>
                      <option>Concise</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Sound Effects</span>
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-2 rounded-lg hover:bg-slate-100 transition-all"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-slate-600" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Dark Mode</span>
                    <button className="p-2 rounded-lg hover:bg-slate-100 transition-all">
                      <Eye className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                  <button className="w-full px-4 py-2 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-all text-sm font-medium">
                    Save Settings
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Stats */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-4">
                  <h3 className="font-semibold text-slate-900 text-sm mb-3 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    AI Performance
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Accuracy</span>
                      <span className="font-medium text-green-600">94%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Response Time</span>
                      <span className="font-medium">1.2s</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Questions Answered</span>
                      <span className="font-medium">1,247</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Satisfaction Rate</span>
                      <span className="font-medium text-green-600">92%</span>
                    </div>
                  </div>
                </div>

                {/* Quick Tips */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-4">
                  <h3 className="font-semibold text-slate-900 text-sm mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-500" />
                    Quick Tips
                  </h3>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <Check className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                      Be specific with dates and amounts
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                      Use department names for accurate results
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                      Ask follow-up questions for clarity
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                      Review important information before acting
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-slate-400">
          <p>AI Assistant is powered by advanced language models. Always verify critical information.</p>
          <div className="flex items-center justify-center gap-4 mt-1">
            <button className="hover:text-slate-600 transition-all flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Secure
            </button>
            <button className="hover:text-slate-600 transition-all flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Compliant
            </button>
            <button className="hover:text-slate-600 transition-all flex items-center gap-1">
              <Globe className="w-3 h-3" />
              Multi-language
            </button>
            <button className="hover:text-slate-600 transition-all flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Learning
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
