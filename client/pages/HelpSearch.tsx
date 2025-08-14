import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams, Link } from "react-router-dom";
import {
  Building2,
  Search,
  FileText,
  MessageCircle,
  Phone,
  ArrowRight,
  Clock,
} from "lucide-react";

interface HelpArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  views: number;
  helpful: number;
  lastUpdated: string;
  tags: string[];
}

export default function HelpSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(query);
  const [results, setResults] = useState<HelpArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchCount, setSearchCount] = useState(0);

  const mockArticles: HelpArticle[] = [
    {
      id: "1",
      title: "How to reset your online banking password",
      excerpt:
        "Step-by-step guide to reset your password using email verification or security questions. Includes troubleshooting tips for common issues.",
      category: "Account Access",
      views: 2450,
      helpful: 89,
      lastUpdated: "2024-01-15",
      tags: ["password", "login", "security", "reset"],
    },
    {
      id: "2",
      title: "Setting up mobile banking on your smartphone",
      excerpt:
        "Learn how to download and set up our mobile banking app on iOS and Android devices. Includes security setup and troubleshooting.",
      category: "Mobile Banking",
      views: 1823,
      helpful: 92,
      lastUpdated: "2024-01-10",
      tags: ["mobile", "app", "setup", "android", "ios"],
    },
    {
      id: "3",
      title: "Understanding your account statements",
      excerpt:
        "Detailed explanation of all sections in your monthly account statement, including transaction codes and fee descriptions.",
      category: "Account Management",
      views: 1567,
      helpful: 78,
      lastUpdated: "2024-01-08",
      tags: ["statements", "transactions", "fees", "codes"],
    },
    {
      id: "4",
      title: "How to transfer money between accounts",
      excerpt:
        "Complete guide for transferring funds between your checking and savings accounts using online banking or mobile app.",
      category: "Transfers",
      views: 3012,
      helpful: 95,
      lastUpdated: "2024-01-12",
      tags: ["transfers", "accounts", "money", "online banking"],
    },
    {
      id: "5",
      title: "Reporting a lost or stolen debit card",
      excerpt:
        "Immediate steps to take when your debit card is lost or stolen, including how to freeze your card and request a replacement.",
      category: "Card Services",
      views: 876,
      helpful: 88,
      lastUpdated: "2024-01-14",
      tags: ["debit card", "lost", "stolen", "replacement", "freeze"],
    },
    {
      id: "6",
      title: "Setting up direct deposit",
      excerpt:
        "How to set up direct deposit for your paycheck or benefits, including required forms and processing times.",
      category: "Direct Deposit",
      views: 2134,
      helpful: 85,
      lastUpdated: "2024-01-09",
      tags: ["direct deposit", "paycheck", "setup", "forms"],
    },
    {
      id: "7",
      title: "Understanding overdraft protection",
      excerpt:
        "Learn about overdraft protection options, fees, and how to opt in or out of overdraft coverage for your accounts.",
      category: "Account Protection",
      views: 1345,
      helpful: 76,
      lastUpdated: "2024-01-11",
      tags: ["overdraft", "protection", "fees", "coverage"],
    },
    {
      id: "8",
      title: "How to dispute a transaction",
      excerpt:
        "Process for disputing unauthorized transactions or billing errors, including required documentation and timelines.",
      category: "Disputes",
      views: 1098,
      helpful: 82,
      lastUpdated: "2024-01-13",
      tags: ["dispute", "unauthorized", "billing", "error"],
    },
  ];

  const searchArticles = (term: string) => {
    if (!term.trim()) {
      setResults([]);
      setSearchCount(0);
      return;
    }

    setLoading(true);

    // Simulate API search delay
    setTimeout(() => {
      const filtered = mockArticles.filter(
        (article) =>
          article.title.toLowerCase().includes(term.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(term.toLowerCase()) ||
          article.tags.some((tag) =>
            tag.toLowerCase().includes(term.toLowerCase()),
          ) ||
          article.category.toLowerCase().includes(term.toLowerCase()),
      );

      setResults(filtered);
      setSearchCount(filtered.length);
      setLoading(false);
    }, 500);
  };

  const handleSearch = () => {
    setSearchParams({ q: searchTerm });
    searchArticles(searchTerm);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    if (query) {
      searchArticles(query);
    }
  }, [query]);

  const popularSearches = [
    "password reset",
    "mobile app",
    "direct deposit",
    "account balance",
    "debit card",
    "online banking",
    "transfer money",
    "statements",
  ];

  const categories = [
    { name: "Account Access", count: 12 },
    { name: "Mobile Banking", count: 8 },
    { name: "Transfers", count: 6 },
    { name: "Card Services", count: 10 },
    { name: "Account Management", count: 15 },
    { name: "Security", count: 9 },
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
              Fusion Bank
            </div>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/help">
              <Button
                variant="ghost"
                className="text-[#00754A] hover:bg-green-50"
              >
                Help Center
              </Button>
            </Link>
            <Link to="/chat">
              <Button className="bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white">
                Live Chat
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#00754A] mb-4">
            Search Help Articles
          </h1>
          <p className="text-muted-foreground">
            Find answers to your questions in our comprehensive help center
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for help articles, FAQs, or topics..."
              className="pl-12 h-14 text-lg bg-white border-2 border-green-200 focus:border-[#00754A] rounded-xl"
            />
            <Button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white"
            >
              Search
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Popular Searches */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-[#00754A]">
                  Popular Searches
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {popularSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start text-sm hover:bg-green-50 hover:text-[#00754A]"
                    onClick={() => {
                      setSearchTerm(search);
                      setSearchParams({ q: search });
                      searchArticles(search);
                    }}
                  >
                    {search}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Categories */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-[#00754A]">
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-1"
                  >
                    <Button
                      variant="ghost"
                      className="justify-start text-sm hover:bg-green-50 hover:text-[#00754A] p-0"
                      onClick={() => {
                        setSearchTerm(category.name);
                        setSearchParams({ q: category.name });
                        searchArticles(category.name);
                      }}
                    >
                      {category.name}
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      ({category.count})
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card className="shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="text-lg text-[#00754A]">
                  Need More Help?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/chat">
                  <Button className="w-full bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Live Chat
                  </Button>
                </Link>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">
                    or call us at
                  </div>
                  <div className="text-lg font-semibold text-[#00754A]">
                    (555) 123-4567
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-[#00754A] border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Searching articles...</p>
              </div>
            ) : query && results.length > 0 ? (
              <>
                {/* Search Results Header */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-[#00754A] mb-2">
                    Search Results for "{query}"
                  </h2>
                  <p className="text-muted-foreground">
                    Found {searchCount}{" "}
                    {searchCount === 1 ? "article" : "articles"}
                  </p>
                </div>

                {/* Results */}
                <div className="space-y-4">
                  {results.map((article) => (
                    <Card
                      key={article.id}
                      className="shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                    >
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-[#00754A]" />
                            <span className="text-sm text-[#00754A] font-medium">
                              {article.category}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Updated{" "}
                            {new Date(article.lastUpdated).toLocaleDateString()}
                          </div>
                        </div>

                        <h3 className="text-xl font-semibold text-[#00754A] mb-2 hover:text-[#005A39] transition-colors">
                          {article.title}
                        </h3>

                        <p className="text-muted-foreground mb-4 leading-relaxed">
                          {article.excerpt}
                        </p>

                        <div className="flex justify-between items-center">
                          <div className="flex gap-2">
                            {article.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-green-100 text-[#00754A] text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{article.views} views</span>
                            <span>{article.helpful}% helpful</span>
                            <ArrowRight className="w-4 h-4 text-[#00754A]" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : query && results.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-[#00754A] mb-2">
                  No articles found
                </h2>
                <p className="text-muted-foreground mb-6">
                  We couldn't find any articles matching "{query}". Try
                  different keywords or browse our categories.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/chat">
                    <Button className="bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Ask in Live Chat
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button
                      variant="outline"
                      className="border-[#00754A] text-[#00754A] hover:bg-green-50"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Contact Support
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-[#00754A] mb-2">
                  Search Our Help Center
                </h2>
                <p className="text-muted-foreground mb-6">
                  Enter a search term above to find helpful articles and guides.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {popularSearches.slice(0, 4).map((search, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchTerm(search);
                        setSearchParams({ q: search });
                        searchArticles(search);
                      }}
                      className="border-green-200 text-[#00754A] hover:bg-green-50"
                    >
                      {search}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
