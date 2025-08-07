import { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Building2, Send, Bot, User, Clock, Minimize2, X } from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  agentName?: string;
}

export default function LiveChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [agentName, setAgentName] = useState("Sarah");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Simulate connecting to chat
    const timer = setTimeout(() => {
      setIsConnected(true);
      setMessages([
        {
          id: "1",
          type: "system",
          content: "Connected to live chat support",
          timestamp: new Date()
        },
        {
          id: "2",
          type: "agent",
          content: "Hi! I'm Sarah from First City Credit Union. How can I help you today?",
          timestamp: new Date(),
          agentName: "Sarah"
        }
      ]);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: newMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      setIsTyping(false);
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "agent",
        content: getAgentResponse(newMessage),
        timestamp: new Date(),
        agentName: agentName
      };
      setMessages(prev => [...prev, agentResponse]);
    }, 1000 + Math.random() * 2000);
  };

  const getAgentResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes("balance") || msg.includes("account")) {
      return "I can help you check your account balance. For security reasons, I'll need to verify your identity first. Can you provide me with your account number or the email associated with your account?";
    } else if (msg.includes("loan") || msg.includes("apply")) {
      return "I'd be happy to help you with loan information! We offer personal loans, auto loans, and home loans with competitive rates. What type of loan are you interested in?";
    } else if (msg.includes("card") || msg.includes("credit")) {
      return "Great! We have several credit card options including our Cashback Rewards Card and Premium Travel Card. Would you like me to help you compare the benefits and apply for one?";
    } else if (msg.includes("hours") || msg.includes("time")) {
      return "Our branch hours are Monday-Friday 8AM-6PM, Saturday 9AM-3PM. Our online banking and mobile app are available 24/7. Is there something specific you need help with today?";
    } else if (msg.includes("problem") || msg.includes("issue") || msg.includes("help")) {
      return "I'm sorry to hear you're experiencing an issue. Can you tell me more details about what's happening? I'm here to help resolve this for you.";
    } else if (msg.includes("rate") || msg.includes("interest")) {
      return "Our current rates are very competitive! Personal loan rates start at 6.99% APR, and our high-yield savings account offers 4.25% APY. Would you like specific rate information for a particular product?";
    } else {
      return "Thank you for your question. Let me help you with that. Could you provide a bit more detail so I can give you the most accurate information?";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickActions = [
    "Check account balance",
    "Apply for a loan",
    "Credit card options",
    "Branch locations",
    "Report lost card"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/30">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 border-b bg-white/80 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00754A] to-[#005A39] rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className="text-xl font-bold text-[#00754A]">
              First City Credit Union
            </div>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/help">
              <Button variant="ghost" className="text-[#00754A] hover:bg-green-50">
                Help Center
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="border-[#00754A] text-[#00754A] hover:bg-green-50">
                <X className="w-4 h-4 mr-2" />
                Close Chat
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chat Window */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col shadow-lg">
              <CardHeader className="bg-gradient-to-r from-[#00754A] to-[#005A39] text-white rounded-t-lg">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold">Live Chat Support</div>
                      <div className="text-sm text-green-100 flex items-center gap-1">
                        {isConnected ? (
                          <>
                            <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                            Connected with {agentName}
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            Connecting...
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                      <Minimize2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-[#00754A] text-white'
                            : message.type === 'system'
                            ? 'bg-gray-100 text-gray-600 text-center text-sm'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {message.type === 'agent' && (
                          <div className="text-xs text-gray-500 mb-1">{message.agentName}</div>
                        )}
                        <div>{message.content}</div>
                        <div className={`text-xs mt-1 ${
                          message.type === 'user' ? 'text-green-200' : 'text-gray-400'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 px-4 py-2 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">{agentName}</div>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex space-x-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      disabled={!isConnected}
                      className="flex-1"
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!isConnected || !newMessage.trim()}
                      className="bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-[#00754A]">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-sm border-green-200 hover:bg-green-50"
                    onClick={() => setNewMessage(action)}
                  >
                    {action}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Support Hours */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-[#00754A]">Support Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Live Chat:</span>
                  <span className="font-medium">24/7</span>
                </div>
                <div className="flex justify-between">
                  <span>Phone Support:</span>
                  <span className="font-medium">Mon-Fri 8AM-8PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Branch Hours:</span>
                  <span className="font-medium">Mon-Fri 9AM-5PM</span>
                </div>
                <div className="pt-3 border-t">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-[#00754A]">(555) 123-4567</div>
                    <div className="text-xs text-muted-foreground">Emergency Line</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Help Topics */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-[#00754A]">Popular Help Topics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/help" className="block">
                  <Button variant="ghost" className="w-full justify-start text-sm hover:bg-green-50">
                    Reset Password
                  </Button>
                </Link>
                <Link to="/help" className="block">
                  <Button variant="ghost" className="w-full justify-start text-sm hover:bg-green-50">
                    Mobile Banking
                  </Button>
                </Link>
                <Link to="/help" className="block">
                  <Button variant="ghost" className="w-full justify-start text-sm hover:bg-green-50">
                    Account Security
                  </Button>
                </Link>
                <Link to="/security" className="block">
                  <Button variant="ghost" className="w-full justify-start text-sm hover:bg-green-50">
                    Report Fraud
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
